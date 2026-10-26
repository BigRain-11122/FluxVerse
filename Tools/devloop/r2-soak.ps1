# R2 soak probe launcher (main#5 tier-1: batchmode play-mode frame sampling)
# ASCII-only (PS5.1 GBK trap). Runs City3D in batchmode (graphics device IS initialized:
# only -nographics would disable it), enters play mode via R2SoakProbe.BatchEntry, and waits.
# Watchdog default 20 min (10 min soak + rebuild margin) per docs/qa-r2-frame-map.md section 4.3.
param(
  [int]$LogicSec = 180,
  [int]$RenderSec = 180,
  [int]$TimeoutMin = 20,
  [switch]$AllowGuiClose,
  [switch]$WarmOnly,
  [switch]$RestoreOnly
)
$ErrorActionPreference = 'Stop'

$exe  = 'C:\Program Files\Tuanjie\Hub\Editor\2022.3.62t15\Editor\Tuanjie.exe'
$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$proj = Join-Path $root 'City3D'
$qa   = Join-Path $root 'qa'
$stg  = Join-Path $root 'City3D-staging'
$log  = Join-Path $stg 'r2-soak.log'
$done = Join-Path $stg 'r2-soak.done'
$settings = Join-Path $proj 'ProjectSettings\EditorSettings.asset'

# Play-mode option residue guard (main#18). The probe temporarily sets
# enterPlayModeOptionsEnabled=1 / options=DisableDomainReload so play mode keeps its statics, and
# restores them on normal exit. A force-killed editor (watchdog kill, launcher teardown, external
# taskkill) skips that restore and leaves the project with domain reload disabled for every later
# session. This project's baseline is 0/3, so anything else is residue and is restored here.
function Restore-PlayModeSettings {
  param([string]$Path)
  if (-not (Test-Path $Path)) { return 'MISSING' }
  $orig = [System.IO.File]::ReadAllText($Path, [System.Text.Encoding]::UTF8)
  $next = [regex]::Replace($orig, 'm_EnterPlayModeOptionsEnabled:\s*\d+', 'm_EnterPlayModeOptionsEnabled: 0')
  $next = [regex]::Replace($next, 'm_EnterPlayModeOptions:\s*\d+', 'm_EnterPlayModeOptions: 3')
  if ($next -eq $orig) { return 'CLEAN' }
  [System.IO.File]::WriteAllText($Path, $next, (New-Object System.Text.UTF8Encoding($false)))
  return 'RESTORED'
}

if ($RestoreOnly) {
  $r = Restore-PlayModeSettings -Path $settings
  Write-Output ("SETTINGS_" + $r)
  if ($r -eq 'MISSING') { exit 1 }
  exit 0
}

if (-not (Test-Path $exe))  { Write-Output "SOAK_FAIL missing editor: $exe"; exit 1 }
if (-not (Test-Path $proj)) { Write-Output "SOAK_FAIL missing project: $proj"; exit 1 }
New-Item -ItemType Directory -Force -Path $qa  | Out-Null
New-Item -ItemType Directory -Force -Path $stg | Out-Null
Remove-Item $done, $log -ErrorAction SilentlyContinue

# An open GUI editor on this project holds the lock and makes batchmode exit silently.
$targets = @(Get-CimInstance Win32_Process -Filter "Name='Tuanjie.exe'" | Where-Object {
  $_.CommandLine -and $_.CommandLine -like '*gaming\FluxVerse\City3D*' -and $_.CommandLine -notlike '*batchmode*'
})
if ($targets.Count -gt 0) {
  if ($AllowGuiClose) {
    foreach ($tg in $targets) {
      Write-Output ("CLOSING_GUI_" + $tg.ProcessId)
      taskkill /PID ([int]$tg.ProcessId) 2>$null | Out-Null
      Start-Sleep -Seconds 3
      if (Get-Process -Id ([int]$tg.ProcessId) -ErrorAction SilentlyContinue) { taskkill /F /PID ([int]$tg.ProcessId) 2>$null | Out-Null }
    }
    Write-Output 'GUI_CLOSED'
  } else {
    Write-Output ("SOAK_ABORT gui_open pid=" + (($targets | ForEach-Object { $_.ProcessId }) -join ',') + " (re-run with -AllowGuiClose only if no interactive window work is in flight)")
    exit 1
  }
} else { Write-Output 'GUI_ALREADY_CLOSED' }

$env:SOAK_LOGIC_SEC  = [string]$LogicSec
$env:SOAK_RENDER_SEC = [string]$RenderSec
$env:SOAK_OUT_DIR    = $qa

# -WarmOnly: import-only pass (-quit, no executeMethod) so a cold Library rebuild does not eat
# the soak watchdog. Run this first when City3D/Library has been invalidated by a version/cleanup.
$argList = @('-batchmode','-projectpath',$proj)
if ($WarmOnly) { $argList += '-quit' } else { $argList += @('-executeMethod','R2SoakProbe.BatchEntry') }
$argList += @('-logFile',$log)

