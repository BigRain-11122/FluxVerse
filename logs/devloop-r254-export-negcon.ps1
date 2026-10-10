# devloop-r254-export-negcon.ps1 - negative-control sandbox for export-public-snapshot.ps1
# (tech queue #11, sister of the r253 positive deterministic check).
# Pre-registered criteria:
#  A0 static: exporter ASCII-only; all five AC-5 gate markers + candidate-delete
#     law + isolation params present in the body.
#  A1 baseline positive control: clean fixture -> exit 0 + five-gate OK line +
#     whitelist projection holds (events tail keeps exactly ts_utc/type/zone;
#     disallowed event type filtered out; status_face included with 6 keys).
#  A2 negative controls - each poison injection MUST produce: exit 2 +
#     'pubgate: FAIL' line + the right gate tag + last-good snapshot preserved
#     byte-identically + zero stranded .new candidates:
#     n1 G1 secret scan : AKIA-class cloud key in zone name
#     n2 G1 secret scan : github token in zone activity
#     n3 G2 whitelist   : nested object smuggled through whitelisted leaf (name)
#     n4 G3 forbidden   : ASCII word (password) in zone status
#     n5 G3 forbidden   : CJK word (mi-yao) in zone activity, code-point built
#     n6 G5 metadata    : local machine path (C:\Users) in zone name
#     n7 G5 metadata    : username (sjs20) in zone name
#  S1 status-face fail-soft: poisoned status file -> export STILL exit 0 with
#     status_face=skip-G1 and no status_face section in the artifact
#     (blast-radius law: a bad status line never blocks the public snapshot).
#  G4 (1MB cap): covered by the STANDING r69 harness (T15: 20000-zone fixture
#     >1MB -> G4 FAIL) - no duplicate construction here (reuse-not-rebuild law).
#  r254 FINDING (first A1 run, before the fix): the exporter rejected a
#     legitimate EMPTY flows section with a spurious 'G2 whitelist: null
#     element in flows' - Get-Val's 'return $p.Value' pipeline-unwraps empty
#     arrays to $null and Assert-List then read @($null) as a [null] element.
#     Production (flows=3) never hit it, but any quiet-day zero-whitelisted-
#     events tail would have FAIL-blocked the export forever (fail-keep loop).
#     Fixed in the exporter this round (direct property access for the three
#     list sections); A1 (empty flows) + A1b (empty events tail) regression-
#     gate that fix, while the [null]-element defense is preserved.
# Isolation law: -WorldDir/-OutDir/-StatusFile all point at $env:TEMP fixtures
#  and -NoGit is always passed - production world/, world-public/ and state/
#  are never touched (zero-disturbance, r253 pattern).
# Child processes via .NET Process double-redirect (29th trap law, r244/r245).
# ASCII-only script (encoding law). CJK words are built from code points.
$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot
$exporter = Join-Path $repo 'Tools\tick\export-public-snapshot.ps1'
$utf8 = New-Object System.Text.UTF8Encoding($false)
$pass = 0
$fail = 0
function Chk([bool]$cond, [string]$name) {
  if ($cond) { $script:pass++; Write-Output ('PASS ' + $name) }
  else { $script:fail++; Write-Output ('FAIL ' + $name) }
}
function Run-Export {
  param([string]$WorldDir, [string]$OutDir, [string]$StatusFile)
  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = 'powershell.exe'
  $psi.Arguments = '-NoProfile -ExecutionPolicy Bypass -File "' + $exporter + '"' +
    ' -WorldDir "' + $WorldDir + '" -OutDir "' + $OutDir + '" -StatusFile "' + $StatusFile + '" -NoGit'
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

$BASE_STATE = @'
{"protocol":"fixture/0","ts_utc":"2026-10-11T00:00:00Z","zones":[{"id":"z1","name":"Alpha District","status":"active","activity":"building"}],"flows":[],"fleet":[],"game_tasks":{"total":2,"active":1},"media_outputs":{"renders_total":3,"last_render_utc":"2026-10-10T00:00:00Z"},"history":{"commits_total":10},"reality":{"city_day_phase":"day","weather_kind":"clear","weather_temp_c":20,"weekday":"Sunday","beijing_hhmm":"10:00"},"season":"autumn"}
'@
$EV_LINES = @(
  '{"ts_utc":"2026-10-11T00:00:00Z","type":"COMMIT","zone":"game","summary":"internal-note-x"}',
  '{"ts_utc":"2026-10-11T00:01:00Z","type":"TASK_DONE","zone":"game","actor":"someone","repo":"codename-x"}',
  '{"ts_utc":"2026-10-11T00:02:00Z","type":"CEO_QUOTE","zone":"governance","summary":"quote-x"}'
)
$STATUS_OK = '{"updated_utc":"2026-10-11T00:00","current_activity":"negative-control sandbox build","artifact":"docs/negcon-r254.md","artifact_utc":"2026-10-10T23:30","milestone":"R2 module shell milestone chain","milestone_eta_utc":"2026-10-13T00:00"}'
$STATUS_BAD = '{"updated_utc":"2026-10-11T00:00","current_activity":"AKIAABCDEFGHIJKLMNOP","artifact":"docs/negcon-r254.md","artifact_utc":"2026-10-10T23:30","milestone":"R2 module shell milestone chain","milestone_eta_utc":"2026-10-13T00:00"}'
# CJK poison word (mi-yao = secret key) built from code points only
$cMiYao = [string][char]0x5BC6 + [string][char]0x94A5

function New-Fx {
  param([string]$FxDir, [scriptblock]$Mutate)
  New-Item -ItemType Directory -Path $FxDir -Force | Out-Null
  $s = ConvertFrom-Json $BASE_STATE
  if ($Mutate) { & $Mutate $s }
  $json = ConvertTo-Json $s -Depth 6 -Compress
  [System.IO.File]::WriteAllText((Join-Path $FxDir 'world-state.json'), $json, $script:utf8)
  [System.IO.File]::WriteAllLines((Join-Path $FxDir 'world-events.jsonl'), $EV_LINES, $script:utf8)
}
function Assert-Bytes-Equal {
  param([byte[]]$A, [byte[]]$B)
  if ($A.Length -ne $B.Length) { return $false }
  return [System.Linq.Enumerable]::SequenceEqual([byte[]]$A, [byte[]]$B)
}

$tmpRoot = Join-Path $env:TEMP ('r254-negcon-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $tmpRoot | Out-Null
$statusOkPath = Join-Path $tmpRoot 'status-ok.json'
$statusBadPath = Join-Path $tmpRoot 'status-bad.json'
[System.IO.File]::WriteAllText($statusOkPath, $STATUS_OK, $utf8)
[System.IO.File]::WriteAllText($statusBadPath, $STATUS_BAD, $utf8)

try {
  # ---- A0 static audit of the exporter ----
  Chk (Test-Path -LiteralPath $exporter) 'a0-exporter-exists'
  $bytes = [System.IO.File]::ReadAllBytes($exporter)
  $nonAscii = 0
  foreach ($b in $bytes) { if ($b -gt 127) { $nonAscii++ } }
  Chk ($nonAscii -eq 0) ('a0-exporter-ascii non_ascii=' + $nonAscii)
  $body = [System.IO.File]::ReadAllText($exporter, [System.Text.Encoding]::UTF8)
  Chk ($body.Contains('G1 secret-scan hit')) 'a0-g1-marker'
  Chk ($body.Contains('G2 whitelist')) 'a0-g2-marker'
  Chk ($body.Contains('G3 forbidden-word hit')) 'a0-g3-marker'
  Chk ($body.Contains('G4 size')) 'a0-g4-marker'
  Chk ($body.Contains('G5 metadata-path hit')) 'a0-g5-marker'
  Chk ($body.Contains('Remove-Item $newPath')) 'a0-candidate-delete-law'
  Chk ($body.Contains('[string]$OutDir') -and $body.Contains('[string]$StatusFile') -and $body.Contains('[switch]$NoGit')) 'a0-isolation-params'

  # ---- A1 baseline positive control (fresh out dir) ----
  $fxA = Join-Path $tmpRoot 'fx-a1'
  $outA = Join-Path $tmpRoot 'out-a1'
  New-Fx -FxDir $fxA -Mutate $null
  $r1 = Run-Export -WorldDir $fxA -OutDir $outA -StatusFile $statusOkPath
  Chk ($r1.code -eq 0) ('a1-exit0 code=' + $r1.code)
  Chk ($r1.out.Contains('pubgate: G1 secrets 0 / G2 whitelist OK / G3 words 0 / G4 size OK / G5 meta OK')) 'a1-five-gate-ok-line'
  Chk ($r1.out.Contains('status_face=included')) 'a1-status-face-included'
  Chk ($r1.out.Contains('zones=1')) 'a1-export-line-zones1'
  $snapPath = Join-Path $outA 'city-snapshot.json'
  Chk (Test-Path -LiteralPath $snapPath) 'a1-snapshot-on-disk'
  if (Test-Path -LiteralPath $snapPath) {
    $snapBytes = (Get-Item -LiteralPath $snapPath).Length
    Chk ($snapBytes -gt 0) ('a1-snapshot-nonempty bytes=' + $snapBytes)
    $snapText = [System.IO.File]::ReadAllText($snapPath, [System.Text.Encoding]::UTF8)
    $snap = ConvertFrom-Json $snapText
    Chk ([string]$snap.protocol -eq 'fluxverse-public/0.1') 'a1-protocol'
    Chk (@($snap.zones).Count -eq 1) 'a1-zones-count1'
    $zkeys = @($snap.zones[0].PSObject.Properties | ForEach-Object { $_.Name })
    Chk ($zkeys.Count -eq 4 -and $zkeys -contains 'id' -and $zkeys -contains 'name' -and $zkeys -contains 'status' -and $zkeys -contains 'activity') 'a1-zone-four-keys'
    Chk (@($snap.events_tail).Count -eq 2) 'a1-events-tail2-filtered'
    $ekeys = @($snap.events_tail[0].PSObject.Properties | ForEach-Object { $_.Name })
    Chk ($ekeys.Count -eq 3 -and $ekeys -contains 'ts_utc' -and $ekeys -contains 'type' -and $ekeys -contains 'zone') 'a1-event-three-keys-only'
    Chk (-not $snapText.Contains('internal-note-x') -and -not $snapText.Contains('codename-x') -and -not $snapText.Contains('CEO_QUOTE')) 'a1-sensitive-fields-dropped'
    $sf = $snap.status_face
    Chk ($null -ne $sf -and @($sf.PSObject.Properties).Count -eq 6) 'a1-status-face-six-keys'
    $newLeft = @(Get-ChildItem -Path $outA -Filter '*.new' -ErrorAction SilentlyContinue).Count
    Chk ($newLeft -eq 0) ('a1-no-new-residue left=' + $newLeft)
  } else {
    Chk $false 'a1-snapshot-details-unavailable'
  }

  # ---- A1b empty-sections regression gate (the r254 finding): zero
  # whitelisted events in the stream + empty flows must NOT trip G2 ----
  $fxB = Join-Path $tmpRoot 'fx-a1b'
  $outB = Join-Path $tmpRoot 'out-a1b'
  New-Item -ItemType Directory -Path $fxB -Force | Out-Null
  $sB = ConvertFrom-Json $BASE_STATE
  [System.IO.File]::WriteAllText((Join-Path $fxB 'world-state.json'), (ConvertTo-Json $sB -Depth 6 -Compress), $utf8)
  [System.IO.File]::WriteAllLines((Join-Path $fxB 'world-events.jsonl'), @('{"ts_utc":"2026-10-11T00:02:00Z","type":"CEO_QUOTE","zone":"governance"}'), $utf8)
  $r1b = Run-Export -WorldDir $fxB -OutDir $outB -StatusFile $statusOkPath
  Chk ($r1b.code -eq 0) ('a1b-empty-events-exit0 code=' + $r1b.code)
  Chk ($r1b.out.Contains('events_tail=0/0')) 'a1b-tail-zero-note'
  $snapB = ConvertFrom-Json ([System.IO.File]::ReadAllText((Join-Path $outB 'city-snapshot.json'), [System.Text.Encoding]::UTF8))
  Chk (@($snapB.events_tail).Count -eq 0 -and @($snapB.flows).Count -eq 0) 'a1b-empty-tail-and-flows-in-artifact'

  # ---- A2 negative controls (shared out dir with sentinel last-good) ----
  $outN = Join-Path $tmpRoot 'out-neg'
  New-Item -ItemType Directory -Path $outN | Out-Null
  $sentPath = Join-Path $outN 'city-snapshot.json'
  [System.IO.File]::WriteAllText($sentPath, '{"sentinel":"last-good-r254"}', $utf8)
  $sentBefore = [System.IO.File]::ReadAllBytes($sentPath)
  $cases = @(
    @{ tag = 'n1-g1-akia';  gate = 'G1 secret-scan hit';        mut = { param($s) $s.zones[0].name = 'AKIAABCDEFGHIJKLMNOP' } },
    @{ tag = 'n2-g1-ghp';   gate = 'G1 secret-scan hit';        mut = { param($s) $s.zones[0].activity = 'ghp_abcdefghijklmnopqrstuvwxyz' } },
    @{ tag = 'n3-g2-nested'; gate = 'G2 whitelist: nested object'; mut = { param($s) $s.zones[0].name = [PSCustomObject]@{ nested = 'object' } } },
    @{ tag = 'n4-g3-ascii'; gate = 'G3 forbidden-word hit';     mut = { param($s) $s.zones[0].status = 'password reset required' } },
    @{ tag = 'n5-g3-cjk';   gate = 'G3 forbidden-word hit (CJK)'; mut = { param($s) $s.zones[0].activity = $script:cMiYao } },
    @{ tag = 'n6-g5-path';  gate = 'G5 metadata-path hit';      mut = { param($s) $s.zones[0].name = 'C:\Users\leak' } },
    @{ tag = 'n7-g5-user';  gate = 'G5 metadata-path hit';      mut = { param($s) $s.zones[0].name = 'sjs20 node' } }
  )
  foreach ($c in $cases) {
    $fx = Join-Path $tmpRoot ('fx-' + $c.tag)
    New-Fx -FxDir $fx -Mutate $c.mut
    $r = Run-Export -WorldDir $fx -OutDir $outN -StatusFile $statusOkPath
    Chk ($r.code -eq 2) ('a2-' + $c.tag + '-exit2 code=' + $r.code)
    Chk ($r.out.Contains('pubgate: FAIL')) ('a2-' + $c.tag + '-fail-line')
    Chk ($r.out.Contains($c.gate)) ('a2-' + $c.tag + '-gate-tag')
    $sentAfter = [System.IO.File]::ReadAllBytes($sentPath)
    Chk (Assert-Bytes-Equal $sentBefore $sentAfter) ('a2-' + $c.tag + '-lastgood-kept')
    $resid = @(Get-ChildItem -Path $outN -Filter '*.new' -ErrorAction SilentlyContinue).Count
    Chk ($resid -eq 0) ('a2-' + $c.tag + '-no-new-residue resid=' + $resid)
    Remove-Item -LiteralPath $fx -Recurse -Force
  }

  # ---- S1 status-face fail-soft (poisoned status file, clean world) ----
  $fxS = Join-Path $tmpRoot 'fx-s1'
  $outS = Join-Path $tmpRoot 'out-s1'
  New-Fx -FxDir $fxS -Mutate $null
  $rS = Run-Export -WorldDir $fxS -OutDir $outS -StatusFile $statusBadPath
  Chk ($rS.code -eq 0) ('s1-exit0-despite-bad-status code=' + $rS.code)
  Chk ($rS.out.Contains('status_face=skip-G1')) 's1-skip-g1-note'
  $sText = [System.IO.File]::ReadAllText((Join-Path $outS 'city-snapshot.json'), [System.Text.Encoding]::UTF8)
  Chk (-not $sText.Contains('status_face') -and -not $sText.Contains('AKIA')) 's1-no-status-face-in-artifact'
  $sSnap = ConvertFrom-Json $sText
  Chk (@($sSnap.zones).Count -eq 1) 's1-export-continued-blast-radius'

  Write-Output ('r254-export-negcon: PASS=' + $pass + ' FAIL=' + $fail)
  if ($fail -gt 0) { exit 1 } else { exit 0 }
} finally {
  if (Test-Path -LiteralPath $tmpRoot) { Remove-Item -LiteralPath $tmpRoot -Recurse -Force -ErrorAction SilentlyContinue }
}
