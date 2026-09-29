# City3D Top1 v5 headless build: assemble -> bridge（P0 净空+P2 基准档配方·Top1 施工案）
# Fail-loud sentinels: top1build.done / top1build.fail（GUI 末批后由收口批重开）
$ErrorActionPreference = 'Stop'
$exe = 'C:\Program Files\Tuanjie\Hub\Editor\2022.3.62t15\Editor\Tuanjie.exe'
$proj = 'C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse\City3D'
$stg = 'C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse\City3D-staging'
$log1 = Join-Path $stg 'assemble-v5.log'
$log2 = Join-Path $stg 'bridge-v5.log'
$done = Join-Path $stg 'top1build.done'
$fail = Join-Path $stg 'top1build.fail'
Remove-Item $done, $fail, $log1, $log2 -ErrorAction SilentlyContinue

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

$proc = Start-Process -FilePath $exe -ArgumentList '-batchmode','-quit','-projectpath',$proj,'-executeMethod','CityAssembler.BatchEntry','-logFile',$log1 -PassThru
if (-not $proc.WaitForExit(1500000)) { $proc.Kill(); Write-Output 'ASSEMBLE_TIMEOUT_25MIN' }
$exit1 = $proc.ExitCode
$ok1 = (Test-Path $log1) -and (Select-String -Path $log1 -Pattern 'CITY3D_ASSEMBLE_DONE' -SimpleMatch -Quiet)
Write-Output ("ASSEMBLE_EXIT=" + $exit1 + " DONE_MARK=" + $ok1)
if (-not $ok1) {
  Write-Output '=== ASSEMBLE_FAIL_LOG_TAIL ==='
  if (Test-Path $log1) { Get-Content $log1 -Tail 40 }
  New-Item -ItemType File -Path $fail -Force | Out-Null
  exit 1
}

$proc2 = Start-Process -FilePath $exe -ArgumentList '-batchmode','-quit','-projectpath',$proj,'-executeMethod','URPMaterialBridge.BatchEntry','-logFile',$log2 -PassThru
if (-not $proc2.WaitForExit(1500000)) { $proc2.Kill(); Write-Output 'BRIDGE_TIMEOUT_25MIN' }
$exit2 = $proc2.ExitCode
$ok2 = (Test-Path $log2) -and (Select-String -Path $log2 -Pattern 'CITY3D_BRIDGE_DONE' -SimpleMatch -Quiet)
Write-Output ("BRIDGE_EXIT=" + $exit2 + " DONE_MARK=" + $ok2)
if (-not $ok2) {
  Write-Output '=== BRIDGE_FAIL_LOG_TAIL ==='
  if (Test-Path $log2) { Get-Content $log2 -Tail 40 }
  New-Item -ItemType File -Path $fail -Force | Out-Null
  exit 1
}

New-Item -ItemType File -Path $done -Force | Out-Null
Write-Output 'TOP1BUILD_ALL_DONE'
