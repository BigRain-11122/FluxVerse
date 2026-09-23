# Probe: MiniGame automation snapshot freshness -> GAME city activity pulse
# Events: none (state-only pulse)

function Probe-snapshot {
  param($ctx)
  try {
    $snap = Join-Path $ctx.root ([char]0x81ea + [char]0x52a8 + [char]0x5316 + [char]0x5feb + [char]0x7167 + '.md')
    # NOTE: path contains CJK chars; built via codepoints to keep this file ASCII.
    # glyphs: zi-dong-hua kuai-zhao .md  (gaming/MiniGame/自动化快照.md)
    $snap = Join-Path (Join-Path $ctx.root 'gaming\MiniGame') $snap
    if (-not (Test-Path $snap)) { return @{ state = @{ } } }
    $ageMin = ((Get-Date) - (Get-Item $snap).LastWriteTime).TotalMinutes
    $pulse = 0.0
    if ($ageMin -le 30) { $pulse = 0.6 }
    return @{ state = @{ gaming_pulse = $pulse; snapshot_age_min = [math]::Round($ageMin,1) } }
  } catch { return $null }
}
