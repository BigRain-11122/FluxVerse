# Probe: fleet tasks (BigMoney task board) -> tasks entities
# Events: TASK_CLAIM / TASK_DONE (both registered; P-12 slice 2 r94 splits the
# transition into its true type - v0.1 fired TASK_CLAIM for EVERY change, so a
# task flipping to done pulsed a claim: wrong direction for the city map
# (TASK_DONE = robot-goes-home edge). done-family status -> TASK_DONE, the
# terminal fact wins when owner and status both move; a new/changed owner ->
# TASK_CLAIM; an ownerless board move stays silent (a registration without a
# claim has no robot to animate). Claim-first board: a task that first appears
# already claimed+done emits only TASK_DONE.)

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
        $isDone = ($st -match '^(done|complete|completed|closed)$')
        if ($ow -and $isDone) {
          & $ctx.AddEvent 'TASK_DONE' $ow 'bigmoney' 'quant' ($tid + ' -> done')
        } elseif ($ow) {
          & $ctx.AddEvent 'TASK_CLAIM' $ow 'bigmoney' 'quant' ($tid + ' -> ' + $st)
        }
        $ctx.cursor[$curKey] = ($ow + '|' + $st)
      }
    }
    return @{ state = @{ tasks = $tasks } }
  } catch { return $null }
}
