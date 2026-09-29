# P1 官方基准档提取批（Top1 施工案·batchmode 静默）
$ErrorActionPreference = 'Stop'
$exe = 'C:\Program Files\Tuanjie\Hub\Editor\2022.3.62t15\Editor\Tuanjie.exe'
$proj = 'C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse\City3D'
$stg = 'C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse\City3D-staging'
$log = Join-Path $stg 'top1baseline.log'
$done = Join-Path $stg 'top1baseline.done'
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

$proc = Start-Process -FilePath $exe -ArgumentList '-batchmode','-quit','-projectpath',$proj,'-executeMethod','Top1Baseline.BaselineEntry','-logFile',$log -PassThru
if (-not $proc.WaitForExit(600000)) { $proc.Kill(); Write-Output 'TOP1BASELINE_TIMEOUT_10MIN' }
$ok = (Test-Path $log) -and (Select-String -Path $log -Pattern 'TOP1_BASELINE_DONE' -SimpleMatch -Quiet)
Write-Output ("TOP1BASELINE_EXIT=" + $proc.ExitCode + " DONE_MARK=" + $ok)
if ($ok) { New-Item -ItemType File -Path $done -Force | Out-Null; Write-Output 'TOP1BASELINE_ALL_DONE' }
else { if (Test-Path $log) { Get-Content $log -Tail 20 }; exit 1 }
