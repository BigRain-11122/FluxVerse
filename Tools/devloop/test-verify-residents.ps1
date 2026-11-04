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

Write-Output ''
Write-Output ('RESULT: pass=' + $pass + ' fail=' + $fail)
if ($fail -gt 0) { exit 1 }
exit 0