# run-ps-suites.ps1 - run the PowerShell write-side sandboxes from ONE entry (r748, queue main#86)
# ---------------------------------------------------------------------------
# Why: `run-panel-suites.ps1` only eats `*.js`. The write-side gates
# (status-face writer, fastpath-state writer) are guarded by PowerShell
# sandboxes that nobody ran every round, so the "both sides share one regex"
# anti-drift assertion (test-write-status-face-bare case j) was never armed
# in practice: change build-city-panel.ps1's $artPattern one character and
# every JS suite stays green.
#
# This runner:
#   1. runs the write-side sandbox family (default list) or every
#      Tools\devloop\test-*.ps1 via -All,
#   2. asserts the art-pattern parity directly (builder literal vs
#      face-path-lint.ps1 constant) so the drift is named even if a suite
#      is skipped,
#   3. prints one line per suite + a machine summary `PS SUITES ... failing=N`
#      and exits 2 when anything is red (zero resident processes).
#
# r751 (queue main#89): the VERIFY-side sandboxes (test-verify-*.ps1 plus the
# modules they guard) had the same problem from the other side - they only ran
# when a round remembered the names. `-Verify` runs that family from this one
# entry, so "did anyone run the verify sandboxes" stops being a memory test.
# Two differences from the write-side list:
#   * parity is write-side only (builder regex vs lint constant) -> skipped;
#   * verify suites run from 0.6 s to 40.8 s each on a loaded box (r752: the
#     ps-suites sandbox grew when it had to boot the verify family tick), so
#     each child gets a hard timeout and a hit reports WARN + a `timeouts=N`
#     counter instead of a verdict. A hang is not a red suite and must not
#     pretend to be a pass either.
#
# Suites are launched as child processes on purpose: they end with `exit N`,
# which would kill this runner if invoked in-process. Never read
# $LASTEXITCODE after `& script.ps1` (B795) - we always call powershell.exe.
# ASCII-only body (PS5.1 GBK law). No auto-variable locals ($pid family, r164).
# ---------------------------------------------------------------------------
param(
    [string[]]$Suites = @(),
    [switch]$All,
    [switch]$Verify,
    [switch]$SkipParity,
    [int]$TimeoutSec = 0,
    [string]$RepoDir = ''
)

$here = Split-Path -Parent $MyInvocation.MyCommand.Path
if ([string]::IsNullOrEmpty($RepoDir)) { $RepoDir = Split-Path -Parent (Split-Path -Parent $here) }

if ([string]::IsNullOrEmpty($RepoDir) -or -not (Test-Path -LiteralPath $RepoDir)) {
    Write-Output ('PS SUITES ERROR: repo dir not found: ' + $RepoDir)
    exit 3
}

# ---------- suite list ----------
$defaultRel = @(
    'Tools\devloop\test-write-status-face-bare.ps1',
    'Tools\devloop\test-fastpath-state-live.ps1',
    'logs\devloop-r247-facewriter-test.ps1',
    'logs\devloop-r197-writer-test.ps1',
    'logs\devloop-r271-keep-negcon.ps1',
    'Tools\devloop\test-nolivecheck-census.ps1',
    'Tools\devloop\test-qa-rotation.ps1',
    'Tools\devloop\test-runbook-sync.ps1'
)

# Verify-side family (main#89). Each of these proves a slice of Tools\perceptor\
# verify.ps1 or of a module it dot-sources, so a change to the gate can be
# checked from one command instead of six remembered names. probe-path-census
# is the cheap one (0.6 s) and guards the census that every tick calls.
$verifyRel = @(
    'Tools\devloop\test-verify-r2-site.ps1',
    'Tools\devloop\test-verify-ambient.ps1',
    'Tools\devloop\test-verify-path-census.ps1',
    'Tools\devloop\test-verify-queue-due.ps1',
    'Tools\devloop\test-queue-due.ps1',
    'Tools\devloop\test-log-archive-duty.ps1',
    'Tools\devloop\test-qa-cite-duty.ps1',
    'Tools\devloop\test-benchmark-duty.ps1',
    'Tools\devloop\test-verify-ps-suites.ps1',
    'Tools\devloop\test-probe-path-census.ps1',
    'Tools\devloop\test-state-promote.ps1'
)

