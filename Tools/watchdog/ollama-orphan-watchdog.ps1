# ollama-orphan-watchdog.ps1 - minimal orphan-slot watchdog for the shared ollama service (bm-a / C machine)
# Authority: evolution-ledger P-2026-10-11-04 (committee-approved transfer, bm-a cadence session, receipt within 3 shifts)
# Spec (verbatim intent): 503x3 + GPU util <5% + netstat shows no active caller, three states co-present >=10min
#   -> restart the ollama service + one-line receipt. Installed ONLY via Tools/task-register.ps1 hidden chain (U060).
# Silence law: this file is ASCII-only (hard constraint 3); no console output in production (wscript chain swallows it).
# Exit codes: 0 = quiet / armed / aborted, 2 = fired (dry-run or real), 1 = config error (fail-loud).
param(
    [string]$Ovr503 = '',         # harness override for the 503x3 probe: 'y'/'n' (skips live probe when set)
    [string]$OvrGpu = '',         # harness override for GPU util: numeric string (skips live probe when set)
    [string]$OvrCallers = '',     # harness override for active-caller gate: 'y'/'n' (skips live probe when set)
    [string]$OvrCallersLate = '', # harness override for the pre-fire re-check (defaults to $OvrCallers)
    [string]$SimNowUtc = '',      # harness clock (ISO UTC); production always empty
    [switch]$DryRun              # fire path writes receipt marked dryrun:true and touches nothing
)
$ErrorActionPreference = 'Continue'

# ---- self-location (r247/r273 same-disease law: assert resolved root, fail loud on wrong depth) ----
$repoRoot = Split-Path (Split-Path $PSScriptRoot)   # Tools\watchdog -> Tools -> repo root
if (-not (Test-Path (Join-Path $repoRoot 'TECH.md'))) { Write-Output 'WD: FAIL repo root not resolved'; exit 1 }
$logDir      = Join-Path $repoRoot 'logs'
$stateFile   = Join-Path $logDir 'ollama-watchdog-state.txt'
$receiptFile = Join-Path $logDir 'ollama-watchdog-receipt.jsonl'

# ---- clock (r13 PS 'Z' trap: AdjustToUniversal keeps UTC) ----
if ($SimNowUtc -ne '') {
    $parsed = [datetime]::MinValue
    $okParse = [datetime]::TryParse($SimNowUtc, [Globalization.CultureInfo]::InvariantCulture, [Globalization.DateTimeStyles]::AdjustToUniversal, [ref]$parsed)
    if (-not $okParse) { Write-Output 'WD: FAIL bad -SimNowUtc'; exit 1 }
    $now = $parsed.ToUniversalTime()
} else {
    $now = [datetime]::UtcNow
}
$nowIso = $now.ToString('yyyy-MM-ddTHH:mm:ssZ')

# ---- probe helpers ----
function Get-CallerCount {
    # ESTABLISHED connections on the ollama port, both directions.
    # MUST run before any HTTP probe of our own so we never count ourselves.
    $n = 0
    try {
        $lines = netstat -ano | Where-Object { $_ -match 'ESTABLISHED' -and $_ -match ':11434' }
        if ($lines) { $n = @($lines).Count }
    } catch { $n = -1 }   # unreadable = unknown = fail-closed (no fire without evidence)
    return $n
}
function Get-WedgeProbe {
    # 3 probes 10s apart; wedged = exactly 503 three times. 200/refused/timeout = not the orphan signature.
    $c503 = 0; $other = 0
    for ($i = 0; $i -lt 3; $i++) {
        if ($i -gt 0) { Start-Sleep -Seconds 10 }
        try {
            $resp = Invoke-WebRequest -Uri 'http://127.0.0.1:11434/api/tags' -UseBasicParsing -TimeoutSec 8
            if ($resp.StatusCode -eq 503) { $c503++ } else { $other++ }
        } catch {
            $code = 0
            if ($null -ne $_.Exception.Response -and $null -ne $_.Exception.Response.StatusCode) { $code = [int]$_.Exception.Response.StatusCode }
            if ($code -eq 503) { $c503++ } else { $other++ }
        }
    }
    $wedged = $false
    if ($c503 -eq 3 -and $other -eq 0) { $wedged = $true }
    return @{ wedged = $wedged; c503 = $c503 }
}
function Get-GpuUtil {
    try {
        $out = & nvidia-smi --query-gpu=utilization.gpu --format=csv,noheader,nounits 2>$null
        if (-not $out) { return -1 }   # unreadable = fail-closed
        $maxv = -1
        foreach ($ln in @($out)) {
            $v = 0
            if ([int]::TryParse(([string]$ln).Trim(), [ref]$v)) { if ($v -gt $maxv) { $maxv = $v } }
        }
        return $maxv
    } catch { return -1 }
}
function Add-Receipt {
    param([string]$JsonLine)
    try { [IO.File]::AppendAllText($receiptFile, $JsonLine + "`r`n") } catch { }
}
function Clear-State {
    try { if (Test-Path $stateFile) { [IO.File]::Delete($stateFile) } } catch { }
}

