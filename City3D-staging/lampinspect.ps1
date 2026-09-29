# LampInspect evidence batch: close City3D GUI -> inspect lamp modules -> reopen
$ErrorActionPreference = 'Stop'
$exe = 'C:\Program Files\Tuanjie\Hub\Editor\2022.3.62t15\Editor\Tuanjie.exe'
$proj = 'C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse\City3D'
$stg = 'C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse\City3D-staging'
$log = Join-Path $stg 'lampinspect.log'
$done = Join-Path $stg 'lampinspect.done'
$fail = Join-Path $stg 'lampinspect.fail'
Remove-Item $done, $fail, $log -ErrorAction SilentlyContinue

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

$proc = Start-Process -FilePath $exe -ArgumentList '-batchmode','-quit','-projectpath',$proj,'-executeMethod','KitInspect.LampEntry','-logFile',$log -PassThru
if (-not $proc.WaitForExit(900000)) { $proc.Kill(); Write-Output 'LAMPINSPECT_TIMEOUT_15MIN' }
$ok = (Test-Path $log) -and (Select-String -Path $log -Pattern 'KITINSPECT_DONE' -SimpleMatch -Quiet)
Write-Output ("LAMPINSPECT_EXIT=" + $proc.ExitCode + " DONE_MARK=" + $ok)
if (-not $ok) {
  if (Test-Path $log) { Get-Content $log -Tail 30 }
  New-Item -ItemType File -Path $fail -Force | Out-Null
  exit 1
}
Start-Process -FilePath $exe -ArgumentList '-projectpath', $proj
Start-Sleep -Seconds 5
New-Item -ItemType File -Path $done -Force | Out-Null
Write-Output 'LAMPINSPECT_ALL_DONE'
