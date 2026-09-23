# Probe: CEO orders (BigMoney fleet/orders) -> pending list + CEO_ORDER events
# Events: CEO_ORDER (registered)

function Probe-orders {
  param($ctx)
  try {
    $pending = @()
    $ordersDir = Join-Path $ctx.root 'quant\bigmoney\fleet\orders'
    if (Test-Path $ordersDir) {
      foreach ($f in (Get-ChildItem $ordersDir -Filter *.md)) {
        if ($f.Name -eq 'README.md') { continue }   # dir doc, not an order
        $pending += $f.BaseName
        $curKey = 'order:' + $f.BaseName
        if (-not $ctx.cursor.ContainsKey($curKey)) {
          & $ctx.AddEvent 'CEO_ORDER' 'CEO' 'bigmoney' 'quant' ('order ' + $f.BaseName)
          $ctx.cursor[$curKey] = '1'
        }
      }
    }
    return @{ state = @{ ceo_orders_pending = $pending } }
  } catch { return $null }
}
