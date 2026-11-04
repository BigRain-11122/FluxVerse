# test-verify-residents.ps1 - sandbox for the resident-voice face (r828 main#138)
#
# The face has two halves: probe residents.ps1 records READINGS (model name,
# installed/not/unknown, who spoke when), Tools\devloop\resident-verdict.ps1
# turns them into a VERDICT, and verify.ps1 prints it. This sandbox proves the
# two pure halves. It does NOT run the whole verify gate (r790: the verify
# family has no budget left for another full gate run); the live wiring is
# proven by the tick itself, exactly once per round.
#
# Cases:
#   a) model roster: installed / not installed / unknown (three states, not two)
#   b) voice meta: never spoke -> age=null; 30h old -> silent; fresh -> age<1
#   c) age formatting: null=never, minutes under 1h, hours otherwise
#   d) verdict: healthy city -> HEALTH, uninstalled model -> WARN + names it
#   e) verdict: unreadable roster -> WARN, unknown is not zero
#   f) verdict: no readings -> WARN (absence is not health)
#   g) reading: missing state / torn state / real state
#   h) no verdict line ever carries the tick red-scan token
#
# ASCII-only law: no CJK in this file.

$ErrorActionPreference = 'Stop'
$module = Join-Path $PSScriptRoot 'resident-verdict.ps1'
$probe = Join-Path (Split-Path -Parent $PSScriptRoot) 'perceptor\probes\residents.ps1'
foreach ($p in @($module, $probe)) {
    if (-not (Test-Path -LiteralPath $p)) { Write-Output ('setup FAIL: missing ' + $p); exit 1 }
}

$pass = 0
$fail = 0
function Check([string]$name, [bool]$cond) {
    if ($cond) { Write-Output ('  PASS ' + $name); $script:pass++ }
    else { Write-Output ('  FAIL ' + $name); $script:fail++ }
}

. $module
# Probe helpers live in the probe file; dot-source it (it only defines
# functions at load time, no side effects).
. $probe

$allLines = New-Object System.Collections.ArrayList

# ---------- a) model roster / status ----------
Write-Output '--- a) model roster ---'
$rosterOk = @{ ok = $true; names = @('qwen3:4b-instruct', 'nomic-embed-text:latest') }
$stA = Get-ResidentModelStatus -Model 'qwen3:4b-instruct' -Roster $rosterOk
Check 'installed model -> present'      ($stA.known -eq $true -and $stA.present -eq $true)
$stB = Get-ResidentModelStatus -Model 'qwen2.5:7b-instruct' -Roster $rosterOk
Check 'absent model -> not present'     ($stB.known -eq $true -and $stB.present -eq $false)
$rosterDown = @{ ok = $false; names = @() }
$stC = Get-ResidentModelStatus -Model 'qwen3:4b-instruct' -Roster $rosterDown
Check 'unreadable roster -> unknown'    ($stC.known -eq $false -and $null -eq $stC.present)
$stD = Get-ResidentModelStatus -Model 'qwen3:4b-instruct' -Roster $null
Check 'null roster -> unknown'          ($stD.known -eq $false -and $null -eq $stD.present)