$selfName = Split-Path -Leaf $MyInvocation.MyCommand.Path
# `powershell.exe -File x.ps1 -Suites a,b` arrives as ONE comma-joined string,
# so split the bound values back into real paths (r748 sandbox caught this).
$list = @()
$mode = 'write'
if ($Suites.Count -gt 0) {
    foreach ($s in $Suites) {
        foreach ($one in ($s -split '[,;]')) {
            $t = $one.Trim().Trim('"').Trim("'")
            if ($t -eq '') { continue }
            # A relative entry is relative to the REPO, never to the caller's
            # working directory: the tick passes `-Suites Tools\devloop\x.ps1`
            # and is launched by a scheduler whose cwd is whatever it was when
            # the task fired. Measured r766: with cwd=C:\Windows\System32 the
            # verify2 family died in 330 ms with `1 suite file(s) missing`
            # (runner exit 3 -> ticket `unreadable`) while the same command
            # passed from the repo root - a green suite that never ran.
            if (-not [System.IO.Path]::IsPathRooted($t)) { $t = Join-Path $RepoDir $t }
            $list += $t
        }
    }
} elseif ($Verify) {
    $mode = 'verify'
    $list = @($verifyRel | ForEach-Object { Join-Path $RepoDir $_ })
} elseif ($All) {
    $list = @(Get-ChildItem -Path (Join-Path $RepoDir 'Tools\devloop') -Filter 'test-*.ps1' |
        Where-Object { $_.Name -ne $selfName } |
        Sort-Object Name |
        ForEach-Object { $_.FullName })
} else {
    $list = @($defaultRel | ForEach-Object { Join-Path $RepoDir $_ })
}

# Per-suite cap for the verify family. Measured on a loaded box (r751):
# probe-path-census 0.6 s, queue-due 3.1 s, path-census 2.7 s, ambient 13.3 s,
# log-archive-duty 14.3 s, verify-queue-due 11.9 s, r2-site 15.6 s,
# verify-ps-suites 18.9 s. r752 grew that last one to 40.8 s (it now also boots
# the verify family tick), so a 40 s cap silently turned the slowest real suite
# into `timeout>40s no verdict` and dropped its 74 assertions from the total
# (observed live: assertions 207 -> 133 with failing=0 - a green ticket hiding a
# suite that never got a verdict). 90 s keeps ~2.2x headroom over 40.8 s and
# still bounds a hang. Override with -TimeoutSec.
if ($mode -eq 'verify' -and $TimeoutSec -le 0) { $TimeoutSec = 90 }

$missing = @()
foreach ($f in $list) { if (-not (Test-Path -LiteralPath $f)) { $missing += $f } }
if ($list.Count -eq 0) {
    Write-Output 'PS SUITES ERROR: empty suite list'
    exit 3
}
if ($missing.Count -gt 0) {
    foreach ($m in $missing) { Write-Output ('PS SUITES MISSING ' + $m) }
    Write-Output ('PS SUITES ERROR: ' + $missing.Count + ' suite file(s) missing')
    exit 3
}

# ---------- art-pattern parity (single source, two sides) ----------
# Write-side only: the verify family does not guard build-city-panel.ps1's
# artifact regex, so asking it for that parity would report a drift nobody in
# that family could have caused.
$failItems = 0
$parityNote = 'skipped'
if (-not $SkipParity -and $mode -ne 'verify') {
    $builder = Join-Path $RepoDir 'Tools\devloop\build-city-panel.ps1'
    $lint = Join-Path $RepoDir 'Tools\devloop\face-path-lint.ps1'
    $parityOk = $true
    if (-not (Test-Path -LiteralPath $builder)) {
        Write-Output ('PARITY FAIL: builder not found: ' + $builder)
        $parityOk = $false
    }
    if (-not (Test-Path -LiteralPath $lint)) {
        Write-Output ('PARITY FAIL: lint module not found: ' + $lint)
        $parityOk = $false
    }
    if ($parityOk) {
        $bText = [System.IO.File]::ReadAllText($builder, [Text.Encoding]::UTF8)
        $lText = [System.IO.File]::ReadAllText($lint, [Text.Encoding]::UTF8)
        $bm = [regex]::Match($bText, '\$artPattern\s*=\s*''([^'']+)''')
        $lm = [regex]::Match($lText, '\$script:FaceArtPattern\s*=\s*''([^'']+)''')
        if (-not $bm.Success) {
            Write-Output ('PARITY FAIL: builder $artPattern literal not found')
            $parityOk = $false
        } elseif (-not $lm.Success) {
            Write-Output ('PARITY FAIL: face-path-lint $script:FaceArtPattern literal not found')
            $parityOk = $false
        } elseif ($bm.Groups[1].Value -ne $lm.Groups[1].Value) {
            Write-Output ('PARITY FAIL: artPattern drift builder=[' + $bm.Groups[1].Value + '] lint=[' + $lm.Groups[1].Value + ']')
            $parityOk = $false
        }
    }
    if ($parityOk) {
        $parityNote = 'ok'
        Write-Output 'PARITY artPattern ok (builder == face-path-lint)'
    } else {
        $parityNote = 'FAIL'
        $failItems++
    }
}

