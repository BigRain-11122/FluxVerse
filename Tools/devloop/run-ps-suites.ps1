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
# Suites are launched as child processes on purpose: they end with `exit N`,
# which would kill this runner if invoked in-process. Never read
# $LASTEXITCODE after `& script.ps1` (B795) - we always call powershell.exe.
# ASCII-only body (PS5.1 GBK law). No auto-variable locals ($pid family, r164).
# ---------------------------------------------------------------------------
param(
    [string[]]$Suites = @(),
    [switch]$All,
    [switch]$SkipParity,
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
    'logs\devloop-r271-keep-negcon.ps1'
)

$selfName = Split-Path -Leaf $MyInvocation.MyCommand.Path
# `powershell.exe -File x.ps1 -Suites a,b` arrives as ONE comma-joined string,
# so split the bound values back into real paths (r748 sandbox caught this).
$list = @()
if ($Suites.Count -gt 0) {
    foreach ($s in $Suites) {
        foreach ($one in ($s -split '[,;]')) {
            $t = $one.Trim().Trim('"').Trim("'")
            if ($t -ne '') { $list += $t }
        }
    }
} elseif ($All) {
    $list = @(Get-ChildItem -Path (Join-Path $RepoDir 'Tools\devloop') -Filter 'test-*.ps1' |
        Where-Object { $_.Name -ne $selfName } |
        Sort-Object Name |
        ForEach-Object { $_.FullName })
} else {
    $list = @($defaultRel | ForEach-Object { Join-Path $RepoDir $_ })
}

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
$failItems = 0
$parityNote = 'skipped'
if (-not $SkipParity) {
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
$failing = 0
$assertTotal = 0
$assertKnown = 0
foreach ($f in $list) {
    $name = Split-Path -Leaf $f
    $out = ''
    $code = 0
    $prevEap = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        $out = & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $f 2>&1 | Out-String
        $code = $LASTEXITCODE
    } finally { $ErrorActionPreference = $prevEap }

    $passCount = -1
    $failCount = -1
    $mp = [regex]::Matches($out, '(?i)\bpass(?:ed)?\s*[=:]\s*(\d+)')
    if ($mp.Count -gt 0) { $passCount = [int]$mp[$mp.Count - 1].Groups[1].Value }
    $mf = [regex]::Matches($out, '(?i)\bfail(?:ed|s)?\s*[=:]\s*(\d+)')
    if ($mf.Count -gt 0) { $failCount = [int]$mf[$mf.Count - 1].Groups[1].Value }

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
Write-Output ('PS SUITES suites=' + $list.Count + ' assertions=' + $assertTotal + ' counted=' + $assertKnown + ' failing=' + $totalFailing + ' parity=' + $parityNote)
if ($totalFailing -gt 0) { exit 2 }
Write-Output 'PS SUITES VERDICT: ALL PASS'
exit 0