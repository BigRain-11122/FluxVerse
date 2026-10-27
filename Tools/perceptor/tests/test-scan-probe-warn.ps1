# test-scan-probe-warn.ps1 - silent-zero-read self-check (main#22, r685)
# Acceptance: a probe whose data file exists but matches 0 rows must make scan
# print "WARN zero-read", not "OK"; a healthy table must stay "OK"; and the
# scan must still complete (fail-soft: health stays the verify gate).
# Method: sandbox copy of Tools\perceptor under <tmp>\gaming\FluxVerse so the
# legacy group-root hop lands inside <tmp>; stub docs\orders.md fixtures.
# ASCII-only (repo law). Exit 0 = all assertions pass.

$ErrorActionPreference = 'Stop'
$fail = 0
function Assert([string]$name, [bool]$ok, [string]$detail) {
  if ($ok) { Write-Output ('PASS ' + $name + ' ' + $detail) }
  else { Write-Output ('FAIL ' + $name + ' ' + $detail); $script:fail++ }
}

$src = Join-Path (Split-Path -Parent (Split-Path -Parent $PSScriptRoot)) 'perceptor'   # Tools\perceptor
$srcRoot = (Split-Path -Parent (Split-Path -Parent $src))                              # repo root
$sand = Join-Path $env:TEMP ('fv-r685-' + [guid]::NewGuid().ToString('N').Substring(0, 8))
$repo = Join-Path $sand 'gaming\FluxVerse'
New-Item -ItemType Directory -Path (Join-Path $repo 'Tools') -Force | Out-Null
Copy-Item -LiteralPath $src -Destination (Join-Path $repo 'Tools\perceptor') -Recurse -Force
New-Item -ItemType Directory -Path (Join-Path $repo 'schema') -Force | Out-Null
Copy-Item -LiteralPath (Join-Path $srcRoot 'schema\events-registry.json') -Destination (Join-Path $repo 'schema\events-registry.json') -Force
New-Item -ItemType Directory -Path (Join-Path $repo 'world') -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $sand 'docs') -Force | Out-Null
$orders = Join-Path $sand 'docs\orders.md'
$scan = Join-Path $repo 'Tools\perceptor\scan.ps1'

function Run-Scan {
  $out = & powershell -NoProfile -ExecutionPolicy Bypass -File $scan 2>&1
  return ($out -join "`n")
}

# --- fixture 1: third-format table (exists, but no row the probe can match) ---
$stub1 = @(
  '# orders (fixture: a future table shape)',
  '',
  '| time | order | owner | status |',
  '| --- | --- | --- | --- |',
  '| 2026/10/28 05:10 | do the thing | @FluxVerse | executing |',
  '| 2026/10/28 05:20 | do another | @FluxVerse | executing |'
) -join "`n"
[System.IO.File]::WriteAllText($orders, $stub1 + "`n", (New-Object System.Text.UTF8Encoding($false)))
$o1 = Run-Scan
Assert 'zero-read-warns' ($o1 -match 'probe orders_hq: WARN zero-read matched=0 < expect_min_rows=20') 'scan prints WARN with the actual count and the floor'
Assert 'zero-read-not-ok' (-not ($o1 -match 'probe orders_hq: OK')) 'the zero-read probe is no longer reported as OK'
Assert 'warn-summary' ($o1 -match 'perceptor WARN: [0-9]+ probe\(s\) zero-read/degraded -> .*orders_hq=') 'a single summary line names the degraded probes'
Assert 'scan-completes' ($o1 -match 'perceptor v0\.7 done: events \+[0-9]+ quarantined=[0-9]+') 'scan still reaches its final line (fail-soft kept)'
Assert 'no-fail-word' (-not ($o1 -match '(gate|probe).*FAIL')) 'no FAIL marker introduced (fastpath c1 red-scan untouched)'

# --- fixture 2: healthy table (both supported row shapes) -> OK ---
$rows = @('# orders', '', '| 10-27 ~08:0x | legacy row | @FluxVerse | done |')
for ($i = 1; $i -le 22; $i++) {
  $rows += ('| 2026-10-27 0' + ($i % 10) + ':1' + ($i % 10) + ' | row ' + $i + ' | @FluxVerse | done |')
}
[System.IO.File]::WriteAllText($orders, (($rows -join "`n") + "`n"), (New-Object System.Text.UTF8Encoding($false)))
$o2 = Run-Scan
Assert 'healthy-ok' ($o2 -match 'probe orders_hq: OK') 'matched=23 >= floor stays OK'
Assert 'healthy-no-hq-warn' (-not ($o2 -match 'orders_hq=zero-read')) 'healthy run does not name orders_hq in the WARN summary'

# --- fixture 3: missing data file -> probe returns empty state -> WARN ---
Remove-Item -LiteralPath $orders -Force
$o3 = Run-Scan
Assert 'missing-file-warns' ($o3 -match 'probe orders_hq: WARN empty-state') 'missing ledger surfaces as WARN, not OK'

Remove-Item -LiteralPath $sand -Recurse -Force -ErrorAction SilentlyContinue
if ($fail -eq 0) { Write-Output 'ALL PASS'; exit 0 }
Write-Output ('FAILED ' + $fail); exit 1