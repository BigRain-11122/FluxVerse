# test-archive-logs.ps1 - sandbox for archive-logs.ps1 (scripts stay ASCII-only).
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression | Out-Null
Add-Type -AssemblyName System.IO.Compression.FileSystem | Out-Null
$fails = 0
$total = 0

function Assert {
  param([bool]$Cond, [string]$Name)
  $script:total++
  if ($Cond) { Write-Host ("  PASS {0}" -f $Name) } else { Write-Host ("  FAIL {0}" -f $Name); $script:fails++ }
}

$tool = Join-Path $PSScriptRoot 'archive-logs.ps1'
if (-not (Test-Path -LiteralPath $tool)) { Write-Host 'SANDBOX FAIL: tool missing'; exit 2 }

$tmp = Join-Path $env:TEMP ("fv-archive-sandbox-{0}" -f ([guid]::NewGuid().ToString('N').Substring(0, 8)))
$logs = Join-Path $tmp 'logs'
New-Item -ItemType Directory -Path (Join-Path $logs 'devloop') -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $logs 'deep\nested') -Force | Out-Null

$oldStamp = (Get-Date).AddDays(-40)
$files = [ordered]@{
  'tick-20260101.log'          = ('x' * 200)
  'devloop\run_old.log'        = ('y' * 400)
  'deep\nested\round_old.err'  = ('z' * 100)
  'fresh.log'                  = ('f' * 50)
  'devloop-r999-keep.ps1'      = ('# keep' + ('k' * 30))
  'tick.lock'                  = 'lock'
}
foreach ($k in $files.Keys) {
  $p = Join-Path $logs $k
  Set-Content -LiteralPath $p -Value $files[$k] -Encoding ASCII -NoNewline
  if ($k -ne 'fresh.log' -and $k -ne 'tick.lock') { (Get-Item -LiteralPath $p).LastWriteTime = $oldStamp }
}
# fresh file must stay fresh
(Get-Item -LiteralPath (Join-Path $logs 'fresh.log')).LastWriteTime = (Get-Date)

Write-Host 'CASE 1: dry run does not touch disk'
$dry = & powershell -NoProfile -ExecutionPolicy Bypass -File $tool -LogsDir $logs -Days 14 -DryRun 2>&1 | Out-String
Assert ($dry -match 'ARCHIVE CANDIDATES: 3 files') 'dry: 3 candidates'
Assert ($dry -match 'ARCHIVE VERDICT: DRYRUN') 'dry: verdict DRYRUN'
Assert (Test-Path -LiteralPath (Join-Path $logs 'tick-20260101.log')) 'dry: old file still present'
Assert (-not (Test-Path -LiteralPath (Join-Path $logs '_archive'))) 'dry: no archive dir'

Write-Host 'CASE 2: real run archives old, keeps fresh/protected'
$run = & powershell -NoProfile -ExecutionPolicy Bypass -File $tool -LogsDir $logs -Days 14 2>&1 | Out-String
Assert ($run -match 'ARCHIVE FILES: 3') 'run: 3 files archived'
Assert ($run -match 'ARCHIVE VERDICT: OK') 'run: verdict OK'
Assert ($run -match 'ARCHIVE REMAIN_ARCHIVABLE: 0') 'run: nothing archivable left'
Assert ($run -match 'ARCHIVE REMAIN_OLD: 1') 'run: only protected old file remains'
Assert (-not (Test-Path -LiteralPath (Join-Path $logs 'tick-20260101.log'))) 'run: old tick removed'
Assert (-not (Test-Path -LiteralPath (Join-Path $logs 'devloop\run_old.log'))) 'run: old run log removed'
Assert (Test-Path -LiteralPath (Join-Path $logs 'fresh.log')) 'run: fresh kept'
Assert (Test-Path -LiteralPath (Join-Path $logs 'devloop-r999-keep.ps1')) 'run: code ext kept'
Assert (Test-Path -LiteralPath (Join-Path $logs 'tick.lock')) 'run: lock kept'
Assert (-not (Test-Path -LiteralPath (Join-Path $logs 'deep'))) 'run: emptied dir pruned'

$zips = @(Get-ChildItem -LiteralPath (Join-Path $logs '_archive') -Filter '*.zip')
Assert ($zips.Count -eq 1) 'run: one zip'
$zipPath = $zips[0].FullName
$zip = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
try {
  $names = @($zip.Entries | ForEach-Object { $_.FullName })
  $sizes = @{}
  foreach ($e in $zip.Entries) { $sizes[$e.FullName] = $e.Length }
} finally { $zip.Dispose() }
Assert ($names -contains 'tick-20260101.log') 'zip: tick entry'
Assert ($names -contains 'devloop/run_old.log') 'zip: nested entry with forward slashes'
Assert ($names -contains 'deep/nested/round_old.err') 'zip: deep entry'
Assert ($sizes['tick-20260101.log'] -eq 200) 'zip: tick entry length 200'
Assert ($sizes['devloop/run_old.log'] -eq 400) 'zip: run entry length 400'
Assert ($sizes['deep/nested/round_old.err'] -eq 100) 'zip: deep entry length 100'
Assert (@($names | Where-Object { $_ -like '*fresh.log' }).Count -eq 0) 'zip: fresh not archived'

$man = @(Get-ChildItem -LiteralPath (Join-Path $logs '_archive') -Filter 'manifest-*.json')
Assert ($man.Count -eq 1) 'run: manifest written'
$mj = Get-Content -LiteralPath $man[0].FullName -Raw | ConvertFrom-Json
Assert (@($mj.files).Count -eq 3) 'manifest: 3 file rows'
Assert (@($mj.zips).Count -eq 1) 'manifest: 1 zip row'

Write-Host 'CASE 3: second run is a no-op'
$again = & powershell -NoProfile -ExecutionPolicy Bypass -File $tool -LogsDir $logs -Days 14 2>&1 | Out-String
Assert ($again -match 'nothing to do') 'rerun: nothing to do'
Assert (@(Get-ChildItem -LiteralPath (Join-Path $logs '_archive') -Filter '*.zip').Count -eq 1) 'rerun: still one zip'

Write-Host 'CASE 4: missing dir fails loud'
$bad = & powershell -NoProfile -ExecutionPolicy Bypass -File $tool -LogsDir (Join-Path $tmp 'nope') -Days 14 2>&1 | Out-String
$badCode = $LASTEXITCODE
Assert ($bad -match 'ARCHIVE FAIL') 'missing dir: FAIL line'
Assert ($badCode -eq 2) 'missing dir: exit 2'

Remove-Item -LiteralPath $tmp -Recurse -Force

Write-Host ("ARCHIVE SANDBOX: {0}/{1}" -f ($total - $fails), $total)
if ($fails -gt 0) { Write-Host 'SANDBOX VERDICT: FAIL'; exit 2 }
Write-Host 'SANDBOX VERDICT: PASS'
exit 0