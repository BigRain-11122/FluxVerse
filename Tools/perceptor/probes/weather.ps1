# Probe: Open-Meteo Shanghai current weather -> city sky/rain-snow + WEATHER_ALERT
# Reality link M1.5 (DESIGN S15). Zero key. Anchor: Shanghai 31.23/121.47.
# Alert rule: wind >= 17.2 m/s (gale family) OR WMO heavy codes
# (65,67,75,77,82,95,96,99). One alert per condition episode: cursor signature
# changes or clears, so a new episode re-alerts, the same storm does not spam.
# Any HTTP/parse failure returns null (silent degrade, never blocks the scan).
# Events: WEATHER_ALERT (registered T2 2026-09-23). ASCII-only.

function Probe-weather {
  param($ctx)
  try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    $u = 'https://api.open-meteo.com/v1/forecast?latitude=31.23&longitude=121.47&current_weather=true'
    $r = Invoke-RestMethod -Uri $u -TimeoutSec 10 -ErrorAction Stop
    if (-not $r.current_weather) { return $null }
    $cw = $r.current_weather
    $code = [int]$cw.weathercode
    $temp = [double]$cw.temperature
    $wind = [double]$cw.windspeed

    $kind = 'other'
    if ($code -eq 0) { $kind = 'clear' }
    elseif ($code -le 3) { $kind = 'cloud' }
    elseif ($code -ge 45 -and $code -le 48) { $kind = 'fog' }
    elseif (($code -ge 51 -and $code -le 67) -or ($code -ge 80 -and $code -le 82)) { $kind = 'rain' }
    elseif ($code -ge 71 -and $code -le 77) { $kind = 'snow' }
    elseif ($code -ge 95) { $kind = 'thunder' }

    $heavy = @(65, 67, 75, 77, 82, 95, 96, 99)
    $alert = $false; $sig = ''
    if ($wind -ge 17.2) { $alert = $true; $sig = 'gale-' + [string][int]$wind }
    elseif ($heavy -contains $code) { $alert = $true; $sig = 'wmo-' + $code }
    $prevSig = ''
    if ($ctx.cursor.ContainsKey('weather_alert_sig')) { $prevSig = [string]$ctx.cursor['weather_alert_sig'] }
    if ($alert) {
      if ($sig -ne $prevSig) {
        $msg = 'Shanghai '
        if ($sig -like 'gale-*') { $msg = $msg + 'gale wind ' + [string][int]$wind + ' m/s' }
        else { $msg = $msg + 'severe weather WMO' + $code }
        & $ctx.AddEvent 'WEATHER_ALERT' 'weather' 'fluxverse' 'governance' $msg
        $ctx.cursor['weather_alert_sig'] = $sig
      }
    } elseif ($prevSig -ne '') {
      $ctx.cursor['weather_alert_sig'] = ''      # episode over: re-arm the alert
    }

    return @{ state = @{
      reality_weather_kind = $kind
      reality_weather_code = [string]$code
      reality_weather_temp_c = [string][math]::Round($temp, 1)
      reality_weather_wind_ms = [string][math]::Round($wind, 1)
    } }
  } catch { return $null }
}
