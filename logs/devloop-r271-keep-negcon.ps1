# devloop-r271-keep-negcon.ps1 - negative-control sandbox for Tools/devloop/write-fastpath-state.ps1
# KEEP keys (tech queue #11, r270 negcon paradigm application #3).
# Delta vs the r197 writer seat (41 asserts, KEEP basics by exit code only):
#  (a) MARKER-LEVEL fail-loud - each poison must print the exact FAIL text,
#      not just exit nonzero; seeded targets byte-untouched after every failure.
#  (b) two-path writeback fixture - .new write+assert path succeeds, then an
#      EXCLUSIVE-LOCKED destination fails the Move-Item path: 'move into place
#      failed', target untouched, .new cleaned by catch, and the SAME call goes
#      green the instant the lock drops (proves path 1 ran during the lock).
#      Lock uses explicit-hex args (KEEP would hit the pre-read 'KEEP read
#      failed' face instead of the move face - kept out of this fixture).
#  (c) static double-assert audit: Assert-StateFile is called on BOTH the
#      .new file and the moved state file.
#  (d) echo-vs-file liveness: 'STATE OK tech=' must echo the OLD seed value
#      which appears in NO argument (a fake echo cannot know 999999999999).
#  (e) double-run byte stability of the KEEP write.
# NOTE (found-and-noted, not gated): PS -eq is case-insensitive, so 'keep'
#      lowercase also enters the KEEP branch; recorded as a NOTE line.
# Isolation law: every call passes -StatePath; fixtures live in a GUID-unique
#  $env:TEMP root; production logs\devloop-fastpath-state.txt hash compared
#  before/after (zero production touch).
# Child processes via .NET Process double-redirect (29th trap law, r244).
# ASCII-only script (encoding law). A/B byte-stability law: no ms/GUID/sha
# values in printed names.
$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot
$writer = Join-Path $repo 'Tools\devloop\write-fastpath-state.ps1'
$prodState = Join-Path $repo 'logs\devloop-fastpath-state.txt'
$utf8 = New-Object System.Text.UTF8Encoding($false)
$pass = 0
$fail = 0
function Chk([bool]$cond, [string]$name) {
  if ($cond) { $script:pass++; Write-Output ('PASS ' + $name) }
  else { $script:fail++; Write-Output ('FAIL ' + $name) }
}
function Run-Writer {
  param([string]$Tech, [string]$Led, [string]$Dec, [string]$Ord, [string]$StPath)
  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = 'powershell.exe'
  $psi.Arguments = '-NoProfile -ExecutionPolicy Bypass -File "' + $writer + '" -TechSha12 ' + $Tech + ' -LedgerSha12 ' + $Led + ' -DecSha12 ' + $Dec + ' -OrdersSha12 ' + $Ord + ' -StatePath "' + $StPath + '"'
  $psi.UseShellExecute = $false
  $psi.RedirectStandardOutput = $true
  $psi.RedirectStandardError = $true
  $psi.CreateNoWindow = $true
  $p = [System.Diagnostics.Process]::Start($psi)
  $so = $p.StandardOutput.ReadToEnd()
  $se = $p.StandardError.ReadToEnd()
  $p.WaitForExit()
  $code = $p.ExitCode
  $p.Dispose()
  return @{ code = $code; out = $so; err = $se }
}
function Get-Hash12 { param([string]$P) (Get-FileHash -LiteralPath $P -Algorithm SHA256).Hash.Substring(0,12) }
function Mk-State { param([string]$Path, [string[]]$Lines) [System.IO.File]::WriteAllLines($Path, $Lines, $utf8) }
function Read-Lines { param([string]$P) [System.IO.File]::ReadAllLines($P) }
function Read-Bytes { param([string]$P) [System.IO.File]::ReadAllBytes($P) }
function Bytes-Equal { param([byte[]]$A, [byte[]]$B) (-not (Compare-Object -ReferenceObject $A -DifferenceObject $B)) }

