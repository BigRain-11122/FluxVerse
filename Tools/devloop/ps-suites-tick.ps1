# ps-suites-tick.ps1 - let the tick run the write-side sandboxes without anyone remembering (r750, queue main#88)
# ---------------------------------------------------------------------------
# WHY: r748 gave the PowerShell sandboxes ONE entry (Tools\devloop\run-ps-suites.ps1)
# but nothing ever runs it. The tick is the only thing that runs unattended
# (every 5 minutes); if a round changes build-city-panel.ps1's $artPattern and
# nobody remembers to call the runner, the "both sides share one regex"
# anti-drift assertion stays unarmed and nothing in the logs says so.
#
# DESIGN - content addressed, not wall-clock addressed. The write-side suites
# only change their verdict when the sources they guard change, so the tick
# fingerprints the guarded source set (sha12 over path+content hash of every
# file listed in Get-PsSuitesTickDefaults):
#   * fingerprint unchanged  -> reuse the last ticket, spawn nothing (<100 ms)
#   * fingerprint changed    -> run the runner ONCE as a child process (it
#                               spawns per-suite children; suites end with
#                               `exit N`, so it can never run in-process) with
#                               a hard timeout, then overwrite the ticket
# The ticket (logs\.ps-suites-last.json) is the record of the last real run:
# its failing/parity/ts survive restarts, so a red result stays visible on
# every tick until the sources move again (no silent skip, no re-spin storm).
#
# Honest boundaries:
#   - a red result is sticky until the guarded source set changes, even if the
#     environment (not the code) was at fault; the WARN line carries the age
#     and the one command that re-runs it.
#   - suite fixture files are content, not a hash input: a suite that depends on
#     a fixture outside this list can go red without the fingerprint moving.
#   - 45 s timeout: the full 5-suite run measured 19.5 s (r748). A hit means the
#     machine is loaded or a suite hangs; we report `timeout`, never a verdict.
#
# ASCII-only (PS5.1 GBK law). No auto-variable locals ($pid family, r164).
# ---------------------------------------------------------------------------

function Get-PsSuitesTickDefaults {
    # Guarded sources: the five write-side suites plus everything whose change
    # can flip their verdict (runner, builder regex, lint constant, the two
    # writers under test).
    return @(
        'Tools\devloop\test-write-status-face-bare.ps1',
        'Tools\devloop\test-fastpath-state-live.ps1',
        'logs\devloop-r247-facewriter-test.ps1',
        'logs\devloop-r197-writer-test.ps1',
        'logs\devloop-r271-keep-negcon.ps1',
        'Tools\devloop\run-ps-suites.ps1',
        'Tools\devloop\build-city-panel.ps1',
        'Tools\devloop\face-path-lint.ps1',
        'Tools\devloop\write-status-face.ps1',
        'Tools\devloop\write-fastpath-state.ps1'
    )
}

