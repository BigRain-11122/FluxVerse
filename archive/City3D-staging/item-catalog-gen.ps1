# Regenerates polygon48-item-catalog.tsv from the 48-pack master tree (P3D_Spike zhongtai).
# ASCII-only script body (encoding law: no Chinese in PS script source).
# Output: pipe tsv  ad|semantic_path  -- semantic_path = path inside the pack kernel root
# (PolygonXXX/...), so pack dir names stay out of the data; file name included.
# Law: lowpoly3d-asset-law.md (CEO order 2026-09-29: maximize library use, no duplicate work).
# Re-run whenever new packs enter the library (CEO fills library = sole supply channel).
param(
  [string]$Root = "gaming\MiniGame\projects\P3D_Spike\Assets\lowpoly",
  [string]$Out  = "gaming\FluxVerse\City3D-staging\polygon48-item-catalog.tsv"
)
$ErrorActionPreference = 'Stop'
$rootAbs = (Resolve-Path -LiteralPath $Root).Path
$outAbs  = Join-Path (Get-Location).Path $Out
$rows = New-Object System.Collections.Generic.List[string]
$files = Get-ChildItem -LiteralPath $rootAbs -Recurse -Filter *.prefab
foreach ($f in $files) {
  $parts = $f.FullName -split '[\\/]+'
  $ad = $null; $i = 0
  for (; $i -lt $parts.Count; $i++) {
    if ($parts[$i] -match '^(AD-\d{3})') { $ad = $Matches[1]; break }
  }
  if (-not $ad) { continue }
  if ($i + 2 -gt $parts.Count - 1) { continue }  # file directly under pack dir: skip kernel-less
  $sem = ($parts[($i+2)..($parts.Count-1)] -join '/')
  $rows.Add("$ad|$sem")
}
$hdr = @(
'# POLYGON 48-pack item catalog (machine-generated from P3D_Spike master tree)',
'# regen: powershell -File item-catalog-gen.ps1   format: ad|semantic_path  (semantic path inside pack kernel root, incl. file)',
'# CEO order 2026-09-29: maximize library utilization / no duplicate work. Lookup first, browse editor later.'
)
$text = ($hdr + ($rows | Sort-Object)) -join "`n"
[System.IO.File]::WriteAllText($outAbs, $text + "`n", (New-Object System.Text.UTF8Encoding($false)))
Write-Output ("rows=" + $rows.Count + " out=" + $outAbs)
