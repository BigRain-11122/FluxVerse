# devloop-r80-releasegate-test.ps1 - sandbox for the G5 metadata gate added
# to export-public-snapshot.ps1 (P-2026-09-24-66 release-gate slice, r80).
# Proves: path/username leak injection FAILs (exit 2 + G5 reason + fail-keep),
# clean fixture and real-machine export PASS with the G5 line reported, and
# the real artifact carries none of the metadata patterns.
# ASCII-only script (encoding law). Exit 0 = all assertions green.

$ErrorActionPreference = 'Stop'
$repo = Resolve-Path (Join-Path $PSScriptRoot '..')
$exporter = Join-Path $repo 'Tools\tick\export-public-snapshot.ps1'

$pass = 0; $fail = 0
function Check {
  param([string]$name, [bool]$cond)
  if ($cond) { $script:pass++; Write-Output ('PASS ' + $name) }
  else { $script:fail++; Write-Output ('FAIL ' + $name) }
}
# r66 law: read child exit codes via .NET Process with a held handle
function Invoke-Script {
  param([string]$file, [string]$argline)
  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = 'powershell.exe'
  $psi.Arguments = ('-NoProfile -ExecutionPolicy Bypass -File "' + $file + '" ' + $argline)
  $psi.RedirectStandardOutput = $true
  $psi.RedirectStandardError = $true
  $psi.UseShellExecute = $false
  $p = [System.Diagnostics.Process]::Start($psi)
  $o = $p.StandardOutput.ReadToEnd()
  $e = $p.StandardError.ReadToEnd()
  $p.WaitForExit()
  return @{ exit = $p.ExitCode; out = $o; err = $e }
}

# ---------- synthetic fixtures ----------
$TMP = Join-Path $env:TEMP ('fv-r80-' + [guid]::NewGuid().ToString('N').Substring(0, 8))
$TW = Join-Path $TMP 'world'
$TO = Join-Path $TMP 'out'
New-Item -ItemType Directory -Path $TW | Out-Null
New-Item -ItemType Directory -Path $TO | Out-Null
$utf8 = New-Object System.Text.UTF8Encoding($false)

function MkState {
  param([string]$zoneExtra)
  $zoneList = New-Object System.Collections.ArrayList
  $names = @('gaming','quant','media')
  for ($i = 0; $i -lt 3; $i++) {
    [void]$zoneList.Add([PSCustomObject][ordered]@{ id = $names[$i]; name = ('FLUX ' + $names[$i] + $zoneExtra); status = 'active'; activity = ($i % 5) })
  }
  [PSCustomObject][ordered]@{
    protocol = 'fluxverse/0.1'
    ts_utc = '2026-09-24T12:00:00Z'
    zones = @($zoneList)
    fleet = @([PSCustomObject][ordered]@{ id = 'bm-a'; online = $true; cores = 32; last_seen = 'x'; current_task = 't' })
    flows = @(
      [PSCustomObject][ordered]@{ id = 'data'; zone = 'gaming' },
      [PSCustomObject][ordered]@{ id = 'capital'; zone = 'quant' },
      [PSCustomObject][ordered]@{ id = 'traffic'; zone = 'media' }
    )
    history = [PSCustomObject][ordered]@{ commits_total = 4985 }
    reality = [PSCustomObject][ordered]@{ city_day_phase = 'night'; weather_kind = 'clear'; weather_temp_c = 26.5; weekday = '4'; beijing_hhmm = '20:06' }
    media_outputs = [PSCustomObject][ordered]@{ renders_total = 24; last_render_utc = '2026-09-24T09:16:22Z' }
    game_tasks = [PSCustomObject][ordered]@{ total = 19; active = 13 }
  }
}
$evLines = @(
  '{"ts_utc":"2026-09-24T11:00:00Z","type":"COMMIT","zone":"gaming"}',
  '{"ts_utc":"2026-09-24T11:01:00Z","type":"TASK_CLAIM","zone":"quant"}',
  '{"ts_utc":"2026-09-24T11:59:00Z","type":"CEO_ORDER","zone":"quant","summary":"CEO quote fixture"}'
)