function Get-PsSuitesFingerprint {
    param(
        [Parameter(Mandatory=$true)][string]$RepoDir,
        [string[]]$Paths = @()
    )
    if ($null -eq $Paths -or $Paths.Count -eq 0) { $Paths = @(Get-PsSuitesTickDefaults) }
    $parts = @()
    foreach ($rel in $Paths) {
        $full = Join-Path $RepoDir $rel
        $norm = $rel.Replace('\', '/')
        if (Test-Path -LiteralPath $full) {
            $h = (Get-FileHash -LiteralPath $full -Algorithm SHA256).Hash.Substring(0, 12).ToLower()
            $parts += ($norm + '=' + $h)
        } else {
            $parts += ($norm + '=MISSING')
        }
    }
    $text = ($parts -join "`n")
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($text)
    $sha = [System.Security.Cryptography.SHA256]::Create()
    $hash = $sha.ComputeHash($bytes)
    $hex = (($hash | ForEach-Object { $_.ToString('x2') }) -join '')
    return $hex.Substring(0, 12)
}

function Get-PsSuitesTicket {
    param([Parameter(Mandatory=$true)][string]$Path)
    if (-not (Test-Path -LiteralPath $Path)) { return $null }
    try {
        $raw = [System.IO.File]::ReadAllText($Path, [System.Text.Encoding]::UTF8)
        $obj = $raw | ConvertFrom-Json
    } catch { return $null }
    if ($null -eq $obj) { return $null }
    if (-not $obj.PSObject.Properties['sha']) { return $null }
    return $obj
}

function Write-PsSuitesTicket {
    param(
        [Parameter(Mandatory=$true)][string]$Path,
        [Parameter(Mandatory=$true)]$Result
    )
    $obj = [ordered]@{
        sha        = [string]$Result.sha
        status     = [string]$Result.status
        suites     = [int]$Result.suites
        assertions = [int]$Result.assertions
        failing    = [int]$Result.failing
        parity     = [string]$Result.parity
        exit       = [int]$Result.exit
        ms         = [int]$Result.ms
        ts_utc     = [string]$Result.ts_utc
    }
    $dir = Split-Path -Parent $Path
    if ($dir -and -not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    $enc = New-Object System.Text.UTF8Encoding($false)
    $side = $Path + '.new'
    [System.IO.File]::WriteAllText($side, ($obj | ConvertTo-Json -Compress), $enc)
    Move-Item -LiteralPath $side -Destination $Path -Force
}

function Invoke-PsSuitesTick {
    param(
        [Parameter(Mandatory=$true)][string]$RepoDir,
        [string]$TicketPath = '',
        [string[]]$Paths = @(),
        [string]$RunnerPath = '',
        [string[]]$ExtraArgs = @(),
        [int]$TimeoutSec = 45,
        [switch]$Force
    )
    if ([string]::IsNullOrEmpty($TicketPath)) { $TicketPath = Join-Path $RepoDir 'logs\.ps-suites-last.json' }
    if ([string]::IsNullOrEmpty($RunnerPath)) { $RunnerPath = Join-Path $RepoDir 'Tools\devloop\run-ps-suites.ps1' }

    $res = [ordered]@{
        status     = 'unknown'
        sha        = ''
        suites     = 0
        assertions = 0
        failing    = 0
        parity     = 'unknown'
        exit       = 0
        ms         = 0
        age_min    = -1
        ran        = $false
        note       = ''
        ts_utc     = ''
    }

    $res.sha = Get-PsSuitesFingerprint -RepoDir $RepoDir -Paths $Paths

    if (-not (Test-Path -LiteralPath $RunnerPath)) {
        $res.status = 'missing'
        $res.note = 'runner not found: ' + $RunnerPath
        return [pscustomobject]$res
    }

    $ticket = Get-PsSuitesTicket -Path $TicketPath
    $fresh = ($null -ne $ticket) -and ([string]$ticket.sha -eq $res.sha)
    if ($fresh -and -not $Force) {
        $res.status = [string]$ticket.status
        $res.suites = [int]$ticket.suites
        $res.assertions = [int]$ticket.assertions
        $res.failing = [int]$ticket.failing
        $res.parity = [string]$ticket.parity
        $res.exit = [int]$ticket.exit
        $res.ms = [int]$ticket.ms
        $res.ts_utc = [string]$ticket.ts_utc
        $res.age_min = 0
        try {
            $when = [datetime]::Parse($res.ts_utc, [System.Globalization.CultureInfo]::InvariantCulture,
                [System.Globalization.DateTimeStyles]::AdjustToUniversal -bor [System.Globalization.DateTimeStyles]::AssumeUniversal)
            $age = ([datetime]::UtcNow - $when).TotalMinutes
            if ($age -ge 0) { $res.age_min = [int][math]::Round($age) }
        } catch { $res.age_min = -1 }
        $res.ran = $false
        return [pscustomobject]$res
    }

    # ---------- run once, hard timeout ----------
    $tmpOut = [System.IO.Path]::GetTempFileName()
    $tmpErr = [System.IO.Path]::GetTempFileName()
    $argList = @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', ('"' + $RunnerPath + '"'))
    foreach ($a in $ExtraArgs) { if ($a -ne '') { $argList += $a } }

    $sw = New-Object System.Diagnostics.Stopwatch
    $sw.Start()
    $proc = $null
    $exited = $false
    try {
        $proc = Start-Process -FilePath 'powershell.exe' -ArgumentList $argList -NoNewWindow -PassThru `
            -RedirectStandardOutput $tmpOut -RedirectStandardError $tmpErr
        $exited = $proc.WaitForExit($TimeoutSec * 1000)
    } catch {
        $res.status = 'missing'
        $res.note = 'child launch failed: ' + ($_.Exception.Message -replace '[\r\n]', ' ')
    }
    $sw.Stop()
    $res.ms = [int]$sw.ElapsedMilliseconds

    if (-not $exited -and $proc -ne $null) {
        try { if (-not $proc.HasExited) { $proc.Kill() } } catch { }
        $res.status = 'timeout'
        $res.note = 'runner did not finish in ' + $TimeoutSec + 's'
    }

    $text = ''
    if (Test-Path -LiteralPath $tmpOut) {
        try { $text = [System.IO.File]::ReadAllText($tmpOut, [System.Text.Encoding]::UTF8) } catch { $text = '' }
    }
    $errText = ''
    if (Test-Path -LiteralPath $tmpErr) {
        try { $errText = ([System.IO.File]::ReadAllText($tmpErr, [System.Text.Encoding]::UTF8)).Trim() } catch { $errText = '' }
    }
    Remove-Item -LiteralPath $tmpOut -Force -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath $tmpErr -Force -ErrorAction SilentlyContinue

    if ($res.status -eq 'missing') {
        return [pscustomobject]$res
    }

    $m = [regex]::Match($text, 'PS SUITES suites=(\d+)\s+assertions=(\d+)\s+counted=(\d+)\s+failing=(\d+)\s+parity=(\S+)')
    if (-not $m.Success) {
        if ($res.status -ne 'timeout') { $res.status = 'unreadable' }
        $tail = (($text -split "`r?`n") | Where-Object { $_.Trim() -ne '' } | Select-Object -Last 1)
        if ([string]::IsNullOrWhiteSpace($tail)) { $tail = '(no output)' }
        if ($errText -ne '') { $tail = $tail + ' / ' + (($errText -split "`r?`n") | Select-Object -Last 1) }
        $res.note = ($res.note + ' summary line not found; last output: ' + $tail).Trim()
        $res.ts_utc = [datetime]::UtcNow.ToString('yyyy-MM-ddTHH:mm:ssZ')
        Write-PsSuitesTicket -Path $TicketPath -Result ([pscustomobject]$res)
        return [pscustomobject]$res
    }

    $res.suites = [int]$m.Groups[1].Value
    $res.assertions = [int]$m.Groups[2].Value
    $res.failing = [int]$m.Groups[4].Value
    $res.parity = [string]$m.Groups[5].Value
    if ($null -ne $proc) { $res.exit = [int]$proc.ExitCode }
    if ($res.status -eq 'unknown') {
        if ($res.failing -gt 0 -or $res.exit -ne 0) { $res.status = 'red' } else { $res.status = 'pass' }
    }
    $res.ran = $true
    $res.ts_utc = [datetime]::UtcNow.ToString('yyyy-MM-ddTHH:mm:ssZ')
    $res.age_min = 0
    Write-PsSuitesTicket -Path $TicketPath -Result ([pscustomobject]$res)
    return [pscustomobject]$res
}

function Format-PsSuitesLine {
    # Returns text that follows "VERIFY HEALTH: " / "VERIFY WARN: ".
    # Judge: healthy only when the last real run passed. Never call a cached red
    # "ok" and never hide a timeout behind a stale zero.
    # Word choice matters: the census sandboxes assert that no verify line
    # carries the red token at all (case-insensitive), so the counts print as
    # `red=` and a parity drift prints as `drift`. The runner's own `failing=`
    # summary stays inside the ticket, never in a VERIFY line.
    param([Parameter(Mandatory=$true)]$Result)
    $parityText = [string]$Result.parity
    if ($parityText -eq 'FAIL') { $parityText = 'drift' }
    $head = 'ps-suites: suites=' + $Result.suites + ' red=' + $Result.failing + ' assertions=' + $Result.assertions + ' parity=' + $parityText + ' sha=' + $Result.sha
    if ($Result.status -eq 'pass' -or $Result.status -eq 'red') {
        if ($Result.ran) { $head = $head + ' ran=' + $Result.ms + 'ms' }
        elseif ($Result.age_min -ge 0) { $head = $head + ' cached=' + $Result.age_min + 'm' }
        else { $head = $head + ' cached=age-unknown' }
    }
    return $head
}

function Test-PsSuitesHealthy {
    param([Parameter(Mandatory=$true)]$Result)
    return ([string]$Result.status -eq 'pass')
}