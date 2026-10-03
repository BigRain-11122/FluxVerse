# R0 diag v2 batchmode runner (O-20261003-1210 order-3)
$ErrorActionPreference = 'Stop'
$exe = 'C:\Program Files\Tuanjie\Hub\Editor\2022.3.62t15\Editor\Tuanjie.exe'
$proj = 'C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse\City3D'
$stg = 'C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse\City3D-staging'
$log = Join-Path $stg 'r0diagd.log'
$done = Join-Path $stg 'r0diagd.done'
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

$proc = Start-Process -FilePath $exe -ArgumentList '-batchmode','-quit','-projectpath',$proj,'-executeMethod','CitySim.R0DiagRefreshWrapper.RunDirect','-logFile',$log -PassThru
if (-not $proc.WaitForExit(900000)) { $proc.Kill(); Write-Output 'r0diagd_TIMEOUT_15MIN' }
Write-Output ("r0diagd_EXIT=" + $proc.ExitCode)
if (Test-Path $done) { Write-Output ("DONE: " + (Get-Content $done -Raw)) } else { Write-Output 'DONE_MISSING' }
if (Test-Path $log) { Select-String -Path $log -Pattern 'r0diagd|error CS|Exception' | Select-Object -Last 8 }


