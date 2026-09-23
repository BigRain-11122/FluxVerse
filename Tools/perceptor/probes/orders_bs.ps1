# Probe: BigStream orders dir (media/BigStream/orders/*.md) -> CEO_ORDER events
# F2 fix: media line audit face was uncovered. Events: CEO_ORDER (registered)

function Probe-orders_bs {
  param($ctx)
  try {
    $pending = @()
    $dir = Join-Path $ctx.root 'media\BigStream\orders'
    if (Test-Path $dir) {
      foreach ($f in (Get-ChildItem $dir -Filter *.md)) {
        if ($f.Name -eq 'README.md') { continue }
        $pending += $f.BaseName
        $curKey = 'bsorder:' + $f.BaseName
        if (-not $ctx.cursor.ContainsKey($curKey)) {
          & $ctx.AddEvent 'CEO_ORDER' 'CEO' 'bigstream' 'media' ('order ' + $f.BaseName)
          $ctx.cursor[$curKey] = '1'
        }
      }
    }
    return @{ state = @{ ceo_orders_bs = $pending } }
  } catch { return $null }
}
