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
    if (Test-Path $rotFile) { $r = [string](Get-Content $rotFile -Raw); try { $rot = [int]$r } catch {} }
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

# ---------- assemble + base64 payload ----------
$data = [ordered]@{
  generated_ts   = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
  state          = '__STATE_RAW__'
  events         = $events
  commits_24h    = $commits
  tick_tail      = $tick
  images         = $imgList
  milestones     = $milestones
  welcome        = $welcome
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
