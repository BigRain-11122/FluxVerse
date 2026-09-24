# FluxVerse CityWatch - CEO progress viewer generator (read-only, zero interference)
# CEO order 2026-09-23: "an interface on every machine to watch city progress
# anytime, visual tour, a logo, and viewing must not affect development."
# Encoding law: ASCII-only script body (PS5.1 no-BOM UTF-8 reads as GBK - proven
# today in orders_hq). ALL Chinese lives in data files (milestones.json UTF-8,
# template.html with meta charset).
# Reads: world-state.json + world-events.jsonl tail + git logs + tick log + pngs.
# Writes: ONLY watch\out\ (gitignored). Never opens the Tuanjie editor, never
# writes shared files, never locks. Scan's two-phase promote makes reads atomic.
# Usage: CityWatch.bat (group U060 silent pattern), or with -Open to open browser.

param([switch]$Open)

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')        # -> gaming/FluxVerse
$group    = Resolve-Path (Join-Path $PSScriptRoot '..\..\..')  # -> FluxGroup root
$world    = Join-Path $repoRoot 'world'
$outDir   = Join-Path $repoRoot 'watch\out'
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }
$utf8 = New-Object System.Text.UTF8Encoding($false)

# ---------- gather (all read-only) ----------
# PS5.1 LAW (proven today): Get-Content lines carry ETS note properties
# (PSPath/PSDrive/provider object graph). Feeding those PSObjects to ConvertTo-Json
# serializes ~2.23MB of .NET type graph PER LINE. Unwrap to plain strings first.
$stateJson = ''
$stateFile = Join-Path $world 'world-state.json'
if (Test-Path $stateFile) { $stateJson = [string](Get-Content $stateFile -Raw -Encoding UTF8) }

$events = @()
$evFile = Join-Path $world 'world-events.jsonl'
if (Test-Path $evFile) {
  $all = @(Get-Content $evFile -Encoding UTF8 | ForEach-Object { [string]$_ } | Where-Object { $_.Trim() })
  if ($all.Count -gt 40) { $events = @($all | Select-Object -Last 40) } else { $events = $all }
}

$commits = @{}
$since = (Get-Date).AddHours(-24).ToString('yyyy-MM-ddTHH:mm:ss')
$repos = @{
  'fluxgroup' = $group.Path
  'minigame'  = (Join-Path $group 'gaming\MiniGame')
  'bigmoney'  = (Join-Path $group 'quant\bigmoney')
  'bigstream' = (Join-Path $group 'media\BigStream')
  'fluxverse' = $repoRoot.Path
}
foreach ($k in @($repos.Keys)) {
  $c = 0
  try {
    $o = & git -C $repos[$k] rev-list --count --since=$since HEAD 2>$null
    if ($LASTEXITCODE -eq 0 -and $o) { $c = [int]$o }
  } catch {}
  $commits[$k] = $c
}

$tick = @()
$logFile = Join-Path $repoRoot ('logs\tick-' + (Get-Date).ToString('yyyyMMdd') + '.log')
if (Test-Path $logFile) { $tick = @(Get-Content $logFile -Encoding UTF8 | ForEach-Object { [string]$_ } | Select-Object -Last 6) }

# images: screenshots & concept art live under docs/ (m1-r*.png per DevLoop
# round = the build process). City\Assets excluded on purpose: 953 art tiles
# would flood the gallery whenever assets get re-imported. Never crawl MiniGame
# 22GB or engine Library/ - heavy disk IO during dev violates zero-interference.
$imgs = @()
$searchRoots = @((Join-Path $repoRoot 'docs'))
foreach ($rt in $searchRoots) {
  if (Test-Path $rt) {
    $imgs += @(Get-ChildItem $rt -Recurse -Include *.png -File -ErrorAction SilentlyContinue | Where-Object { $_.FullName -notmatch '\\out\\' })
  }
}
$imgs = @($imgs | Sort-Object LastWriteTime -Descending | Select-Object -First 16)
$imgList = @()
foreach ($i in $imgs) {
  $rel = [System.IO.Path]::GetFullPath($i.FullName).Substring($repoRoot.Path.Length + 1)
  $imgList += @{ src = ('../../' + ($rel -replace '\\','/')); name = $i.BaseName; ts = $i.LastWriteTime.ToString('MM-dd HH:mm') }
}

