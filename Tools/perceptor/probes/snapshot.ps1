# Probe: MiniGame automation snapshot freshness -> GAME city activity pulse
# Events: none (state-only pulse)
# r686 (main#24): the path was built TWICE - the first Join-Path produced an
# ABSOLUTE path (root\自动...md) and the second joined that onto
# root\gaming\MiniGame, so the result was a nonsense double-rooted path,
# Test-Path always failed, and the probe returned an empty state that scan
# used to print as "OK" (silent zero-read for weeks). Now: one join, plus an
# explicit row floor so a missing file reads as zero-read instead of silence.
# Missing file = a real signal (the MiniGame automation face went away), so it
# stays a WARN rather than a quiet skip.

function Probe-snapshot {
  param($ctx)
  try {
    $name = (-join @([char]0x81ea,[char]0x52a8,[char]0x5316,[char]0x5feb,[char]0x7167)) + '.md'
    # NOTE: path contains CJK chars; built via codepoints to keep this file ASCII.
    # glyphs: zi-dong-hua kuai-zhao .md  (file lives under gaming/MiniGame/)
    $snap = Join-Path (Join-Path $ctx.root 'gaming\MiniGame') $name
    if (-not (Test-Path -LiteralPath $snap)) { return @{ state = @{ }; matched = 0; expect_min_rows = 1 } }
    $ageMin = ((Get-Date) - (Get-Item -LiteralPath $snap).LastWriteTime).TotalMinutes
    $pulse = 0.0
    if ($ageMin -le 30) { $pulse = 0.6 }
    return @{ state = @{ gaming_pulse = $pulse; snapshot_age_min = [math]::Round($ageMin,1) }
              matched = 1; expect_min_rows = 1 }
  } catch { return $null }
}