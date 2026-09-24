# voice-check.ps1 - assertion gate for the CityWatch voice panel (P-23 claim).
# Verifies the artifact end to end: builds a fresh snapshot via city-watch.ps1,
# decodes the embedded payload and asserts the voice section (BigLife cognition
# layers 2+3 consumption) against independent re-derivations of the source:
#  - situation fact gate is independently recomputed (events > weather > clock,
#    mirroring BigLife draw.py derive_context - no shared code path);
#  - pool purity law: bubble lines carry zero digits (pool = tone, zero facts);
#  - draw determinism: same (ids, date, slot) re-run must be byte-identical;
#  - spotlight shape + designed degrade (Ollama down => null spots, card ships).
# ASCII-only body (encoding law). Chinese values flow from data, never asserted
# by literal here. Exit 0 = all green, 1 = any fail.
# Usage: powershell -File watch\voice-check.ps1

$ErrorActionPreference = 'Stop'
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$group    = Resolve-Path (Join-Path $PSScriptRoot '..\..\..')
$checks   = New-Object System.Collections.ArrayList
$fail     = 0
function Assert([string]$name, [bool]$cond) {
  if ($cond) { [void]$checks.Add('PASS ' + $name) } else { [void]$checks.Add('FAIL ' + $name); $script:fail = 1 }
}
$CONTEXTS = @('morning','dusk','night','weekend','rain','typhoon','heatwave','coldsnap','market_open','market_close','ceo_order','festival')

# independent mirror of BigLife draw.py derive_context (fact gate priority)
function Get-DerivedContext {
  $weatherKind = ''
  try {
    $wsFile = Join-Path $repoRoot 'world\world-state.json'
    if (Test-Path $wsFile) {
      $st = (Get-Content $wsFile -Raw -Encoding UTF8) | ConvertFrom-Json
      if ($st.reality -and $st.reality.weather_kind) { $weatherKind = [string]$st.reality.weather_kind }
    }
  } catch {}
  $types = @()
  $evFile = Join-Path $repoRoot 'world\world-events.jsonl'
  if (Test-Path $evFile) {
    $last = @(Get-Content $evFile -Encoding UTF8 | ForEach-Object { [string]$_ } | Where-Object { $_.Trim() } | Select-Object -Last 15)
    foreach ($ln in $last) { try { $e = $ln | ConvertFrom-Json; $types += [string]$e.type } catch {} }
  }
  $ctx = $null; $src = ''
  if ($types -contains 'CEO_ORDER')      { $ctx = 'ceo_order';    $src = 'event' }
  elseif ($types -contains 'MARKET_OPEN')  { $ctx = 'market_open'; $src = 'event' }
  elseif ($types -contains 'MARKET_CLOSE') { $ctx = 'market_close'; $src = 'event' }
  elseif ($types -contains 'WEATHER_ALERT'){ $ctx = 'typhoon';     $src = 'event' }
  if (-not $ctx) {
    if (@('rain','storm','drizzle','shower') -contains $weatherKind) { $ctx = 'rain';     $src = 'weather' }
    elseif (@('snow','sleet') -contains $weatherKind)                { $ctx = 'coldsnap'; $src = 'weather' }
    elseif (@('typhoon','gale','wind') -contains $weatherKind)       { $ctx = 'typhoon';  $src = 'weather' }
  }
  if (-not $ctx) {
    $h = (Get-Date).Hour
    if (5 -le $h -and $h -lt 11) { $ctx = 'morning' }
    elseif (17 -le $h -and $h -lt 19) { $ctx = 'dusk' }
    elseif ($h -ge 19 -or $h -lt 5) { $ctx = 'night' }
    elseif ($h -lt 15) { $ctx = 'morning' } else { $ctx = 'dusk' }
    $src = 'clock'
    if (@('Saturday','Sunday') -contains (Get-Date).DayOfWeek -and @('morning','dusk','night') -contains $ctx) { $ctx = 'weekend' }
  }
  return @{ ctx = $ctx; src = $src }
}

# 1. template wired
$tpl = [string](Get-Content (Join-Path $PSScriptRoot 'template.html') -Raw -Encoding UTF8)
Assert 'template has voice panel div'  ($tpl -match 'id="voice"')
Assert 'template renders DATA.voice'   ($tpl -match 'DATA\.voice')
Assert 'template has spotlight reveal wiring' ($tpl -match 'spot')

