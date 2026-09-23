# Probe: CPH4 evolution ledger -> open proposals count
# Events: EVOLUTION_PROPOSE / EVOLUTION_LAW (registered; v0.1 counts only, no event yet)

function Probe-evolution {
  param($ctx)
  try {
    $open = 0
    $ledger = Join-Path $ctx.root 'cph4\evolution-ledger.md'
    if (Test-Path $ledger) {
      $raw = Get-Content $ledger -Raw -Encoding UTF8
      $open = ([regex]::Matches($raw, 'open')).Count
    }
    return @{ state = @{ evolution_open = $open } }
  } catch { return $null }
}
