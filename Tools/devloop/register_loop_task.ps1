# Registers the FluxVerse 10-minute AI dev loop (headless codely round).
# Ported 2026-09-23 from BigMoney Tools\register_loop_task.ps1 (proven pattern).
# Staggered on the 5-min lane to stay off the FluxVerseTick lane (:00-ish).
# Pure ASCII. Idempotent via -Force. Re-run for self-heal.
$Project = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path   # -> gaming/FluxVerse
$launcher = Join-Path $PSScriptRoot 'iteration_loop.ps1'
$vbs = Join-Path $PSScriptRoot 'InvisibleRunner.vbs'
if (-not (Test-Path $launcher)) { Write-Output "FATAL: $launcher missing"; exit 1 }
if (-not (Test-Path $vbs)) { Write-Output "FATAL: $vbs missing"; exit 1 }
$a = New-ScheduledTaskAction -Execute 'wscript.exe' `
    -Argument ('//B //nologo "' + $vbs + '" powershell.exe -NoProfile -ExecutionPolicy Bypass -File "' + $launcher + '"') `
    -WorkingDirectory $Project
$start = Get-Date -Minute 0 -Second 0
while ($start -le (Get-Date)) { $start = $start.AddMinutes(5) }   # next :05/:15/:25...
$t = New-ScheduledTaskTrigger -Once -At $start -RepetitionInterval (New-TimeSpan -Minutes 10) -RepetitionDuration (New-TimeSpan -Days 3650)
$s = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Minutes 35)
Register-ScheduledTask -TaskName 'FluxVerse-DevLoop' -Action $a -Trigger $t -Settings $s -Force | Out-Null
Write-Output "registered FluxVerse-DevLoop (project=$Project), first fire $start"