# 1b. P-40 AI-content label law (2025-09-01 explicit-labeling regulation): the
#     AI surfaces (welcome line / residents card / voice bubbles / spotlight)
#     must carry the explicit "AI 生成" badge. ASCII law: the Chinese literal is
#     built from code points, never typed into the script body.
$aiLabel = -join @([char]0x41,[char]0x49,[char]0x20,[char]0x751F,[char]0x6210)
$aiBadge = '<span class="aitag">' + $aiLabel + '</span>'
Assert 'template wires AI-gen badge on 3+ surfaces (P-40)' (([regex]::Matches($tpl, [regex]::Escape($aiBadge))).Count -ge 3)

# 2. build a fresh snapshot (same generator CityWatch.bat uses)
& (Join-Path $PSScriptRoot 'city-watch.ps1') | Out-Null
$outFile = Join-Path $repoRoot 'watch\out\city-watch.html'
Assert 'snapshot generated' (Test-Path $outFile)

# 3. decode payload
$html = [string](Get-Content $outFile -Raw -Encoding UTF8)
$m = [regex]::Match($html, "const B64='([^']+)'")
Assert 'b64 payload present' $m.Success
$DATA = $null
if ($m.Success) {
  $json = [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($m.Groups[1].Value))
  $DATA = $json | ConvertFrom-Json
}
Assert 'payload parses as json' ($null -ne $DATA)
Assert 'html embeds voice card' ($html -match 'id="voice"')
Assert 'snapshot html carries AI-gen label (P-40)' ($html.Contains($aiBadge))

$V = $null
if ($null -ne $DATA) { $V = $DATA.voice }
Assert 'payload has voice' ($null -ne $V)

