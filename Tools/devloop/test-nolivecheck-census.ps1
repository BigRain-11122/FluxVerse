# test-nolivecheck-census.ps1 - sandbox for Tools\devloop\nolivecheck-census.ps1 (main#77, r765)
# ------------------------------------------------------------------------------------------
# The census only earns its keep if it can tell four states apart: a hit in the
# owner file, a hit in a whitelisted drill, a hit anywhere else, and a whitelisted
# file that stopped naming the switch at all. This suite builds those trees under
# a temp root and drives the real tool as a CHILD PROCESS (r755 precedent: the
# census exits non-zero by design, and a child process reports that as a code
# instead of unwinding the sandbox).
#
# The token is assembled from two pieces in every fixture, so neither this file
# nor the tool can trip its own scan (see the tool header's honest boundary: a
# text scan cannot see an assembled call - that is also how the fixtures stay
# invisible to the live run).
#
# ASCII-only law (PS5.1 GBK trap).
param(
    [string]$RepoDir = ''
)

$ErrorActionPreference = 'Stop'
$fail = 0
$pass = 0
function Ok([string]$n) { $script:pass++; Write-Output ('PASS ' + $n) }
function No([string]$n, [string]$d) { $script:fail++; Write-Output ('FAIL ' + $n + ' :: ' + $d) }
function Eq([string]$n, [string]$got, [string]$want) {
    if ($got -eq $want) { Ok $n } else { No $n ('expected [' + $want + '] got [' + $got + ']') }
}
function Has([string]$n, [string]$body, [string]$needle) {
    if ($body.Contains($needle)) { Ok $n } else { No $n ('missing [' + $needle + ']') }
}

$here = $PSScriptRoot
if ([string]::IsNullOrEmpty($RepoDir)) { $RepoDir = (Resolve-Path (Join-Path $here '..\..')).Path }
$census = Join-Path $RepoDir 'Tools\devloop\nolivecheck-census.ps1'
if (-not (Test-Path -LiteralPath $census)) { Write-Output ('FAIL census tool missing: ' + $census); exit 1 }

$flag = '-' + 'NoLiveCheck'
$utf8 = New-Object System.Text.UTF8Encoding($false)
$root = Join-Path ([System.IO.Path]::GetTempPath()) ('fc-nlc-' + [System.Guid]::NewGuid().ToString('N'))
[void](New-Item -ItemType Directory -Path $root -Force)

function Write-Text([string]$Rel, [string]$Body) {
    $full = Join-Path $root $Rel
    $dir = Split-Path -Parent $full
    if (-not (Test-Path -LiteralPath $dir)) { [void](New-Item -ItemType Directory -Path $dir -Force) }
    [System.IO.File]::WriteAllText($full, $Body, $utf8)
}

function New-CleanTree {
    if (Test-Path -LiteralPath $root) { Remove-Item -LiteralPath $root -Recurse -Force }
    [void](New-Item -ItemType Directory -Path $root -Force)
    # owner of the switch: one comment mention + one argument-style mention
    Write-Text 'Tools\devloop\write-fastpath-state.ps1' ("# the drill switch `r`n# " + $flag + " exists for sandbox drills`r`nparam([switch]`$Skip)`r`n")
    # whitelisted drill: a real call site
    Write-Text 'logs\devloop-r197-writer-test.ps1' ("`$full = @(`$ArgList) + @('" + $flag + "')`r`n")
    # whitelisted drill: an argument string
    Write-Text 'logs\devloop-r271-keep-negcon.ps1' ("`$psi.Arguments = '-File ""' + `$writer + '"" " + $flag + "'`r`n")
    # whitelisted but names the switch nowhere (the stale case)
    Write-Text 'Tools\devloop\test-fastpath-state-live.ps1' ("# this drill checks the live-hash path itself`r`n`$x = 1`r`n")
}

function Invoke-Census([string]$ScanRoot, [switch]$Fail) {
    $argv = @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', $census, '-ScanRoot', $ScanRoot)
    if ($Fail) { $argv += '-FailOnUnexpected' }
    $out = @()
    $out = @(& powershell.exe @argv 2>&1 | ForEach-Object { [string]$_ })
    $script:lastCode = $LASTEXITCODE
    return ($out -join "`n")
}
function Get-Field([string]$body, [string]$key) {
    $m = [regex]::Match($body, [regex]::Escape($key) + '=(\d+)')
    if ($m.Success) { return $m.Groups[1].Value }
    return ''
}

# ---------------- a. clean tree: the whitelist holds, one stale entry is named
New-CleanTree
$body = Invoke-Census $root -Fail
Eq 'a1 clean tree exit code is 0' ([string]$script:lastCode) '0'
Has 'a2 summary line is present' $body 'nolivecheck-census:'
Eq 'a3 four script files scanned' (Get-Field $body 'files') '4'
Eq 'a4 three hits found' (Get-Field $body 'hits') '3'
Eq 'a5 all three hits are allowed' (Get-Field $body 'allowed') '3'
Eq 'a6 nothing unexpected' (Get-Field $body 'unexpected') '0'
Eq 'a7 one whitelisted file is stale' (Get-Field $body 'stale') '1'
Has 'a8 the pruned trees are printed, not just skipped' $body 'pruned: City3D\Assets'

# ---------------- g. the stale entry is named, not just counted
Has 'g1 stale row names the live-check drill' $body 'stale    Tools\devloop\test-fastpath-state-live.ps1'
Has 'g2 stale row says why it is listed' $body 'names the switch nowhere'

