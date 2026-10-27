# test-verify-path-census.ps1 - sandbox proof for the r688 verify-side wiring
# ---------------------------------------------------------------------------
# WHY: main#26 wired probe-path-census into verify.ps1's healthy line. A health
# line is only worth printing if it can actually go red-honest when a probe path
# dies - so this harness injects a dead path through the same test hook verify
# uses (FLUXVERSE_CENSUS_PROBE_DIR) and asserts the line flips to WARN.
#
# Judge criteria (main#26, three questions):
#   1. healthy line carries the three counts (rows / dead / dynamic / gate)
#   2. injecting one dead probe path flips the line to a WARN naming it
#   3. a zero-DEAD machine produces no WARN noise
#
# Boundary: verify.ps1 is executed for real (read-only against world state; it
# only rewrites the event cursor with the same count). No probe body is run by
# the census itself.
# ASCII-only law: no CJK in this file (PS5.1 GBK trap).

$ErrorActionPreference = 'Stop'
$verify = Join-Path (Split-Path $PSScriptRoot -Parent) 'perceptor\verify.ps1'
if (-not (Test-Path -LiteralPath $verify)) { throw ('verify.ps1 not found: ' + $verify) }

$script:fails = 0
function Check([string]$name, [bool]$ok, [string]$detail) {
  if ($ok) { Write-Output ('PASS ' + $name) }
  else { $script:fails++; Write-Output ('FAIL ' + $name + ' :: ' + $detail) }
}

function Run-Verify([string]$probeDir) {
  if ($probeDir) { $env:FLUXVERSE_CENSUS_PROBE_DIR = $probeDir }
  else { Remove-Item Env:\FLUXVERSE_CENSUS_PROBE_DIR -ErrorAction SilentlyContinue }
  $out = @(& $verify 2>&1 | ForEach-Object { [string]$_ })
  Remove-Item Env:\FLUXVERSE_CENSUS_PROBE_DIR -ErrorAction SilentlyContinue
  return $out
}

# ---------- sandbox probe set: one live, one dead, one runtime-composed ------
$sandbox = Join-Path ([System.IO.Path]::GetTempPath()) ('fv-verifycensus-' + $PID)
$probes = Join-Path $sandbox 'probes'
New-Item -ItemType Directory -Path $probes -Force | Out-Null

$live = @'
function Probe-livesrc {
  param($ctx)
  $f = Join-Path $ctx.root 'docs\orders.md'
  if (-not (Test-Path $f)) { return $null }
  return @{ state = @{ ok = 1 } }
}
'@

$dead = @'
function Probe-deadsrc {
  param($ctx)
  $f = Join-Path $ctx.root 'docs\no-such-file-r688.md'
  if (-not (Test-Path $f)) { return $null }
  return @{ state = @{ dead = 1 } }
}
'@

$dyn = @'
function Probe-dynsrc {
  param($ctx)
  $d = Join-Path $ctx.root 'docs'
  $f = Join-Path $d ('file-' + $ctx.now + '.md')
  if (-not (Test-Path $f)) { return $null }
  return @{ state = @{ dyn = 1 } }
}
'@

$utf8 = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText((Join-Path $probes 'livesrc.ps1'), $live, $utf8)
[System.IO.File]::WriteAllText((Join-Path $probes 'deadsrc.ps1'), $dead, $utf8)
[System.IO.File]::WriteAllText((Join-Path $probes 'dynsrc.ps1'), $dyn, $utf8)

# ---------- 1. real machine: healthy line, no WARN noise --------------------
$out = Run-Verify ''
$text = $out -join "`n"
$health = @($out | Where-Object { $_ -like 'VERIFY HEALTH: probe-path-census:*' })
Check 'real machine prints a health line' ($health.Count -eq 1) $text
if ($health.Count -eq 1) {
  Check 'health line carries rows=' ($health[0] -match 'rows=\d+') $health[0]
  Check 'health line carries dead=' ($health[0] -match 'dead=\d+') $health[0]
  Check 'health line carries dynamic=' ($health[0] -match 'dynamic=\d+') $health[0]
  Check 'health line carries gate=' ($health[0] -match 'gate=\d+') $health[0]
}
Check 'real machine dead=0' ($health.Count -eq 1 -and $health[0] -match 'dead=0') $text
Check 'real machine emits no census WARN' (-not ($text -match 'VERIFY WARN: probe-path-census')) $text
Check 'gate still passes with census wired' ($text -match 'VERIFY PASS') $text

# ---------- 2. injected dead path: line flips to WARN and names it ----------
$out2 = Run-Verify $probes
$text2 = $out2 -join "`n"
$warn = @($out2 | Where-Object { $_ -like 'VERIFY WARN: probe-path-census:*' })
Check 'dead path flips the health line to WARN' ($warn.Count -eq 1) $text2
if ($warn.Count -eq 1) {
  Check 'WARN reports dead=1' ($warn[0] -match 'dead=1') $warn[0]
}
Check 'WARN names the offending probe row' ($text2 -match 'census deadsrc:\d+ -> .*no-such-file-r688\.md') $text2
Check 'no health line when dead paths exist' (-not ($out2 | Where-Object { $_ -like 'VERIFY HEALTH: probe-path-census:*' })) $text2
Check 'WARN does not fail the gate' ($text2 -match 'VERIFY PASS') $text2
Check 'WARN text contains no FAIL token' (-not ($text2 -match 'FAIL')) $text2

# ---------- 3. protocol hygiene -------------------------------------------
Check 'census is called in-process (no powershell child)' `
  (-not (Select-String -Path $verify -Pattern 'powershell\.exe|powershell -' -Quiet)) 'verify.ps1 spawns a shell'

Remove-Item -Recurse -Force $sandbox -ErrorAction SilentlyContinue

if ($script:fails -gt 0) { Write-Output ('RESULT: FAIL (' + $script:fails + ')'); exit 1 }
Write-Output 'RESULT: PASS'
exit 0