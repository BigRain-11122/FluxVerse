# export-public-snapshot.ps1 - city public snapshot exporter v0.1
# P-2026-09-24-52 slice 3a (2026-09-24 r69): whitelist-sanitized subset of
# world-state.json plus an events tail digest -> world-public/city-snapshot.json
# (cap 1MB). Consumed by the visitor read API over the git read-only channel
# (server cron pull every 10min; spec = cph4/research/R-20260924-server-city
# sections 1/2/7). This script is the single writer of world-public/; world/
# itself is strictly read-only here (P-43 single-writer law).
#
# AC-5 gates (R- section 8, EVERY export round, built in):
#   G1 secret-scan      - P0 secret patterns over all values + serialized text
#   G2 whitelist fields - parsed output must walk the declared whitelist tree
#   G3 forbidden words  - sensitive-face terms, ASCII list + CJK via code points
#   G4 size             - 0 < bytes < 1MB
# FAIL = the candidate .new is deleted, the last-good snapshot on disk is kept
# (verify-style FAIL-blocks-promote), exit 2. Success = two-phase promote
# (unique-per-PID candidate -> atomic rename) + fail-soft git staging (r62
# chronicle pattern: the snapshot enters history with the next devloop commit).
#
# Sensitive faces excluded BY DESIGN (v0 whitelist, per-section sensitive-face
# law - see TECH section 9 P-52 slice 3a row for the ledger):
#   - market / fx / market calendar  (financial quotes - forbidden face)
#   - governance                     (CEO order ids, decision/feedback counts)
#   - fleet machine + task owner detail (fleet topology ban)
#   - event summary/actor/repo fields (CEO quotes, repo codenames); public
#     events keep ts_utc + type + zone only, type-filtered
# ASCII-only script (encoding law). CJK scan words are built from code points.
# Usage: powershell -File export-public-snapshot.ps1 [-WorldDir d] [-OutDir d] [-NoGit]

param(
  [string]$WorldDir = '',
  [string]$OutDir = '',
  [switch]$NoGit
)

$ErrorActionPreference = 'Stop'
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')
if (-not $WorldDir) { $WorldDir = Join-Path $repoRoot 'world' }
if (-not $OutDir)   { $OutDir   = Join-Path $repoRoot 'world-public' }
$utf8 = New-Object System.Text.UTF8Encoding($false)

# ---------- output contract: v0 whitelist (single declaration) ----------
$WL_EVENT_TYPES = @('COMMIT','TASK_CLAIM','TASK_DONE','GAME_STAGE','MEDIA_OUTPUT','GITHUB_EVENT','WEATHER_ALERT')
$WL_ZONES = @('id','name','status','activity')
$WL_FLOWS = @('id','zone')
$WL_CITY  = @('fleet_online','games_total','games_active','renders_total','last_render_utc','commits_total')
$WL_REAL  = @('city_day_phase','weather_kind','weather_temp_c','weekday','beijing_hhmm')
$WL_EVENT = @('ts_utc','type','zone')
$WL_TOP   = @('protocol','ts_utc','zones','flows','city','reality_public','events_tail')
$MAX_BYTES = 1048576
$TAIL_N = 50

# ---------- helpers ----------
function Get-Val {
  param($obj, [string]$name)
  if ($null -eq $obj) { return $null }
  $p = $obj.PSObject.Properties[$name]
  if ($p) { return $p.Value } else { return $null }
}
function To-Int {
  param($v, [int]$dflt)
  if ($v -is [int] -or $v -is [long] -or $v -is [double] -or $v -is [byte]) { return [int]$v }
  if ($v -is [string] -and $v -match '^\d+$') { return [int]$v }
  return $dflt
}
function Copy-Keys {
  # project an object down to exactly the whitelisted keys (missing -> null)
  param($obj, [string[]]$keys)
  $h = [ordered]@{}
  foreach ($k in $keys) { $h[$k] = (Get-Val $obj $k) }
  [PSCustomObject]$h
}
function Assert-Leaf {
  param($v, [string]$path)
  if ($v -is [System.Management.Automation.PSCustomObject]) { throw ('G2 whitelist: nested object at ' + $path) }
  if ($v -is [System.Array]) { throw ('G2 whitelist: nested array at ' + $path) }
}
function Assert-Obj {
  param($node, [string[]]$allowed, [string]$path)
  foreach ($p in $node.PSObject.Properties) {
    if ($allowed -notcontains $p.Name) { throw ('G2 whitelist: ' + $path + '.' + $p.Name + ' not in whitelist') }
    Assert-Leaf $p.Value ($path + '.' + $p.Name)
  }
}
function Assert-List {
  param($list, [string[]]$allowed, [string]$path)
  foreach ($el in @($list)) {
    if ($null -eq $el) { throw ('G2 whitelist: null element in ' + $path) }
    Assert-Obj $el $allowed $path
  }
}
function CJK {
  param([int[]]$cps)
  $s = ''
  foreach ($c in $cps) { $s += [char]$c }
  $s
}

