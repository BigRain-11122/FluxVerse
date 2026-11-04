# test-suite-registry-census.ps1 - sandbox for suite-registry-census.ps1
# -----------------------------------------------------------------------
# Queue main#139 (r831). The census answers "does some family actually SPAWN
# this sandbox?" - the question behind r786 / r790 / r795 / r828, all of which
# were sandboxes that existed (and one of them red) while nobody ran them.
#
# Fixtures are tiny trees: a suite dir with test-*.ps1 files and a registry file
# holding -Suites literals. The live section at the end pins the two invariants
# this round restored: every on-disk sandbox is spawned or exemptly dated, and
# no family guards a suite it never asks for.
# ASCII-only law: no CJK in this file.

$ErrorActionPreference = 'Stop'
$pass = 0
$fail = 0
function Check([string]$name, [bool]$cond, [string]$detail = '') {
    if ($cond) { Write-Output ('  PASS ' + $name); $script:pass++ }
    else { Write-Output ('  FAIL ' + $name + $(if ($detail) { ' :: ' + $detail } else { '' })); $script:fail++ }
}

$mod = Join-Path $PSScriptRoot 'suite-registry-census.ps1'
if (-not (Test-Path -LiteralPath $mod)) { Write-Output 'setup FAIL: suite-registry-census.ps1 missing'; exit 1 }

$tmp = Join-Path ([System.IO.Path]::GetTempPath()) ('srcensus-' + [Guid]::NewGuid().ToString('N').Substring(0, 8))
$suiteDir = Join-Path $tmp 'Tools\devloop'
$null = New-Item -ItemType Directory -Path $suiteDir -Force
function New-Suite([string]$name) {
    $p = Join-Path $suiteDir $name
    [System.IO.File]::WriteAllText($p, '# fixture' + [Environment]::NewLine, (New-Object System.Text.UTF8Encoding($false)))
    return $p
}
function New-Registry([string]$body) {
    $p = Join-Path $suiteDir 'registry.ps1'
    [System.IO.File]::WriteAllText($p, $body, (New-Object System.Text.UTF8Encoding($false)))
    return $p
}
# A registry whose only spawn list names one suite, in the exact shape the tick
# module uses (the census parses that literal, so the shape is a contract).
$regOne = New-Registry @'
if ($ExtraArgs.Count -eq 0 -and $Family -eq 'write3') { $ExtraArgs = @('-Suites', 'Tools\devloop\test-alpha.ps1') }
'@
$null = New-Suite 'test-alpha.ps1'

# --- a. one spawned, one not: the reading names the orphan -----------------
$null = New-Suite 'test-beta.ps1'
$out = @(& powershell.exe -NoProfile -ExecutionPolicy Bypass -File $mod -RepoDir $tmp -RegistryPath $regOne 2>&1)
$code = $LASTEXITCODE
$txt = ($out -join ' ')
Check 'a1 exit 0 without the fail switch' ($code -eq 0) ([string]$code)
Check 'a2 counts the orphan' ($txt -match 'files=2' -and $txt -match 'spawned=1' -and $txt -match 'unspawned=1') $txt
Check 'a3 names the orphan' ($txt -match 'test-beta\.ps1') $txt

# --- b. the fail switch turns the reading into a gate ---------------------
$out2 = @(& powershell.exe -NoProfile -ExecutionPolicy Bypass -File $mod -RepoDir $tmp -RegistryPath $regOne -FailOnUnregistered 2>&1)
$code2 = $LASTEXITCODE
Check 'b1 -FailOnUnregistered exits 2' ($code2 -eq 2) ([string]$code2)