$preSettings = Restore-PlayModeSettings -Path $settings
if ($preSettings -eq 'RESTORED') { Write-Output 'SOAK_PRE_SETTINGS_RESTORED' }

$sw = [System.Diagnostics.Stopwatch]::StartNew()
$runStart = Get-Date
$proc = Start-Process -FilePath $exe -ArgumentList $argList -PassThru
$timeoutMs = $TimeoutMin * 60 * 1000
if (-not $proc.WaitForExit($timeoutMs)) {
  $proc.Kill()
  Write-Output "SOAK_TIMEOUT_${TimeoutMin}MIN"
  $exitCode = -1
} else { $exitCode = $proc.ExitCode }
$sw.Stop()

# Restore before reporting: this runs on the kill/timeout path too, which is exactly where the
# probe's own restore never fires.
$postSettings = Restore-PlayModeSettings -Path $settings
if ($postSettings -eq 'RESTORED') { Write-Output 'SOAK_POST_SETTINGS_RESTORED' }
else { Write-Output ("SOAK_SETTINGS_" + $postSettings) }

$logDone = (Test-Path $log) -and (Select-String -Path $log -Pattern 'CITY3D_SOAK_DONE' -SimpleMatch -Quiet)
$logFail = (Test-Path $log) -and (Select-String -Path $log -Pattern 'CITY3D_SOAK_FAIL' -SimpleMatch -Quiet)
$logStart = (Test-Path $log) -and (Select-String -Path $log -Pattern 'CITY3D_SOAK_START' -SimpleMatch -Quiet)
# Cold-Library diagnostic: a project whose Library was invalidated re-imports every asset before
# executeMethod runs, which is indistinguishable from a hung probe without this counter.
$importLines = 0
if (Test-Path $log) { $importLines = (Select-String -Path $log -Pattern 'Start importing Assets/' -AllMatches).Count }
# Only accept a JSON produced by THIS run (older qa artifacts must not be reported as a fresh result).
$json = Get-ChildItem -Path $qa -Filter 'r2-soak-*.json' -ErrorAction SilentlyContinue |
  Where-Object { $_.LastWriteTime -ge $runStart.AddSeconds(-5) } |
  Sort-Object LastWriteTime -Descending | Select-Object -First 1

$receipt = [ordered]@{
  ts             = (Get-Date -Format 'yyyy-MM-ddTHH:mm:sszzz')
  probe          = 'R2SoakProbe'
  tier           = if ($WarmOnly) { 'warm_import_only' } else { 'tier1_batchmode_playmode' }
  logic_sec      = $LogicSec
  render_sec     = $RenderSec
  timeout_min    = $TimeoutMin
  exit_code      = $exitCode
  wall_s         = [int]$sw.Elapsed.TotalSeconds
  log_soak_start = [bool]$logStart
  log_done       = [bool]$logDone
  log_fail       = [bool]$logFail
  import_lines   = $importLines
  settings_pre   = $preSettings
  settings_post  = $postSettings
  json           = if ($json) { $json.FullName } else { $null }
  log            = $log
}
$receipt | ConvertTo-Json | Set-Content -Path $done -Encoding UTF8

if ($json) {
  $j = Get-Content $json.FullName -Raw | ConvertFrom-Json
  Write-Output ("SOAK_JSON " + $json.Name)
  Write-Output ("SOAK_LOGIC frames=" + $j.logic.frames + " fps_avg=" + $j.logic.fps_avg + " fps_min=" + $j.logic.fps_min + " p95_ms=" + $j.logic.dt_p95_ms)
  Write-Output ("SOAK_RENDER frames=" + $j.render.frames + " fps_avg=" + $j.render.fps_avg + " fps_min=" + $j.render.fps_min + " p95_ms=" + $j.render.dt_p95_ms)
  Write-Output ("SOAK_ERRORS errors=" + $j.errors + " exceptions=" + $j.exceptions)
} else {
  Write-Output 'SOAK_NO_JSON'
  if (Test-Path $log) { Select-String -Path $log -Pattern 'error CS|Exception|CITY3D_SOAK_FAIL|Aborting|no main camera' | Select-Object -Last 15 | ForEach-Object { $_.Line } }
}

if ($WarmOnly) {
  if ($exitCode -eq 0) {
    Write-Output ("SOAK_WARM_OK imports=" + $importLines + " wall_s=" + [int]$sw.Elapsed.TotalSeconds)
    exit 0
  }
  Write-Output ("SOAK_WARM_NOT_OK exit=" + $exitCode + " imports=" + $importLines)
  exit 1
}
if ($logDone -and $json) { Write-Output ("SOAK_OK exit=" + $exitCode + " wall_s=" + [int]$sw.Elapsed.TotalSeconds); exit 0 }
Write-Output ("SOAK_NOT_OK exit=" + $exitCode + " soak_started=" + [bool]$logStart + " imports=" + $importLines)
exit 1