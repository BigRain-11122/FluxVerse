# Phase 0 validation-run ignition (CEO order O-20261010-0010 s4 / audit 2026-10-02 s5-1, bm-a receipt leg)
# SOP: close GUI instances of this project first (already-open trap), batchmode -quit, watchdog 15min, fail-loud .done sentinel
$ErrorActionPreference = 'Stop'
$exe = 'C:\Program Files\Tuanjie\Hub\Editor\2022.3.62t15\Editor\Tuanjie.exe'
$proj = 'C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse\City3D'
$stg = 'C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse\City3D-staging'
$log = Join-Path $stg 'phase0-ignite.log'
$done = Join-Path $stg 'phase0-ignite.done'
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

$sw = [System.Diagnostics.Stopwatch]::StartNew()
$proc = Start-Process -FilePath $exe -ArgumentList '-batchmode','-quit','-projectpath',$proj,'-executeMethod','WhiteboxBuilder.BatchEntry','-logFile',$log -PassThru
if (-not $proc.WaitForExit(900000)) { $proc.Kill(); Write-Output 'PHASE0_TIMEOUT_15MIN' }
$sw.Stop()
$okLog = (Test-Path $log) -and (Select-String -Path $log -Pattern 'CITY3D_PHASE0_DONE' -SimpleMatch -Quiet)
$shots = @('L0_overview.png','L1_brainring.png','L2_street.png','X_bridge.png','breath_on.png','breath_off.png') | ForEach-Object { Join-Path $stg ("shots\" + $_) }
$okShots = @($shots | Where-Object { Test-Path $_ }).Count
$receipt = [ordered]@{
  ts = (Get-Date -Format 'yyyy-MM-ddTHH:mm:sszzz')
  order = 'O-20261010-0010-bm-c s4 (City3D Phase 0 validation-run ignition, bm-a receipt leg)'
  exit_code = $proc.ExitCode
  wall_s = [int]$sw.Elapsed.TotalSeconds
  log_done_marker = $okLog
  shots_present = $okShots
  shots_expected = 6
  log = $log
  report = (Join-Path $stg 'phase0-report.md')
}
$receipt | ConvertTo-Json | Set-Content -Path $done -Encoding UTF8
Write-Output ("PHASE0_EXIT=" + $proc.ExitCode + " DONE_MARKER=" + $okLog + " SHOTS=" + $okShots + "/6 WALL_S=" + [int]$sw.Elapsed.TotalSeconds)
if ($okLog -and $okShots -ge 6) { Write-Output 'PHASE0_IGNITE_ALL_DONE' }
else { if (Test-Path $log) { Select-String -Path $log -Pattern 'CITY3D_PHASE0_FAIL|error CS|Exception|CompilerError' | Select-Object -Last 20 }; exit 1 }
