# Probe: MiniGame live task panel (root state*.json g_projects)
#   -> GAME_STAGE events + state gametasks_* (GAME city game-building face).
# Backlog line "[P2] MiniGame task panel / BigStream output probe" - the
# MiniGame half claimed r48 (the BigStream half closed r47).
# SOURCE-FACE VERIFICATION (no-guess-path law, MEDIA-row family) - the source
# is MiniGame's own declared authority, not a guess:
#   (a) their central board (shared-control central priority board) states the
#       live pointer authority is the root automation snapshot + state.json;
#   (b) g_projects carries its own law note: the project list is ALWAYS
#       state-derived, hand-written fixed lists forbidden (07 hao sec.10);
#   (c) three machine shapes verified on disk r48: state.json (machine A,
#       direct GXX_Name keys with owner/stage), state-b.json (machine B,
#       nested stage_cards.GXX), state-c.json (machine C, direct keys with
#       owner implied by the file suffix). A machine letter comes from the
#       file name (state.json -> A, state-<x>.json -> <x>).
# STAGE TOKEN LAW: the panel prose is round-noisy task detail, so the event
# key is the COARSE stage marker only - leading S<number> (S2, S2.5, S4),
# else U<number> (rework/review campaigns), else leading ASCII word
# (managed), else the leading CJK run cut at the first delimiter (B's G08
# ships CJK-head stages like dai-shen - without this branch two CJK-head
# stages would both collapse to 'other' and a real move between them would
# never fire), else 'none' (empty stage). A prose edit inside the same stage
# never fires; a real stage move fires exactly once. Rows whose value is not
# an object (C's G10 panel row is a raw batch-history string) carry no
# structured stage and are skipped honestly.
# CURSOR LAW (r6 content-addressed family): mgtp:<owner>:<gid> = coarse token
# ('=' stripped from key material). Migration (no mgtp:* keys yet): rows whose
# stage_since is TODAY that never pulsed fire once (dedup authority = the
# live event stream, which only holds today); older rows seed silently - no
# old-history replay. Post-migration: a changed token fires a transition
# '<old> -> <new>'; a brand-new game id fires an 'enter' row (a real WIP
# registration; post-fresh arrivals always fire, the panel has no dates to
# trust on arrival).
# Read-only (sibling repo, never a write). ASCII-only body (encoding law:
# CJK lives only in the data). Self-limit: any failure returns $null
# (degrade, never block the city scan).
# Event type registered: GAME_STAGE (T2 2026-09-24, veto window 2026-10-01).

