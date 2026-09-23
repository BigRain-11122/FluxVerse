# Probe: Biggame A/B/C machines -> fleet entities + HEARTBEAT events
# F2 fix: gaming-line machines were uncovered -> GAME city was mute.
# Consolidated 2026-09-23: dual-source online/work state -
#   heartbeat json (Design/configs/GLOBAL/fleet/*.json, pulse lane can be slow) OR
#   MiniGame automation snapshot (dui-fang-ji summary line proves B/C still working).
# Events: HEARTBEAT (registered)

function Probe-fleet_minigame {
  param($ctx)
  try {
    $fleet = @()
    $dir = Join-Path $ctx.root 'gaming\MiniGame\Design\configs\GLOBAL\fleet'
    if (-not (Test-Path $dir)) { return @{ state = @{ } } }

    # snapshot work text for B/C (their own reports into the shared line)
    $snapName = ''
    foreach ($cp in @(0x81ea,0x52a8,0x5316,0x5feb,0x7167)) { $snapName += [char]$cp }   # zi-dong-hua kuai-zhao
    $snapName += '.md'
    $snap = Join-Path (Join-Path $ctx.root 'gaming\MiniGame') $snapName
    $snapFresh = $false
    $workB = ''
    $workC = ''
    if (Test-Path $snap) {
      $snapItem = Get-Item $snap
      $snapFresh = (((Get-Date) - $snapItem.LastWriteTime).TotalMinutes -le 30)
      $needle = ''
      foreach ($cp in @(0x5bf9,0x65b9,0x673a,0x6458,0x8981)) { $needle += [char]$cp }   # dui-fang-ji-zhai-yao
      $sumLine = ''
      foreach ($ln in (Get-Content $snap -Encoding UTF8)) {
        if ($ln.Contains($needle)) { $sumLine = $ln; break }
      }
      if ($sumLine) {
        $idxB = $sumLine.IndexOf('B=')
        $idxC = $sumLine.IndexOf('C=')
        if ($idxB -ge 0) {
          if ($idxC -gt $idxB) { $workB = $sumLine.Substring($idxB + 2, $idxC - $idxB - 2).Trim() }
          else { $workB = $sumLine.Substring($idxB + 2).Trim() }
        }
        if ($idxC -ge 0) { $workC = $sumLine.Substring($idxC + 2).Trim() }
      }
    }

    foreach ($f in (Get-ChildItem $dir -Filter *.json)) {
      try { $m = Get-Content $f.FullName -Raw -Encoding UTF8 | ConvertFrom-Json } catch { continue }
      $mid = [string]$m.machine_id
      if (-not $mid) { $mid = $f.BaseName }
      $id = 'BG-' + $mid.ToUpper()
      $seenAt = [string]$m.ts
      $online = $false
      try {
        $ls = [datetime]::ParseExact($seenAt, 'yyyy-MM-ddTHH:mm:ss', $null)
        $online = ((Get-Date) - $ls).TotalMinutes -le 60   # biggame pulse lane is slower than bigmoney
      } catch {}
      $cores = 0
      try { $cores = [int]$m.cpu.cores } catch {}
      $task = [string]$m.verdict
      # dual source: stale heartbeat but fresh snapshot work report = still on the job
      if (-not $online -and $snapFresh) {
        if ($mid -eq 'B' -and $workB.Length -gt 0) { $online = $true; $task = $workB }
        elseif ($mid -eq 'C' -and $workC.Length -gt 0) { $online = $true; $task = $workC }
      }
      if ($task.Length -gt 120) { $task = $task.Substring(0,120) + ([string][char]46 + [string][char]46 + [string][char]46) }
      $fleet += @{ id = $id; online = $online; last_seen = $seenAt; cores = $cores; current_task = $task; company = 'biggame' }
      $curKey = 'bgfleet:' + $id
      $curSeen = ''
      if ($ctx.cursor.ContainsKey($curKey)) { $curSeen = $ctx.cursor[$curKey] }
      $curVal = $seenAt + '|' + $task
      if ($curSeen -ne $curVal) {
        & $ctx.AddEvent 'HEARTBEAT' $id 'minigame' 'gaming' ('pulse=' + $seenAt + ' verdict=' + $task)
      }
      $ctx.cursor[$curKey] = $curVal
    }
    return @{ state = @{ fleet_biggame = $fleet } }
  } catch { return $null }
}