# ---------- run suites ----------
function Invoke-SuiteChild {
    param([string]$Path, [int]$CapSec)
    $res = [ordered]@{ text = ''; exit = 0; timeout = $false }
    # Marker: a suite may run the gate in process (verify.ps1), and the gate now
    # owns a sandbox family for each side. Those nested runs must not start
    # another family run - we ARE the family run. Without this, a direct
    # `run-ps-suites.ps1 -Verify` recursed one level deep and the family took
    # minutes instead of ~2 (measured: >5 min, command killed by the harness).
    $prevChild = $env:FLUXVERSE_PS_SUITES_CHILD
    $env:FLUXVERSE_PS_SUITES_CHILD = '1'
    try {
    if ($CapSec -le 0) {
        # No cap: keep the original capture path byte-for-byte (zero regression
        # risk for the write-side suites, which are also read by the tick ticket).
        $prevEap = $ErrorActionPreference
        $ErrorActionPreference = 'Continue'
        try {
            $res.text = & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $Path 2>&1 | Out-String
            $res.exit = $LASTEXITCODE
        } finally { $ErrorActionPreference = $prevEap }
        return [pscustomobject]$res
    }
    $tmpOut = [System.IO.Path]::GetTempFileName()
    $tmpErr = [System.IO.Path]::GetTempFileName()
    $proc = $null
    $exited = $false
    # The child goes through cmd.exe only to get a reliable exit code: a Process
    # object from Start-Process -PassThru reports an empty ExitCode on this box
    # (measured, PS5.1 + PS7 alike), which silently turned a red suite into
    # `exit=0`. cmd /c captures the output to the two temp files AND yields the
    # real code (r751 sandbox case m caught this).
    try {
        $psi = New-Object System.Diagnostics.ProcessStartInfo
        $psi.FileName = 'cmd.exe'
        $psi.Arguments = '/c ""powershell.exe" -NoProfile -ExecutionPolicy Bypass -File "' + $Path + '" > "' + $tmpOut + '" 2> "' + $tmpErr + '""'
        $psi.UseShellExecute = $false
        $psi.CreateNoWindow = $true
        $proc = [System.Diagnostics.Process]::Start($psi)
        $exited = $proc.WaitForExit($CapSec * 1000)
    } catch {
        $exited = $false
    }
    if (-not $exited -and $null -ne $proc) {
        # Kill the tree: cmd.exe alone would leave the suite running as an orphan.
        try { & taskkill.exe /T /F /PID $proc.Id 2>&1 | Out-Null } catch { }
        try { if (-not $proc.HasExited) { $proc.Kill() } } catch { }
    }
    $body = ''
    try { if (Test-Path -LiteralPath $tmpOut) { $body = [System.IO.File]::ReadAllText($tmpOut, [System.Text.Encoding]::UTF8) } } catch { $body = '' }
    try {
        if (Test-Path -LiteralPath $tmpErr) {
            $errText = [System.IO.File]::ReadAllText($tmpErr, [System.Text.Encoding]::UTF8)
            if ($errText.Trim() -ne '') { $body = $body + "`n" + $errText }
        }
    } catch { }
    Remove-Item -LiteralPath $tmpOut -Force -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath $tmpErr -Force -ErrorAction SilentlyContinue
    $res.text = $body
    if ($exited -and $null -ne $proc) {
        $code = -1
        try { $code = [int]$proc.ExitCode } catch { $code = -1 }
        $res.exit = $code
    }
    $res.timeout = (-not $exited)
    return [pscustomobject]$res
    } finally {
        if ($null -eq $prevChild) { Remove-Item 'Env:\FLUXVERSE_PS_SUITES_CHILD' -ErrorAction SilentlyContinue }
        else { $env:FLUXVERSE_PS_SUITES_CHILD = $prevChild }
    }
}

