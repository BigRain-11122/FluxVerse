# test-verify-queue-due.ps1 - sandbox proof for the r749 verify-side wiring (main#87)
# ---------------------------------------------------------------------------
# WHY: r745 put the overdue count on the page, r747 made a badly written `due`
# marker visible on the page - and neither reached the tick, which is the only
# thing that runs unattended every ten minutes. This harness injects queue
# directories through the same hook verify uses (FLUXVERSE_QUEUE_DIR) and
# asserts the line flips between HEALTH and WARN.
#
# Judge criteria (main#87, two questions):
#   1. the tick sees the marker census at all (open/dated/late/max/bad tokens)
#   2. it goes red-honest WITHOUT failing the gate: bad markers, overdue rows
#      and a missing directory are WARNs, never a FAIL and never a silent zero
#   3. prose in a non-remark cell does not make a row accuse itself
#      (the r747 false-hit class: 5 hits on the author's own row)
#   4. a strict deadline quoted in backticks (invisible by rule) is reported as
#      a read-only `code=` count - it never turns the line red (main#101)
#
# Boundary: verify.ps1 is executed for real (read-only against world state; it
# only rewrites the event cursor with the same count). The live queue is read
# but never modified. ASCII-only law: no CJK in this file (PS5.1 GBK trap).

$ErrorActionPreference = 'Stop'
$verify = Join-Path (Split-Path $PSScriptRoot -Parent) 'perceptor\verify.ps1'
if (-not (Test-Path -LiteralPath $verify)) { throw ('verify.ps1 not found: ' + $verify) }

$script:fails = 0
function Check([string]$name, [bool]$ok, [string]$detail) {
  if ($ok) { Write-Output ('PASS ' + $name) }
  else { $script:fails++; Write-Output ('FAIL ' + $name + ' :: ' + $detail) }
}

function Run-Verify([string]$queueDir) {
  if ($queueDir) { $env:FLUXVERSE_QUEUE_DIR = $queueDir }
  else { Remove-Item Env:\FLUXVERSE_QUEUE_DIR -ErrorAction SilentlyContinue }
  $out = @(& $verify 2>&1 | ForEach-Object { [string]$_ })
  Remove-Item Env:\FLUXVERSE_QUEUE_DIR -ErrorAction SilentlyContinue
  return $out
}

function Get-QdueLine($out) {
  return @($out | Where-Object { $_ -match '^VERIFY (HEALTH|WARN): qdue:' })
}

# ---------- sandbox queues ---------------------------------------------------
$sandbox = Join-Path ([System.IO.Path]::GetTempPath()) ('fv-verifyqdue-' + $PID)
if (Test-Path -LiteralPath $sandbox) { Remove-Item -LiteralPath $sandbox -Recurse -Force }
$utf8 = New-Object System.Text.UTF8Encoding($false)

function New-Queue([string]$name, [string]$body) {
  $d = Join-Path $sandbox $name
  New-Item -ItemType Directory -Path $d -Force | Out-Null
  [System.IO.File]::WriteAllText((Join-Path $d 'q.md'), $body, $utf8)
  return $d
}

# healthy: two future deadlines, nothing late, nothing broken
$dirOk = New-Queue 'ok' @"
# fixture queue: healthy

| # | task | ptr | note |
|---|---|---|---|
| 1 | open, future deadline | p | due=2026-12-25 |
| 2 | open, undated | p | nothing here |
"@

# broken: a single mis-written marker in the remark cell
$dirBad = New-Queue 'bad' @"
# fixture queue: broken marker

| # | task | ptr | note |
|---|---|---|---|
| 1 | open, future deadline | p | due=2026-12-25 |
| 2 | short month | p | due=2026-1-5 |
"@

# prose: the r747 false-hit class - the subject cell QUOTES a broken marker
$dirProse = New-Queue 'prose' @"
# fixture queue: prose about markers

| # | task | ptr | note |
|---|---|---|---|
| 1 | fix the due=2026-1-5 case | p | nothing here |
| 2 | quote of due: 2026-01-05 | p | nothing here |
"@

# late: one deadline in the past
$dirLate = New-Queue 'late' @"
# fixture queue: overdue

| # | task | ptr | note |
|---|---|---|---|
| 1 | open, overdue | p | due=2026-01-05 |
"@

