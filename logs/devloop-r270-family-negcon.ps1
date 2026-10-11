# devloop-r270-family-negcon.ps1 - negative-control sandbox for Tools/devloop/family-run.ps1
# (tech queue #11, r269 handover: verdict-parse surface + input fail-loud paths).
# Pre-registered criteria:
#  A0 static: runner exists; ASCII-only body; fmtC regex + LAST-match accessor present
#     (the r269 law: final verdict line wins, a FAIL echo quoting an inner
#     "pass=9 fail=0" check name can never shadow the real verdict); fail-loud
#     input markers (SEAT-LINE-BAD / SEAT-NAME-DUP / SEAT-ONLY-UNKNOWN) + file
#     markers (SEATS-FILE-MISSING / SEATS-EMPTY / SEAT-MISSING) present;
#     -SeatsFile / -Only params present; both verdict markers present.
#     Found-and-noted: 'SEAT-ONLY-NONE' in the runner is defense-in-depth dead
#     code (unknown-name check catches every not-in-file name first, so the
#     picked count can never be 0 when a known name is required) - kept as a
#     note, not a failure.
#  A1 positive control: two-seat fixture file (fmtA seat PASS=30 FAIL=0 +
#     fmtC clean seat "harness: pass=50 fail=0") -> exit 0, seats=2/2 header,
#     both SEAT lines OK=True with fmt=A / fmt=C, FAM-TOTAL 80/80,
#     FAMILY-ALL-GREEN.
#  A1b -Only happy path: same file -Only ngA -> seats=1/2, FAM-TOTAL 30/30,
#     ngC absent (arg splicing face, r64 family law regression).
#  A2 input fail-loud negative controls - each poison MUST produce exit 1 +
#     the right marker line:
#     n1 SEAT-LINE-BAD : 3-field line (missing expected-fail column)
#     n2 SEAT-LINE-BAD : non-numeric expected-pass column
#     n3 SEAT-NAME-DUP : duplicate seat name
#     n4 SEAT-ONLY-UNKNOWN : -Only ghost-ng on a valid file
#     n5 SEATS-FILE-MISSING : nonexistent seats file path
#     n6 SEATS-EMPTY : comment+blank-only seats file
#     n7 SEAT-MISSING : seat row points at a sandbox file that does not exist
#        -> SEAT-MISSING ngM + VERDICT: RED + exit 1 (fail-loud, no silent path)
#  S1 fmtC shadow immunity (the r269 finding regression gate): seat output =
#     two FAIL echo lines quoting "pass=9 fail=0" / "pass=3 fail=1" BEFORE the
#     final verdict "pass=50 fail=0" -> runner must parse 50/0 fmt=C OK=True,
#     FAMILY-ALL-GREEN, and the echoed values (pass=9/, fail=1/) must never
#     surface in the runner's own verdict line.
#  S2 mismatch-must-RED (comparison liveness): same clean output pinned at
#     expected 49 -> SEAT line shows pass=50/49 OK=False, VERDICT: RED,
#     exit 1 - proves the parse feeds a live comparison (fake-green trap:
#     a parser that echoes expected values can never pass this).
# Isolation law: seats files + status live in a GUID-unique $env:TEMP root.
#  Fixture seat sandbox files MUST live in repo logs\ (the runner hard-joins
#  $repo\logs\<file> - not parameterizable), so they use a unique famneg-
#  prefix, are created inside try, and are removed in finally; the runner's
#  own fixture-run outputs fam-ng*-{A,B}.{out,err} use fixture seat names
#  ngA/ngC/ngS/ngX/ngM (unique vs production rXXX seats) and are removed in
#  finally. Production family-seats.txt, fam-rXXX-* files and all production
#  seats are never touched (zero-disturbance, r254 pattern).
# Child processes via .NET Process double-redirect (29th trap law, r244).
# ASCII-only script (encoding law). Output = static check names only
# (A/B byte-stability law: no ms/GUID/sha values in printed names).
$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot
$runner = Join-Path $repo 'Tools\devloop\family-run.ps1'
$utf8 = New-Object System.Text.UTF8Encoding($false)
$pass = 0
$fail = 0
function Chk([bool]$cond, [string]$name) {
  if ($cond) { $script:pass++; Write-Output ('PASS ' + $name) }
  else { $script:fail++; Write-Output ('FAIL ' + $name) }
}
function Run-Family {
  param([string]$SeatsFilePath, [string[]]$OnlyNames = @())
  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = 'powershell.exe'
  $psi.Arguments = '-NoProfile -ExecutionPolicy Bypass -File "' + $runner + '" -SeatsFile "' + $SeatsFilePath + '"'
  foreach ($o in $OnlyNames) { $psi.Arguments = $psi.Arguments + ' -Only "' + $o + '"' }
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
function Mk-SeatsFile {
  param([string]$Path, [string[]]$Lines)
  [System.IO.File]::WriteAllLines($Path, $Lines, $utf8)
}

$tmpRoot = Join-Path $env:TEMP ('r270-negcon-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $tmpRoot | Out-Null

try {
  # ---------- fixture seat sandboxes (repo logs\, unique famneg- prefix) ----------
  $fxA = @("Write-Output 'PASS=30 FAIL=0'", 'exit 0')
  $fxC = @("Write-Output 'famneg fmtC clean seat body'", "Write-Output 'seat harness: pass=50 fail=0'", 'exit 0')
  $fxS = @(
    "Write-Output 'FAIL: A4 inner-fixture echo quotes pass=9 fail=0 as inner-check-name'",
    "Write-Output 'FAIL: B2 second echo quotes pass=3 fail=1 residue-note'",
    "Write-Output 'seat harness: pass=50 fail=0'",
    'exit 0'
  )
  $fxX = @("Write-Output 'seat harness: pass=50 fail=0'", 'exit 0')
  [System.IO.File]::WriteAllLines((Join-Path $repo 'logs\famneg-a1a.ps1'), $fxA, $utf8)
  [System.IO.File]::WriteAllLines((Join-Path $repo 'logs\famneg-a1c.ps1'), $fxC, $utf8)
  [System.IO.File]::WriteAllLines((Join-Path $repo 'logs\famneg-s1shadow.ps1'), $fxS, $utf8)
  [System.IO.File]::WriteAllLines((Join-Path $repo 'logs\famneg-s2mism.ps1'), $fxX, $utf8)

  # ---------- seats files (TEMP) ----------
  $sfA1  = Join-Path $tmpRoot 'seats-a1.txt'
  $sfN1  = Join-Path $tmpRoot 'seats-n1.txt'
  $sfN2  = Join-Path $tmpRoot 'seats-n2.txt'
  $sfN3  = Join-Path $tmpRoot 'seats-n3.txt'
  $sfN4  = Join-Path $tmpRoot 'seats-n4.txt'
  $sfN6  = Join-Path $tmpRoot 'seats-n6.txt'
  $sfN7  = Join-Path $tmpRoot 'seats-n7.txt'
  $sfS1  = Join-Path $tmpRoot 'seats-s1.txt'
  $sfS2  = Join-Path $tmpRoot 'seats-s2.txt'
  Mk-SeatsFile $sfA1 @('ngA|famneg-a1a.ps1|30|0', 'ngC|famneg-a1c.ps1|50|0')
  Mk-SeatsFile $sfN1 @('ngA|famneg-a1a.ps1|30')
  Mk-SeatsFile $sfN2 @('ngA|famneg-a1a.ps1|xx|0')
  Mk-SeatsFile $sfN3 @('ngA|famneg-a1a.ps1|30|0', 'ngA|famneg-a1c.ps1|50|0')
  Mk-SeatsFile $sfN4 @('ngA|famneg-a1a.ps1|30|0')
  Mk-SeatsFile $sfN6 @('# comment only', '')
  Mk-SeatsFile $sfN7 @('ngM|famneg-missing-absent.ps1|7|0')
  Mk-SeatsFile $sfS1 @('ngS|famneg-s1shadow.ps1|50|0')
  Mk-SeatsFile $sfS2 @('ngX|famneg-s2mism.ps1|49|0')

  # ---- A0 static audit of the runner ----
  Chk (Test-Path -LiteralPath $runner) 'a0-runner-exists'
  $bytes = [System.IO.File]::ReadAllBytes($runner)
  $nonAscii = 0
  foreach ($b in $bytes) { if ($b -gt 127) { $nonAscii++ } }
  Chk ($nonAscii -eq 0) ('a0-runner-ascii non_ascii=' + $nonAscii)
  $body = [System.IO.File]::ReadAllText($runner, [System.Text.Encoding]::UTF8)
  Chk ($body.Contains('pass=(\d+)\s+fail=(\d+)')) 'a0-fmtc-regex'
  Chk ($body.Contains('$mCs[$mCs.Count - 1]')) 'a0-fmtc-lastmatch-accessor'
  Chk ($body.Contains('SEAT-LINE-BAD') -and $body.Contains('SEAT-NAME-DUP') -and $body.Contains('SEAT-ONLY-UNKNOWN')) 'a0-failloud-input-markers'
  Chk ($body.Contains('SEATS-FILE-MISSING') -and $body.Contains('SEATS-EMPTY') -and $body.Contains('SEAT-MISSING')) 'a0-failloud-file-markers'
  Chk ($body.Contains('[string]$SeatsFile') -and $body.Contains('[string[]]$Only')) 'a0-params-present'
  Chk ($body.Contains('FAMILY-ALL-GREEN') -and $body.Contains('VERDICT: RED')) 'a0-verdict-markers'

  # ---- A1 positive control: two-seat file, both formats, all green ----
  $r1 = Run-Family -SeatsFilePath $sfA1
  Chk ($r1.code -eq 0) ('a1-exit0 code=' + $r1.code)
  Chk ($r1.out.Contains('FAMILY-RUN seats=2/2')) 'a1-header-two-seats'
  Chk ([regex]::IsMatch($r1.out, 'SEAT ngA fmt=A exit=0/0 pass=30/30 fail=0/0 shaSame=True .+ OK=True')) 'a1-seat-ngA-fmtA-green'
  Chk ([regex]::IsMatch($r1.out, 'SEAT ngC fmt=C exit=0/0 pass=50/50 fail=0/0 shaSame=True .+ OK=True')) 'a1-seat-ngC-fmtC-green'
  Chk ($r1.out.Contains('FAM-TOTAL pass=80/80')) 'a1-famtotal-80'
  Chk ($r1.out.Contains('VERDICT: FAMILY-ALL-GREEN')) 'a1-all-green'

  # ---- A1b -Only happy path (arg splicing face) ----
  $r1b = Run-Family -SeatsFilePath $sfA1 -OnlyNames @('ngA')
  Chk ($r1b.code -eq 0) ('a1b-exit0 code=' + $r1b.code)
  Chk ($r1b.out.Contains('FAMILY-RUN seats=1/2')) 'a1b-header-subset'
  Chk ([regex]::IsMatch($r1b.out, 'SEAT ngA fmt=A exit=0/0 pass=30/30 fail=0/0 shaSame=True .+ OK=True')) 'a1b-seat-ngA-green'
  Chk (-not $r1b.out.Contains('SEAT ngC')) 'a1b-seat-ngC-absent'
  Chk ($r1b.out.Contains('FAM-TOTAL pass=30/30')) 'a1b-famtotal-30'

  # ---- A2 input fail-loud negative controls ----
  $rN1 = Run-Family -SeatsFilePath $sfN1
  Chk ($rN1.code -eq 1) ('a2-n1-linebad3f-exit1 code=' + $rN1.code)
  Chk ($rN1.out.Contains('SEAT-LINE-BAD')) 'a2-n1-linebad3f-marker'
  $rN2 = Run-Family -SeatsFilePath $sfN2
  Chk ($rN2.code -eq 1) ('a2-n2-linebad-nonnum-exit1 code=' + $rN2.code)
  Chk ($rN2.out.Contains('SEAT-LINE-BAD')) 'a2-n2-linebad-nonnum-marker'
  $rN3 = Run-Family -SeatsFilePath $sfN3
  Chk ($rN3.code -eq 1) ('a2-n3-namedup-exit1 code=' + $rN3.code)
  Chk ($rN3.out.Contains('SEAT-NAME-DUP ngA')) 'a2-n3-namedup-marker'
  $rN4 = Run-Family -SeatsFilePath $sfN4 -OnlyNames @('ghost-ng')
  Chk ($rN4.code -eq 1) ('a2-n4-onlyunknown-exit1 code=' + $rN4.code)
  Chk ($rN4.out.Contains('SEAT-ONLY-UNKNOWN ghost-ng')) 'a2-n4-onlyunknown-marker'
  $rN5 = Run-Family -SeatsFilePath (Join-Path $tmpRoot 'no-such-seats.txt')
  Chk ($rN5.code -eq 1) ('a2-n5-filemissing-exit1 code=' + $rN5.code)
  Chk ($rN5.out.Contains('SEATS-FILE-MISSING')) 'a2-n5-filemissing-marker'
  $rN6 = Run-Family -SeatsFilePath $sfN6
  Chk ($rN6.code -eq 1) ('a2-n6-seatsempty-exit1 code=' + $rN6.code)
  Chk ($rN6.out.Contains('SEATS-EMPTY')) 'a2-n6-seatsempty-marker'
  $rN7 = Run-Family -SeatsFilePath $sfN7
  Chk ($rN7.code -eq 1) ('a2-n7-seatmissing-exit1 code=' + $rN7.code)
  Chk ($rN7.out.Contains('SEAT-MISSING ngM')) 'a2-n7-seatmissing-marker'
  Chk ($rN7.out.Contains('VERDICT: RED')) 'a2-n7-verdict-red'

  # ---- S1 fmtC shadow immunity (r269 finding regression gate) ----
  $rS1 = Run-Family -SeatsFilePath $sfS1
  Chk ($rS1.code -eq 0) ('s1-shadow-exit0 code=' + $rS1.code)
  Chk ([regex]::IsMatch($rS1.out, 'SEAT ngS fmt=C exit=0/0 pass=50/50 fail=0/0 shaSame=True .+ OK=True')) 's1-seat-shadow-immune-50-0'
  Chk ($rS1.out.Contains('FAM-TOTAL pass=50/50')) 's1-famtotal-50'
  Chk ($rS1.out.Contains('VERDICT: FAMILY-ALL-GREEN')) 's1-all-green'
  Chk (-not $rS1.out.Contains('pass=9/') -and -not $rS1.out.Contains('fail=1/')) 's1-echo-values-never-surface'

  # ---- S2 mismatch-must-RED (comparison liveness, fake-green trap) ----
  $rS2 = Run-Family -SeatsFilePath $sfS2
  Chk ($rS2.code -eq 1) ('s2-mismatch-exit1 code=' + $rS2.code)
  Chk ($rS2.out.Contains('VERDICT: RED')) 's2-verdict-red'
  Chk ($rS2.out.Contains('pass=50/49') -and $rS2.out.Contains('OK=False')) 's2-mismatch-visible-50-49'

  Write-Output ('r270-family-negcon: PASS=' + $pass + ' FAIL=' + $fail)
  if ($fail -gt 0) { exit 1 } else { exit 0 }
} finally {
  Get-ChildItem -Path (Join-Path $repo 'logs') -Filter 'famneg-*.ps1' -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue
  Get-ChildItem -Path (Join-Path $repo 'logs') -Filter 'fam-ng*-*' -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue
  if (Test-Path -LiteralPath $tmpRoot) { Remove-Item -LiteralPath $tmpRoot -Recurse -Force -ErrorAction SilentlyContinue }
}
