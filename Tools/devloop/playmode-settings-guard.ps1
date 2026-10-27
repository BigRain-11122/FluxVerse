# Play-mode option guard (main#19). Extracted out of r2-soak.ps1 so the ABORT path can be proven
# against sandbox copies instead of a live project.
#
# Why: the soak probe temporarily sets enterPlayModeOptionsEnabled=1 / options=DisableDomainReload
# so play mode keeps statics. A force-killed editor skips the probe's own restore. The previous
# guard hard-coded "reset to 0/3", which silently overwrote a baseline that had been changed on
# purpose. Now the baseline is read from a tracked file and any state that is neither the baseline
# nor the probe's own residue is ABORTed instead of overwritten.
#
# Verdicts (first token of the returned string is authoritative):
#   MISSING            settings file absent
#   CLEAN <detail>     already at baseline, nothing written
#   RESTORED <detail>  probe residue found, baseline written back
#   ABORT <detail>     unexpected state, nothing written (caller must fail loudly)
# ASCII-only (PS5.1 GBK trap).

function Get-PlayModeState {
  param([string]$Path)
  if (-not (Test-Path $Path)) { return $null }
  $raw = [System.IO.File]::ReadAllText($Path, [System.Text.Encoding]::UTF8)
  $mE = [regex]::Match($raw, 'm_EnterPlayModeOptionsEnabled:\s*(\d+)')
  $mO = [regex]::Match($raw, 'm_EnterPlayModeOptions:\s*(\d+)')
  if (-not $mE.Success -or -not $mO.Success) { return $null }
  return [pscustomobject]@{
    Enabled = [int]$mE.Groups[1].Value
    Options = [int]$mO.Groups[1].Value
    Raw     = $raw
  }
}

function Get-PlayModeBaseline {
  param([string]$Path)
  if (-not (Test-Path $Path)) { return $null }
  $text = [System.IO.File]::ReadAllText($Path, [System.Text.Encoding]::UTF8)
  # Comment lines carry illustrative values (they once shadowed the real baseline), so parse the
  # body only.
  $body = (($text -split "`r?`n") | Where-Object { $_ -notmatch '^\s*#' }) -join "`n"
  $mE = [regex]::Match($body, 'enabled\s*=\s*(\d+)')
  $mO = [regex]::Match($body, 'options\s*=\s*(\d+)')
  if (-not $mE.Success -or -not $mO.Success) { return $null }
  return [pscustomobject]@{
    Enabled = [int]$mE.Groups[1].Value
    Options = [int]$mO.Groups[1].Value
  }
}

function Restore-PlayModeSettings {
  param([string]$Path, [string]$BaselinePath)

  $st = Get-PlayModeState -Path $Path
  if ($null -eq $st) { return 'MISSING' }

  $bl = Get-PlayModeBaseline -Path $BaselinePath
  if ($null -eq $bl) { return 'ABORT baseline_unreadable' }

  $tag = 'base=' + $bl.Enabled + '/' + $bl.Options + ' cur=' + $st.Enabled + '/' + $st.Options

  if ($st.Enabled -eq $bl.Enabled -and $st.Options -eq $bl.Options) { return 'CLEAN ' + $tag }

  # Only the probe's own residue signature is safe to overwrite (domain reload disabled by us).
  if (-not ($st.Enabled -eq 1 -and $st.Options -eq 3)) { return 'ABORT drift ' + $tag }

  $next = [regex]::Replace($st.Raw, 'm_EnterPlayModeOptionsEnabled:\s*\d+', ('m_EnterPlayModeOptionsEnabled: ' + $bl.Enabled))
  $next = [regex]::Replace($next, 'm_EnterPlayModeOptions:\s*\d+', ('m_EnterPlayModeOptions: ' + $bl.Options))
  if ($next -eq $st.Raw) { return 'CLEAN ' + $tag }

  [System.IO.File]::WriteAllText($Path, $next, (New-Object System.Text.UTF8Encoding($false)))
  return 'RESTORED ' + $tag
}