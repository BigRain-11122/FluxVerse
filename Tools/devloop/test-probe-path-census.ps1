# test-probe-path-census.ps1 - sandbox proof for probe-path-census.ps1
# ---------------------------------------------------------------------
# The census is only worth its verdict if it would actually SAY SO when a probe
# points at a path that does not exist (the r686 failure class). This sandbox
# builds three synthetic probes - one live path, one dead path, one run-time
# composed name - and asserts the census reports exactly one dead path and does
# not confuse a dynamic tail with a dead file.
# ASCII-only law: no CJK in this file.

$ErrorActionPreference = 'Stop'
$census = Join-Path $PSScriptRoot 'probe-path-census.ps1'
if (-not (Test-Path -LiteralPath $census)) { Write-Output 'setup FAIL: census script missing'; exit 1 }

$sandbox = Join-Path ([System.IO.Path]::GetTempPath()) ('fv-pathcensus-' + $PID)
$probes = Join-Path $sandbox 'probes'
New-Item -ItemType Directory -Path $probes -Force | Out-Null

$live = @'
function Probe-livesrc {
  param($ctx)
  try {
    $f = Join-Path $ctx.root 'docs\orders.md'
    if (-not (Test-Path $f)) { return @{ state = @{ } } }
    return @{ state = @{ live = 1 } }
  } catch { return $null }
}
'@
$dead = @'
function Probe-deadsrc {
  param($ctx)
  try {
    $f = Join-Path $ctx.root 'docs\no-such-file-r687.md'
    if (-not (Test-Path $f)) { return @{ state = @{ } } }
    return @{ state = @{ dead = 1 } }
  } catch { return $null }
}
'@
$dyn = @'
function Probe-dynsrc {
  param($ctx)
  try {
    $d = Join-Path $ctx.root 'docs'
    $f = Join-Path $d ('file-' + $ctx.now + '.md')
    if (-not (Test-Path $f)) { return @{ state = @{ } } }
    return @{ state = @{ dyn = 1 } }
  } catch { return $null }
}
'@
[System.IO.File]::WriteAllText((Join-Path $probes 'livesrc.ps1'), $live, (New-Object System.Text.UTF8Encoding($false)))
[System.IO.File]::WriteAllText((Join-Path $probes 'deadsrc.ps1'), $dead, (New-Object System.Text.UTF8Encoding($false)))
[System.IO.File]::WriteAllText((Join-Path $probes 'dynsrc.ps1'), $dyn, (New-Object System.Text.UTF8Encoding($false)))

$out = (& powershell -NoProfile -ExecutionPolicy Bypass -File $census -ProbeDirOverride $probes) -join "`n"
$pass = 0
$fail = 0
function Check([string]$name, [bool]$cond) {
  if ($cond) { Write-Output ('  PASS ' + $name); $script:pass++ }
  else { Write-Output ('  FAIL ' + $name); $script:fail++ }
}

Check 'summary line present' ($out -match 'probe-path-census: probes=3')
Check 'exactly one dead path' ($out -match 'DEAD=1')
Check 'dead path named in the DEAD section' ($out -match 'deadsrc:.*no-such-file-r687\.md')
Check 'live path reported as existing' ($out -match 'livesrc\s+exact\s+YES')
Check 'dynamic tail is not a dead file' ($out -match 'dynsrc\s+prefix\s+YES')
Check 'dynamic probe did not land in DEAD section' (-not ($out -match 'DEAD PATHS[\s\S]*dynsrc:'))

Remove-Item -LiteralPath $sandbox -Recurse -Force -ErrorAction SilentlyContinue
Write-Output ('test-probe-path-census: ' + $pass + ' passed, ' + $fail + ' failed (of ' + ($pass + $fail) + ')')
if ($fail -gt 0) { exit 1 }
exit 0