# ---------- b) voice meta ----------
Write-Output '--- b) voice meta ---'
$nowUtc = (Get-Date).ToUniversalTime()
$fresh = $nowUtc.AddMinutes(-10).ToString('yyyy-MM-ddTHH:mm:ssZ')
$old = $nowUtc.AddHours(-30).ToString('yyyy-MM-ddTHH:mm:ssZ')
$curEmpty = @{}
$m0 = Get-ResidentVoiceMeta $curEmpty @('bm-a', 'BG-A') 'qwen3:4b-instruct' @{ present = $true; known = $true } 3
Check 'no lines -> age is null'         ($null -eq $m0.last_say_age_h)
Check 'no lines -> everyone silent'     ([int]$m0.silent_n -eq 2)
Check 'no lines -> speakers 0'          ([int]$m0.speakers_n -eq 0)
# r830: the census splits into two halves that always reconcile.
Check 'no lines -> never 2'             ([int]$m0.never_n -eq 2)
Check 'no lines -> stale 0'             ([int]$m0.stale_n -eq 0)
Check 'no lines -> say+never=residents' (([int]$m0.speakers_n + [int]$m0.never_n) -eq [int]$m0.residents_n)
Check 'no lines -> last none'           ([string]::IsNullOrEmpty([string]$m0.last_say_utc))
$curMix = @{ 'res:bm-a:ts' = $old; 'res:BG-A:ts' = $fresh }
$m1 = Get-ResidentVoiceMeta $curMix @('bm-a', 'BG-A') 'qwen3:4b-instruct' @{ present = $true; known = $true } 3
Check 'mixed -> speakers 2'             ([int]$m1.speakers_n -eq 2)
Check 'mixed -> one silent (30h)'       ([int]$m1.silent_n -eq 1)
# A 30h-old line is stale but still a speaker - the old single count made
# "say=2 silent=1" look like 3 residents out of 2.
Check 'mixed -> stale 1, never 0'       ([int]$m1.stale_n -eq 1 -and [int]$m1.never_n -eq 0)
Check 'mixed -> say+never=residents'    (([int]$m1.speakers_n + [int]$m1.never_n) -eq [int]$m1.residents_n)
Check 'mixed -> stale is subset of say' ([int]$m1.stale_n -le [int]$m1.speakers_n)
Check 'mixed -> last is the fresh one'  ([string]$m1.last_say_utc -eq $fresh)
Check 'mixed -> age under 1h'           ($m1.last_say_age_h -ne $null -and [double]$m1.last_say_age_h -lt 1)
Check 'meta carries model/presence'     ([string]$m1.model -eq 'qwen3:4b-instruct' -and $m1.model_present -eq $true)
# r829: the two rosters are different facts and must not collapse into one
# number (a fixture with equal counts would hide the old bug, so 2 vs 3).
Check 'meta: city roster is cards'      ([int]$m1.residents_n -eq 2)
Check 'meta: model table is models_n'   ([int]$m1.models_n -eq 3)
$curMissing = @{ 'res:bm-a:ts' = '' }
$m2 = Get-ResidentVoiceMeta $curMissing @('bm-a') 'x' @{ present = $true; known = $true } 1
Check 'empty ts -> silent, not a speaker' ([int]$m2.silent_n -eq 1 -and [int]$m2.speakers_n -eq 0)

# ---------- c) age formatting ----------
Write-Output '--- c) age format ---'
Check 'null -> never'                   ((Format-ResidentAge $null) -eq 'never')
Check '30m -> minutes form'             ((Format-ResidentAge 0.5) -eq '30m')
Check '8.1h -> hours form'              ((Format-ResidentAge 8.1) -eq '8.1h')
Check 'negative -> never'               ((Format-ResidentAge -1) -eq 'never')

# ---------- d) verdict: healthy ----------
Write-Output '--- d) verdict healthy ---'
$rHealthy = @{ exists = $true; unreadable = $false; meta = [PSCustomObject]@{
    model = 'qwen3:4b-instruct'; model_present = $true; model_known = $true;
    residents_n = 5; models_n = 4; speakers_n = 5; never_n = 0; stale_n = 1; silent_n = 1;
    last_say_utc = $fresh; last_say_age_h = 0.2 } }
$vH = Get-ResidentVoiceVerdict $rHealthy
Check 'healthy -> health'               ($vH.verdict -eq 'health')
Check 'healthy -> names model'          ($vH.line -match 'model=qwen3:4b-instruct')
Check 'healthy -> present=1'            ($vH.line -match 'present=1')
Check 'healthy -> residents/say/never/stale' ($vH.line -match 'residents=5 say=5 never=0 stale=1')
Check 'healthy -> no overlapping silent=' ($vH.line -notmatch 'silent=')
Check 'healthy -> models is its own'    ($vH.line -match 'models=4')
Check 'healthy -> never says roster='   ($vH.line -notmatch 'roster=')
[void]$allLines.Add($vH.line)

# ---------- e) verdict: model missing / roster unknown ----------
Write-Output '--- e) verdict warnings ---'
$rMissing = @{ exists = $true; unreadable = $false; meta = [PSCustomObject]@{
    model = 'qwen2.5:7b-instruct'; model_present = $false; model_known = $true;
    residents_n = 5; models_n = 4; speakers_n = 5; silent_n = 1; last_say_utc = $fresh; last_say_age_h = 0.2 } }