# ---------------- h. hits are classified, and carry file:line
Has 'h1 comment hit is classified' $body 'write-fastpath-state.ps1:2  [comment]'
Has 'h2 call-site hit is classified as code' $body 'devloop-r197-writer-test.ps1:1  [code]'
Has 'h3 allowed row keeps the text it found' $body "exists for sandbox drills"

# ---------------- d/e/f. non-script files and pruned trees do not count
Write-Text 'docs\notes.md' ('prose mentioning ' + $flag + "`r`n")
Write-Text '.git\hooks\sneaky.ps1' ($flag + "`r`n")
Write-Text 'Library\gen.ps1' ($flag + "`r`n")
Write-Text 'node_modules\pkg\cli.cmd' ('REM ' + $flag + "`r`n")
# Unity asset payload trees are a deliberate, PRINTED blind spot (case a8):
# an editor script dropped in there is not counted, and this assertion pins
# that the omission really is the implemented behaviour rather than a bug.
Write-Text 'City3D\Assets\Editor\stray.ps1' ($flag + "`r`n")
$body = Invoke-Census $root -Fail
Eq 'd1 a markdown mention is not scanned' (Get-Field $body 'files') '4'
Eq 'd2 and adds no hit' (Get-Field $body 'hits') '3'
Eq 'e1 .git tree is pruned' (Get-Field $body 'unexpected') '0'
Eq 'f1 Library tree is pruned' (Get-Field $body 'unexpected') '0'
Eq 'f2 vendor tree is pruned' (Get-Field $body 'unexpected') '0'
Eq 'f3 the Unity asset tree is pruned (printed blind spot)' (Get-Field $body 'files') '4'
Eq 'd3 the clean run is still green' ([string]$script:lastCode) '0'

# ---------------- b. a production caller is reported and fails the run
Write-Text 'Tools\perceptor\verify.ps1' ("& " + "`$writer -TechSha12 " + "`$t " + $flag + "`r`n")
$body = Invoke-Census $root -Fail
Eq 'b1 one unexpected hit' (Get-Field $body 'unexpected') '1'
Eq 'b2 exit code is 2' ([string]$script:lastCode) '2'
Has 'b3 the offender is named with its line' $body 'Tools\perceptor\verify.ps1:1'
Has 'b4 the section explains the hazard' $body 'skips the live-hash check'

# ---------------- check3. without the switch the run is informational only
$body = Invoke-Census $root
Eq 'c1 exit stays 0 without the gate switch' ([string]$script:lastCode) '0'
Eq 'c2 but the count is still visible' (Get-Field $body 'unexpected') '1'

# ---------------- check4. a comment-only mention outside the whitelist still counts
Write-Text 'Tools\devloop\some-chain.cmd' ('REM do not add ' + $flag + ' here' + "`r`n")
$body = Invoke-Census $root -Fail
Eq 'i1 two unexpected hits' (Get-Field $body 'unexpected') '2'
Has 'i2 the second offender is named' $body 'some-chain.cmd:1'
Eq 'i3 still fails the run' ([string]$script:lastCode) '2'

# ---------------- l. a missing scan root fails loudly instead of reporting zero
$body = Invoke-Census (Join-Path $root 'no-such-dir')
Eq 'l1 missing root exits 1' ([string]$script:lastCode) '1'
Has 'l2 missing root says so in the summary' $body 'scan root missing'

# ---------------- j. the live tree, and the tool does not trip itself
$body = Invoke-Census $RepoDir -Fail
Eq 'j1 live tree has no unexpected hit' (Get-Field $body 'unexpected') '0'
Eq 'j2 live census run exits 0' ([string]$script:lastCode) '0'
$toolText = [System.IO.File]::ReadAllText($census, [System.Text.Encoding]::UTF8)
if ($toolText.IndexOf($flag, [System.StringComparison]::Ordinal) -lt 0) { Ok 'j3 the tool does not name the token literally' }
else { No 'j3 the tool does not name the token literally' 'census source contains the literal token' }
$selfText = [System.IO.File]::ReadAllText($PSCommandPath, [System.Text.Encoding]::UTF8)
if ($selfText.IndexOf($flag, [System.StringComparison]::Ordinal) -lt 0) { Ok 'j4 this sandbox does not name the token either' }
else { No 'j4 this sandbox does not name the token either' 'sandbox source contains the literal token' }
Has 'j5 live tree still names the owner' $body 'write-fastpath-state.ps1'

# ---------------- k. ASCII-only audit for both new files
foreach ($pair in @(@{ N = 'census'; P = $census }, @{ N = 'sandbox'; P = $PSCommandPath })) {
    $bytes = [System.IO.File]::ReadAllBytes($pair['P'])
    $nonAscii = 0
    foreach ($b in $bytes) { if ($b -gt 127) { $nonAscii++ } }
    Eq ('k-' + $pair['N'] + ' is ASCII only') ([string]$nonAscii) '0'
}

if (Test-Path -LiteralPath $root) { Remove-Item -LiteralPath $root -Recurse -Force }
$total = $pass + $fail
# The trailing pass=/fail= pair is not decoration: run-ps-suites.ps1 counts a
# suite only when it can parse one of two dialects, and a bare "N assertions"
# line left every check here out of the family ledger (queue main#100 is the
# same disease seen from the other side).
if ($fail -eq 0) {
    Write-Output ('RESULT: PASS (' + $total + ' assertions)  pass=' + $pass + ' fail=0')
    exit 0
}
Write-Output ('RESULT: FAIL (' + $fail + ' of ' + $total + ')  pass=' + $pass + ' fail=' + $fail)
exit 1
exit 1