# milestones: Chinese labels live in milestones.json (UTF-8 data file)
$milestones = @()
$msFile = Join-Path $PSScriptRoot 'milestones.json'
if (Test-Path $msFile) {
  try {
    $ms = Get-Content $msFile -Raw -Encoding UTF8 | ConvertFrom-Json
    if ($ms -and $ms.milestones) {
      foreach ($m in @($ms.milestones)) { $milestones += @{ id = $m.id; name = $m.name; status = $m.status } }
    }
  } catch {}
}

# ---------- census read (BigLife export face; shared by population + voice) ----------
# ETS unwrap law (PS5.1, proven r27): every line becomes a plain string here.
$censusFile = Join-Path $group 'life\BigLife\census\export\citizens-light.jsonl'
$craw = ''
$clines = @()
if (Test-Path $censusFile) {
  $craw = [string](Get-Content $censusFile -Raw -Encoding UTF8)
  $clines = @($craw -split "`n" | ForEach-Object { [string]$_ } | Where-Object { $_.Trim() })
}

# ---------- population (P-22 claim: BigLife census read-only consumption) ----------
# CODEX sec.12 names CityWatch population panel as consumer of the export face
# census/export/citizens-light.jsonl (v1.2). Honest-layer law (CODEX sec.1): the
# census IS the narrative-citizen layer - panel must label it as such and never
# mix it with the anchor layer (machine residents in docs\residents). Encoding
# law: script body stays ASCII - codes and Chinese values flow through raw from
# data; Chinese labels live in template.html (UTF-8 data file).
# Zero interference: file read once on demand (snapshot build), nothing written.
$population = $null
try {
  if ($clines.Count -gt 0) {
    # P-58 honor seats (CEO family cards, census first segment) carry district=""
    # by design - their seat is at the brain tower, not in any district. Bucket
    # them under a labeled key so the embedded JSON never holds an empty-string
    # property (PS5.1 ConvertFrom-Json dies on it) and the panel shows a real
    # chip. Label built from code points per the encoding law (RONG YU XI).
    $honorSeat = [string][char]0x8363 + [string][char]0x8A89 + [string][char]0x5E2D
    function Get-FieldCounts([string]$text, [string]$field, [string]$emptyLabel) {
      $h = @{}
      foreach ($m in [regex]::Matches($text, ('"' + $field + '":\s*"([^"]*)"'))) {
        $k = $m.Groups[1].Value
        if ($k -eq '' -and $emptyLabel) { $k = $emptyLabel }
        $h[$k] = 1 + [int]$h[$k]
      }
      return $h
    }
    $byDistrict = Get-FieldCounts $craw 'district' $honorSeat
    $byFaction  = Get-FieldCounts $craw 'faction'
    $bySpecies  = Get-FieldCounts $craw 'species'
    $byGender   = Get-FieldCounts $craw 'gender'
    # hand-written showcase anchors (CODEX sec.11.4) - rotate per day, deterministic;
    # stride 5 because anchors are grouped by district, so consecutive picks would
    # fill the card with one district - striding spreads the daily four across zones
    $anchors = @($clines | Where-Object { $_ -match '"anchor":\s*true' })
    $showcase = @()
    if ($anchors.Count -gt 0) {
      $dayIdx = [int](Get-Date -Format 'yyyyMMdd') % $anchors.Count
      $take = [Math]::Min(4, $anchors.Count)
      for ($i = 0; $i -lt $take; $i++) {
        $a = $anchors[($dayIdx + 5 * $i) % $anchors.Count] | ConvertFrom-Json
        $aDistrict = [string]$a.district
        if (-not $aDistrict.Trim()) { $aDistrict = $honorSeat }
        $showcase += @{ id = $a.id; name = $a.name; age = $a.age; profession = $a.profession; district = $aDistrict; block = $a.block; creed = $a.creed }
      }
    }
    $anchorLayer = 0
    $resCardsDir = Join-Path $repoRoot 'docs\residents'
    if (Test-Path $resCardsDir) { $anchorLayer = @(Get-ChildItem $resCardsDir -Filter *.md -ErrorAction SilentlyContinue).Count }
    $population = [ordered]@{
      total        = $clines.Count
      by_district  = $byDistrict
      by_faction   = $byFaction
      by_species   = $bySpecies
      by_gender    = $byGender
      anchors      = $anchors.Count
      showcase     = $showcase
      anchor_layer = $anchorLayer
    }
  }
} catch { $population = $null }   # census missing/broken => panel hides, snapshot still ships

