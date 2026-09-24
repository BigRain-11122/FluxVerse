# FluxVerse desktop shortcut installer (CEO order 2026-09-23 ~21:47: shortcut to desktop on every fleet machine, same everywhere).
# Rerouted 2026-09-24 by CEO order P-2026-09-24-59 (~16:45): the desktop entry now opens the
# CEO-designated SOLE observation window (silicon-life metaverse html in the MiniGame repo).
# CityWatch stays as data face: watch/CityWatch.bat still opens it directly; the panel carries a paused-note strip.
# Idempotent: safe to re-run any time (refreshes the shortcut).
# ASCII-only body (encoding law); the Chinese shortcut label / target path live in UTF-8 data files:
#   desktop-shortcut-name.txt / desktop-shortcut-target.txt.

$ErrorActionPreference = 'Stop'

$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$repo = Split-Path -Parent $here
$ico  = Join-Path $here 'fluxverse.ico'
$nameFile   = Join-Path $here 'desktop-shortcut-name.txt'
$targetFile = Join-Path $here 'desktop-shortcut-target.txt'

if (-not (Test-Path $ico))        { throw ("fluxverse.ico not found: " + $ico) }
if (-not (Test-Path $targetFile)) { throw ("desktop-shortcut-target.txt not found: " + $targetFile) }

$label = 'FluxVerse'
if (Test-Path $nameFile) {
    $raw = Get-Content -LiteralPath $nameFile -Encoding UTF8 | Select-Object -First 1
    if (-not [string]::IsNullOrWhiteSpace($raw)) { $label = $raw.Trim() }
}

# target = path relative to this repo root, resolved to absolute
# (e.g. ..\MiniGame\<ceo sole observation window>.html)
$rel = [string](Get-Content -LiteralPath $targetFile -Encoding UTF8 | Select-Object -First 1)
if ([string]::IsNullOrWhiteSpace($rel)) { throw "desktop-shortcut-target.txt is empty" }
$target = [IO.Path]::GetFullPath((Join-Path $repo $rel.Trim()))
if (-not (Test-Path -LiteralPath $target)) { throw ("sole observation window not found: " + $target) }

$desktop = [Environment]::GetFolderPath('Desktop')
$lnk = Join-Path $desktop ($label + '.lnk')

$shell = New-Object -ComObject WScript.Shell
$sc = $shell.CreateShortcut($lnk)
$sc.TargetPath = $target
$sc.Arguments = ''
$sc.WorkingDirectory = (Split-Path -Parent $target)
$sc.IconLocation = ($ico + ',0')
$sc.Description = 'CEO sole observation window - Silicon Life Metaverse (FluxVerse reroute P-59)'
$sc.Save()

if (-not (Test-Path $lnk)) { throw ("shortcut was not created: " + $lnk) }

# verify round-trip
$check = $shell.CreateShortcut($lnk)
$okTarget = (Test-Path -LiteralPath $check.TargetPath)
Write-Output ("SHORTCUT OK: " + $lnk)
Write-Output ("TARGET: " + $check.TargetPath + " (exists=" + $okTarget + ")")
