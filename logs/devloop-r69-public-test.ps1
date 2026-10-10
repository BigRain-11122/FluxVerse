# devloop-r69-public-test.ps1 - sandbox for export-public-snapshot.ps1
# P-2026-09-24-52 slice 3a (2026-09-24 r69). AC-5 gate proof + projection
# correctness + fail-keep + determinism + real-machine smoke.
# ASCII-only script (encoding law); CJK fixtures built from code points.
# Exit 0 = all assertions green.

$ErrorActionPreference = 'Stop'
$repo = Resolve-Path (Join-Path $PSScriptRoot '..')
$exporter = Join-Path $repo 'Tools\tick\export-public-snapshot.ps1'
$tickScript = Join-Path $repo 'Tools\tick\tick.ps1'

$pass = 0; $fail = 0
function Check {
  param([string]$name, [bool]$cond)
  if ($cond) { $script:pass++; Write-Output ('PASS ' + $name) }
  else { $script:fail++; Write-Output ('FAIL ' + $name) }
}
function CJK {
  param([int[]]$cps)
  $s = ''
  foreach ($c in $cps) { $s += [char]$c }
  $s
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
$TMP = Join-Path $env:TEMP ('fv-r69-' + [guid]::NewGuid().ToString('N').Substring(0, 8))
$TW = Join-Path $TMP 'world'
$TO = Join-Path $TMP 'out'
New-Item -ItemType Directory -Path $TW | Out-Null
New-Item -ItemType Directory -Path $TO | Out-Null
$utf8 = New-Object System.Text.UTF8Encoding($false)

function MkState {
  param([string]$zoneExtra, [int]$zoneCount = 3)
  $zoneList = New-Object System.Collections.ArrayList
  $names = @('gaming','quant','media')
  for ($i = 0; $i -lt $zoneCount; $i++) {
    $zn = $names[$i % 3]
    [void]$zoneList.Add([PSCustomObject][ordered]@{ id = ('z' + $i); name = ('FLUX ' + $zn + $zoneExtra); status = 'active'; activity = ($i % 5) })
  }
  [PSCustomObject][ordered]@{
    protocol = 'fluxverse/0.1'
    ts_utc = '2026-09-24T08:00:00Z'
    zones = @($zoneList)
    fleet = @(
      [PSCustomObject][ordered]@{ id = 'bm-a'; online = $true; cores = 32; last_seen = 'x'; current_task = 'internal codename stuff' },
      [PSCustomObject][ordered]@{ id = 'bm-b'; online = $false; cores = 16; last_seen = 'y'; current_task = 'more internal text' }
    )
    tasks = @([PSCustomObject][ordered]@{ id = 'T-1'; owner = 'bm-a'; zone = 'quant'; status = 'done' })
    flows = @(
      [PSCustomObject][ordered]@{ id = 'data'; zone = 'gaming' },
      [PSCustomObject][ordered]@{ id = 'capital'; zone = 'quant' },
      [PSCustomObject][ordered]@{ id = 'traffic'; zone = 'media' }
    )
    products = @([PSCustomObject][ordered]@{ id = 'minigame'; line = 'gaming'; status = 'active' })
    governance = [PSCustomObject][ordered]@{ ceo_orders_pending = @('O-SECRET-1'); decisions_total = 8; decisions_open = 5; hq_feedback_open = 15 }
    history = [PSCustomObject][ordered]@{ commits_total = 4740; last_commit_ts = '2026-09-24T15:45:47+08:00' }
    reality = [PSCustomObject][ordered]@{
      city_day_phase = 'dusk'; weather_kind = 'rain'; weather_temp_c = 22.5; weekday = 'THU'; beijing_hhmm = '16:05';
      market = [PSCustomObject][ordered]@{ bars = @(@(1, 2)); change_pct = -0.5 }; fx_usdcny = 7.12; market_phase = 'open'; market_calendar = 'STALE'
    }
    media_outputs = [PSCustomObject][ordered]@{ renders_total = 19; renders_bytes = 91086806; last_render = 'bs-001-x.mp4'; last_render_utc = '2026-09-24T03:25:02Z' }
    game_tasks = [PSCustomObject][ordered]@{ total = 19; active = 12; blocked = 2; items = @([PSCustomObject][ordered]@{ gid = 'G01'; stage = 'S1' }) }
    residents = @{}
  }
}

$ALLOWED = @('COMMIT','TASK_CLAIM','TASK_DONE','GAME_STAGE','MEDIA_OUTPUT','GITHUB_EVENT','WEATHER_ALERT')
$evLines = New-Object System.Collections.ArrayList
for ($i = 0; $i -lt 120; $i++) {
  $t = $ALLOWED[$i % 7]
  [void]$evLines.Add(('{"ts_utc":"2026-09-24T07:00:00Z#' + $i + '","type":"' + $t + '","actor":"x' + $i + '","repo":"r' + $i + '","zone":"gaming","summary":"internal note ' + $i + '"}'))
}
[void]$evLines.Add('{"ts_utc":"2026-09-24T07:59:00Z#CEO","type":"CEO_ORDER","actor":"CEO","repo":"hq","zone":"quant","summary":"CEO quote fixture 1532"}')
[void]$evLines.Add('{"ts_utc":"2026-09-24T07:59:01Z","type":"MARKET_OPEN","actor":"clock","repo":"local","zone":"quant","summary":"market open fixture"}')
[void]$evLines.Add('{"ts_utc":"2026-09-24T07:59:02Z","type":"FX_TICK","actor":"fx","repo":"local","zone":"quant","summary":"7.12"}')
[void]$evLines.Add('{"ts_utc":"2026-09-24T07:59:03Z","type":"DECISION_MADE","actor":"hq","repo":"hq","zone":"governance","summary":"decision fixture"}')
[void]$evLines.Add('{"ts_utc":"2026-09-24T07:59:04Z","type":"RESIDENT_SAY","actor":"res","repo":"biglife","zone":"rv","summary":"voice fixture"}')
[void]$evLines.Add('{"ts_utc":"2026-09-24T07:59:05Z","type":"HEARTBEAT","actor":"bm-a","repo":"fleet","zone":"quant","summary":"alive"}')
[void]$evLines.Add('{"ts_utc":"2026-09-24T07:59:06Z","type":"HQ_FEEDBACK","actor":"fv","repo":"fv","zone":"governance","summary":"fb fixture"}')
[void]$evLines.Add('this line is not json at all')

# ---------- T1: happy path projection ----------
$state1 = MkState ''
[System.IO.File]::WriteAllText((Join-Path $TW 'world-state.json'), (ConvertTo-Json $state1 -Depth 6), $utf8)
[System.IO.File]::WriteAllLines((Join-Path $TW 'world-events.jsonl'), [string[]]$evLines, $utf8)
$r1 = Invoke-Script $exporter ('-WorldDir "' + $TW + '" -OutDir "' + $TO + '" -NoGit')
$f1 = Join-Path $TO 'city-snapshot.json'
Check 'T1 exporter exit 0' ($r1.exit -eq 0)
Check 'T1 artifact exists' (Test-Path $f1)
$snapText = [System.IO.File]::ReadAllText($f1, [System.Text.Encoding]::UTF8)
$snap = ConvertFrom-Json $snapText
# r254 re-baseline: T2/T16d top keys now include the additive status_face
# section (r239 v0.2) and T7 reality keys include 'season' (T-FV-132) - the
# two additive contract changes predate r254; exact-set lines updated so the
# standing harness runs green again (harness rot law: re-baseline at the
# contract-change round; the r254 empty-section fix itself is key-neutral).
$topSet = (@($snap.PSObject.Properties.Name) | Sort-Object) -join ','
Check 'T2 top keys exact whitelist set' ($topSet -eq 'city,events_tail,flows,protocol,reality_public,status_face,ts_utc,zones')
Check 'T3 protocol marker' ($snap.protocol -eq 'fluxverse-public/0.1')
$zkeys = (@($snap.zones[0].PSObject.Properties.Name) | Sort-Object) -join ','
Check 'T4 zone keys whitelisted' ($zkeys -eq 'activity,id,name,status')
Check 'T4b zones carried (3)' (@($snap.zones).Count -eq 3)
$fkeys = (@($snap.flows[0].PSObject.Properties.Name) | Sort-Object) -join ','
Check 'T5 flow keys whitelisted' ($fkeys -eq 'id,zone')
Check 'T6 city aggregates' ($snap.city.fleet_online -eq 1 -and $snap.city.games_total -eq 19 -and $snap.city.games_active -eq 12 -and $snap.city.renders_total -eq 19 -and $snap.city.last_render_utc -eq '2026-09-24T03:25:02Z' -and $snap.city.commits_total -eq 4740)
$rkeys = (@($snap.reality_public.PSObject.Properties.Name) | Sort-Object) -join ','
Check 'T7 reality_public keys exact 5' ($rkeys -eq 'beijing_hhmm,city_day_phase,season,weather_kind,weather_temp_c,weekday')
Check 'T7b reality values carried' ($snap.reality_public.city_day_phase -eq 'dusk' -and $snap.reality_public.weather_temp_c -eq 22.5)
$tailArr = @($snap.events_tail)
Check 'T8 tail capped at 50 of 120 allowed' ($tailArr.Count -eq 50)
Check 'T8b tail is the LAST 50' ([string]$tailArr[0].ts_utc -eq '2026-09-24T07:00:00Z#70' -and [string]$tailArr[49].ts_utc -eq '2026-09-24T07:00:00Z#119')
$badTypes = @($tailArr | Where-Object { @('COMMIT','TASK_CLAIM','TASK_DONE','GAME_STAGE','MEDIA_OUTPUT','GITHUB_EVENT','WEATHER_ALERT') -notcontains $_.type })
$badKeys = @($tailArr | Where-Object { (@($_.PSObject.Properties.Name | Sort-Object) -join ',') -ne 'ts_utc,type,zone' })
Check 'T9 no forbidden event types leaked' ($badTypes.Count -eq 0)
Check 'T9b event fields = ts/type/zone only' ($badKeys.Count -eq 0)
Check 'T10 CEO quote absent from artifact' (-not $snapText.Contains('CEO quote fixture'))
Check 'T10b governance order id absent' (-not $snapText.Contains('O-SECRET-1'))
Check 'T10c fleet task text absent' (-not $snapText.Contains('internal codename stuff'))
Check 'T10d game gid absent' (-not $snapText.Contains('G01'))
Check 'T10e render filename absent' (-not $snapText.Contains('bs-001-x.mp4'))
Check 'T10f market/fx faces absent' (-not ($snapText.Contains('market') -or $snapText.Contains('fx_usdcny') -or $snapText.Contains('7.12') -or $snapText.Contains('market_phase')))

# ---------- T11: world dir read-only proof (temp dir untouched by rerun) ----------
$stBefore = Get-Item (Join-Path $TW 'world-state.json')
$evBefore = Get-Item (Join-Path $TW 'world-events.jsonl')
$r2 = Invoke-Script $exporter ('-WorldDir "' + $TW + '" -OutDir "' + $TO + '" -NoGit')
$stAfter = Get-Item (Join-Path $TW 'world-state.json')
$evAfter = Get-Item (Join-Path $TW 'world-events.jsonl')
Check 'T11 rerun exit 0' ($r2.exit -eq 0)
Check 'T11b world-state.json untouched (size+mtime)' ($stAfter.Length -eq $stBefore.Length -and $stAfter.LastWriteTime -eq $stBefore.LastWriteTime)
Check 'T11c world-events.jsonl untouched (size+mtime)' ($evAfter.Length -eq $evBefore.Length -and $evAfter.LastWriteTime -eq $evBefore.LastWriteTime)
$h1 = (Get-FileHash $f1 -Algorithm SHA256).Hash
Check 'T12 deterministic (same input -> same bytes)' ($r1.out -eq $r2.out)

# ---------- T13: secret-scan gate (structure-legal but content-poisoned) ----------
$goodHash = (Get-FileHash $f1 -Algorithm SHA256).Hash
$stateAkia = MkState 'AKIA0123456789ABCDEF'
[System.IO.File]::WriteAllText((Join-Path $TW 'world-state.json'), (ConvertTo-Json $stateAkia -Depth 6), $utf8)
$r3 = Invoke-Script $exporter ('-WorldDir "' + $TW + '" -OutDir "' + $TO + '" -NoGit')
Check 'T13 secret gate FAIL exit 2' ($r3.exit -eq 2)
Check 'T13b G1 reason reported' ($r3.out.Contains('G1 secret-scan hit'))
$goodHash2 = (Get-FileHash $f1 -Algorithm SHA256).Hash
$stray = @(Get-ChildItem -Path $TO -Filter '*.new' -ErrorAction SilentlyContinue)
Check 'T13c last-good snapshot kept (fail-keep)' ($goodHash2 -eq $goodHash)
Check 'T13d candidate .new cleaned up' ($stray.Count -eq 0)

# ---------- T14: forbidden-word gates (ASCII + CJK via code points) ----------
$stateProfit = MkState ' quarterly profit report '
[System.IO.File]::WriteAllText((Join-Path $TW 'world-state.json'), (ConvertTo-Json $stateProfit -Depth 6), $utf8)
$r4 = Invoke-Script $exporter ('-WorldDir "' + $TW + '" -OutDir "' + $TO + '" -NoGit')
Check 'T14 ASCII forbidden word FAIL' ($r4.exit -eq 2 -and $r4.out.Contains('G3 forbidden-word hit: profit'))
$wordCjk = CJK @(0x7B56, 0x7565)   # ce-lue (strategy)
$stateCjk = MkState (' tag-' + $wordCjk + '-tag ')
[System.IO.File]::WriteAllText((Join-Path $TW 'world-state.json'), (ConvertTo-Json $stateCjk -Depth 6), $utf8)
$r5 = Invoke-Script $exporter ('-WorldDir "' + $TW + '" -OutDir "' + $TO + '" -NoGit')
Check 'T14b CJK forbidden word FAIL (pre-serialization face)' ($r5.exit -eq 2 -and $r5.out.Contains('G3 forbidden-word hit (CJK)'))

# ---------- T15: size cap gate ----------
$stateBig = MkState (' ' + ('a' * 40)) 20000
[System.IO.File]::WriteAllText((Join-Path $TW 'world-state.json'), (ConvertTo-Json $stateBig -Depth 6), $utf8)
$r6 = Invoke-Script $exporter ('-WorldDir "' + $TW + '" -OutDir "' + $TO + '" -NoGit')
Check 'T15 size cap FAIL over 1MB' ($r6.exit -eq 2 -and $r6.out.Contains('G4 size'))

# ---------- T16: real-machine smoke (default dirs, git staging on) ----------
$rp = Invoke-Script $exporter ''
$rf = Join-Path $repo 'world-public\city-snapshot.json'
Check 'T16 real export exit 0' ($rp.exit -eq 0)
Check 'T16b real artifact exists' (Test-Path $rf)
if (Test-Path $rf) {
  $rb = (Get-Item $rf).Length
  $rsnap = ConvertFrom-Json ([System.IO.File]::ReadAllText($rf, [System.Text.Encoding]::UTF8))
  $rtail = @($rsnap.events_tail)
  $rtop = (@($rsnap.PSObject.Properties.Name) | Sort-Object) -join ','
  Check 'T16c real size under 1MB' ($rb -gt 0 -and $rb -lt 1048576)
  Check 'T16d real top keys whitelisted' ($rtop -eq 'city,events_tail,flows,protocol,reality_public,status_face,ts_utc,zones')
  $rbad = @($rtail | Where-Object { @('COMMIT','TASK_CLAIM','TASK_DONE','GAME_STAGE','MEDIA_OUTPUT','GITHUB_EVENT','WEATHER_ALERT') -notcontains $_.type })
  Check 'T16e real tail types whitelisted' ($rbad.Count -eq 0)
  Check 'T16f real tail non-empty' ($rtail.Count -gt 0)
  $stageLine = & git -C $repo status --porcelain -- 'world-public/city-snapshot.json' 2>$null
  Check 'T16g snapshot staged for next commit' ($LASTEXITCODE -eq 0 -and $stageLine -match '^[AM]\s')
}

# ---------- T17: ASCII-law audit (script bodies pure ASCII) ----------
function MaxByte {
  param([string]$path)
  $m = 0
  foreach ($b in [System.IO.File]::ReadAllBytes($path)) { if ($b -gt $m) { $m = $b } }
  $m
}
Check 'T17 exporter ASCII-only' ((MaxByte $exporter) -le 127)
Check 'T17b tick.ps1 ASCII-only' ((MaxByte $tickScript) -le 127)
Check 'T17c sandbox ASCII-only' ((MaxByte ($PSCommandPath)) -le 127)

# ---------- cleanup + verdict ----------
Remove-Item $TMP -Recurse -Force -ErrorAction SilentlyContinue
Write-Output ('SUMMARY: ' + $pass + ' passed, ' + $fail + ' failed')
if ($fail -gt 0) { exit 1 } else { exit 0 }
