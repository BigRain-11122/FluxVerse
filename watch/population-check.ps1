# population-check.ps1 - assertion gate for the CityWatch population panel (P-22)
# Verifies the artifact end to end: builds a fresh snapshot via city-watch.ps1,
# decodes the embedded payload and asserts the population section against an
# independent recount of the BigLife census source. ASCII-only body (encoding
# law). Chinese values (names, creeds, gender labels) flow from data, never
# asserted by literal here. Exit 0 = all green, 1 = any fail.
# Usage: powershell -File watch\population-check.ps1

$ErrorActionPreference = 'Stop'
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$group    = Resolve-Path (Join-Path $PSScriptRoot '..\..\..')
$checks   = New-Object System.Collections.ArrayList
$fail     = 0
function Assert([string]$name, [bool]$cond) {
  if ($cond) { [void]$checks.Add('PASS ' + $name) } else { [void]$checks.Add('FAIL ' + $name); $script:fail = 1 }
}

# 1. template wired
$tpl = [string](Get-Content (Join-Path $PSScriptRoot 'template.html') -Raw -Encoding UTF8)
Assert 'template has pop panel div'      ($tpl -match 'id="pop"')
Assert 'template has faces panel div'    ($tpl -match 'id="faces"')
Assert 'template renders DATA.population' ($tpl -match 'DATA\.population')

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
Assert 'payload has population'  ($null -ne $DATA -and $null -ne $DATA.population)
if ($null -ne $DATA -and $null -ne $DATA.population) {
  $P = $DATA.population

  # 4. independent recount of the census source (no shared code with generator)
  $censusFile = Join-Path $group 'life\BigLife\census\export\citizens-light.jsonl'
  Assert 'census source exists' (Test-Path $censusFile)
  $srcTotal = 0
  if (Test-Path $censusFile) {
    $srcTotal = @((Get-Content $censusFile -Encoding UTF8 | ForEach-Object { [string]$_ } | Where-Object { $_.Trim() })).Count
  }
  Assert ('total matches source line count (' + $srcTotal + ')') ($P.total -eq $srcTotal)

  # 5. four split axes each fully partition the population
  $sum = { param($obj) $s = 0; foreach ($p in $obj.PSObject.Properties) { $s += [int]$p.Value }; $s }
  Assert 'by_district sums to total' ((& $sum $P.by_district) -eq $P.total)
  Assert 'by_species sums to total'  ((& $sum $P.by_species)  -eq $P.total)
  Assert 'by_gender sums to total'   ((& $sum $P.by_gender)   -eq $P.total)
  Assert 'by_faction sums to total'  ((& $sum $P.by_faction) -eq $P.total)

  # 6. known canon shape (CODEX sec.2/sec.3: 3 species, 6 districts).
  #    P-58 honor seats (CEO family cards) sit outside all districts: the
  #    generator buckets their empty district under a labeled honor-seat key,
  #    so the payload must carry 6 canon keys + (when honor cards exist) exactly
  #    one labeled bucket - and never an empty-string key (PS5.1 parse crash face).
  $honorSeat = [string][char]0x8363 + [string][char]0x8A89 + [string][char]0x5E2D
  $dProps = @($P.by_district.PSObject.Properties)
  $hasHonor = @($dProps | Where-Object { $_.Name -eq $honorSeat }).Count -gt 0
  Assert 'no empty-string district key' (@($dProps | Where-Object { $_.Name -eq '' }).Count -eq 0)
  Assert 'district count == 6 (+1 when honor seats present)' ($dProps.Count -eq (6 + [int]$hasHonor))
  Assert 'species count == 3'  (@($P.by_species.PSObject.Properties).Count -eq 3)
  foreach ($d in @('NS','GM','QT','MD','RV','OR')) { Assert ('district key ' + $d) ($null -ne $P.by_district.$d) }
  foreach ($s in @('carbon','silicon','sprite'))  { Assert ('species key ' + $s)  ($null -ne $P.by_species.$s) }
  Assert 'gender key count == 3' (@($P.by_gender.PSObject.Properties).Count -eq 3)

  # 7. showcase + anchor layer
  Assert 'anchors >= 1' ([int]$P.anchors -ge 1)
  $sc = @($P.showcase)
  Assert 'showcase 1..4 cards' ($sc.Count -ge 1 -and $sc.Count -le 4)
  $okCards = 0
  foreach ($c in $sc) {
    $isHonor = ([string]$c.block).Contains($honorSeat)
    if ($c.name -and $c.profession -and (($c.creed -and $c.district) -or $isHonor)) { $okCards++ }
  }
  Assert ('showcase cards complete (' + $okCards + '/' + $sc.Count + ')') ($okCards -eq $sc.Count)
  $resCards = 0
  $resDir = Join-Path $repoRoot 'docs\residents'
  if (Test-Path $resDir) { $resCards = @(Get-ChildItem $resDir -Filter *.md -ErrorAction SilentlyContinue).Count }
  Assert ('anchor_layer matches docs/residents (' + $resCards + ')') ([int]$P.anchor_layer -eq $resCards)

  # 8. honest-layer labels visible in the shipped html (data-side Chinese, checked via payload ids)
  Assert 'html embeds faces card' ($html -match 'id="faces"')
  Assert 'html embeds pop card'  ($html -match 'id="pop"')
}

foreach ($c in $checks) { Write-Output $c }
Write-Output ('RESULT: ' + $(if ($fail -eq 0) { 'ALL GREEN (' + $checks.Count + ' checks)' } else { 'FAILED' }))
exit $fail
