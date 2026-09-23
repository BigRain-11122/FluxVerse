# FluxVerse desktop shortcut installer (CEO order 2026-09-23 ~21:47: shortcut to desktop on every fleet machine, same everywhere).
# Idempotent: safe to re-run any time (refreshes the shortcut).
# ASCII-only body (encoding law); the Chinese shortcut label lives in desktop-shortcut-name.txt (UTF-8 data file).

$ErrorActionPreference = 'Stop'

$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$repo = Split-Path -Parent $here
$bat  = Join-Path $here 'CityWatch.bat'
$ico  = Join-Path $here 'fluxverse.ico'
$nameFile = Join-Path $here 'desktop-shortcut-name.txt'

if (-not (Test-Path $bat))  { throw ("CityWatch.bat not found: " + $bat) }
if (-not (Test-Path $ico))  { throw ("fluxverse.ico not found: " + $ico) }

$label = 'FluxVerse'
if (Test-Path $nameFile) {
    $raw = Get-Content -LiteralPath $nameFile -Encoding UTF8 | Select-Object -First 1
    if (-not [string]::IsNullOrWhiteSpace($raw)) { $label = $raw.Trim() }
}

$desktop = [Environment]::GetFolderPath('Desktop')
$lnk = Join-Path $desktop ($label + '.lnk')

$shell = New-Object -ComObject WScript.Shell
$sc = $shell.CreateShortcut($lnk)
$sc.TargetPath = $bat
$sc.Arguments = ''
$sc.WorkingDirectory = $repo
$sc.IconLocation = ($ico + ',0')
$sc.Description = 'FluxVerse CityWatch - city progress viewer (read-only, double-click to enter)'
$sc.Save()

if (-not (Test-Path $lnk)) { throw ("shortcut was not created: " + $lnk) }

# verify round-trip
$check = $shell.CreateShortcut($lnk)
$okTarget = (Test-Path $check.TargetPath)
Write-Output ("SHORTCUT OK: " + $lnk)
Write-Output ("TARGET: " + $check.TargetPath + " (exists=" + $okTarget + ")")