# ---- probes (overrides skip the live probe entirely - harness stays deterministic) ----
if ($OvrCallers -ne '') {
    if ($OvrCallers -eq 'n') { $callers = 0 } else { $callers = 1 }
} else {
    $callers = Get-CallerCount
}
if ($Ovr503 -ne '') {
    if ($Ovr503 -eq 'y') { $probe = @{ wedged = $true; c503 = 3 } } else { $probe = @{ wedged = $false; c503 = 0 } }
} else {
    $probe = Get-WedgeProbe
}
if ($OvrGpu -ne '') {
    $g = 0
    if ([int]::TryParse($OvrGpu, [ref]$g)) { $gpu = $g } else { $gpu = -1 }
} else {
    $gpu = Get-GpuUtil
}

# ---- three-state gate (A: wedged 503x3 / B: GPU util <5 with evidence / C: zero active callers) ----
$condA = [bool]$probe.wedged
$condB = ($gpu -ge 0 -and $gpu -lt 5)
$condC = ($callers -eq 0)

if (-not ($condA -and $condB -and $condC)) {
    Clear-State
    Write-Output ('WD: quiet wedged=' + $condA + ' gpu=' + $gpu + ' callers=' + $callers + ' p503=' + $probe.c503)
    exit 0
}

# ---- all three present: arm or fire ----
$firstSeen = $null
$firstSeenIso = ''
if (Test-Path $stateFile) {
    foreach ($ln in [IO.File]::ReadAllLines($stateFile)) {
        if ($ln -like 'first_seen=*') {
            $fs = $ln.Substring(11)
            $dt = [datetime]::MinValue
            $okFs = [datetime]::TryParse($fs, [Globalization.CultureInfo]::InvariantCulture, [Globalization.DateTimeStyles]::AdjustToUniversal, [ref]$dt)
            if ($okFs) { $firstSeen = $dt.ToUniversalTime(); $firstSeenIso = $fs }
        }
    }
}
if ($null -eq $firstSeen) {
    [IO.File]::WriteAllText($stateFile, 'first_seen=' + $nowIso)
    Write-Output ('WD: armed first_seen=' + $nowIso)
    exit 0
}
$ageS = [int]($now - $firstSeen).TotalSeconds
if ($ageS -lt 600) {
    Write-Output ('WD: armed age_s=' + $ageS)
    exit 0
}

# ---- fire path: fresh caller re-check first (closes the probe-window race) ----
if ($OvrCallersLate -ne '') { $lateOvr = $OvrCallersLate } else { $lateOvr = $OvrCallers }
if ($lateOvr -ne '') {
    if ($lateOvr -eq 'n') { $lateCallers = 0 } else { $lateCallers = 1 }
} else {
    $lateCallers = Get-CallerCount
}
$baseJson = '"ts_utc":"' + $nowIso + '","first_seen_utc":"' + $firstSeenIso + '","age_s":' + $ageS + ',"gpu_util":' + $gpu + ',"callers":' + $callers + ',"p503":' + $probe.c503
if ($lateCallers -ne 0) {
    Add-Receipt ('{' + $baseJson + ',"action":"abort","reason":"callers-present","dryrun":true}')
    Clear-State
    Write-Output 'WD: abort callers-present'
    exit 0
}
if ($DryRun) {
    Add-Receipt ('{' + $baseJson + ',"action":"dryrun-restart","dryrun":true}')
    Clear-State
    Write-Output 'WD: DRYRUN-RESTART (no process touched)'
    exit 2
}

# ---- real restart: kill runner + serve, then bring serve back (tray respawn or direct start) ----
$exe = $null
try {
    $po = Get-Process -Name ollama -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($po) { $exe = $po.Path }
} catch { }
if (-not $exe) { $exe = 'C:\Users\sjs20\AppData\Local\Programs\Ollama\ollama.exe' }
Stop-Process -Name llama-server -Force -ErrorAction SilentlyContinue
Stop-Process -Name ollama -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 5
$serveAlive = $false
try {
    $ps2 = Get-Process -Name ollama -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($ps2) { $serveAlive = $true }
} catch { }
if (-not $serveAlive -and (Test-Path $exe)) {
    Start-Process -FilePath $exe -ArgumentList 'serve' -WindowStyle Hidden | Out-Null
}
$recovered = $false
for ($i = 0; $i -lt 18; $i++) {
    Start-Sleep -Seconds 5
    try {
        $rp = Invoke-WebRequest -Uri 'http://127.0.0.1:11434/api/tags' -UseBasicParsing -TimeoutSec 5
        if ($rp.StatusCode -eq 200) { $recovered = $true; break }
    } catch { }
}
$result = 'recovered'
if (-not $recovered) { $result = 'still-down' }
Add-Receipt ('{' + $baseJson + ',"action":"restart","result":"' + $result + '","dryrun":false}')
Clear-State
Write-Output ('WD: FIRED result=' + $result)
exit 2