$failing = 0
$timeouts = 0
$assertTotal = 0
$assertKnown = 0
foreach ($f in $list) {
    $name = Split-Path -Leaf $f
    $r = Invoke-SuiteChild -Path $f -CapSec $TimeoutSec
    if ($r.timeout) {
        # Not a verdict: we do not know whether it would have passed. WARN, and
        # keep it out of failing so a loaded box cannot impersonate a red suite.
        $timeouts++
        Write-Output ('WARN  ' + $name + '  timeout>' + $TimeoutSec + 's  no verdict')
        continue
    }
    $out = $r.text
    $code = $r.exit

    $passCount = -1
    $failCount = -1
    # Two summary dialects in this repo: `pass=3 fail=0` (writer sandboxes) and
    # `30 passed, 0 failed` (verify sandboxes). Accept both, last match wins.
    $mp = [regex]::Matches($out, '(?i)\bpass(?:ed)?\s*[=:]\s*(\d+)')
    if ($mp.Count -gt 0) { $passCount = [int]$mp[$mp.Count - 1].Groups[1].Value }
    $mp2 = [regex]::Matches($out, '(?i)\b(\d+)\s+passed\b')
    if ($mp2.Count -gt 0) { $passCount = [int]$mp2[$mp2.Count - 1].Groups[1].Value }
    $mf = [regex]::Matches($out, '(?i)\bfail(?:ed|s)?\s*[=:]\s*(\d+)')
    if ($mf.Count -gt 0) { $failCount = [int]$mf[$mf.Count - 1].Groups[1].Value }
    $mf2 = [regex]::Matches($out, '(?i)\b(\d+)\s+failed\b')
    if ($mf2.Count -gt 0) { $failCount = [int]$mf2[$mf2.Count - 1].Groups[1].Value }

    # Third dialect (queue main#100): suites that print one line per check
    # (`PASS <name>` / `FAIL <name>`) and never summarise in either form above.
    # Without this, r759's 15 -> 36 assertions still read as counted=0.
    # Guard rails: only when BOTH summary sides are absent (never mix sources -
    # a half-summarised suite stays uncounted rather than getting an invented
    # number), and only when at least two marker lines are present (a lone
    # `PASS` in an unrelated log line is not a check list).
    if ($passCount -lt 0 -and $failCount -lt 0) {
        $mpass = [regex]::Matches($out, '(?im)^\s*PASS\s+\S')
        $mfail = [regex]::Matches($out, '(?im)^\s*FAIL\s+\S')
        if (($mpass.Count + $mfail.Count) -ge 2) {
            $passCount = $mpass.Count
            $failCount = $mfail.Count
        }
    }

    if ($passCount -ge 0 -and $failCount -ge 0) {
        $assertTotal += ($passCount + $failCount)
        $assertKnown++
    }

    $last = ($out -split "`r?`n" | Where-Object { $_.Trim() -ne '' } | Select-Object -Last 1)
    if ([string]::IsNullOrWhiteSpace($last)) { $last = '(no output)' }
    $red = ($code -ne 0) -or ($failCount -gt 0)
    if ($red) {
        $failing++
        Write-Output ('FAIL  ' + $name + '  exit=' + $code + '  ' + $last)
        # name the red checks so a drift is not just a wall of exit codes
        foreach ($ln in ($out -split "`r?`n")) {
            $t = $ln.Trim()
            if ($t -eq '') { continue }
            if ($t -match '(?i)^(FAIL|not ok|RED)') { Write-Output ('        ' + $t) }
        }
    } else {
        Write-Output ('PASS  ' + $name + '  exit=' + $code + '  ' + $last)
    }
}

$totalFailing = $failing + $failItems
$summary = 'PS SUITES suites=' + $list.Count + ' assertions=' + $assertTotal + ' counted=' + $assertKnown + ' failing=' + $totalFailing + ' parity=' + $parityNote
if ($mode -eq 'verify') {
    $summary = $summary + ' mode=verify timeouts=' + $timeouts
    Write-Output $summary
    if ($timeouts -gt 0) {
        Write-Output ('PS SUITES WARN: ' + $timeouts + ' suite(s) hit the ' + $TimeoutSec + 's cap - re-run them alone before trusting green')
    }
    if ($totalFailing -gt 0) { exit 2 }
    Write-Output 'PS SUITES VERIFY VERDICT: ALL PASS'
    exit 0
}
Write-Output $summary
if ($totalFailing -gt 0) { exit 2 }
Write-Output 'PS SUITES VERDICT: ALL PASS'
exit 0