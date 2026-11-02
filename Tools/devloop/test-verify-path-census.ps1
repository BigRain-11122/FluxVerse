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

# ---------- 3. protocol hygiene: the whole in-process chain, not one file ---
# r759 (queue main#92): the old assertion grepped verify.ps1 for a literal
# 'powershell.exe'. r750 put the real spawn in a dot-sourced module, so the
# letter stayed green while the intent was gone. The audit below walks the
# chain verify.ps1 actually runs in this process and requires every shell
# capability in it to be named in an explicit allowlist (with a reason).
$chainModule = Join-Path (Split-Path $PSScriptRoot -Parent) 'devloop\shell-chain-census.ps1'
. $chainModule

$shellAllow = @(
  @{ Path = 'Tools\devloop\ps-suites-tick.ps1'; Reason = 'sandbox suites end with exit N - must be a real child process (r748 judgement)' }
)
$shellDynamic = @{
  'state-promote.ps1:$MoveFile' = 'scriptblock test seam (r753), never a file'
  'archive-logs.ps1:$flush' = 'scriptblock chunk writer, never a file'
  'archive-logs.ps1:$weekOf' = 'scriptblock week-label formatter (D-20261101-05 item 3), never a file'
}
$repoRootForChain = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent

function Get-ChainAudit([string]$verifyPath, [object[]]$allow, [hashtable]$dyn) {
  return Get-ShellChainAudit -VerifyPath $verifyPath -RepoRoot $repoRootForChain -Whitelist $allow -DynamicAllow $dyn
}

$audit = Get-ChainAudit $verify $shellAllow $shellDynamic
$auditLine = Format-ShellChainVerdict $audit

$verifyKey = [System.IO.Path]::GetFullPath($verify)
Check 'verify.ps1 itself starts no shell' (@($audit.Hits | Where-Object { $_.Path -eq $verifyKey }).Count -eq 0) $auditLine
Check 'chain audit resolves more than one file' ($audit.Files.Count -ge 8) $auditLine
Check 'chain audit names the allowed spawn module' (@($audit.Files | Where-Object { (Split-Path $_ -Leaf) -eq 'ps-suites-tick.ps1' }).Count -eq 1) $auditLine
Check 'no shell capability outside the allowlist' ($audit.Violations.Count -eq 0) $auditLine
Check 'every call site resolves to a file or a declared seam' ($audit.Unresolved.Count -eq 0) $auditLine
Check 'no stale allowlist entry' ($audit.StaleWhitelist.Count -eq 0) $auditLine
Check 'verdict line carries the four counts' ($auditLine -match 'violations=0 unresolved=0 stale_allow=0') $auditLine

# ---------- 4. the audit must stay able to catch a new spawn ---------------
# Fixtures are plain files in a temp tree; each one is a miniature verify.
$fx = Join-Path $sandbox 'chain'
New-Item -ItemType Directory -Path $fx -Force | Out-Null
function Write-Fx([string]$name, [string]$body) {
  [System.IO.File]::WriteAllText((Join-Path $fx $name), $body, $utf8)
}
# Bodies are parenthesised: in command mode an unparenthesised
# 'a' + "`n" + 'b' binds as extra ARGUMENTS, not as concatenation, and the
# fixture silently loses every line after the first (caught by this sandbox
# itself: files=1 with an empty chain).
Write-Fx 'mod-clean.ps1' ('function Get-Clean { return 1 }' + "`n")
Write-Fx 'mod-shell.ps1' ('function Get-Shell { & powershell.exe -File x.ps1 }' + "`n")
Write-Fx 'mod-str.ps1' ('function Start-Thing { $psi = New-Object System.Diagnostics.ProcessStartInfo; $psi.FileName = ''cmd.exe'' }' + "`n")
Write-Fx 'mod-cmt.ps1' ('# usage: powershell -File mod-cmt.ps1' + "`n" + 'function Get-Quiet { return 2 }' + "`n")
Write-Fx 'mod-var.ps1' ('function Get-Local { $cmd = Get-Command foo -ErrorAction SilentlyContinue; return $cmd }' + "`n")
Write-Fx 'mod-mid.ps1' ('$deep = Join-Path $PSScriptRoot ''mod-shell.ps1''' + "`n" + '. $deep' + "`n")
Write-Fx 'v-clean.ps1' ('$m = Join-Path $PSScriptRoot ''mod-clean.ps1''' + "`n" + '. $m' + "`n")
Write-Fx 'v-root-shell.ps1' ('& powershell.exe -NoProfile -File helper.ps1' + "`n")
Write-Fx 'v-mid.ps1' ('$m = Join-Path $PSScriptRoot ''mod-mid.ps1''' + "`n" + '. $m' + "`n")
Write-Fx 'v-str.ps1' ('$m = Join-Path $PSScriptRoot ''mod-str.ps1''' + "`n" + '. $m' + "`n")
Write-Fx 'v-cmt.ps1' ('$m = Join-Path $PSScriptRoot ''mod-cmt.ps1''' + "`n" + '. $m' + "`n")
Write-Fx 'v-var.ps1' ('$m = Join-Path $PSScriptRoot ''mod-var.ps1''' + "`n" + '. $m' + "`n")
Write-Fx 'v-unres.ps1' ('& $mysteryThing' + "`n")

