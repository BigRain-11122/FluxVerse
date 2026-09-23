# Probe: git repos (5 repos) -> COMMIT events + zone activity + history
# Events: COMMIT (registered)

function Probe-git {
  param($ctx)
  try {
    $root = $ctx.root
    $repoDirs = @{
      'fluxgroup' = @{ dir = $root;                              zone = 'governance' }
      'minigame'  = @{ dir = (Join-Path $root 'gaming\MiniGame');  zone = 'gaming' }
      'bigmoney'  = @{ dir = (Join-Path $root 'quant\bigmoney');   zone = 'quant' }
      'bigstream' = @{ dir = (Join-Path $root 'media\BigStream');  zone = 'media' }
      'fluxverse' = @{ dir = (Join-Path $root 'gaming\FluxVerse'); zone = 'governance' }
    }
    $commitStats = @{}
    $lastCommits = @{}
    $newCur = @{}
    foreach ($name in @($repoDirs.Keys)) {
      $r = $repoDirs[$name]; $d = $r.dir
      if (-not (Test-Path (Join-Path $d '.git'))) { continue }
      $cnt = 0
      $out = & git -C $d rev-list --count HEAD 2>$null
      if ($LASTEXITCODE -eq 0 -and $out) { $cnt = [int]$out }
      $commitStats[$name] = $cnt
      $lines = @(& git -C $d log -50 --pretty='%H|%aI|%s' 2>$null)
      $fresh = @()
      foreach ($ln in $lines) {
        if (-not $ln) { continue }
        $p = $ln -split '\|', 3
        if ($p.Count -lt 3) { continue }
        $fresh += ,@($p[0], $p[1], $p[2])
      }
      $curKey = 'repo:' + $name
      $curHash = ''
      if ($ctx.cursor.ContainsKey($curKey)) { $curHash = $ctx.cursor[$curKey] }
      $reached = $false
      foreach ($f in $fresh) {
        if ($reached) { break }
        if ($f[0] -eq $curHash) { $reached = $true; break }
        & $ctx.AddEvent 'COMMIT' $name $name $r.zone ($f[1] + ' ' + $f[2])
      }
      if ($fresh.Count -gt 0) {
        $lastCommits[$name] = $fresh[0][1]
        $newCur[$curKey] = $fresh[0][0]
      }
    }
    # zone activity: commits in last 24h, capped 0..1
    $zoneActivity = @{ gaming = 0.0; quant = 0.0; media = 0.0 }
    $iso24 = (Get-Date).ToUniversalTime().AddHours(-24).ToString('yyyy-MM-ddTHH:mm:ss')
    foreach ($name in @($repoDirs.Keys)) {
      $r = $repoDirs[$name]; $z = $r.zone
      if (-not $zoneActivity.ContainsKey($z)) { continue }
      $d = $r.dir
      $n24 = 0
      $out = & git -C $d rev-list --count --since="$iso24" HEAD 2>$null
      if ($LASTEXITCODE -eq 0 -and $out) { $n24 = [int]$out }
      $a = [math]::Min(1.0, $n24 / 10.0)
      if ($a -gt $zoneActivity[$z]) { $zoneActivity[$z] = $a }
    }
    $total = 0
    foreach ($v in $commitStats.Values) { $total += $v }
    $lastAny = ''
    foreach ($v in $lastCommits.Values) { if ($v -gt $lastAny) { $lastAny = $v } }

    return @{
      state = @{ zones_activity = $zoneActivity; commits_total = $total; last_commit_ts = $lastAny }
      newcur = $newCur
    }
  } catch { return $null }
}