# secret patterns (P0 class): cloud keys, private key headers, platform tokens
$SECRET_PATTERNS = @(
  'AKIA[0-9A-Z]{16}',
  '-----BEGIN [A-Z ]*PRIVATE KEY',
  'ghp_[A-Za-z0-9]{20,}',
  'github_pat_[A-Za-z0-9_]{20,}',
  'sk-[A-Za-z0-9]{20,}',
  'xox[baprs]-[A-Za-z0-9-]{10,}',
  'AIza[0-9A-Za-z_-]{35}'
)
# sensitive-face words (structure net is primary; this is the content net)
$FW_ASCII = @('password','passwd','secret','token','apikey','api_key','private_key','smtp','credential','access_key','net_value','netvalue','profit','drawdown','strategy','factor','balance','equity')
$FW_CJK = @(
  (CJK @(0x5BC6,0x94A5)),      # mi-yao (secret key)
  (CJK @(0x5BC6,0x7801)),      # mi-ma (password)
  (CJK @(0x6388,0x6743,0x7801)), # shou-quan-ma (auth code)
  (CJK @(0x76C8,0x4E8F)),      # ying-kui (profit and loss)
  (CJK @(0x51C0,0x503C)),      # jing-zhi (net value)
  (CJK @(0x4ED3,0x4F4D)),      # cang-wei (position)
  (CJK @(0x7B56,0x7565)),      # ce-lue (strategy)
  (CJK @(0x884C,0x60C5))       # hang-qing (market quotes)
)

