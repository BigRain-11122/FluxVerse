# Tools/devloop/family-run.ps1 - harness family sweep runner, -SeatsFile parameterized.
# Law lineage (tech#12 / r269): r265/r266 runner-per-round copies retired -- the seat
# set now lives in family-seats.txt; onboarding a new consolidated seat = ONE list
# line, zero runner edits. Subset run: -Only <seat>[,<seat>...].
# Family law (r266, carried unchanged): per-seat A/B double-run, byte-stable stdout
# (shaSame gate); stderr A/B byte-identical accepted as deterministic fixture noise
# (r198 err 69B precedent); verdict parse superset (fmtA PASS=/FAIL=, fmtB SUMMARY
# passed/failed, fmtC lowercase "pass=N fail=M" last-match, count fallback -- fmtC
# added r269 after the r212 seat's in-family first run exposed the gap: its custom
# verdict line parsed as 0/50 until the runner learned it). exf>0 = exempt-red
# standing seat judged per named-red law (tech#10), excluded from FAM-TOTAL.
# Subprocess law: .NET Process double-redirect (trap 29 / r244); ExitCode read from the
# .NET handle (r66 law). ASCII-only body (PS5.1 GBK console law).
# Exit: 0 = FAMILY-ALL-GREEN; 1 = red or bad seats input (fail-loud, no silent path).
param(
  [string]$SeatsFile = '',
  [string[]]$Only = @()
)
$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)   # Tools\devloop -> repo
if ($SeatsFile -eq '') { $SeatsFile = Join-Path $PSScriptRoot 'family-seats.txt' }
$utf8 = New-Object System.Text.UTF8Encoding($false)

# ---------- seats file: one seat per line = name|sandbox-file|expected-pass|expected-fail ----------
if (-not (Test-Path $SeatsFile)) { Write-Output ('SEATS-FILE-MISSING ' + $SeatsFile); exit 1 }
$rawLines = [System.IO.File]::ReadAllLines($SeatsFile)
$seats = @()
$names = @{}
foreach ($ln in $rawLines) {
  $t = $ln.Trim()
  if ($t.Length -eq 0) { continue }
  if ($t.StartsWith('#')) { continue }
  $p = $t -split '\|'
  if ($p.Count -ne 4) { Write-Output ('SEAT-LINE-BAD ' + $t); exit 1 }
  if ($p[0].Length -eq 0 -or $p[1].Length -eq 0) { Write-Output ('SEAT-LINE-BAD ' + $t); exit 1 }
  if ($p[2] -notmatch '^\d+$' -or $p[3] -notmatch '^\d+$') { Write-Output ('SEAT-LINE-BAD ' + $t); exit 1 }
  if ($names.ContainsKey($p[0])) { Write-Output ('SEAT-NAME-DUP ' + $p[0]); exit 1 }
  $names[$p[0]] = $true
  $seats += @{ n = $p[0]; f = $p[1]; exp = [int]$p[2]; exf = [int]$p[3] }
}
if ($seats.Count -eq 0) { Write-Output 'SEATS-EMPTY'; exit 1 }
$totalListed = $seats.Count
if ($Only.Count -gt 0) {
  foreach ($want in $Only) { if (-not $names.ContainsKey($want)) { Write-Output ('SEAT-ONLY-UNKNOWN ' + $want); exit 1 } }
  $picked = @($seats | Where-Object { $Only -contains $_.n })
  if ($picked.Count -eq 0) { Write-Output 'SEAT-ONLY-NONE'; exit 1 }
  $seats = $picked
}
$seatsSha = (Get-FileHash -Algorithm SHA256 $SeatsFile).Hash.Substring(0, 12)
('FAMILY-RUN seats=' + $seats.Count + '/' + $totalListed + ' seatsFile=' + [System.IO.Path]::GetFileName($SeatsFile) + ' seatsSha12=' + $seatsSha)

function Run-Sandbox([string]$sbPath, [string]$outPath, [string]$errPath) {
  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = 'powershell.exe'
  $psi.Arguments = '-NoProfile -ExecutionPolicy Bypass -File "' + $sbPath + '"'
  $psi.UseShellExecute = $false
  $psi.RedirectStandardOutput = $true
  $psi.RedirectStandardError = $true
  $psi.CreateNoWindow = $true
  $proc = [System.Diagnostics.Process]::Start($psi)
  $out = $proc.StandardOutput.ReadToEnd()
  $err = $proc.StandardError.ReadToEnd()
  $proc.WaitForExit()
  [System.IO.File]::WriteAllText($outPath, $out, $script:utf8)
  [System.IO.File]::WriteAllText($errPath, $err, $script:utf8)
  $proc.ExitCode
}