$vM = Get-ResidentVoiceVerdict $rMissing
Check 'missing model -> warn'           ($vM.verdict -eq 'warn' -and $vM.reason -eq 'model-not-installed')
Check 'missing model -> present=0'      ($vM.line -match 'present=0')
Check 'missing model -> names the model' ($vM.line -match 'qwen2\.5:7b-instruct')
[void]$allLines.Add($vM.line)
$rUnknown = @{ exists = $true; unreadable = $false; meta = [PSCustomObject]@{
    model = 'qwen3:4b-instruct'; model_present = $null; model_known = $false;
    residents_n = 2; models_n = 0; speakers_n = 0; silent_n = 2; last_say_utc = ''; last_say_age_h = $null } }
$vU = Get-ResidentVoiceVerdict $rUnknown
Check 'unknown roster -> warn'          ($vU.verdict -eq 'warn' -and $vU.reason -eq 'roster-unreadable')
Check 'unknown roster -> present=unknown' ($vU.line -match 'present=unknown')
Check 'unknown roster -> never, not 0h' ($vU.line -match 'age=never')
[void]$allLines.Add($vU.line)
# A reading published BEFORE r829 carries roster_n (= model count) and no
# residents_n/models_n. Both halves must print `?` - reading the legacy key as
# a resident count would restore the exact bug this round removes.
$rLegacy = @{ exists = $true; unreadable = $false; meta = [PSCustomObject]@{
    model = 'qwen3:4b-instruct'; model_present = $true; model_known = $true;
    roster_n = 4; speakers_n = 5; silent_n = 0; last_say_utc = $fresh; last_say_age_h = 0.3 } }
$vL = Get-ResidentVoiceVerdict $rLegacy
Check 'legacy reading -> residents=?'   ($vL.line -match 'residents=\?')
Check 'legacy reading -> models=?'      ($vL.line -match 'models=\?')
Check 'legacy reading -> never 4 as city' ($vL.line -notmatch 'residents=4')
# r830: the old `silent_n` meant never+stale, so a legacy number must not be
# borrowed as either new half.
Check 'legacy reading -> never=?/stale=?' ($vL.line -match 'never=\? stale=\?')
Check 'legacy reading -> silent 0 hidden' ($vL.line -notmatch 'never=0|stale=0')
[void]$allLines.Add($vL.line)

# ---------- f) verdict: no readings ----------
Write-Output '--- f) verdict no readings ---'
$vN = Get-ResidentVoiceVerdict @{ exists = $true; unreadable = $false; meta = $null }
Check 'no readings -> warn'             ($vN.verdict -eq 'warn' -and $vN.reason -eq 'no-readings')
Check 'no readings -> says unknown'     ($vN.line -match 'say=unknown')
[void]$allLines.Add($vN.line)
$vMiss = Get-ResidentVoiceVerdict @{ exists = $false; unreadable = $false; meta = $null }
Check 'no state -> warn no-state'       ($vMiss.verdict -eq 'warn' -and $vMiss.reason -eq 'no-state')

# ---------- g) reading: file shapes ----------
Write-Output '--- g) reading ---'
$tmpDir = Join-Path ([System.IO.Path]::GetTempPath()) ('fv-residents-' + $PID)
if (Test-Path $tmpDir) { Remove-Item $tmpDir -Recurse -Force }
New-Item -ItemType Directory -Path $tmpDir | Out-Null
try {
    $missing = Join-Path $tmpDir 'nope.json'
    $r1 = Get-ResidentVoiceReading -StatePath $missing
    Check 'missing file -> exists=false' ($r1.exists -eq $false)
    $torn = Join-Path $tmpDir 'torn.json'
    [System.IO.File]::WriteAllText($torn, '{ not json', (New-Object System.Text.UTF8Encoding($false)))
    $r2 = Get-ResidentVoiceReading -StatePath $torn
    Check 'torn file -> unreadable'      ($r2.exists -eq $true -and $r2.unreadable -eq $true)
    $okFile = Join-Path $tmpDir 'ok.json'
    [System.IO.File]::WriteAllText($okFile, '{"ts_utc":"2026-01-01T00:00:00Z","residents_meta":{"model":"m","model_present":true,"model_known":true,"speakers_n":1,"silent_n":0,"last_say_age_h":1.5,"last_say_utc":"2026-01-01T00:00:00Z"}}', (New-Object System.Text.UTF8Encoding($false)))
    $r3 = Get-ResidentVoiceReading -StatePath $okFile
    Check 'real file -> meta read'       ($r3.exists -eq $true -and $null -ne $r3.meta -and [string]$r3.meta.model -eq 'm')
    $v3 = Get-ResidentVoiceVerdict $r3
    Check 'real file -> healthy verdict' ($v3.verdict -eq 'health' -and $v3.line -match 'age=1\.5h')
} finally {
    if (Test-Path $tmpDir) { Remove-Item $tmpDir -Recurse -Force -ErrorAction SilentlyContinue }
}