function Probe-minigame_tasks {
  param($ctx)
  try {
    $mgDir = Join-Path $ctx.root 'gaming\MiniGame'
    if (-not (Test-Path $mgDir)) { return @{ state = @{ } } }
    $fresh = @($ctx.cursor.Keys | Where-Object { $_ -like 'mgtp:*' }).Count -eq 0
    # migration only: today's panel events already fired (dedup authority)
    $fired = @{}
    if ($fresh -and $ctx.worldDir) {
      $evf = Join-Path $ctx.worldDir 'world-events.jsonl'
      if (Test-Path $evf) {
        foreach ($ev in (Get-Content $evf -Encoding UTF8)) {
          if ($ev -notmatch '"GAME_STAGE"') { continue }
          try { $o = $ev | ConvertFrom-Json } catch { continue }
          if ([string]$o.type -eq 'GAME_STAGE') { $fired[[string]$o.summary] = $true }
        }
      }
    }
    $today = (Get-Date).ToString('yyyy-MM-dd')
    $items = @()
    $stateFiles = @(Get-ChildItem $mgDir -File | Where-Object { $_.Name -match '^state(-[a-z0-9]+)?\.json$' } | Sort-Object Name)
    foreach ($sf in $stateFiles) {
      $mach = 'A'
      if ($sf.Name -match '^state-([a-z0-9]+)\.json$') { $mach = $Matches[1].ToUpper() }
      $j = $null
      try { $j = Get-Content $sf.FullName -Raw -Encoding UTF8 | ConvertFrom-Json } catch { continue }
      if (-not $j -or -not $j.g_projects) { continue }
      # rows = (panel-key, game-object) pairs; two shapes: direct GXX keys
      # (machines A/C) and nested stage_cards.GXX (machine B) - union both.
      $rows = @()
      foreach ($p in $j.g_projects.PSObject.Properties) {
        if ($p.Name -notmatch '^G\d+') { continue }
        if ($p.Value -is [System.Management.Automation.PSCustomObject]) { $rows += ,@($p.Name, $p.Value) }
      }
      $sc = $j.g_projects.PSObject.Properties['stage_cards']
      if ($sc -and $sc.Value) {
        foreach ($p in $sc.Value.PSObject.Properties) {
          if ($p.Name -notmatch '^G\d+') { continue }
          if ($p.Value -is [System.Management.Automation.PSCustomObject]) { $rows += ,@($p.Name, $p.Value) }
        }
      }
      foreach ($pair in $rows) {
        $pkey = $pair[0]; $g = $pair[1]
        $gid = $pkey; $name = ''
        if ($pkey -match '^(G\d+)_(.+)$') { $gid = $Matches[1]; $name = $Matches[2] }
        $token = Get-StageToken ([string]$g.stage)
        $since = ''
        $sinceRaw = [string]$g.stage_since
        if ($sinceRaw.Length -ge 10) {
          $d10 = $sinceRaw.Substring(0, 10)
          if ($d10 -match '^\d{4}-\d{2}-\d{2}$') { $since = $d10 }
        }
        $owner = [string]$g.owner
        if (-not $owner) { $owner = $mach }
        $blocked = $false
        if (([string]$g.blocked_on).Trim().Length -gt 0) { $blocked = $true }
        $item = @{ id = $gid; name = $name; zone = 'gaming'; owner = $owner
                   lifecycle = [string]$g.lifecycle; stage = $token
                   stage_since = $since; blocked = $blocked }
        if ($g.PSObject.Properties['wip_slot']) { $wv = $g.wip_slot; if ($wv -is [bool]) { $item['wip'] = $wv } }
        $items += $item
        $kmat = (($owner + ':' + $gid) -replace '=', '')
        $ck = 'mgtp:' + $kmat
        $old = ''
        if ($ctx.cursor.ContainsKey($ck)) { $old = [string]$ctx.cursor[$ck] }
        if ($old -eq $token) { continue }
        if ($old) {
          # a real stage move on a known game -> one transition event
          $ctx.cursor[$ck] = $token
          & $ctx.AddEvent 'GAME_STAGE' $gid 'minigame' 'gaming' ($gid + ' ' + $name + ': ' + $old + ' -> ' + $token)
        } elseif (-not $fresh) {
          # post-migration arrival (new WIP registration on the panel)
          $ctx.cursor[$ck] = $token
          & $ctx.AddEvent 'GAME_STAGE' $gid 'minigame' 'gaming' ($gid + ' ' + $name + ': enter ' + $token)
        } elseif ($since -eq $today) {
          # migration: today's transition that never pulsed -> backfill once
          $sum = $gid + ' ' + $name + ': enter ' + $token
          $ctx.cursor[$ck] = $token
          if (-not $fired.ContainsKey($sum)) {
            & $ctx.AddEvent 'GAME_STAGE' $gid 'minigame' 'gaming' $sum
          }
        } else {
          # older stage = history we were not alive for -> silent seed only
          $ctx.cursor[$ck] = $token
        }
      }
    }
    $active = 0; $review = 0; $blockedN = 0
    foreach ($it in $items) {
      if ([string]$it.stage -like 'S*') { $active++ }
      if ([string]$it.stage -like 'U*') { $review++ }
      if ($it.blocked) { $blockedN++ }
    }
    return @{ state = @{ gametasks_items = $items; gametasks_total = $items.Count
                         gametasks_active = $active; gametasks_review = $review
                         gametasks_blocked = $blockedN } }
  } catch { return $null }
}

function Get-StageToken {
  # coarse stage marker: S2 / S2.5 / S4 / U153 / managed / CJK-head / none
  param([string]$s)
  $t = $s.Trim()
  while ($t.Length -gt 0 -and $t[0] -eq '*') { $t = $t.Substring(1) }
  if ($t -match '^(S\d+(?:\.\d+)?)') { return $Matches[1] }
  if ($t -match '^(U\d+)') { return $Matches[1] }
  if ($t -match '^([A-Za-z][A-Za-z0-9_\-]{0,11})') { return $Matches[1] }
  # CJK-head stage (e.g. dai-shen): capture the leading ideograph run,
  # cut at the first delimiter - never let two different CJK stages collapse
  if ($t.Length -gt 0 -and [int][char]$t[0] -ge 0x4E00 -and [int][char]$t[0] -le 0x9FFF) {
    $run = ''
    foreach ($ch in $t.ToCharArray()) {
      $ci = [int][char]$ch
      if ($ci -lt 0x4E00 -or $ci -gt 0x9FFF) { break }
      $run += [string]$ch
      if ($run.Length -ge 6) { break }
    }
    if ($run.Length -gt 0) { return $run }
  }
  if ($t.Length -eq 0) { return 'none' }
  return 'other'
}