# quoted (main#101): a strict deadline written inside backticks dates nothing,
# so it silently disappears - the read-only code= count is what makes it visible
$dirCode = New-Queue 'code' @'
# fixture queue: quoted deadline

| # | task | ptr | note |
|---|---|---|---|
| 1 | quoted real deadline | p | `due=2026-01-05` |
'@

# long (main#110): a row over the width cap is structural debt, not a marker
# bug - the tick must name it without turning it into a bad-marker account
$padLong = 'z' * 3500
$dirLong = New-Queue 'long' @"
# fixture queue: over-cap row

| # | task | ptr | note |
|---|---|---|---|
| 1 | short row | p | nothing here |
| 2 | long row | p | $padLong |
"@

# ---------- 1. live machine --------------------------------------------------
$out = Run-Verify ''
$text = $out -join "`n"
$live = @(Get-QdueLine $out)
Check 'live machine prints exactly one qdue line' ($live.Count -eq 1) $text
if ($live.Count -eq 1) {
  Check 'live line carries open=' ($live[0] -match 'open=\d+') $live[0]
  Check 'live line carries dated=' ($live[0] -match 'dated=\d+') $live[0]
  Check 'live line carries late=' ($live[0] -match 'late=\d+') $live[0]
  Check 'live line carries max=' ($live[0] -match 'max=\d+d') $live[0]
  Check 'live line carries bad=' ($live[0] -match 'bad=\d+') $live[0]
  Check 'live line carries code=' ($live[0] -match 'code=\d+') $live[0]
  Check 'live line carries long=' ($live[0] -match 'long=\d+') $live[0]
  Check 'live line carries longmax=' ($live[0] -match 'longmax=\d+') $live[0]
}
Check 'live gate still passes with the census wired' ($text -match 'VERIFY PASS') $text
Check 'live census text contains no FAIL token' (-not ($text -match 'FAIL')) $text

# ---------- 2. healthy fixture -> HEALTH, bad=0 ------------------------------
$out2 = Run-Verify $dirOk
$text2 = $out2 -join "`n"
$h2 = @(Get-QdueLine $out2)
Check 'healthy fixture prints one qdue line' ($h2.Count -eq 1) $text2
if ($h2.Count -ge 1) {
  Check 'healthy fixture is a HEALTH line' ($h2[0] -match '^VERIFY HEALTH: qdue:') $h2[0]
  Check 'healthy fixture has bad=0' ($h2[0] -match 'bad=0(?!\d)') $h2[0]
  Check 'healthy fixture has late=0' ($h2[0] -match 'late=0(?!\d)') $h2[0]
  Check 'healthy fixture counts two open rows' ($h2[0] -match 'open=2(?!\d)') $h2[0]
  Check 'healthy fixture counts one dated row' ($h2[0] -match 'dated=1(?!\d)') $h2[0]
}

# ---------- 3. bad marker -> WARN naming the token ---------------------------
$out3 = Run-Verify $dirBad
$text3 = $out3 -join "`n"
$w3 = @($out3 | Where-Object { $_ -match '^VERIFY WARN: qdue:' })
Check 'bad marker flips the line to WARN' ($w3.Count -eq 1) $text3
if ($w3.Count -eq 1) {
  Check 'WARN reports bad=1' ($w3[0] -match 'bad=1(?!\d)') $w3[0]
  Check 'WARN names the offending token' ($w3[0] -match '#2\(due=2026-1-5 shape\)') $w3[0]
  Check 'WARN says where the marker belongs' ($w3[0] -match 'remark cell') $w3[0]
}
Check 'bad marker does not fail the gate' ($text3 -match 'VERIFY PASS') $text3
Check 'bad marker text contains no FAIL token' (-not ($text3 -match 'FAIL')) $text3

# ---------- 4. prose in a non-remark cell -> not counted (main#87 part 1) ----
$out4 = Run-Verify $dirProse
$text4 = $out4 -join "`n"
$h4 = @(Get-QdueLine $out4)
Check 'prose fixture prints one qdue line' ($h4.Count -eq 1) $text4
if ($h4.Count -ge 1) {
  Check 'prose about a broken marker is not bad' ($h4[0] -match 'bad=0(?!\d)') $h4[0]
  Check 'prose fixture stays a HEALTH line' ($h4[0] -match '^VERIFY HEALTH: qdue:') $h4[0]
}