# ---------- h) red-scan token ----------
Write-Output '--- h) red-scan token ---'
Check 'verdict lines carry 3+ samples'  ($allLines.Count -ge 3)
Check 'no verdict line says FAIL'       (@($allLines | Where-Object { $_ -match 'FAIL' }).Count -eq 0)

# ---------- i) city roster (r835) ----------
# The page names the residents (r835). Both halves of that read are proven here:
# the card title carries the display name, world-state carries the last word
# time and the routine place. Same rules as the voice face: a missing age is
# null (= never spoke, never 0), a missing cards dir is exists=false (= not a
# zero-resident city), and a heading without a separator yields name=''.
Write-Output '--- i) city roster ---'
$tmpR = Join-Path ([System.IO.Path]::GetTempPath()) ('fv-roster-' + $PID)
if (Test-Path $tmpR) { Remove-Item $tmpR -Recurse -Force }
New-Item -ItemType Directory -Path $tmpR | Out-Null
try {
    $sep = [string][char]0xFF1A
    $cards = Join-Path $tmpR 'cards'
    New-Item -ItemType Directory -Path $cards | Out-Null
    $utf8 = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText((Join-Path $cards 'A-1.md'), ('# CARD (A-1)' + $sep + 'Alpha One' + "`n" + '- job: test' + "`n"), $utf8)
    [System.IO.File]::WriteAllText((Join-Path $cards 'B-2.md'), ('# CARD (B-2)' + "`n"), $utf8)
    $now = [DateTimeOffset]::Parse('2026-01-01T12:00:00Z')
    $state = ConvertFrom-Json '{"residents":{"A-1":{"ts":"2026-01-01T11:00:00Z","location":"night-shift"},"B-2":{"ts":"2025-12-31T12:00:00Z","location":"made-up"}}}'
    $ro = Get-ResidentRoster -CardsDir $cards -State $state -NowUtc $now
    Check 'roster read ok'               ($ro.exists -eq $true)
    Check 'roster counts every card'     ([int]$ro.n -eq 2)
    Check 'roster counts talked rows'    ([int]$ro.talked_n -eq 2)
    $rowA = @($ro.rows | Where-Object { $_.id -eq 'A-1' })[0]
    $rowB = @($ro.rows | Where-Object { $_.id -eq 'B-2' })[0]
    Check 'card title carries the name'  ($rowA.name -eq 'Alpha One')
    Check 'no separator -> empty name'   ($rowB.name -eq '')
    Check 'age measured from ts'         ([math]::Abs([double]$rowA.age_h - 1.0) -lt 0.01)
    Check 'routine place carried'        ($rowA.place -eq 'night-shift')
    Check 'unknown place carried as-is'  ($rowB.place -eq 'made-up')
    $noState = Get-ResidentRoster -CardsDir $cards -State (ConvertFrom-Json '{}') -NowUtc $now
    Check 'no state -> age null not 0'   ($null -eq (@($noState.rows)[0].age_h) -and [int]$noState.talked_n -eq 0)
    $missDir = Get-ResidentRoster -CardsDir (Join-Path $tmpR 'nope') -State $state -NowUtc $now
    Check 'missing cards dir is not zero' ($missDir.exists -eq $false -and [int]$missDir.n -eq 0)
    $futureState = ConvertFrom-Json '{"residents":{"A-1":{"ts":"2026-01-02T00:00:00Z","location":"ji-dui-su-she"}}}'
    $roF = Get-ResidentRoster -CardsDir $cards -State $futureState -NowUtc $now
    Check 'future ts -> age null'        ($null -eq (@($roF.rows | Where-Object { $_.id -eq 'A-1' })[0].age_h))
    Check 'roster row carries no speech' ($null -eq ($rowA.PSObject.Properties['line']))
} finally {
    if (Test-Path $tmpR) { Remove-Item $tmpR -Recurse -Force -ErrorAction SilentlyContinue }
}