# ---------- welcome line: a resident greets the CEO on every open ----------
# P-54(2) slice 2 (r75): consumption wiring for the pre-baked greeting library
# watch\greetings.json (baked r70 via a local Ollama batch). The live per-open
# LLM call is RETIRED - local-compute max order: batch offline -> deterministic
# data file -> deterministic pick (r41 bake-resident-barks paradigm).
# Pick law mirrors the voice card / draw.py standard tier exactly:
#   key  = id|date|s<slot>|<ctx>  (slot = 45-min slot 0..31, date = yyyy-MM-dd)
#   pick = md5(key) first 8 hex chars as uint % bucket len
# Byte-stable inside one slot, rotating across slots. ctx = the phase canon
# key - the one situation dimension these lines were baked for. Phase = clock
# probe four-tier law (dawn 05-08 / day 09-16 / dusk 17-19 / night else,
# Beijing wall time). Greeter still rotates per open via
# watch\out\welcome-rotate.txt (r27 rotation law). P-40 AI-gen badge stays on
# the template face: lines are model-baked (qwen2.5:7b, tone only - zero
# facts / zero digits, BigLife cognition layer-2 honesty law).
# Degrade law: library missing/broken => no greeting, snapshot still ships.
$welcome = $null
try {
  $libFile = Join-Path $PSScriptRoot 'greetings.json'
  if (Test-Path $libFile) {
    $libRaw = [string](Get-Content $libFile -Raw -Encoding UTF8)
    $lib = $libRaw | ConvertFrom-Json
    $cards = @($lib.cards)
    if ($cards.Count -gt 0) {
      $rotFile = Join-Path $outDir 'welcome-rotate.txt'
      $rot = 0
      if (Test-Path $rotFile) { $r = [string](Get-Content $rotFile -Raw -Encoding UTF8); try { $rot = [int]$r } catch {} }
      $card = $cards[$rot % $cards.Count]
      [System.IO.File]::WriteAllText($rotFile, [string](($rot + 1) % 1000), (New-Object System.Text.UTF8Encoding($false)))

      $now = Get-Date
      $h = $now.Hour
      if ($h -ge 5 -and $h -le 8) { $dp = 'dawn' }
      elseif ($h -ge 9 -and $h -le 16) { $dp = 'day' }
      elseif ($h -ge 17 -and $h -le 19) { $dp = 'dusk' }
      else { $dp = 'night' }
      $slot = [int][math]::Floor((($h * 60) + $now.Minute) / 45)

      $bucket = @()
      foreach ($p in @($card.phases)) { if ([string]$p.phase -eq $dp) { $bucket = @($p.lines); break } }
      if ($bucket.Count -gt 0) {
        $key = [string]$card.id + '|' + $now.ToString('yyyy-MM-dd') + '|s' + $slot + '|' + $dp
        $md5 = [System.Security.Cryptography.MD5]::Create()
        $seed = ([System.BitConverter]::ToString($md5.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($key)))).Replace('-','').ToLower()
        $idx = [int]([Convert]::ToUInt32($seed.Substring(0, 8), 16) % [uint32]$bucket.Count)
        $wline = [string]$bucket[$idx]
        if ($wline.Trim().Length -gt 0) { $welcome = @{ id = [string]$card.id; line = $wline } }
      }
    }
  }
} catch { $welcome = $null }   # library missing/broken => no greeting, snapshot still ships