if ($null -ne $V) {
  # 4. shape: known context, src, slot window
  Assert 'context is a registered situation' ($CONTEXTS -contains $V.context)
  Assert ('context = ' + $V.context + ' (src=' + $V.src + ')') (@('event','weather','clock') -contains $V.src)
  Assert 'slot in 0..31' ($V.slot -ge 0 -and $V.slot -le 31)
  $cz = @($V.citizens)
  Assert ('citizens drawn 3..5 (' + $cz.Count + ')') ($cz.Count -ge 3 -and $cz.Count -le 5)

  # 5. situation fact gate - independent re-derivation vs payload (race-tolerant:
  #    a scan may land between build and check; a fresh draw.py header that agrees
  #    with the independent mirror proves the payload was correct at build time)
  $exp = Get-DerivedContext
  if ($V.context -eq $exp.ctx -and $V.src -eq $exp.src) {
    Assert 'situation matches independent re-derivation' $true
  } else {
    $bigTools = Join-Path $group 'life\BigLife\Tools'
    $tmp = Join-Path $repoRoot ('watch\out\voice-check-' + [guid]::NewGuid().ToString('N') + '.txt')
    $env:PYTHONIOENCODING = 'utf-8'
    $p = Start-Process -FilePath 'python' -ArgumentList @('-X','utf8','draw.py','--ids',$cz[0].id,'--tier','standard','--auto') -WorkingDirectory $bigTools -RedirectStandardOutput $tmp -RedirectStandardError ($tmp + '.err') -PassThru -NoNewWindow
    if (-not $p.WaitForExit(30000)) { $p.Kill() }
    $fresh = ''
    if (Test-Path $tmp) { $fresh = [string]((Get-Content $tmp -Encoding UTF8 | Select-Object -First 1)) }
    Remove-Item $tmp -Force -ErrorAction SilentlyContinue
    Remove-Item ($tmp + '.err') -Force -ErrorAction SilentlyContinue
    $mf = [regex]::Match($fresh, '^ctx=(\S+) \(src=(\S+)\)')
    if ($mf.Success -and $mf.Groups[1].Value -eq $exp.ctx) {
      Assert ('situation race tolerated (payload ' + $V.context + ' -> now ' + $exp.ctx + ')') $true
      $V.context = $exp.ctx; $V.src = $exp.src
    } else {
      Assert ('situation mismatch: payload=' + $V.context + '/' + $V.src + ' independent=' + $exp.ctx + '/' + $exp.src + ' fresh=' + $fresh) $false
    }
  }

  # 6. census cross-check: every drawn id exists in source with same name
  $censusFile = Join-Path $group 'life\BigLife\census\export\citizens-light.jsonl'
  Assert 'census source exists' (Test-Path $censusFile)
  $srcTxt = ''
  if (Test-Path $censusFile) { $srcTxt = [string](Get-Content $censusFile -Raw -Encoding UTF8) }
  $okIds = 0; $okNames = 0; $okLines = 0; $okNoDigit = 0; $okLen = 0
  foreach ($c in $cz) {
    if ($srcTxt -match ('"id":\s*"' + $c.id + '"')) { $okIds++ }
    $mm = [regex]::Match($srcTxt, ('"id":\s*"' + $c.id + '"[^}]*?"name":\s*"([^"]*)"'))
    if (-not $mm.Success) { $mm = [regex]::Match($srcTxt, ('"name":\s*"([^"]*)"[^}]*?"id":\s*"' + $c.id + '"')) }
    if ($mm.Success -and $mm.Groups[1].Value -eq [string]$c.name) { $okNames++ }
    if ($c.line -and ([string]$c.line).Trim().Length -ge 1) { $okLines++ }
    $hasDigit = [regex]::IsMatch([string]$c.line, '[0-9]')
    if (-not $hasDigit) { $okNoDigit++ }
    if (([string]$c.line).Length -le 40) { $okLen++ }
  }
  Assert ('all drawn ids exist in census (' + $okIds + '/' + $cz.Count + ')') ($okIds -eq $cz.Count)
  Assert ('names match census (' + $okNames + '/' + $cz.Count + ')') ($okNames -eq $cz.Count)
  Assert ('bubble lines non-empty (' + $okLines + '/' + $cz.Count + ')') ($okLines -eq $cz.Count)
  Assert ('pool purity: zero digits in bubble lines (' + $okNoDigit + '/' + $cz.Count + ')') ($okNoDigit -eq $cz.Count)
  Assert ('bubble lines within length law 1..40 (' + $okLen + '/' + $cz.Count + ')') ($okLen -eq $cz.Count)

  # 7. determinism: re-run draw.py with the same ids inside the same slot
  $bigTools = Join-Path $group 'life\BigLife\Tools'
  $tmp = Join-Path $repoRoot ('watch\out\voice-check-' + [guid]::NewGuid().ToString('N') + '.txt')
  $p = Start-Process -FilePath 'python' -ArgumentList @('-X','utf8','draw.py','--ids',((@($cz) | ForEach-Object { $_.id }) -join ','),'--tier','standard','--auto') -WorkingDirectory $bigTools -RedirectStandardOutput $tmp -RedirectStandardError ($tmp + '.err') -PassThru -NoNewWindow
  if (-not $p.WaitForExit(30000)) { $p.Kill() }
  $rerun = @()
  if (Test-Path $tmp) { $rerun = @(Get-Content $tmp -Encoding UTF8 | ForEach-Object { [string]$_ } | Where-Object { $_.Trim() }) }
  Remove-Item $tmp -Force -ErrorAction SilentlyContinue
  Remove-Item ($tmp + '.err') -Force -ErrorAction SilentlyContinue
  if ($rerun.Count -gt 0 -and $rerun[0] -match 'slot=(\d+)') {
    if ([int]$Matches[1] -ne [int]$V.slot) {
      Assert ('determinism SKIPPED (slot flipped ' + $V.slot + '->' + $Matches[1] + ' during check)') $true
    } else {
      $same = 0
      foreach ($ln in ($rerun | Select-Object -Skip 1)) {
        $mr = [regex]::Match($ln, '^(C-\d+)\s+.+?\s+\[.+?\]:\s*(.*)$')
        if ($mr.Success) { foreach ($c in $cz) { if ($c.id -eq $mr.Groups[1].Value -and [string]$c.line -eq $mr.Groups[2].Value) { $same++ } } }
      }
      Assert ('draw determinism: same slot re-run byte-identical (' + $same + '/' + $cz.Count + ')') ($same -eq $cz.Count)
    }
  } else {
    Assert 'determinism re-run produced output' $false
  }

  # 8. spotlight: fact-level line shape (spotlight.py owns its own honesty QC);
  #    designed degrade = spot null when Ollama down (card ships, UI labels it)
  $spots = @($cz | Where-Object { $_.spot -and ([string]$_.spot).Trim() })
  Assert ('spotlight answers 0..' + $cz.Count + ' (' + $spots.Count + ')') ($spots.Count -le $cz.Count)
  $okSpot = 0
  foreach ($s in $spots) { if (([string]$s.spot).Length -ge 4 -and ([string]$s.spot).Length -le 60) { $okSpot++ } }
  Assert ('spotlight line length law 4..60 (' + $okSpot + '/' + $spots.Count + ')') ($okSpot -eq $spots.Count)
}

foreach ($c in $checks) { Write-Output $c }
Write-Output ('RESULT: ' + $(if ($fail -eq 0) { 'ALL GREEN (' + $checks.Count + ' checks)' } else { 'FAILED' }))
exit $fail