# --- c. an exemption hides it, and goes stale when it stops meaning anything
$out3 = @(& powershell.exe -NoProfile -ExecutionPolicy Bypass -File $mod -RepoDir $tmp -RegistryPath $regOne -ExemptNames 'test-beta.ps1' 2>&1)
$txt3 = ($out3 -join ' ')
Check 'c1 exempt file leaves unspawned at 0' ($txt3 -match 'unspawned=0' -and $txt3 -match 'exempt=1') $txt3
Check 'c2 a live exemption is not stale' ($txt3 -match 'stale_exempt=0') $txt3
$out4 = @(& powershell.exe -NoProfile -ExecutionPolicy Bypass -File $mod -RepoDir $tmp -RegistryPath $regOne -ExemptNames 'test-beta.ps1','test-ghost.ps1' 2>&1)
$txt4 = ($out4 -join ' ')
Check 'c3 an exemption whose file is gone is stale' ($txt4 -match 'stale_exempt=1' -and $txt4 -match 'test-ghost\.ps1') $txt4
$out5 = @(& powershell.exe -NoProfile -ExecutionPolicy Bypass -File $mod -RepoDir $tmp -RegistryPath $regOne -ExemptNames 'test-alpha.ps1' 2>&1)
$txt5 = ($out5 -join ' ')
Check 'c4 an exemption for a spawned suite is stale' ($txt5 -match 'stale_exempt=1' -and $txt5 -match 'test-alpha\.ps1') $txt5

# --- d. missing inputs are measurements that did not happen, never a zero ---
$out6 = @(& powershell.exe -NoProfile -ExecutionPolicy Bypass -File $mod -RepoDir $tmp -RegistryPath (Join-Path $tmp 'nope.ps1') 2>&1)
$code6 = $LASTEXITCODE
$txt6 = ($out6 -join ' ')
Check 'd1 missing registry exits 1' ($code6 -eq 1) ([string]$code6)
Check 'd2 missing registry does not print a count' ($txt6 -notmatch 'files=') $txt6
$out7 = @(& powershell.exe -NoProfile -ExecutionPolicy Bypass -File $mod -RepoDir (Join-Path $tmp 'nope') -RegistryPath $regOne 2>&1)
Check 'd3 missing repo exits 1' ($LASTEXITCODE -eq 1) ([string]$LASTEXITCODE)

# --- e. the live tree: no orphan, no guarded-but-unspawned suite ----------
$repo = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$live = @(& powershell.exe -NoProfile -ExecutionPolicy Bypass -File $mod -RepoDir $repo 2>&1)
$liveTxt = ($live -join ' ')
Check 'e1 live census runs' ($liveTxt -match 'SUITE-REGISTRY: files=\d+') $liveTxt
Check 'e2 no sandbox on disk is unspawned without a dated exemption' ($liveTxt -match 'unspawned=0') $liveTxt
Check 'e3 no family guards a suite it never spawns (the r828 shape)' ($liveTxt -match 'guarded_only=0') $liveTxt
Check 'e4 no exemption has outlived its meaning' ($liveTxt -match 'stale_exempt=0') $liveTxt
# unborn-guard: the census must be able to see a suite that appeared after the
# registry was written. Proven here by a fresh file in a fixture tree.
$null = New-Suite 'test-gamma.ps1'
$out8 = @(& powershell.exe -NoProfile -ExecutionPolicy Bypass -File $mod -RepoDir $tmp -RegistryPath $regOne 2>&1)
$txt8 = ($out8 -join ' ')
Check 'e5 a newly added sandbox is named immediately' ($txt8 -match 'test-gamma\.ps1' -and $txt8 -match 'files=3') $txt8

# --- f. ASCII hygiene ----------------------------------------------------
$bytes = [System.IO.File]::ReadAllBytes($mod)
$nonAscii = 0
foreach ($b in $bytes) { if ($b -gt 127) { $nonAscii++ } }
Check ('f1 census is ASCII-only (non-ascii=' + $nonAscii + ')') ($nonAscii -eq 0) ([string]$nonAscii)

Remove-Item -LiteralPath $tmp -Recurse -Force -ErrorAction SilentlyContinue
Write-Output ('test-suite-registry-census: ' + $pass + ' passed, ' + $fail + ' failed (of ' + ($pass + $fail) + ')')
if ($fail -gt 0) { exit 1 }
exit 0