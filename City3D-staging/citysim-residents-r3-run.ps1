# A-leg third run batchmode runner (O-20261003-1210 bm-c adjudication 10-06 ~19:0x: GUID direct-load fix 2e7a9c6)
$ErrorActionPreference = 'Stop'
$exe = 'C:\Program Files\Tuanjie\Hub\Editor\2022.3.62t15\Editor\Tuanjie.exe'
$proj = 'C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse\City3D'
$stg = 'C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse\City3D-staging'
$log = Join-Path $stg 'citysim-residents-r3.log'
$done = Join-Path $stg 'citysim-residents.done'

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

$proc = Start-Process -FilePath $exe -ArgumentList '-batchmode','-quit','-projectpath',$proj,'-executeMethod','CitySim.CitySimResidentsBatch.RunResidentsAll','-logFile',$log -PassThru
if (-not $proc.WaitForExit(1500000)) { $proc.Kill(); Write-Output 'r3_TIMEOUT_25MIN' }
Write-Output ("r3_EXIT=" + $proc.ExitCode)
if (Test-Path $done) { Write-Output ("DONE: " + (Get-Content $done -Raw)) } else { Write-Output 'DONE_MISSING' }