# ---------- j) quiet rounds must not erase the roster (r837) ----------
# scan.ps1 merges probe state by replacing each key, so whatever the probe
# returns for `residents` wins outright. The early returns (no events / nobody
# eligible) used to answer @{} -- so every quiet round wiped the promoted map
# and the page named nobody (roster talked=0) while residents_meta -- built
# from the SAME cursor -- still said say=5. Both halves must come from one
# builder, or the two faces of one probe disagree on one screen.
Write-Output '--- j) quiet-round snapshot ---'
$tmpS = Join-Path ([System.IO.Path]::GetTempPath()) ('fv-snap-' + $PID)
if (Test-Path $tmpS) { Remove-Item $tmpS -Recurse -Force }
New-Item -ItemType Directory -Path $tmpS | Out-Null
try {
    $cardsJ = Join-Path $tmpS 'cards'
    New-Item -ItemType Directory -Path $cardsJ | Out-Null
    $utf8j = New-Object System.Text.UTF8Encoding($false)
    foreach ($nm in @('S-1', 'S-2', 'S-3')) {
        [System.IO.File]::WriteAllText((Join-Path $cardsJ ($nm + '.md')), ('# CARD (' + $nm + ')' + "`n"), $utf8j)
    }
    $curJ = @{
        'res:S-1:line' = 'line one'
        'res:S-1:ts'   = '2026-01-01T11:00:00Z'
        'res:S-1:loc'  = 'ji-dui-su-she'
        'res:S-2:line' = 'line two'
        'res:S-2:ts'   = '2026-01-01T11:30:00Z'
        'res:S-2:loc'  = 'night-shift'
    }
    $ctxJ = @{ cursor = $curJ }
    $snap = Get-ResidentSnapshot $ctxJ $cardsJ
    Check 'snapshot carries spoken rows'   (@($snap.Keys).Count -eq 2)
    Check 'snapshot keeps ts'              ([string]$snap['S-1'].ts -eq '2026-01-01T11:00:00Z')
    Check 'snapshot normalizes dorm place' ([string]$snap['S-1'].location -eq 'sleep')
    Check 'snapshot keeps night shift'     ([string]$snap['S-2'].location -eq 'night-shift')
    Check 'silent card gets no row'        (-not $snap.ContainsKey('S-3'))
    $snapNone = Get-ResidentSnapshot @{ cursor = @{} } $cardsJ
    Check 'empty cursor -> empty map'      (@($snapNone.Keys).Count -eq 0)
    $snapNoDir = Get-ResidentSnapshot $ctxJ (Join-Path $tmpS 'nope')
    Check 'missing cards dir -> empty'     (@($snapNoDir.Keys).Count -eq 0)
    # The regression itself: the quiet-round return value must still carry rows.
    $quiet = New-ResidentState (Get-ResidentSnapshot $ctxJ $cardsJ) @{ speakers_n = 2 }
    Check 'quiet return carries rows'      (@($quiet.state.residents.Keys).Count -eq 2)
    Check 'quiet return keeps meta'        ([int]$quiet.state.residents_meta.speakers_n -eq 2)
    # Anti-drift: no return path may publish a bare empty map again.
    $probeSrc = [System.IO.File]::ReadAllText($probe)
    Check 'no bare @{} state return'       ($probeSrc -notmatch 'New-ResidentState\s+@\{\}')
    Check 'one builder used on all paths'  (@([regex]::Matches($probeSrc, 'Get-ResidentSnapshot')).Count -ge 4)
} finally {
    if (Test-Path $tmpS) { Remove-Item $tmpS -Recurse -Force -ErrorAction SilentlyContinue }
}