# ---------- voice v2 (P-23 claim: BigLife cognition layers 2+3 -> CityWatch) ----------
# Situation bubbles = zero LLM: BigLife draw.py --tier standard derives the
# context from OUR world state (read-only; fact gate: events > weather > clock)
# and draws pool lines deterministically per (id, date, 45-min slot) - byte
# stable inside a slot, rotating between slots. Spotlight = layer 3 (local
# Ollama, fact level, only fed real signals): pre-computed per drawn citizen at
# snapshot build, the panel click reveals it (static html, zero server).
# Both BigLife tools are stdout-only - no writes to the brother repo (write-ban
# respected). Honest-layer law (cognition/README): pool line = situation tone,
# zero facts; spotlight = fed facts only. Degrade law: any failure => voice
# card hides, snapshot still ships. Subprocess hard-cap law: Start-Process +
# WaitForExit(ms) + Kill().
$voice = $null
try {
  $bigTools = Join-Path $group 'life\BigLife\Tools'
  $drawPy   = Join-Path $bigTools 'draw.py'
  $spotPy   = Join-Path $bigTools 'spotlight.py'
  if ($clines.Count -ge 100 -and (Test-Path $drawPy) -and (Test-Path $spotPy)) {
    # deterministic daily pick of 5 citizens; their LINES rotate every slot via
    # the draw key, the faces rotate every day (same-day reopen = same faces)
    $n = $clines.Count
    $daySeed = [int](Get-Date -Format 'yyyyMMdd')
    $start = $daySeed % $n
    $stride = 1999
    $picks = @()
    for ($i = 0; $i -lt 5; $i++) {
      $ln = $clines[($start + $stride * $i) % $n]
      $mi = [regex]::Match($ln, '"id":\s*"([^"]+)"')
      $md = [regex]::Match($ln, '"district":\s*"([^"]*)"')
      $mp = [regex]::Match($ln, '"profession":\s*"([^"]*)"')
      if ($mi.Success -and $md.Success -and $mp.Success) {
        $dv = $md.Groups[1].Value
        if (-not $dv.Trim()) { $dv = $honorSeat }
        $picks += @{ id = $mi.Groups[1].Value; district = $dv; profession = $mp.Groups[1].Value }
      }
    }
    $ids = @($picks | ForEach-Object { $_.id } | Select-Object -Unique)
    if ($ids.Count -ge 3) {
      $env:PYTHONIOENCODING = 'utf-8'
      $tmp = Join-Path $outDir ('voice-draw-' + [guid]::NewGuid().ToString('N') + '.txt')
      $p = Start-Process -FilePath 'python' -ArgumentList @('-X','utf8','draw.py','--ids',($ids -join ','),'--tier','standard','--auto') -WorkingDirectory $bigTools -RedirectStandardOutput $tmp -RedirectStandardError ($tmp + '.err') -PassThru -NoNewWindow
      if (-not $p.WaitForExit(30000)) { $p.Kill() }
      $drawOut = @()
      if (Test-Path $tmp) { $drawOut = @(Get-Content $tmp -Encoding UTF8 | ForEach-Object { [string]$_ } | Where-Object { $_.Trim() }) }
      Remove-Item $tmp -Force -ErrorAction SilentlyContinue
      Remove-Item ($tmp + '.err') -Force -ErrorAction SilentlyContinue
      $ctx = $null; $ctxSrc = $null; $slot = $null
      $citizens = @()
      if ($drawOut.Count -gt 0 -and $drawOut[0] -match '^ctx=(\S+) \(src=(\S+)\) tier=standard slot=(\d+)') {
        $ctx = $Matches[1]; $ctxSrc = $Matches[2]; $slot = [int]$Matches[3]
        foreach ($ln in ($drawOut | Select-Object -Skip 1)) {
          $m = [regex]::Match($ln, '^(C-\d+)\s+(.+?)\s+\[(.+?)\]:\s*(.*)$')
          if ($m.Success) {
            $pick = $null; foreach ($pk in $picks) { if ($pk.id -eq $m.Groups[1].Value) { $pick = $pk; break } }
            $citizens += @{ id = $m.Groups[1].Value; name = $m.Groups[2].Value; axis = $m.Groups[3].Value; line = $m.Groups[4].Value; district = $pick.district; profession = $pick.profession; spot = $null }
          }
        }
      }
      if ($citizens.Count -ge 3 -and $ctx) {
        # spotlight gate: Ollama aliveness probe (3s). Dead/slow => skip all
        # spotlights; bubbles still ship (designed degrade, honest label in UI).
        $spotOk = $false
        try { Invoke-RestMethod -Uri 'http://127.0.0.1:11434/api/tags' -Method Get -TimeoutSec 3 | Out-Null; $spotOk = $true } catch { $spotOk = $false }
        if ($spotOk) {
          foreach ($c in $citizens) {
            $tmp2 = Join-Path $outDir ('voice-spot-' + [guid]::NewGuid().ToString('N') + '.txt')
            $p2 = Start-Process -FilePath 'python' -ArgumentList @('-X','utf8','spotlight.py','--id',$c.id) -WorkingDirectory $bigTools -RedirectStandardOutput $tmp2 -RedirectStandardError ($tmp2 + '.err') -PassThru -NoNewWindow
            if (-not $p2.WaitForExit(45000)) { $p2.Kill() }
            if (Test-Path $tmp2) {
              $sl = @((Get-Content $tmp2 -Encoding UTF8 | ForEach-Object { [string]$_ } | Where-Object { $_.Trim() }))
              if ($sl.Count -gt 0) {
                $ms = [regex]::Match($sl[0], ('^' + $c.id + '\s+(.+?):\s*(.*)$'))
                if ($ms.Success) { $c.spot = $ms.Groups[2].Value }
              }
            }
            Remove-Item $tmp2 -Force -ErrorAction SilentlyContinue
            Remove-Item ($tmp2 + '.err') -Force -ErrorAction SilentlyContinue
          }
        }
        $voice = [ordered]@{ context = $ctx; src = $ctxSrc; slot = $slot; citizens = $citizens }
      }
    }
  }
} catch { $voice = $null }   # cognition not ready => voice card hides, snapshot still ships