# ---------- A1: clean baseline passes with G5 reported ----------
$state1 = MkState ''
[System.IO.File]::WriteAllText((Join-Path $TW 'world-state.json'), (ConvertTo-Json $state1 -Depth 6), $utf8)
[System.IO.File]::WriteAllLines((Join-Path $TW 'world-events.jsonl'), [string[]]$evLines, $utf8)
$r1 = Invoke-Script $exporter ('-WorldDir "' + $TW + '" -OutDir "' + $TO + '" -NoGit')
$f1 = Join-Path $TO 'city-snapshot.json'
Check 'A1 clean fixture exit 0' ($r1.exit -eq 0)
Check 'A1b artifact exists' (Test-Path $f1)
Check 'A1c pubgate reports G5 meta OK' ($r1.out.Contains('G5 meta OK'))
$goodHash = (Get-FileHash $f1 -Algorithm SHA256).Hash

# ---------- A2: windows path leak FAILs + fail-keep ----------
$statePath = MkState ' C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse\world '
[System.IO.File]::WriteAllText((Join-Path $TW 'world-state.json'), (ConvertTo-Json $statePath -Depth 6), $utf8)
$r2 = Invoke-Script $exporter ('-WorldDir "' + $TW + '" -OutDir "' + $TO + '" -NoGit')
Check 'A2 path-leak FAIL exit 2' ($r2.exit -eq 2)
Check 'A2b G5 reason reported' ($r2.out.Contains('G5 metadata-path hit'))
Check 'A2c last-good kept (fail-keep)' ((Get-FileHash $f1 -Algorithm SHA256).Hash -eq $goodHash)
$stray = @(Get-ChildItem -Path $TO -Filter '*.new' -ErrorAction SilentlyContinue)
Check 'A2d candidate .new cleaned up' ($stray.Count -eq 0)

# ---------- A3: bare username leak FAILs ----------
$stateUser = MkState ' ops-sjs20-node '
[System.IO.File]::WriteAllText((Join-Path $TW 'world-state.json'), (ConvertTo-Json $stateUser -Depth 6), $utf8)
$r3 = Invoke-Script $exporter ('-WorldDir "' + $TW + '" -OutDir "' + $TO + '" -NoGit')
Check 'A3 username leak FAIL exit 2' ($r3.exit -eq 2 -and $r3.out.Contains('G5 metadata-path hit: sjs20'))

# ---------- A4: linux path leak FAILs (serialized-face pattern) ----------
$stateHome = MkState ' /home/deploy/citysync '
[System.IO.File]::WriteAllText((Join-Path $TW 'world-state.json'), (ConvertTo-Json $stateHome -Depth 6), $utf8)
$r4 = Invoke-Script $exporter ('-WorldDir "' + $TW + '" -OutDir "' + $TO + '" -NoGit')
Check 'A4 linux path leak FAIL exit 2' ($r4.exit -eq 2 -and $r4.out.Contains('G5 metadata-path hit: /home/'))

# ---------- A5: real-machine export passes + artifact pattern-free ----------
$rp = Invoke-Script $exporter ''
$rf = Join-Path $repo 'world-public\city-snapshot.json'
Check 'A5 real export exit 0' ($rp.exit -eq 0)
Check 'A5b real pubgate G5 meta OK' ($rp.out.Contains('G5 meta OK'))
if (Test-Path $rf) {
  $rtext = [System.IO.File]::ReadAllText($rf, [System.Text.Encoding]::UTF8)
  $hit = $false
  foreach ($w in @('C:\Users','C:\\Users','Desktop\FluxGroup','Desktop\\FluxGroup','/home/','sjs20')) {
    if ($rtext -match [regex]::Escape($w)) { $hit = $true }
  }
  Check 'A5c real artifact pattern-free' (-not $hit)
  $stageLine = & git -C $repo status --porcelain -- 'world-public/city-snapshot.json' 2>$null
  Check 'A5d snapshot staged for next commit' ($LASTEXITCODE -eq 0 -and $stageLine -match '^[AM]\s')
} else {
  Check 'A5c real artifact pattern-free' $false
  Check 'A5d snapshot staged for next commit' $false
}

# ---------- A6: ASCII-law audit ----------
function MaxByte {
  param([string]$path)
  $m = 0
  foreach ($b in [System.IO.File]::ReadAllBytes($path)) { if ($b -gt $m) { $m = $b } }
  $m
}
Check 'A6 exporter ASCII-only' ((MaxByte $exporter) -le 127)
Check 'A6b sandbox ASCII-only' ((MaxByte $PSCommandPath) -le 127)

# ---------- cleanup + verdict ----------
Remove-Item $TMP -Recurse -Force -ErrorAction SilentlyContinue
Write-Output ('SUMMARY: ' + $pass + ' passed, ' + $fail + ' failed')
if ($fail -gt 0) { exit 1 } else { exit 0 }
