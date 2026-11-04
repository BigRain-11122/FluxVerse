# resident-verdict.ps1 - the city's resident-voice face, in ONE place (r828 main#138)
#
# WHY: on 2026-10-14 the resident lines stopped (the probe asked for a model the
# host no longer had), and for three weeks every tick still printed
# "probe residents: OK" - an absent read and a healthy read had the same face.
# r826 swapped the model and revived the voices; this module makes the READ
# itself visible:
#   - which model the probe uses,
#   - whether that model is on the local Ollama roster (installed / not /
#     unknown - never two states),
#   - who is speaking and how long the city has been quiet.
#
# Split of duties: probe residents.ps1 records these as `residents_meta` in
# world-state; this module only formats a VERDICT, and verify.ps1 prints it.
# Everything here is a READING, not a gate: a silent city is honest, a silent
# city with an uninstalled model is the warning.
#
# Contract: pure functions, no writes, ASCII-only (encoding law).

function Get-ResidentVoiceReading {
  param([string]$StatePath)
  if ([string]::IsNullOrEmpty($StatePath)) { return @{ exists = $false; unreadable = $false; meta = $null } }
  if (-not (Test-Path -LiteralPath $StatePath)) { return @{ exists = $false; unreadable = $false; meta = $null } }
  $st = $null
  try { $st = ConvertFrom-Json ([System.IO.File]::ReadAllText($StatePath, [System.Text.Encoding]::UTF8)) }
  catch { return @{ exists = $true; unreadable = $true; meta = $null } }
  $m = $null
  if ($null -ne $st -and $null -ne $st.PSObject.Properties['residents_meta']) { $m = $st.residents_meta }
  return @{ exists = $true; unreadable = $false; meta = $m }
}

function Format-ResidentAge([object]$AgeHours) {
  # A missing age is "never", never "0h". 0 would read as "spoke just now".
  if ($null -eq $AgeHours) { return 'never' }
  $h = 0.0
  try { $h = [double]$AgeHours } catch { return 'never' }
  if ($h -lt 0) { return 'never' }
  if ($h -lt 1) { return ([math]::Round($h * 60, 0).ToString([Globalization.CultureInfo]::InvariantCulture) + 'm') }
  return ([math]::Round($h, 1).ToString([Globalization.CultureInfo]::InvariantCulture) + 'h')
}

function Get-ResidentVoiceVerdict {
  # -> @{ verdict = 'health'|'warn'; line = '...'; reason = '' }
  # The line never contains the red-scan token; callers prefix HEALTH/WARN.
  param($Reading)
  if ($null -eq $Reading -or -not $Reading.exists) {
    return @{ verdict = 'warn'; line = 'residents: no world state to read - voice face unknown'; reason = 'no-state' }
  }
  if ($Reading.unreadable) {
    return @{ verdict = 'warn'; line = 'residents: world state not parseable - voice face unknown'; reason = 'unreadable' }
  }
  $m = $Reading.meta
  if ($null -eq $m) {
    return @{ verdict = 'warn'; line = 'residents: model=unknown present=unknown say=unknown - no voice readings in world state (probe residents.ps1 has not published them)'; reason = 'no-readings' }
  }
  $model = [string]$m.model
  if ([string]::IsNullOrEmpty($model)) { $model = 'unknown' }
  $known = $true
  if ($null -ne $m.PSObject.Properties['model_known']) { $known = [bool]$m.model_known }
  $present = $null
  if ($null -ne $m.PSObject.Properties['model_present']) { $present = $m.model_present }
  $presentTxt = 'unknown'
  if ($known -and $present -eq $true) { $presentTxt = '1' }
  elseif ($known -and $present -eq $false) { $presentTxt = '0' }

  $speakers = 0
  if ($null -ne $m.PSObject.Properties['speakers_n']) { try { $speakers = [int]$m.speakers_n } catch { $speakers = 0 } }
  $silent = 0
  if ($null -ne $m.PSObject.Properties['silent_n']) { try { $silent = [int]$m.silent_n } catch { $silent = 0 } }
  $rosterN = 0
  if ($null -ne $m.PSObject.Properties['roster_n']) { try { $rosterN = [int]$m.roster_n } catch { $rosterN = 0 } }
  $last = ''
  if ($null -ne $m.PSObject.Properties['last_say_utc']) { $last = [string]$m.last_say_utc }
  $age = $null
  if ($null -ne $m.PSObject.Properties['last_say_age_h']) { $age = $m.last_say_age_h }

  $line = 'residents: model=' + $model + ' present=' + $presentTxt + ' roster=' + $rosterN +
    ' say=' + $speakers + ' silent=' + $silent +
    ' last=' + $(if ($last) { $last } else { 'never' }) +
    ' age=' + (Format-ResidentAge $age)
  if ($null -ne $m.PSObject.Properties['last_error'] -and -not [string]::IsNullOrEmpty([string]$m.last_error)) {
    $line = $line + ' err=' + [string]$m.last_error
  }

  if (-not $known) {
    return @{ verdict = 'warn'; line = $line; reason = 'roster-unreadable' }
  }
  if ($present -eq $false) {
    return @{ verdict = 'warn'; line = $line; reason = 'model-not-installed' }
  }
  return @{ verdict = 'health'; line = $line; reason = '' }
}