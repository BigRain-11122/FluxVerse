# 赛博硅基城 v1 建造批（CEO 令 09-29 另存一份·自包含：建城→过桥→存盘→日/夜判据帧）
$ErrorActionPreference = 'Stop'
$exe = 'C:\Program Files\Tuanjie\Hub\Editor\2022.3.62t15\Editor\Tuanjie.exe'
$proj = 'C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse\City3D'
$stg = 'C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse\City3D-staging'
$log = Join-Path $stg 'scificity.log'
$done = Join-Path $stg 'scificity.done'
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

$proc = Start-Process -FilePath $exe -ArgumentList '-batchmode','-quit','-projectpath',$proj,'-executeMethod','SciFiCityBuilder.BatchEntry','-logFile',$log -PassThru
if (-not $proc.WaitForExit(1500000)) { $proc.Kill(); Write-Output 'SCIFICITY_TIMEOUT_25MIN' }
$ok = (Test-Path $log) -and (Select-String -Path $log -Pattern 'SCIFICITY_DONE' -SimpleMatch -Quiet)
Write-Output ("SCIFICITY_EXIT=" + $proc.ExitCode + " DONE_MARK=" + $ok)
if ($ok) { New-Item -ItemType File -Path $done -Force | Out-Null; Write-Output 'SCIFICITY_ALL_DONE' }
else { if (Test-Path $log) { Select-String -Path $log -Pattern 'SCIFICITY_FAIL|error CS' | Select-Object -Last 12 }; exit 1 }
