# Sandbox test for DevLoop r94 - P-12 slices 1+2 (D-20260925-02):
#   A0 static laws: tick v1.6 round-end lands before the log write; new probe
#      ticklog.ps1 is ASCII + explicit-UTF8-read; fleet_tasks TASK_DONE split;
#      registry desc flips (5 types emitting, TRANSFER still reserved).
#   A1 probe behavior: block parsing / complete-block gating / cursor advance /
#      re-run silence / torn-tail wait / fresh-run stream dedup / ts honesty.
#   A2 fleet_tasks: claim vs done event split, claim-first-done board, ownerless
#      registration stays silent.
# ASCII-only (encoding law). Exit 0 = all green, 1 = any FAIL.

$pass = 0; $fail = 0
function Assert([bool]$cond, [string]$name) {
  if ($cond) { $script:pass++; Write-Output ('PASS ' + $name) }
  else { $script:fail++; Write-Output ('FAIL ' + $name) }
}

$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$repo = Split-Path $here -Parent
$probeDir = Join-Path $repo 'Tools\perceptor\probes'
$utf8 = New-Object System.Text.UTF8Encoding($false)

# ---------- A0 static ----------
$tickText = [System.IO.File]::ReadAllText((Join-Path $repo 'Tools\tick\tick.ps1'))
$endIdx = $tickText.IndexOf('] round end')
$writeIdx = $tickText.IndexOf('WriteAllText($logFile')
Assert (($endIdx -ge 0) -and ($writeIdx -ge 0) -and ($endIdx -lt $writeIdx)) 'A0-1 tick v1.6 round-end marker appended BEFORE the log write'
$endCount = ([regex]::Matches($tickText, [regex]::Escape('] round end'))).Count
Assert ($endCount -eq 1) 'A0-2 tick v1.6 single round-end builder (no stray post-write append)'

$ticklogPath = Join-Path $probeDir 'ticklog.ps1'
$bytes = [System.IO.File]::ReadAllBytes($ticklogPath)
$nonAscii = @($bytes | Where-Object { $_ -gt 127 }).Count
Assert ($nonAscii -eq 0) 'A0-3 ticklog.ps1 ASCII-only body'
$ticklogText = [System.IO.File]::ReadAllText($ticklogPath)
Assert ($ticklogText.Contains('Get-Content $logFile -Encoding UTF8')) 'A0-4 ticklog reads the log with explicit UTF8 (template law 7/8)'

$ftText = [System.IO.File]::ReadAllText((Join-Path $probeDir 'fleet_tasks.ps1'))
Assert ($ftText.Contains("'TASK_DONE'")) 'A0-5 fleet_tasks TASK_DONE branch present'
Assert ($ftText.Contains('^(done|complete|completed|closed)$')) 'A0-6 fleet_tasks done-family match present'

