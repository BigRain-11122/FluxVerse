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
    function Get-FieldCounts([string]$text, [string]$field) {
      $h = @{}
      foreach ($m in [regex]::Matches($text, ('"' + $field + '":\s*"([^"]*)"'))) {
        $k = $m.Groups[1].Value; $h[$k] = 1 + [int]$h[$k]
      }
      return $h
    }
    $byDistrict = Get-FieldCounts $craw 'district'
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
        $showcase += @{ id = $a.id; name = $a.name; age = $a.age; profession = $a.profession; district = $a.district; block = $a.block; creed = $a.creed }
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

# ---------- welcome line: a resident greets the CEO on every open (local LLM) ----------
# CEO order 2026-09-23 (open-world NPC AI): the city greets its master on arrival.
# The fact "the CEO just opened CityWatch" IS a real event - honest to use.
# Rotates the greeter via watch\out\welcome-rotate.txt (gitignored area only).
$welcome = $null
try {
  $cardsDir = Join-Path $repoRoot 'docs\residents'
  $welcomePromptFile = Join-Path $PSScriptRoot 'welcome-prompt.txt'
  if ((Test-Path $cardsDir) -and (Test-Path $welcomePromptFile) -and $events.Count -gt 0) {
    $cards = @(Get-ChildItem $cardsDir -Filter *.md | Sort-Object Name)
    $rotFile = Join-Path $outDir 'welcome-rotate.txt'
    $rot = 0
    if (Test-Path $rotFile) { $r = [string](Get-Content $rotFile -Raw -Encoding UTF8); try { $rot = [int]$r } catch {} }
    $chosen = $cards[$rot % $cards.Count]
    [System.IO.File]::WriteAllText($rotFile, [string](($rot + 1) % 1000), (New-Object System.Text.UTF8Encoding($false)))

    $facts = @()
    foreach ($ln in ($events | Select-Object -Last 6)) {
      try { $e = $ln | ConvertFrom-Json; $facts += ('- [' + [string]$e.type + '] ' + [string]$e.summary) } catch {}
    }
    $card = [string](Get-Content $chosen.FullName -Raw -Encoding UTF8)
    $tmpl = [string](Get-Content $welcomePromptFile -Raw -Encoding UTF8)
    $wprompt = $tmpl.Replace('__CARD__', $card).Replace('__EVENTS__', ($facts -join "`n")).Replace('__NOW__', (Get-Date).ToString('HH:mm'))
    $wbody = @{ model = 'qwen2.5:7b-instruct'; prompt = $wprompt; stream = $false; options = @{ num_predict = 40; temperature = 0.75 } } | ConvertTo-Json -Depth 4
    $wresp = Invoke-RestMethod -Uri 'http://127.0.0.1:11434/api/generate' -Method Post -Body ([System.Text.Encoding]::UTF8.GetBytes($wbody)) -ContentType 'application/json; charset=utf-8' -TimeoutSec 20
    $wline = ([string]$wresp.response).Trim() -replace "`r`n", ' ' -replace "`n", ' '
    if ($wline.Length -gt 60) { $wline = $wline.Substring(0, 60) }
    if ($wline) { $welcome = @{ id = $chosen.BaseName; line = $wline } }
  }
} catch { $welcome = $null }   # Ollama down => no greeting, snapshot still ships

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
      if ($mi.Success -and $md.Success -and $mp.Success) { $picks += @{ id = $mi.Groups[1].Value; district = $md.Groups[1].Value; profession = $mp.Groups[1].Value } }
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