$totPassFam = 0
$totExpFam = 0
$allOk = $true
$swAll = [System.Diagnostics.Stopwatch]::StartNew()

foreach ($s in $seats) {
  $sbPath = Join-Path $repo ('logs\' + $s.f)
  if (-not (Test-Path $sbPath)) { ('SEAT-MISSING ' + $s.n); $allOk = $false; continue }
  $aOut = Join-Path $repo ('logs\fam-' + $s.n + '-A.out')
  $aErr = Join-Path $repo ('logs\fam-' + $s.n + '-A.err')
  $bOut = Join-Path $repo ('logs\fam-' + $s.n + '-B.out')
  $bErr = Join-Path $repo ('logs\fam-' + $s.n + '-B.err')
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  $codeA = Run-Sandbox $sbPath $aOut $aErr
  $codeB = Run-Sandbox $sbPath $bOut $bErr
  $sw.Stop()
  $shaA = (Get-FileHash -Algorithm SHA256 $aOut).Hash
  $shaB = (Get-FileHash -Algorithm SHA256 $bOut).Hash
  $same = ($shaA -eq $shaB)
  $txtA = [System.IO.File]::ReadAllText($aOut)
  $passN = -1
  $failN = -1
  $fmt = 'none'
  $mS = [regex]::Match($txtA, 'SUMMARY:\s*(\d+) passed,\s*(\d+) failed')
  if ($mS.Success) { $passN = [int]$mS.Groups[1].Value; $failN = [int]$mS.Groups[2].Value; $fmt = 'B' }
  else {
    $mA = [regex]::Match($txtA, 'PASS=(\d+)')
    $mF = [regex]::Match($txtA, 'FAIL=(\d+)')
    if ($mA.Success -and $mF.Success) { $passN = [int]$mA.Groups[1].Value; $failN = [int]$mF.Groups[1].Value; $fmt = 'A' }
    else {
      # fmtC (r269): lowercase custom verdict line, e.g. "r212 ... harness: pass=50 fail=0".
      # LAST match wins -- the verdict line is the harness's final line, so a FAIL echo
      # quoting an inner "pass=9 fail=0" check name can never shadow the real verdict.
      $mCs = [regex]::Matches($txtA, 'pass=(\d+)\s+fail=(\d+)')
      if ($mCs.Count -gt 0) {
        $mC = $mCs[$mCs.Count - 1]
        $passN = [int]$mC.Groups[1].Value; $failN = [int]$mC.Groups[2].Value; $fmt = 'C'
      }
      else {
        $passN = ([regex]::Matches($txtA, '(?m)^PASS ')).Count
        $failN = ([regex]::Matches($txtA, '(?m)^FAIL')).Count
        $fmt = 'count'
      }
    }
  }
  $errBytesA = ([System.IO.File]::ReadAllBytes($aErr)).Length
  $errBytesB = ([System.IO.File]::ReadAllBytes($bErr)).Length
  $errShaA = (Get-FileHash -Algorithm SHA256 $aErr).Hash
  $errShaB = (Get-FileHash -Algorithm SHA256 $bErr).Hash
  $okExit = if ($s.exf -eq 0) { ($codeA -eq 0 -and $codeB -eq 0) } else { $true }
  $okPass = ($passN -eq $s.exp)
  $okFail = ($failN -eq $s.exf)
  $ok = $okExit -and $same -and $okPass -and $okFail -and ($errShaA -eq $errShaB)
  if (-not $ok) { $allOk = $false }
  if ($s.exf -eq 0) { $totPassFam += $passN; $totExpFam += $s.exp }
  ('SEAT ' + $s.n + ' fmt=' + $fmt + ' exit=' + $codeA + '/' + $codeB + ' pass=' + $passN + '/' + $s.exp + ' fail=' + $failN + '/' + $s.exf + ' shaSame=' + $same + ' shaA12=' + $shaA.Substring(0, 12) + ' err=' + $errBytesA + '/' + $errBytesB + ' errSame=' + ($errShaA -eq $errShaB) + ' ms=' + $sw.ElapsedMilliseconds + ' OK=' + $ok)
}

('FAM-TOTAL pass=' + $totPassFam + '/' + $totExpFam)
('ELAPSED-MS=' + $swAll.ElapsedMilliseconds)
if ($allOk -and $totPassFam -eq $totExpFam) { 'VERDICT: FAMILY-ALL-GREEN' } else { 'VERDICT: RED' }
'--- family run done ---'
if ($allOk -and $totPassFam -eq $totExpFam) { exit 0 } else { exit 1 }
