# AD-049 Megacity quick-sample batch (CEO order 10-08: 1008 incremental packs put to use)
# SOP: close GUI instances of this project first (already-open trap), batchmode -quit, watchdog 25min (first import ~194MB + splines resolve), fail-loud .done sentinel
$ErrorActionPreference = 'Stop'
$exe = 'C:\Program Files\Tuanjie\Hub\Editor\2022.3.62t15\Editor\Tuanjie.exe'
$proj = 'C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse\City3D'
$stg = 'C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse\City3D-staging'
$log = Join-Path $stg 'megacity-sample.log'
$done = Join-Path $stg 'megacity-sample.done'
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

$proc = Start-Process -FilePath $exe -ArgumentList '-batchmode','-quit','-projectpath',$proj,'-executeMethod','MegacitySampleBuilder.BatchEntry','-logFile',$log -PassThru
if (-not $proc.WaitForExit(1500000)) { $proc.Kill(); Write-Output 'SAMPLE_TIMEOUT_25MIN' }
$ok = (Test-Path $log) -and (Select-String -Path $log -Pattern 'MEGACITY_SAMPLE PASS' -SimpleMatch -Quiet)
Write-Output ("SAMPLE_EXIT=" + $proc.ExitCode + " DONE_MARK=" + $ok)
if (Test-Path $done) { Write-Output ("DONE: " + (Get-Content $done -Raw)) }
if ($ok) { Write-Output 'MEGACITY_SAMPLE_ALL_DONE' }
else { if (Test-Path $log) { Select-String -Path $log -Pattern 'MEGACITY_SAMPLE FAIL|error CS|Exception|CompilerError' | Select-Object -Last 20 }; exit 1 }