$tmpRoot = Join-Path $env:TEMP ('r271-keepnegcon-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $tmpRoot | Out-Null
$lock = $null

$seed4 = @('tech_sha12=999999999999', 'ledger_sha12=222222222222', 'dec_sha12=333333333333', 'orders_sha12=888888888888')
$seedNoTech = @('ledger_sha12=222222222222', 'dec_sha12=333333333333', 'orders_sha12=888888888888')
$seedNoOrd = @('tech_sha12=999999999999', 'ledger_sha12=222222222222', 'dec_sha12=333333333333')
$garbage = @('junk line one', 'broken ### key=value', '')
$prodHashBefore = Get-Hash12 $prodState

try {
  # ---------- A0 static audit ----------
  Chk (Test-Path -LiteralPath $writer) 'a0-writer-exists'
  $bytes = Read-Bytes $writer
  $nonAscii = 0
  foreach ($b in $bytes) { if ($b -gt 127) { $nonAscii++ } }
  Chk ($nonAscii -eq 0) ('a0-writer-ascii non_ascii=' + $nonAscii)
  $body = [System.IO.File]::ReadAllText($writer)
  $keepHits = [regex]::Matches($body, [regex]::Escape("-eq 'KEEP'")).Count
  Chk ($keepHits -ge 2) ('a0-keep-branches keep_hits=' + $keepHits)
  Chk ($body.Contains('function Get-ExistingSha')) 'a0-getexisting-fn'
  Chk ($body.Contains('Assert-StateFile -Path $tmpPath')) 'a0-assert-new-path'
  Chk ($body.Contains('Assert-StateFile -Path $StatePath')) 'a0-assert-moved-path'
  Chk ($body.Contains('.new') -and $body.Contains('Move-Item -LiteralPath $tmpPath -Destination $StatePath -Force')) 'a0-atomic-markers'
  Chk ($body.Contains('KEEP requested but state file missing')) 'a0-marker-file-missing'
  Chk ($body.Contains('no valid tech_sha12 line') -and $body.Contains('no valid orders_sha12 line')) 'a0-marker-keepline-missing'
  Chk ($body.Contains('bad -TechSha12') -and $body.Contains('bad -OrdersSha12')) 'a0-marker-badparam'
  Chk ($body.Contains('move into place failed') -and $body.Contains('write .new failed')) 'a0-marker-writepaths'
  Chk ($body.Contains('[string]$StatePath')) 'a0-statepath-param'
  Chk ($body.Contains('STATE OK') -and $body.Contains('lines=4')) 'a0-output-markers'

  # ---------- A1 positive control: KEEP tech + KEEP orders ----------
  $st = Join-Path $tmpRoot 'a1-state.txt'
  Mk-State $st $seed4
  $r = Run-Writer -Tech 'KEEP' -Led 'AAAAAAAAAAAA' -Dec 'BBBBBBBBBBBB' -Ord 'KEEP' -StPath $st
  Chk ($r.code -eq 0) ('a1-exit0 code=' + $r.code)
  Chk ($r.out.Contains('STATE OK')) 'a1-state-ok-line'
  $L = Read-Lines $st
  Chk (@($L).Count -eq 4) ('a1-lines4 count=' + @($L).Count)
  Chk ($L[0] -eq 'tech_sha12=999999999999') ('a1-tech-keep-preserved [' + $L[0] + ']')
  Chk ($L[1] -eq 'ledger_sha12=AAAAAAAAAAAA') 'a1-ledger-updated'
  Chk ($L[2] -eq 'dec_sha12=BBBBBBBBBBBB') 'a1-dec-updated'
  Chk ($L[3] -eq 'orders_sha12=888888888888') ('a1-orders-keep-preserved [' + $L[3] + ']')
  Chk (-not (Test-Path -LiteralPath ($st + '.new'))) 'a1-no-new-residue'
  Chk ($r.out.Contains('tech=999999999999') -and $r.out.Contains('orders=888888888888')) 'a1-echo-echoes-old-seed-values'
  Chk ($r.out.Contains('ledger=AAAAAAAAAAAA') -and $r.out.Contains('dec=BBBBBBBBBBBB')) 'a1-echo-echoes-new-values'
  $b1 = Read-Bytes $st
  $r2 = Run-Writer -Tech 'KEEP' -Led 'AAAAAAAAAAAA' -Dec 'BBBBBBBBBBBB' -Ord 'KEEP' -StPath $st
  Chk ($r2.code -eq 0) ('a1-doublerun-exit0 code=' + $r2.code)
  $b2 = Read-Bytes $st
  Chk (Bytes-Equal $b1 $b2) 'a1-doublerun-bytes-identical'
  $stL = Join-Path $tmpRoot 'a1-lower.txt'
  Mk-State $stL $seed4
  $rL = Run-Writer -Tech 'keep' -Led 'AAAAAAAAAAAA' -Dec 'BBBBBBBBBBBB' -Ord 'keep' -StPath $stL
  Write-Output ('NOTE lowercase-keep accepted=' + ($rL.code -eq 0) + ' (PS -eq case-insensitive; found-and-noted, not gated)')

  # ---------- A2 fail-loud negative controls ----------
  $rN1 = Run-Writer -Tech 'KEEP' -Led 'AAAAAAAAAAAA' -Dec 'BBBBBBBBBBBB' -Ord 'CCCCCCCCCCCC' -StPath (Join-Path $tmpRoot 'no-such-state.txt')
  Chk ($rN1.code -eq 1) ('a2-n1-techkeep-missingfile-exit1 code=' + $rN1.code)
  Chk ($rN1.out.Contains('KEEP requested but state file missing')) 'a2-n1-techkeep-missingfile-marker'
  $rN2 = Run-Writer -Tech 'ABCDEF012345' -Led 'AAAAAAAAAAAA' -Dec 'BBBBBBBBBBBB' -Ord 'KEEP' -StPath (Join-Path $tmpRoot 'no-such-state.txt')
  Chk ($rN2.code -eq 1) ('a2-n2-ordkeep-missingfile-exit1 code=' + $rN2.code)
  Chk ($rN2.out.Contains('KEEP requested but state file missing')) 'a2-n2-ordkeep-missingfile-marker'
  $stN3 = Join-Path $tmpRoot 'n3-state.txt'
  Mk-State $stN3 $seedNoTech
  $h3 = Get-Hash12 $stN3
  $rN3 = Run-Writer -Tech 'KEEP' -Led 'AAAAAAAAAAAA' -Dec 'BBBBBBBBBBBB' -Ord 'CCCCCCCCCCCC' -StPath $stN3
  Chk ($rN3.code -eq 1) ('a2-n3-techkeep-noline-exit1 code=' + $rN3.code)
  Chk ($rN3.out.Contains('no valid tech_sha12 line')) 'a2-n3-techkeep-noline-marker'
  Chk ((Get-Hash12 $stN3) -eq $h3) 'a2-n3-target-untouched'
  $stN4 = Join-Path $tmpRoot 'n4-state.txt'
  Mk-State $stN4 $seedNoOrd
  $h4 = Get-Hash12 $stN4
  $rN4 = Run-Writer -Tech 'ABCDEF012345' -Led 'AAAAAAAAAAAA' -Dec 'BBBBBBBBBBBB' -Ord 'KEEP' -StPath $stN4
  Chk ($rN4.code -eq 1) ('a2-n4-ordkeep-noline-exit1 code=' + $rN4.code)
  Chk ($rN4.out.Contains('no valid orders_sha12 line')) 'a2-n4-ordkeep-noline-marker'
  Chk ((Get-Hash12 $stN4) -eq $h4) 'a2-n4-target-untouched'
  $stN5 = Join-Path $tmpRoot 'n5-state.txt'
  Mk-State $stN5 $garbage
  $h5 = Get-Hash12 $stN5
  $rN5 = Run-Writer -Tech 'KEEP' -Led 'AAAAAAAAAAAA' -Dec 'BBBBBBBBBBBB' -Ord 'CCCCCCCCCCCC' -StPath $stN5
  Chk ($rN5.code -eq 1) ('a2-n5-techkeep-garbage-exit1 code=' + $rN5.code)
  Chk ($rN5.out.Contains('no valid tech_sha12 line')) 'a2-n5-techkeep-garbage-marker'
  Chk ((Get-Hash12 $stN5) -eq $h5) 'a2-n5-target-untouched'
  $stN6 = Join-Path $tmpRoot 'n6-state.txt'
  Mk-State $stN6 $seed4
  $h6 = Get-Hash12 $stN6
  $rN6 = Run-Writer -Tech 'NOTHEXNOTHEX' -Led 'AAAAAAAAAAAA' -Dec 'BBBBBBBBBBBB' -Ord 'CCCCCCCCCCCC' -StPath $stN6
  Chk ($rN6.code -eq 1) ('a2-n6-badtech-exit1 code=' + $rN6.code)
  Chk ($rN6.out.Contains('FAIL: bad -TechSha12')) 'a2-n6-badtech-marker'
  Chk ((Get-Hash12 $stN6) -eq $h6) 'a2-n6-target-untouched'
  $rN7 = Run-Writer -Tech 'ABCDEF012345' -Led 'AAAAAAAAAAAA' -Dec 'BBBBBBBBBBBB' -Ord 'ZZ' -StPath $stN6
  Chk ($rN7.code -eq 1) ('a2-n7-badord-exit1 code=' + $rN7.code)
  Chk ($rN7.out.Contains('FAIL: bad -OrdersSha12')) 'a2-n7-badord-marker'
  Chk ((Get-Hash12 $stN6) -eq $h6) 'a2-n7-target-untouched'

  # ---------- S1 two-path move-failure fixture ----------
  $stS1 = Join-Path $tmpRoot 's1-state.txt'
  Mk-State $stS1 $seed4
  $seedBytesS1 = Read-Bytes $stS1
  $lock = [System.IO.File]::Open($stS1, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::None)
  $rS1 = Run-Writer -Tech 'ABCDEF012345' -Led 'AAAAAAAAAAAA' -Dec 'BBBBBBBBBBBB' -Ord 'CCCCCCCCCCCC' -StPath $stS1
  Chk ($rS1.code -eq 1) ('s1-locked-exit1 code=' + $rS1.code)
  Chk ($rS1.out.Contains('move into place failed')) 's1-locked-movefailed-marker'
  Chk (-not (Test-Path -LiteralPath ($stS1 + '.new'))) 's1-locked-no-new-residue'
  $lock.Close()
  $lock = $null
  $bAfterLock = Read-Bytes $stS1
  Chk (Bytes-Equal $seedBytesS1 $bAfterLock) 's1-locked-target-untouched'
  $rS1b = Run-Writer -Tech 'ABCDEF012345' -Led 'AAAAAAAAAAAA' -Dec 'BBBBBBBBBBBB' -Ord 'CCCCCCCCCCCC' -StPath $stS1
  Chk ($rS1b.code -eq 0) ('s1-unlocked-rerun-exit0 code=' + $rS1b.code)
  $LS1 = Read-Lines $stS1
  Chk ($LS1[0] -eq 'tech_sha12=ABCDEF012345') 's1-rerun-tech-updated'
  Chk ($LS1[3] -eq 'orders_sha12=CCCCCCCCCCCC') 's1-rerun-orders-updated'

  # ---------- S0 isolation ----------
  Chk ((Get-Hash12 $prodState) -eq $prodHashBefore) 's0-prod-state-untouched'

  Write-Output ('r271-keep-negcon: PASS=' + $pass + ' FAIL=' + $fail)
  if ($fail -gt 0) { exit 1 } else { exit 0 }
} finally {
  if ($null -ne $lock) { $lock.Close() }
  if (Test-Path -LiteralPath $tmpRoot) { Remove-Item -LiteralPath $tmpRoot -Recurse -Force -ErrorAction SilentlyContinue }
}