# ---------- 5. overdue row -> WARN, still no FAIL ---------------------------
$out5 = Run-Verify $dirLate
$text5 = $out5 -join "`n"
$w5 = @($out5 | Where-Object { $_ -match '^VERIFY WARN: qdue:' })
Check 'overdue fixture flips the line to WARN' ($w5.Count -eq 1) $text5
if ($w5.Count -eq 1) {
  Check 'WARN reports late=1' ($w5[0] -match 'late=1(?!\d)') $w5[0]
  Check 'WARN names the overdue row' ($w5[0] -match '#1 \d+d') $w5[0]
}
Check 'overdue fixture does not fail the gate' ($text5 -match 'VERIFY PASS') $text5

# ---------- 5b. quoted deadline -> code=1, still HEALTH, still no FAIL -------
$out5b = Run-Verify $dirCode
$text5b = $out5b -join "`n"
$h5b = @(Get-QdueLine $out5b)
Check 'quoted fixture prints one qdue line' ($h5b.Count -eq 1) $text5b
if ($h5b.Count -eq 1) {
  Check 'quoted fixture reports code=1' ($h5b[0] -match 'code=1(?!\d)') $h5b[0]
  Check 'quoted fixture still stays HEALTH (a count is not a verdict)' ($h5b[0] -match '^VERIFY HEALTH: qdue:') $h5b[0]
  Check 'quoted fixture counts no deadline' ($h5b[0] -match 'dated=0(?!\d)') $h5b[0]
}
Check 'quoted fixture text contains no FAIL token' (-not ($text5b -match 'FAIL')) $text5b

# ---------- 5c. over-cap row -> WARN naming it, separate from bad (main#110)
$out5c = Run-Verify $dirLong
$text5c = $out5c -join "`n"
$w5c = @($out5c | Where-Object { $_ -match '^VERIFY WARN: qdue:' })
Check 'over-cap fixture flips the line to WARN' ($w5c.Count -eq 1) $text5c
if ($w5c.Count -eq 1) {
  Check 'over-cap fixture reports long=1' ($w5c[0] -match 'long=1(?!\d)') $w5c[0]
  Check 'over-cap fixture keeps bad=0 (two separate accounts)' ($w5c[0] -match 'bad=0(?!\d)') $w5c[0]
  Check 'over-cap WARN names the row and its length' ($w5c[0] -match '#2 \d{4,}') $w5c[0]
  Check 'over-cap WARN says which rule it broke' ($w5c[0] -match 'one row is one item') $w5c[0]
}
Check 'over-cap fixture does not fail the gate' ($text5c -match 'VERIFY PASS') $text5c
Check 'over-cap fixture text contains no FAIL token' (-not ($text5c -match 'FAIL')) $text5c

# ---------- 6. missing directory -> WARN "unknown", never zero --------------
$missing = Join-Path $sandbox 'no-such-queue'
$out6 = Run-Verify $missing
$text6 = $out6 -join "`n"
$w6 = @($out6 | Where-Object { $_ -match '^VERIFY WARN: qdue:' })
Check 'missing dir flips the line to WARN' ($w6.Count -eq 1) $text6
if ($w6.Count -eq 1) {
  Check 'missing dir says unknown, not zero' ($w6[0] -match 'unknown, not zero') $w6[0]
  Check 'missing dir prints no comfort counts' (-not ($w6[0] -match 'bad=0')) $w6[0]
}
Check 'missing dir does not fail the gate' ($text6 -match 'VERIFY PASS') $text6
Check 'missing dir text contains no FAIL token' (-not ($text6 -match 'FAIL')) $text6

# ---------- 7. protocol hygiene --------------------------------------------
Check 'census is called in-process (no powershell child)' `
  (-not (Select-String -Path $verify -Pattern 'powershell\.exe|powershell -' -Quiet)) 'verify.ps1 spawns a shell'

Remove-Item -Recurse -Force $sandbox -ErrorAction SilentlyContinue

if ($script:fails -gt 0) { Write-Output ('RESULT: FAIL (' + $script:fails + ')'); exit 1 }
Write-Output 'RESULT: PASS'
exit 0