$outLines = New-Object System.Collections.ArrayList
$newPath = ''
try {
  $stateFile = Join-Path $WorldDir 'world-state.json'
  $eventsFile = Join-Path $WorldDir 'world-events.jsonl'
  if (-not (Test-Path $stateFile)) { throw 'world-state.json not found (scan has not produced state yet)' }
  $state = ConvertFrom-Json ([System.IO.File]::ReadAllText($stateFile, [System.Text.Encoding]::UTF8))
  if ($null -eq (Get-Val $state 'zones')) { throw 'state has no zones section' }
  if (@(Get-Val $state 'zones').Count -lt 1) { throw 'state zones section is empty' }

  # ---------- compose the public projection ----------
  $zonesPub = @((Get-Val $state 'zones') | ForEach-Object { Copy-Keys $_ $WL_ZONES })
  $flowsPub = @((Get-Val $state 'flows') | ForEach-Object { Copy-Keys $_ $WL_FLOWS })
  $fleetOnline = @((Get-Val $state 'fleet') | Where-Object { (Get-Val $_ 'online') -eq $true }).Count
  $cityPub = [PSCustomObject][ordered]@{
    fleet_online     = $fleetOnline
    games_total      = To-Int (Get-Val (Get-Val $state 'game_tasks') 'total') 0
    games_active     = To-Int (Get-Val (Get-Val $state 'game_tasks') 'active') 0
    renders_total    = To-Int (Get-Val (Get-Val $state 'media_outputs') 'renders_total') 0
    last_render_utc  = [string](Get-Val (Get-Val $state 'media_outputs') 'last_render_utc')
    commits_total    = To-Int (Get-Val (Get-Val $state 'history') 'commits_total') 0
  }
  $re = Get-Val $state 'reality'
  $realPub = [PSCustomObject][ordered]@{
    city_day_phase = [string](Get-Val $re 'city_day_phase')
    weather_kind   = [string](Get-Val $re 'weather_kind')
    weather_temp_c = Get-Val $re 'weather_temp_c'
    weekday        = [string](Get-Val $re 'weekday')
    beijing_hhmm  = [string](Get-Val $re 'beijing_hhmm')
  }

  # events tail: cheap type pre-filter, then parse, then exact type check
  $kept = New-Object System.Collections.ArrayList
  $scanned = 0
  if (Test-Path $eventsFile) {
    $typeRe = '"type":"(' + ($WL_EVENT_TYPES -join '|') + ')"'
    foreach ($ln in [System.IO.File]::ReadAllLines($eventsFile, [System.Text.Encoding]::UTF8)) {
      if ($null -eq $ln -or $ln.Length -eq 0) { continue }
      if (-not ($ln -match $typeRe)) { continue }
      $scanned++
      try {
        $ev = ConvertFrom-Json $ln
        $t = [string](Get-Val $ev 'type')
        if ($WL_EVENT_TYPES -notcontains $t) { continue }
        [void]$kept.Add([PSCustomObject][ordered]@{
          ts_utc = [string](Get-Val $ev 'ts_utc')
          type   = $t
          zone   = [string](Get-Val $ev 'zone')
        })
      } catch { continue }
    }
  }
  if ($kept.Count -gt $TAIL_N) { $tail = @($kept.GetRange($kept.Count - $TAIL_N, $TAIL_N)) }
  else { $tail = @($kept) }

  $out = [PSCustomObject][ordered]@{
    protocol       = 'fluxverse-public/0.1'
    ts_utc         = [string](Get-Val $state 'ts_utc')
    zones          = $zonesPub
    flows          = $flowsPub
    city           = $cityPub
    reality_public = $realPub
    events_tail    = $tail
  }
  $json = ConvertTo-Json $out -Depth 6 -Compress

  # ---------- write candidate (unique per PID: concurrent manual runs safe) ----------
  if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Path $OutDir | Out-Null }
  # janitor: drop candidates stranded by killed runs (older than 15 min)
  Get-ChildItem -Path $OutDir -Filter 'city-snapshot.json.*.new' -ErrorAction SilentlyContinue |
    Where-Object { $_.LastWriteTime -lt (Get-Date).AddMinutes(-15) } |
    Remove-Item -Force -ErrorAction SilentlyContinue
  $finalPath = Join-Path $OutDir 'city-snapshot.json'
  $newPath = $finalPath + '.' + $PID + '.new'
  [System.IO.File]::WriteAllText($newPath, ($json + "`n"), $utf8)

  # ---------- AC-5 gates on the on-disk candidate ----------
  $snapText = [System.IO.File]::ReadAllText($newPath, [System.Text.Encoding]::UTF8)
  $snap = ConvertFrom-Json $snapText

  # G2: structural whitelist walk of the parsed artifact
  foreach ($p in $snap.PSObject.Properties) {
    if ($WL_TOP -notcontains $p.Name) { throw ('G2 whitelist: top-level key ' + $p.Name) }
  }
  Assert-List (Get-Val $snap 'zones') $WL_ZONES 'zones'
  Assert-List (Get-Val $snap 'flows') $WL_FLOWS 'flows'
  Assert-Obj (Get-Val $snap 'city') $WL_CITY 'city'
  Assert-Obj (Get-Val $snap 'reality_public') $WL_REAL 'reality_public'
  Assert-List (Get-Val $snap 'events_tail') $WL_EVENT 'events_tail'

  # collect every string value (pre-serialization text: CJK is \u-escaped in
  # the serialized form, so the values text is the only honest CJK scan face)
  $sb = New-Object System.Text.StringBuilder
  function Add-Values {
    param($node)
    foreach ($p in $node.PSObject.Properties) {
      $v = $p.Value
      if ($v -is [System.Management.Automation.PSCustomObject]) { Add-Values $v }
      elseif ($v -is [System.Array]) {
        foreach ($el in $v) {
          if ($el -is [System.Management.Automation.PSCustomObject]) { Add-Values $el }
          elseif ($el -is [string]) { [void]$sb.Append($el); [void]$sb.Append(' ') }
        }
      }
      elseif ($v -is [string]) { [void]$sb.Append($v); [void]$sb.Append(' ') }
    }
  }
  Add-Values $snap
  $contentText = $sb.ToString()

  # G1: secret-scan on values text + serialized text
  foreach ($txt in @($contentText, $snapText)) {
    foreach ($pat in $SECRET_PATTERNS) {
      if ($txt -match $pat) { throw ('G1 secret-scan hit: ' + $pat) }
    }
  }
  # G3: forbidden words (ASCII on both faces, CJK on values text)
  foreach ($txt in @($contentText, $snapText)) {
    foreach ($w in $FW_ASCII) {
      if ($txt -match [regex]::Escape($w)) { throw ('G3 forbidden-word hit: ' + $w) }
    }
  }
  foreach ($w in $FW_CJK) {
    if ($contentText.Contains($w)) { throw ('G3 forbidden-word hit (CJK): ' + $w) }
  }
  # G4: size cap
  $bytes = (Get-Item $newPath).Length
  if ($bytes -le 0) { throw 'G4 size: candidate is empty' }
  if ($bytes -ge $MAX_BYTES) { throw ('G4 size: ' + $bytes + ' bytes over the 1MB cap') }

  # ---------- two-phase promote ----------
  Move-Item -Force $newPath $finalPath

  [void]$outLines.Add(('export: city-snapshot.json bytes=' + $bytes + ' zones=' + @($zonesPub).Count + ' flows=' + @($flowsPub).Count + ' events_tail=' + @($tail).Count + '/' + $scanned))
  [void]$outLines.Add('pubgate: G1 secrets 0 / G2 whitelist OK / G3 words 0 / G4 size OK')
  if (-not $NoGit) {
    # r32 law: native stderr under EAP=Stop throws on the first stderr line
    # (git's LF->CRLF notice etc.) - swap to Continue around the call.
    $eapSaved = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
      & git -C $repoRoot add -- $finalPath 2>$null
      if ($LASTEXITCODE -eq 0) { [void]$outLines.Add('stage: snapshot staged (deferred commit, r62 pattern)') }
      else { [void]$outLines.Add('stage: git add failed (fail-soft)') }
    } catch { [void]$outLines.Add('stage: git add error (fail-soft)') }
    finally { $ErrorActionPreference = $eapSaved }
  }
  $outLines
  exit 0
} catch {
  if ($newPath -and (Test-Path $newPath)) { Remove-Item $newPath -Force -ErrorAction SilentlyContinue }
  [void]$outLines.Add('pubgate: FAIL: ' + ($_.Exception.Message -replace "[\r\n]", ' '))
  $outLines
  exit 2
}
