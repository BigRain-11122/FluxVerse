# probes/census.ps1
# r165: census birth-station face - data leg of the P-39 birth station (DESIGN
# sec.16.2 half-alive face: real population total + rolling recent-birth wall).
# READ-ONLY consumes BigLife census/export/citizens-light.jsonl (consumption
# contract per BigLife census INDEX.md). Field law: PUBLIC-WHITELIST v1.0
# public-face only - wall cards carry id/name/species/district/profession;
# deep-water fields (hook / recent_ring / recent_ring_date) are never surfaced.
# Emits RESIDENT_BIRTH (registered T2 2026-09-25, first-register law) for
# census ids ABOVE the last-seen id frontier. Measured growth law: id space is
# dense ascending (C-00001..C-10009 minus 6 revoked honor seats 4..9; generated
# range ends exactly at the file tail) - birth batches / user registrations
# continue upward. Mid-range inserts (CEO re-named honor seats filling 4..9)
# grow count/sum but NOT the frontier -> no birth event (honesty: honor seats
# are not births). The cursor keeps count|sum|max so any id-set change stays
# observable - nothing is silently missed (cursor-design third law).
# Fresh run (no cursor) seeds silently: the standing 10003 population never
# replays as births (historic-silence seed law, r6 family).
# Cursor: census:frontier = '<count>|<sum>|<max>' ('=' never in the value).
# ts honesty: census file mtime -> UTC (r95 transfers family law).
# Degrade: torn/partial export (< 1000 id lines), missing file or any error ->
# $null (section absent, next round self-heals; zero consumer impact).
# Contract: laws 1-8 (read-only / ASCII body / Probe-<name> / try-catch
# degrade / TECH sec.2+9 registration / no native capture / explicit UTF-8
# reads / no world\ writes).

function Probe-census {
  param($ctx)
  try {
    $censusPath = Join-Path $ctx.root 'life\BigLife\census\export\citizens-light.jsonl'
    if (-not (Test-Path $censusPath)) { return $null }

    # last-seen frontier '<count>|<sum>|<max>'; absent/malformed = fresh seed
    $oldMax = -1
    if ($ctx.cursor -and $ctx.cursor.ContainsKey('census:frontier')) {
      $raw = [string]$ctx.cursor['census:frontier']
      $fp = $raw -split '\|'
      if (@($fp).Count -eq 3) {
        try { $oldMax = [long]$fp[2] } catch { $oldMax = -1 }
      }
    }

    # single streaming pass: id scalars + new-birth picks + top-15 wall
    $u8 = New-Object System.Text.UTF8Encoding($false)
    $idRe = [regex]'"id":\s*"(C-\d{5})"'
    $nameRe = [regex]'"name":\s*"([^"]*)"'
    $specRe = [regex]'"species":\s*"([^"]*)"'
    $distRe = [regex]'"district":\s*"([^"]*)"'
    $profRe = [regex]'"profession":\s*"([^"]*)"'
    $n = 0
    $sum = [long]0
    $max = [long]-1
    $wall = New-Object System.Collections.ArrayList
    $newBirths = New-Object System.Collections.ArrayList
    foreach ($ln in [System.IO.File]::ReadLines($censusPath, $u8)) {
      $m = $idRe.Match($ln)
      if (-not $m.Success) { continue }
      $cid = $m.Groups[1].Value
      $idn = [long]($cid.Substring(2))
      $n++
      $sum += $idn
      if ($idn -gt $max) { $max = $idn }

      # new-birth candidate: above the last-seen frontier
      if ($oldMax -ge 0 -and $idn -gt $oldMax) {
        $bn = ''
        $bm = $nameRe.Match($ln)
        if ($bm.Success) { $bn = $bm.Groups[1].Value }
        [void]$newBirths.Add(@{ id = $cid; name = $bn })
      }

      # wall candidate: keep top 15 by numeric id (recent-birth wall)
      $take = $false
      if ($wall.Count -lt 15) { $take = $true }
      else {
        $lastw = $wall[$wall.Count - 1]
        if ($idn -gt [long]$lastw.idn) { $take = $true }
      }
      if ($take) {
        $card = [ordered]@{}
        $card['id'] = $cid
        $cm = $nameRe.Match($ln); if ($cm.Success) { $card['name'] = $cm.Groups[1].Value } else { $card['name'] = '' }
        $cm = $specRe.Match($ln); if ($cm.Success) { $card['species'] = $cm.Groups[1].Value } else { $card['species'] = '' }
        $cm = $distRe.Match($ln); if ($cm.Success) { $card['district'] = $cm.Groups[1].Value } else { $card['district'] = '' }
        $cm = $profRe.Match($ln); if ($cm.Success) { $card['profession'] = $cm.Groups[1].Value } else { $card['profession'] = '' }
        $entry = @{ idn = $idn; card = $card }
        $ix = $wall.Count
        while ($ix -gt 0) {
          $prev = $wall[$ix - 1]
          if ([long]$prev.idn -ge $idn) { break }
          $ix--
        }
        $wall.Insert($ix, $entry)
        while ($wall.Count -gt 15) { $wall.RemoveAt($wall.Count - 1) }
      }
    }
    # torn/partial export guard: a real census is 10000+; anything tiny = mid-rewrite
    if ($n -lt 1000) { return $null }

    $gen = (Get-Item $censusPath).LastWriteTime.ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ss') + 'Z'

    # emit: one RESIDENT_BIRTH per new id above the frontier, ascending order
    if ($newBirths.Count -gt 0) {
      $sortedB = @($newBirths | Sort-Object { [long]($_.id.Substring(2)) })
      foreach ($b in $sortedB) {
        $sm = 'birth ' + [string]$b.id
        if ($b.name) { $sm = $sm + ' ' + [string]$b.name }
        & $ctx.AddEvent 'RESIDENT_BIRTH' 'biglife' 'biglife' 'governance' $sm $gen
      }
    }

    $cards = New-Object System.Collections.ArrayList
    foreach ($w in $wall) { [void]$cards.Add($w.card) }

    return @{
      state = @{
        census_total = [int]$n
        census_generated_utc = $gen
        census_wall = $cards.ToArray()
      }
      newcur = @{
        'census:frontier' = ('' + $n + '|' + $sum + '|' + $max)
      }
    }
  } catch {
    return $null
  }
}