$reg = Get-Content (Join-Path $repo 'schema\events-registry.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$ok5 = $true
foreach ($t in @('TASK_DONE','OS_TICK_START','OS_TICK_DONE','GATE_PASS','GATE_BLOCK')) {
  $d = [string]$reg.events.$t.desc
  if ($d -notmatch 'emitting since 2026-09-25') { $ok5 = $false }
}
Assert $ok5 'A0-7 registry: 5 types flipped to emitting'
Assert (([string]$reg.events.TRANSFER.desc) -match 'reserved') 'A0-8 registry: TRANSFER stays reserved (slice 3 pending)'

# ---------- helpers ----------
$script:cap = @()
$addEvent = { param($t,$a,$r,$z,$s,$ts) $script:cap += ($t + '|' + $s + '|' + $ts) }
. (Join-Path $probeDir 'ticklog.ps1')
. (Join-Path $probeDir 'fleet_tasks.ps1')

function New-Sandbox([string]$tag) {
  $d = Join-Path $env:TEMP ('devloop-r94-' + $tag + '-' + [guid]::NewGuid().ToString('N').Substring(0,8))
  New-Item -ItemType Directory -Path (Join-Path $d 'world') -Force | Out-Null
  New-Item -ItemType Directory -Path (Join-Path $d 'logs') -Force | Out-Null
  return $d
}
$today = (Get-Date).ToString('yyyyMMdd')

# ---------- A1 ticklog probe ----------
$sb = New-Sandbox 't1'
$logFile = Join-Path $sb ('logs\tick-' + $today + '.log')
$NL = "`r`n"
$b1 = "[2026-09-25 00:10:23] FluxVerseTick round start" + $NL + "  scan: perceptor v0.7 done: events +5 quarantined=0 fleet=6 tasks=39" + $NL + "  gate: VERIFY PASS" + $NL + "  gate: PASS" + $NL + "  pub: export: ok"
$b2 = "[2026-09-25 00:20:31] FluxVerseTick round start" + $NL + "  backoff: perceptor stack dirty (in-flight dev edits) - scan+verify skipped this round" + $NL + "  pub: export: ok" + $NL + "[2026-09-25 00:20:32] round end"
$b3 = "[2026-09-25 00:30:40] FluxVerseTick round start" + $NL + "  gate: VERIFY FAIL: state: field missing: x" + $NL + "  gate: FAIL" + $NL + "  pub: export: ok" + $NL + "[2026-09-25 00:30:41] round end"
$b4 = "[2026-09-25 00:40:50] FluxVerseTick round start" + $NL + "  scan: perceptor v0.7 done: events +2 quarantined=0 fleet=6 tasks=39"
[System.IO.File]::WriteAllText($logFile, ($b1 + $NL + $b2 + $NL + $b3 + $NL + $b4 + $NL), $utf8)

$curKey = 'ticklog:' + $today
$ctx = @{ worldDir = (Join-Path $sb 'world'); cursor = @{}; now = '2026-09-25T02:00:00Z'; AddEvent = $addEvent }
$null = Probe-ticklog $ctx
Assert ($script:cap.Count -eq 8) ('A1-1 run1 fires 8 events (3+2+3, torn tail silent), got ' + $script:cap.Count)
$starts = @($script:cap | Where-Object { $_ -like 'OS_TICK_START|*' }).Count
Assert ($starts -eq 3) 'A1-2 run1 fires 3 OS_TICK_START (one per complete block)'
$gp = @($script:cap | Where-Object { $_ -like 'GATE_PASS|*' }).Count
$gb = @($script:cap | Where-Object { $_ -like 'GATE_BLOCK|*' }).Count
Assert (($gp -eq 1) -and ($gb -eq 1)) 'A1-3 run1 gate split PASS=1 FAIL=1'
Assert (@($script:cap | Where-Object { $_ -like 'OS_TICK_DONE|*done (backoff)*' }).Count -eq 1) 'A1-4 backoff round emits DONE(backoff) and no gate'
Assert (@($script:cap | Where-Object { $_ -like 'GATE_*|*00:20:31*' }).Count -eq 0) 'A1-5 backoff round emits no gate event'
Assert ([string]$ctx.cursor[$curKey] -eq '2026-09-25 00:30:40') ('A1-6 cursor stops at last COMPLETE block (torn 00:40:50 excluded), got ' + [string]$ctx.cursor[$curKey])
$expTs = ([datetime]::ParseExact('2026-09-25 00:10:23', 'yyyy-MM-dd HH:mm:ss', $null)).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
$b1line = @($script:cap | Where-Object { $_ -like '*|*00:10:23*|*' })
Assert (($b1line.Count -gt 0) -and (@($b1line | Where-Object { $_.EndsWith('|' + $expTs) }).Count -eq $b1line.Count)) 'A1-7 ts honesty: block events carry the round stamp as UTC, not scan now'

$n1 = $script:cap.Count
$null = Probe-ticklog $ctx
Assert ($script:cap.Count -eq $n1) 'A1-8 re-run on unchanged log fires zero events'
Assert ([string]$ctx.cursor[$curKey] -eq '2026-09-25 00:30:40') 'A1-9 re-run leaves cursor unchanged'

$b5 = "[2026-09-25 00:50:00] FluxVerseTick round start" + $NL + "  gate: VERIFY PASS" + $NL + "  gate: PASS" + $NL + "[2026-09-25 00:50:01] round end"
[System.IO.File]::AppendAllText($logFile, ($b5 + $NL), $utf8)
$null = Probe-ticklog $ctx
Assert ($script:cap.Count -eq ($n1 + 3)) 'A1-10 appended complete block fires exactly 3 (START+GATE_PASS+DONE)'
Assert ([string]$ctx.cursor[$curKey] -eq '2026-09-25 00:50:00') 'A1-11 cursor advances to the new block'

# fresh-run stream dedup (family law): pre-seeded live-stream line suppresses only the dup
$sb2 = New-Sandbox 't2'
$lf2 = Join-Path $sb2 ('logs\tick-' + $today + '.log')
$c1 = "[2026-09-25 03:10:00] FluxVerseTick round start" + $NL + "  gate: PASS" + $NL + "[2026-09-25 03:10:01] round end"
$c2 = "[2026-09-25 03:20:00] FluxVerseTick round start" + $NL + "  gate: PASS" + $NL + "[2026-09-25 03:20:01] round end"
[System.IO.File]::WriteAllText($lf2, ($c1 + $NL + $c2 + $NL), $utf8)
$seedLine = '{"ts_utc":"2026-09-24T19:10:00Z","type":"OS_TICK_START","actor":"FluxVerseTick","repo":"fluxverse","zone":"governance","summary":"tick round 2026-09-25 03:10:00 start"}'
[System.IO.File]::WriteAllText((Join-Path $sb2 'world\world-events.jsonl'), ($seedLine + "`n"), $utf8)
$script:cap = @()
$ctx2 = @{ worldDir = (Join-Path $sb2 'world'); cursor = @{}; now = '2026-09-25T04:00:00Z'; AddEvent = $addEvent }
$null = Probe-ticklog $ctx2
Assert ($script:cap.Count -eq 5) ('A1-12 fresh run dedups only the pre-fired line (2+3 fire), got ' + $script:cap.Count)
Assert (@($script:cap | Where-Object { $_ -like 'OS_TICK_START|*03:10:00 start*' }).Count -eq 0) 'A1-13 pre-fired START stays silent on fresh run'
Assert ([string]$ctx2.cursor[$curKey] -eq '2026-09-25 03:20:00') 'A1-14 fresh-run cursor still advances past deduped blocks'

# ---------- A2 fleet_tasks probe ----------
$sb3 = New-Sandbox 't3'
$tdir = Join-Path $sb3 'quant\bigmoney\fleet\tasks'
New-Item -ItemType Directory -Path $tdir -Force | Out-Null
$script:cap = @()
$fctx = @{ root = $sb3; worldDir = (Join-Path $sb3 'world'); cursor = @{}; now = '2026-09-25T05:00:00Z'; AddEvent = $addEvent }
[System.IO.File]::WriteAllText((Join-Path $tdir 'TA.json'), '{"id":"T-A","status":"claimed","claimed_by":"bm-a"}', $utf8)
$null = Probe-fleet_tasks $fctx
Assert (@($script:cap | Where-Object { $_ -like 'TASK_CLAIM|T-A -> claimed*' }).Count -eq 1) 'A2-1 new claim fires TASK_CLAIM'
$script:cap = @()
[System.IO.File]::WriteAllText((Join-Path $tdir 'TA.json'), '{"id":"T-A","status":"done","claimed_by":"bm-a"}', $utf8)
$null = Probe-fleet_tasks $fctx
Assert (@($script:cap | Where-Object { $_ -like 'TASK_DONE|T-A -> done*' }).Count -eq 1) 'A2-2 flip to done fires TASK_DONE'
Assert (@($script:cap | Where-Object { $_ -like 'TASK_CLAIM|*' }).Count -eq 0) 'A2-3 done flip does NOT fire TASK_CLAIM'
$script:cap = @()
$null = Probe-fleet_tasks $fctx
Assert ($script:cap.Count -eq 0) 'A2-4 unchanged board stays silent'
$script:cap = @()
[System.IO.File]::WriteAllText((Join-Path $tdir 'TB.json'), '{"id":"T-B","status":"done","claimed_by":"bm-b"}', $utf8)
$null = Probe-fleet_tasks $fctx
Assert (@($script:cap | Where-Object { $_ -like 'TASK_DONE|T-B -> done*' }).Count -eq 1) 'A2-5 claim-first board: task first seen done emits only TASK_DONE'
Assert (@($script:cap | Where-Object { $_ -like 'TASK_CLAIM|T-B*' }).Count -eq 0) 'A2-6 claim-first done board emits no CLAIM'
$script:cap = @()
[System.IO.File]::WriteAllText((Join-Path $tdir 'TC.json'), '{"id":"T-C","status":"registered"}', $utf8)
$null = Probe-fleet_tasks $fctx
Assert ($script:cap.Count -eq 0) 'A2-7 ownerless registration stays silent'
$script:cap = @()
[System.IO.File]::WriteAllText((Join-Path $tdir 'TC.json'), '{"id":"T-C","status":"claimed","claimed_by":"bm-c"}', $utf8)
$null = Probe-fleet_tasks $fctx
Assert (@($script:cap | Where-Object { $_ -like 'TASK_CLAIM|T-C -> claimed*' }).Count -eq 1) 'A2-8 later claim fires TASK_CLAIM'
Assert ([string]$fctx.cursor['task:T-C'] -eq 'bm-c|claimed') 'A2-9 cursor holds owner|status'

# ---------- cleanup + verdict ----------
foreach ($d in @($sb, $sb2, $sb3)) { Remove-Item $d -Recurse -Force -ErrorAction SilentlyContinue }
Write-Output ('r94 sandbox verdict: pass=' + $pass + ' fail=' + $fail)
if ($fail -gt 0) { exit 1 } else { exit 0 }
