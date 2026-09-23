# Probe: fleet tasks (BigMoney task board) -> tasks entities
# Events: TASK_CLAIM / TASK_DONE (registered; v0.1 emits TASK_CLAIM on new/changed task)

function Probe-fleet_tasks {
  param($ctx)
  try {
    $tasks = @()
    $taskDir = Join-Path $ctx.root 'quant\bigmoney\fleet\tasks'
    if (-not (Test-Path $taskDir)) { return @{ state = @{ tasks = $tasks } } }
    foreach ($f in (Get-ChildItem $taskDir -Filter *.json)) {
      $tid = $f.BaseName; $st = 'unknown'; $ow = ''
      try {
        $t = Get-Content $f.FullName -Raw -Encoding UTF8 | ConvertFrom-Json
        if ($t.id) { $tid = [string]$t.id }
        if ($t.status) { $st = [string]$t.status }
        if ($t.owner) { $ow = [string]$t.owner }
        elseif ($t.claimed_by) { $ow = [string]$t.claimed_by }
      } catch {}
      $tasks += @{ id = $tid; zone = 'quant'; owner = $ow; status = $st }
      $curKey = 'task:' + $tid
      $curVal = ''
      if ($ctx.cursor.ContainsKey($curKey)) { $curVal = $ctx.cursor[$curKey] }
      if ($curVal -ne ($ow + '|' + $st)) {
        if ($ow) { & $ctx.AddEvent 'TASK_CLAIM' $ow 'bigmoney' 'quant' ($tid + ' -> ' + $st) }
        $ctx.cursor[$curKey] = ($ow + '|' + $st)
      }
    }
    return @{ state = @{ tasks = $tasks } }
  } catch { return $null }
}