# ---------- k) event-stream backfill (main#141, r838) ----------
# The roster is rebuilt from the perceptor cursor. Lose that file and both faces
# used to answer "never spoke" while world\world-events*.jsonl still held the
# RESIDENT_SAY rows. These cases prove the backup answers, that it is only
# consulted when the cursor is missing an entry, and that a healthy round is
# byte-for-byte what it was before.
Write-Output '--- k) event-stream backfill ---'
$tmpE = Join-Path ([System.IO.Path]::GetTempPath()) ('fv-evback-' + $PID)
if (Test-Path $tmpE) { Remove-Item $tmpE -Recurse -Force }
New-Item -ItemType Directory -Path $tmpE | Out-Null
try {
    $utf8e = New-Object System.Text.UTF8Encoding($false)
    # today's live file: only E-1 spoke; yesterday's rotated file: E-2 spoke.
    $evLive = Join-Path $tmpE 'world-events.jsonl'
    $evOld = Join-Path $tmpE 'world-events-20260101.jsonl'
    $lines1 = @(
        '{"ts_utc":"2026-01-02T09:00:00Z","type":"CITY_WAKE","actor":"x","summary":"noise"}',
        '{"ts_utc":"2026-01-02T10:00:00Z","type":"RESIDENT_SAY","actor":"E-1","summary":"live line one"}',
        '{"ts_utc":"2026-01-02T09:30:00Z","type":"RESIDENT_SAY","actor":"E-1","summary":"older line one"}'
    )
    [System.IO.File]::WriteAllLines($evLive, $lines1, $utf8e)
    $lines2 = @(
        '{"ts_utc":"2026-01-01T20:00:00Z","type":"RESIDENT_SAY","actor":"E-2","summary":"rotated line two"}',
        '{"ts_utc":"2026-01-01T21:00:00Z","type":"RESIDENT_SAY","actor":"Z-9","summary":"not a card here"}'
    )
    [System.IO.File]::WriteAllLines($evOld, $lines2, $utf8e)

    $ev = Get-ResidentEventIndex $tmpE @('E-1', 'E-2', 'E-3')
    Check 'index finds live speaker'       ([string]$ev.index['E-1'].ts -eq '2026-01-02T10:00:00Z')
    Check 'index keeps the newest line'    ([string]$ev.index['E-1'].line -eq 'live line one')
    Check 'index reaches rotated file'     ([string]$ev.index['E-2'].line -eq 'rotated line two')
    Check 'index refuses unknown actor'    (-not $ev.index.ContainsKey('Z-9'))
    Check 'index leaves missing card out'  (-not $ev.index.ContainsKey('E-3'))
    Check 'index reports incomplete'        ($ev.complete -eq $false -and [int]$ev.files_read -ge 2)
    $evFull = Get-ResidentEventIndex $tmpE @('E-1', 'E-2')
    Check 'complete when every card found'  ($evFull.complete -eq $true)
    Check 'stops once everyone is covered'  ([int]$evFull.files_read -le [int]$ev.files_read)

    # cards on disk, cursor wiped (= the rotation the debt describes)
    $cardsE = Join-Path $tmpE 'cards'
    New-Item -ItemType Directory -Path $cardsE | Out-Null
    foreach ($nm in @('E-1', 'E-2', 'E-3')) {
        [System.IO.File]::WriteAllText((Join-Path $cardsE ($nm + '.md')), ('# CARD (' + $nm + ')' + "`n"), $utf8e)
    }
    $snapEv = Get-ResidentSnapshot @{ cursor = @{} } $cardsE $ev.index
    Check 'lost cursor -> rows from events' (@($snapEv.Keys).Count -eq 2)
    Check 'backfilled row marks its source' ([string]$snapEv['E-1'].src -eq 'events')
    Check 'backfilled row keeps the line'   ([string]$snapEv['E-1'].line -eq 'live line one')
    Check 'backfilled row invents no place' ([string]::IsNullOrEmpty([string]$snapEv['E-1'].location))
    Check 'card with no history stays out'  (-not $snapEv.ContainsKey('E-3'))

    # the reading must agree with the rows (one city, one answer)
    $mBf = Get-ResidentVoiceMeta @{} @('E-1', 'E-2', 'E-3') 'm' @{ present = $true; known = $true } 1 $ev.index
    Check 'reading: 2 speakers, 1 never'     ([int]$mBf.speakers_n -eq 2 -and [int]$mBf.never_n -eq 1)
    Check 'reading: say+never=residents'     (([int]$mBf.speakers_n + [int]$mBf.never_n) -eq [int]$mBf.residents_n)
    Check 'reading: backfilled=2'            ([int]$mBf.backfilled_n -eq 2)
    Check 'reading: last is the newest'      ([string]$mBf.last_say_utc -eq '2026-01-02T10:00:00Z')

    # a healthy cursor round: the stream is NOT consulted, so backfilled=0
    $curOk = @{ 'res:E-1:line' = 'cursor line'; 'res:E-1:ts' = '2026-01-02T11:00:00Z' }
    $mOk = Get-ResidentVoiceMeta $curOk @('E-1') 'm' @{ present = $true; known = $true } 1 $ev.index
    Check 'cursor wins over the stream'      ([int]$mOk.backfilled_n -eq 0 -and [int]$mOk.speakers_n -eq 1)
    $snapOk = Get-ResidentSnapshot @{ cursor = $curOk } $cardsE $ev.index
    Check 'cursor row still says cursor'     ([string]$snapOk['E-1'].src -eq 'cursor')

    # absent world dir: no index, no fabrication, no crash
    $evNone = Get-ResidentEventIndex (Join-Path $tmpE 'nope') @('E-1')
    Check 'missing world dir -> empty'       (@($evNone.index.Keys).Count -eq 0 -and $evNone.complete -eq $false)
    $snapNone2 = Get-ResidentSnapshot @{ cursor = @{} } $cardsE $null
    Check 'no index -> no rows (not fake)'   (@($snapNone2.Keys).Count -eq 0)

    # verdict line: printed only when someone was backfilled
    $rBf = @{ exists = $true; unreadable = $false; meta = [PSCustomObject]@{
        model = 'm'; model_present = $true; model_known = $true;
        residents_n = 3; models_n = 1; speakers_n = 2; never_n = 1; stale_n = 0;
        backfilled_n = 2; last_say_utc = '2026-01-02T10:00:00Z'; last_say_age_h = 0.5 } }
    $vBf = Get-ResidentVoiceVerdict $rBf
    Check 'verdict names the backfill'       ($vBf.line -match 'backfilled=2')
    Check 'verdict stays healthy'            ($vBf.verdict -eq 'health')
    [void]$allLines.Add($vBf.line)
    $rNoBf = @{ exists = $true; unreadable = $false; meta = [PSCustomObject]@{
        model = 'm'; model_present = $true; model_known = $true;
        residents_n = 3; models_n = 1; speakers_n = 3; never_n = 0; stale_n = 0;
        backfilled_n = 0; last_say_utc = '2026-01-02T10:00:00Z'; last_say_age_h = 0.5 } }
    $vNoBf = Get-ResidentVoiceVerdict $rNoBf
    Check 'zero backfill -> no segment'      ($vNoBf.line -notmatch 'backfilled=')
    $rPre = @{ exists = $true; unreadable = $false; meta = [PSCustomObject]@{
        model = 'm'; model_present = $true; model_known = $true;
        residents_n = 3; models_n = 1; speakers_n = 3; never_n = 0; stale_n = 0;
        last_say_utc = '2026-01-02T10:00:00Z'; last_say_age_h = 0.5 } }
    $vPre = Get-ResidentVoiceVerdict $rPre
    Check 'pre-r838 reading -> no segment'   ($vPre.line -notmatch 'backfilled=')

    # roster: the row carries the source so the page can mark it
    $stateBf = ConvertFrom-Json '{"residents":{"E-1":{"ts":"2026-01-02T10:00:00Z","location":"","src":"events"}}}'
    $roBf = Get-ResidentRoster -CardsDir $cardsE -State $stateBf -NowUtc ([DateTimeOffset]::Parse('2026-01-02T12:00:00Z'))
    $rowE1 = @($roBf.rows | Where-Object { $_.id -eq 'E-1' })[0]
    Check 'roster row carries src'           ([string]$rowE1.src -eq 'events')
    Check 'roster row still no speech'       ($null -eq ($rowE1.PSObject.Properties['line']))

    # cost discipline: the scan is gated on a missing cursor line
    $probeSrc2 = [System.IO.File]::ReadAllText($probe)
    Check 'scan gated on cursor gaps'        ($probeSrc2 -match 'cursorGaps -gt 0')
    Check 'both faces share one index'       (@([regex]::Matches($probeSrc2, '\$eventIndex')).Count -ge 5)
} finally {
    if (Test-Path $tmpE) { Remove-Item $tmpE -Recurse -Force -ErrorAction SilentlyContinue }
}

Write-Output ''
Write-Output ('RESULT: pass=' + $pass + ' fail=' + $fail)
if ($fail -gt 0) { exit 1 }
exit 0