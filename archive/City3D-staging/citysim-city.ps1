# CitySim 全城 V1 装配批（CEO 令 09-30 硅基城市全面开工·自包含：建城→五断言→B_ 帧→存盘）
# 坑律执法：Start-Process ArgumentList 无空格路径禁嵌引号（v0.1 判例）·20min 看门狗（全城双建较重）·.done 哨兵 fail-loud
$ErrorActionPreference = 'Stop'
$exe = 'C:\Program Files\Tuanjie\Hub\Editor\2022.3.62t15\Editor\Tuanjie.exe'
$proj = 'C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse\City3D'
$stg = 'C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse\City3D-staging'
$log = Join-Path $stg 'citysim-city.log'
$done = Join-Path $stg 'citysim-city.done'
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

$proc = Start-Process -FilePath $exe -ArgumentList '-batchmode','-quit','-projectpath',$proj,'-executeMethod','CitySim.CitySimShellBuilder.RunCityAll','-logFile',$log -PassThru
if (-not $proc.WaitForExit(1200000)) { $proc.Kill(); Write-Output 'CITY_TIMEOUT_20MIN' }
$ok = (Test-Path $log) -and (Select-String -Path $log -Pattern 'RunCityAll PASS' -SimpleMatch -Quiet)
Write-Output ("CITY_EXIT=" + $proc.ExitCode + " DONE_MARK=" + $ok)
if (Test-Path $done) { Write-Output ("DONE: " + (Get-Content $done -Raw)) }
if ($ok) { Write-Output 'CITY_ALL_DONE' }
else { if (Test-Path $log) { Select-String -Path $log -Pattern 'City. FAIL|error CS|Exception' | Select-Object -Last 12 }; exit 1 }