function Fx-Audit([string]$name, [object[]]$allow, [hashtable]$dyn) {
  return Get-ShellChainAudit -VerifyPath (Join-Path $fx $name) -RepoRoot $fx -Whitelist $allow -DynamicAllow $dyn
}

$fxClean = Fx-Audit 'v-clean.ps1' @() @{}
Check 'clean chain passes with zero violations' ($fxClean.Violations.Count -eq 0) (Format-ShellChainVerdict $fxClean)
Check 'clean chain counted both files' ($fxClean.Files.Count -eq 2) (Format-ShellChainVerdict $fxClean)

$fxRoot = Fx-Audit 'v-root-shell.ps1' @() @{}
Check 'spawn in the root file is caught' ($fxRoot.Violations.Count -eq 1) (Format-ShellChainVerdict $fxRoot)
Check 'root spawn is named powershell' ($fxRoot.Violations.Count -eq 1 -and $fxRoot.Violations[0].Hit -eq 'powershell.exe') (Format-ShellChainVerdict $fxRoot)

$fxMid = Fx-Audit 'v-mid.ps1' @() @{}
Check 'spawn two hops down is caught' ($fxMid.Violations.Count -eq 1) (Format-ShellChainVerdict $fxMid)
Check 'deep spawn names its own file' ($fxMid.Violations.Count -eq 1 -and (Split-Path $fxMid.Violations[0].Path -Leaf) -eq 'mod-shell.ps1') (Format-ShellChainVerdict $fxMid)

$fxStr = Fx-Audit 'v-str.ps1' @() @{}
Check 'spawn written as a ProcessStartInfo string is caught' ($fxStr.Violations.Count -eq 1 -and $fxStr.Violations[0].Hit -eq 'cmd.exe') (Format-ShellChainVerdict $fxStr)

$fxCmt = Fx-Audit 'v-cmt.ps1' @() @{}
Check 'a shell named only in a comment is not a spawn' ($fxCmt.Violations.Count -eq 0 -and $fxCmt.Hits.Count -eq 0) (Format-ShellChainVerdict $fxCmt)

$fxVar = Fx-Audit 'v-var.ps1' @() @{}
Check 'a local $cmd variable is not a spawn' ($fxVar.Violations.Count -eq 0 -and $fxVar.Hits.Count -eq 0) (Format-ShellChainVerdict $fxVar)

$fxAllow = Fx-Audit 'v-mid.ps1' @(@{ Path = (Join-Path $fx 'mod-shell.ps1'); Reason = 'fixture allowed' }) @{}
Check 'an allowlisted module is not a violation' ($fxAllow.Violations.Count -eq 0) (Format-ShellChainVerdict $fxAllow)
Check 'an allowlisted module is not stale when it really spawns' ($fxAllow.StaleWhitelist.Count -eq 0) (Format-ShellChainVerdict $fxAllow)

$fxStale = Fx-Audit 'v-clean.ps1' @(@{ Path = (Join-Path $fx 'mod-clean.ps1'); Reason = 'no longer spawns' }) @{}
Check 'an allowance for a module that no longer spawns is stale' ($fxStale.StaleWhitelist.Count -eq 1) (Format-ShellChainVerdict $fxStale)

$fxStale2 = Fx-Audit 'v-clean.ps1' @(@{ Path = (Join-Path $fx 'mod-shell.ps1'); Reason = 'not in this chain' }) @{}
Check 'an allowance for a module outside the chain is stale' ($fxStale2.StaleWhitelist.Count -eq 1) (Format-ShellChainVerdict $fxStale2)

$fxUnres = Fx-Audit 'v-unres.ps1' @() @{}
Check 'an unresolved call site is reported as a hole' ($fxUnres.Unresolved.Count -eq 1) (Format-ShellChainVerdict $fxUnres)
$fxUnres2 = Fx-Audit 'v-unres.ps1' @() @{ 'v-unres.ps1:$mysteryThing' = 'declared seam' }
Check 'a declared seam is not a hole' ($fxUnres2.Unresolved.Count -eq 0) (Format-ShellChainVerdict $fxUnres2)

Remove-Item -Recurse -Force $sandbox -ErrorAction SilentlyContinue

if ($script:fails -gt 0) { Write-Output ('RESULT: FAIL (' + $script:fails + ')'); exit 1 }
Write-Output 'RESULT: PASS'
exit 0