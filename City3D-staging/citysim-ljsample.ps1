# 陆家嘴样板批 runner（CEO 令 O-2026-0930-012·坑律执法同 citysim-city.ps1）
$ErrorActionPreference = 'Stop'
$exe = 'C:\Program Files\Tuanjie\Hub\Editor\2022.3.62t15\Editor\Tuanjie.exe'
$proj = 'C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse\City3D'
$stg = 'C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse\City3D-staging'
$log = Join-Path $stg 'citysim-ljsample.log'
$done = Join-Path $stg 'citysim-ljsample.done'
Remove-Item $done, $log -ErrorAction SilentlyContinue

$targets = Get-CimInstance Win32_Process -Filter "Name='Tuanjie.exe'" | Where-Object { $_.CommandLine -like '*FluxVerse\City3D*' -and $_.CommandLine -notlike '*batchmode*' }
if ($targets) {
  foreach ($tg in $targets) {
    $procId = [int]$tg.ProcessId
    Write-Output ("CLOSING_GUI_" + $procId)
    taskkill /PID $procId 2>$null | Out-Null
    $t = 0
    while ((Get-Process -Id $procId -ErrorAction SilentlyContinue) -and ($t -lt 30)) { Start-Sleep -Seconds 1; $t++ }
    if (Get-Process -Id $procId -ErrorAction SilentlyContinue) { taskkill /F /PID $procId 2>$null | Out-Null; Start-Sleep -Seconds 3 }
  }
  Write-Output 'GUI_CLOSED'
} else { Write-Output 'GUI_ALREADY_CLOSED' }

$proc = Start-Process -FilePath $exe -ArgumentList '-batchmode','-quit','-projectpath',$proj,'-executeMethod','CitySim.CitySimTowerSample.RunAll','-logFile',$log -PassThru
if (-not $proc.WaitForExit(600000)) { $proc.Kill(); Write-Output 'LJS_TIMEOUT_10MIN' }
$ok = (Test-Path $done) -and (Select-String -Path $done -Pattern '|PASS' -SimpleMatch -Quiet)
Write-Output ("LJS_EXIT=" + $proc.ExitCode + " DONE_MARK=" + $ok)
if (Test-Path $done) { Write-Output ("DONE: " + (Get-Content $done -Raw)) }
if ($ok) { Write-Output 'LJS_ALL_DONE' }
else { if (Test-Path $log) { Select-String -Path $log -Pattern 'LJSample|error CS|Exception' | Select-Object -Last 12 }; exit 1 }