# ---------- assemble + base64 payload ----------
$data = [ordered]@{
  generated_ts   = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
  state          = '__STATE_RAW__'
  events         = $events
  commits_24h    = $commits
  tick_tail      = $tick
  images         = $imgList
  milestones     = $milestones
  population     = $population
  welcome        = $welcome
  voice          = $voice
}
$stateObj = $null
try { $stateObj = $stateJson | ConvertFrom-Json } catch {}
$json = $data | ConvertTo-Json -Depth 6 -Compress
if ($stateObj) { $json = $json.Replace('"__STATE_RAW__"', $stateJson) } else { $json = $json.Replace('"__STATE_RAW__"', 'null') }
$b64 = [Convert]::ToBase64String($utf8.GetBytes($json))

# ---------- inject into template ----------
$templateFile = Join-Path $PSScriptRoot 'template.html'
$html = Get-Content $templateFile -Raw -Encoding UTF8
if ($html -notmatch '__CITY_WATCH_B64__') { Write-Output 'CityWatch FAIL: template placeholder missing'; exit 1 }
$html = $html.Replace('__CITY_WATCH_B64__', $b64)
$outFile = Join-Path $outDir 'city-watch.html'
[System.IO.File]::WriteAllText($outFile, $html, $utf8)

Write-Output ('CityWatch snapshot ready (read-only): ' + $outFile)
if ($Open) { Start-Process $outFile }
