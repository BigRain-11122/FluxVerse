# ps-suites-tick.ps1 - let the tick run the sandbox families without anyone remembering (r750 main#88, r752 main#94)
# ---------------------------------------------------------------------------
# WHY: r748 gave the PowerShell sandboxes ONE entry (Tools\devloop\run-ps-suites.ps1)
# but nothing ever runs it. The tick is the only thing that runs unattended
# (every 5 minutes); if a round changes build-city-panel.ps1's $artPattern and
# nobody remembers to call the runner, the "both sides share one regex"
# anti-drift assertion stays unarmed and nothing in the logs says so.
# r751 gave the verify-side family its own entry (-Verify) and hit the same
# wall from the other side: eight sandboxes that only ran when a round
# remembered their names. r752 makes this module family-aware so the tick can
# run both without paying for both in one round (see COST below).
#
# DESIGN - content addressed, not wall-clock addressed. A family's suites only
# change their verdict when the sources they guard change, so the tick
# fingerprints that family's guarded source set (sha12 over path+content hash
# of every file listed in Get-PsSuitesTickDefaults -Family <f>):
#   * fingerprint unchanged  -> reuse the family ticket, spawn nothing (<100 ms)
#   * fingerprint changed    -> run the runner ONCE as a child process (it
#                               spawns per-suite children; suites end with
#                               `exit N`, so it can never run in-process) with
#                               a hard timeout, then overwrite the ticket
# Tickets are per family (write -> logs\.ps-suites-last.json, verify ->
# logs\.ps-suites-verify-last.json): one family going red must not overwrite
# the other's verdict, and the two fingerprints must never be compared.
#
# COST (main#94 acceptance): write ~19 s, verify ~80 s. Running both in one
# tick would double the round, so the two families are meant to be called in
# this order and the caller defers the second when the first really ran
# (`-CheckOnly` answers "would this family spawn?" without spawning). The tick
# wall clock therefore stays at max(write, verify), never their sum.
#
# RECURSION: the runner spawns suites, and some suites run verify.ps1 in
# process. Those nested gate runs must not start another family run, so the
# child is launched with FLUXVERSE_PS_SUITES_CHILD=1 and the caller skips.
#
# STICKY (main#91 r754): a content-addressed ticket cannot go green on its own
# when the cause was the environment (temp dir full, AV lock) rather than the
# code - only a human with -Force could clear it. Two fixes here:
#   * every real run records WHICH suites failed (`reds=`), because a sticky red
#     that cannot name its suite is a red nobody can act on (r754 found a live
#     one: verify family red=1, re-run clean, name lost forever);
#   * a NON-PASS ticket carries `tries`, and after AutoRetryAfter consecutive
#     cached citations (default 3) it re-runs by itself once. A PASSING ticket
#     is never auto-retried - "unchanged means no spawn" stays the main gain.
# Fixtures under Tools\devloop\fixtures are now part of the fingerprint (glob
# entry `Tools\devloop\fixtures\*\*` expands to an explicit file list), so a
# suite that reads a fixture cannot rot while the hash stands still.
#
# BASELINE (main#96 r757): a content-addressed ticket answers "did this change"
# but not "how much of the tick budget is this family eating". The verify family
# grew from 8 to 9 suites and its measured run went 101 s -> 112 s against a
# 180 s cap - nobody could see the remaining headroom without opening the log.
# So every real run appends its measured `ms` to `runs` (last three, oldest
# first, comma-joined string) and the ticket/result carry `base_ms` (their mean)
# plus `budget_over` (> 2/3 of the family cap). The printed line carries
# `base=`, and verify turns that into a WARN that says what to do about it.
# Cached PASS tickets are still never rewritten: history only moves on real runs.
#
# Honest boundaries:
#   - auto-retry heals the environment case, not a real defect: a genuine red
#     re-runs every N ticks (write 19 s, verify ~100 s) instead of every tick.
#   - the baseline is elapsed wall clock on THIS box under whatever load it had;
#     it answers "is the family near its cap", not "how fast is the code".
#   - 45 s cap (write) / 180 s cap (verify) / 165 s cap (verify2): the write run
#     measured 19.5 s, the eight light verify suites ~70 s, and the single
#     gate-of-the-gate sandbox 80.5 s (main#105: cap = 2x the measured run
#     rounded up to 5 s, and no family cap may exceed 1/3 of the tick
#     cadence). A hit means the machine is loaded or a suite hangs; we report
#     `timeout`, never a verdict. 180 s keeps ~2.5x headroom and still bounds a
#     hang inside one tick.
#   - main#99 split the verify family in two: together the nine suites measured
#     121.6 s (68% of the cap, past the 2/3 budget line r757 added) and every
#     edit to this module bought that run. verify (eight light suites) and
#     verify2 (the one heavy sandbox) keep separate tickets, and verify.ps1 runs
#     at most one of them per tick.
#   - the ticket's `exit` is the RUNNER's real exit code (main#97). Until r756
#     it was always 0 because `Start-Process -PassThru` yields an empty
#     ExitCode, so only `failing>0` could turn a ticket red; `-1` now means
#     "could not be read" and still counts as not-green.
#
# ASCII-only (PS5.1 GBK law). No auto-variable locals ($pid family, r164).
# ---------------------------------------------------------------------------

function Get-PsSuitesTickDefaults {
    # Guarded sources, per family. The three sets are deliberately kept apart:
    # editing build-city-panel.ps1 must not buy a verify-family run, editing
    # site-verdict.ps1 must not buy a write-side run, and the ~51 s
    # gate-of-the-gate sandbox must not ride along with the eight light verify
    # suites (main#99: together they measured 121.6 s = 68% of the 180 s cap).
    param([ValidateSet('write','write2','verify','verify2')][string]$Family = 'write')
    if ($Family -eq 'write2') {
        # main#117: the seven-suite write family measured 32.0 s against a 45 s
        # cap - past the 2/3 budget line, so every tick printed a WARN. Timed
        # one suite at a time it was 3.4 / 3.6 / 4.0 / 4.3 / 3.7 / 3.2 / 7.2 s:
        # no single suite eats the bulk, ~2.5-3 s per suite is PowerShell
        # process start. So the honest fix is to split by what each suite
        # guards and let one tick pay one half. This half is the face writer
        # plus the two census/QA tools whose sandboxes live beside it.
        return @(
            'Tools\devloop\test-write-status-face-bare.ps1',
            'logs\devloop-r247-facewriter-test.ps1',
            'Tools\devloop\test-nolivecheck-census.ps1',
            'Tools\devloop\test-qa-rotation.ps1',
            'Tools\devloop\run-ps-suites.ps1',
            'Tools\devloop\build-city-panel.ps1',
            'Tools\devloop\face-path-lint.ps1',
            'Tools\devloop\write-status-face.ps1',
            'Tools\devloop\nolivecheck-census.ps1',
            'Tools\devloop\census-cost.ps1',
            'Tools\devloop\qa-rotation.ps1',
            'Tools\devloop\fixtures\*\*'
        )
    }
    if ($Family -eq 'verify2') {
        # Only what can flip test-verify-ps-suites.ps1's verdict: the sandbox
        # itself, the tick module it dot-sources, the runner it drives, the
        # state-promote module the gate now calls, and the gate itself.
        return @(
            'Tools\devloop\test-verify-ps-suites.ps1',
            'Tools\devloop\ps-suites-tick.ps1',
            'Tools\devloop\run-ps-suites.ps1',
            'Tools\devloop\state-promote.ps1',
            'Tools\perceptor\verify.ps1'
        )
    }
    if ($Family -eq 'verify') {
        return @(
            'Tools\devloop\test-verify-r2-site.ps1',
            'Tools\devloop\test-verify-ambient.ps1',
            'Tools\devloop\test-verify-path-census.ps1',
            'Tools\devloop\test-verify-queue-due.ps1',
            'Tools\devloop\test-queue-due.ps1',
            'Tools\devloop\test-log-archive-duty.ps1',
            'Tools\devloop\test-probe-path-census.ps1',
            'Tools\devloop\test-state-promote.ps1',
            'Tools\devloop\state-promote.ps1',
            'Tools\devloop\run-ps-suites.ps1',
            'Tools\devloop\ps-suites-tick.ps1',
            'Tools\devloop\site-verdict.ps1',
            'Tools\devloop\ambient-verdict.ps1',
            'Tools\devloop\queue-due.ps1',
            'Tools\devloop\log-archive-duty.ps1',
            'Tools\devloop\archive-logs.ps1',
            'Tools\devloop\shell-chain-census.ps1',
            'Tools\perceptor\verify.ps1',
            'Tools\devloop\fixtures\*\*'
        )
    }
    # The other half of main#117: the state-file writer and the three suites
    # that prove it. Editing write-fastpath-state.ps1 must not buy the face
    # suites anymore (and vice versa).
    return @(
        'Tools\devloop\test-fastpath-state-live.ps1',
        'logs\devloop-r197-writer-test.ps1',
        'logs\devloop-r271-keep-negcon.ps1',
        'Tools\devloop\run-ps-suites.ps1',
        'Tools\devloop\write-fastpath-state.ps1',
        'Tools\devloop\fixtures\*\*'
    )
}

function Expand-PsSuitesSourceList {
    # A literal entry is passed through; an entry carrying `*` or `?` expands to
    # the sorted file list it matches, so fixture data hashes as content. An
    # empty glob still contributes a marker entry - adding the first fixture
    # must move the fingerprint, and an empty set that vanished silently would
    # look exactly like "nothing to guard".
    # NOTE: `A\*\*` is NOT a PowerShell recursive glob (Get-ChildItem -Path
    # returns zero hits for it, r754). We walk the literal prefix and match the
    # rest with -like, whose `*` also crosses directory separators.
    param(
        [Parameter(Mandatory=$true)][string]$RepoDir,
        [string[]]$Paths = @()
    )
    $list = @()
    foreach ($rel in @($Paths)) {
        if ($rel -match '[\*\?]') {
            $pattern = $rel.Replace('/', '\')
            $segs = $pattern -split '\\'
            $fixed = @()
            foreach ($s in $segs) {
                if ($s -match '[\*\?]') { break }
                $fixed += $s
            }
            $baseRel = ($fixed -join '\')
            $baseFull = $RepoDir
            if ($baseRel -ne '') { $baseFull = Join-Path $RepoDir $baseRel }
            $hits = @()
            if (Test-Path -LiteralPath $baseFull) {
                foreach ($f in @(Get-ChildItem -LiteralPath $baseFull -File -Recurse -ErrorAction SilentlyContinue | Sort-Object -Property FullName)) {
                    $sub = $f.FullName
                    if ($sub.StartsWith($RepoDir, [System.StringComparison]::OrdinalIgnoreCase)) {
                        $sub = $sub.Substring($RepoDir.Length).TrimStart('\', '/')
                    }
                    if (($sub.Replace('/', '\')) -like $pattern) { $hits += $sub }
                }
            }
            if ($hits.Count -eq 0) { $list += ($rel.Replace('\', '/') + '=NOFILES'); continue }
            foreach ($h in $hits) { $list += $h }
            continue
        }
        $list += $rel
    }
    return [string[]]$list
}

function Get-PsSuitesFingerprint {
    param(
        [Parameter(Mandatory=$true)][string]$RepoDir,
        [string[]]$Paths = @()
    )
    if ($null -eq $Paths -or $Paths.Count -eq 0) { $Paths = @(Get-PsSuitesTickDefaults) }
    $Paths = @(Expand-PsSuitesSourceList -RepoDir $RepoDir -Paths $Paths)
    $parts = @()
    foreach ($rel in $Paths) {
        $full = Join-Path $RepoDir $rel
        $norm = $rel.Replace('\', '/')
        if (Test-Path -LiteralPath $full) {
            $h = (Get-FileHash -LiteralPath $full -Algorithm SHA256).Hash.Substring(0, 12).ToLower()
            $parts += ($norm + '=' + $h)
        } else {
            $parts += ($norm + '=MISSING')
        }
    }
    $text = ($parts -join "`n")
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($text)
    $sha = [System.Security.Cryptography.SHA256]::Create()
    $hash = $sha.ComputeHash($bytes)
    $hex = (($hash | ForEach-Object { $_.ToString('x2') }) -join '')
    return $hex.Substring(0, 12)
}

function Get-PsSuitesTicket {
    param([Parameter(Mandatory=$true)][string]$Path)
    if (-not (Test-Path -LiteralPath $Path)) { return $null }
    try {
        $raw = [System.IO.File]::ReadAllText($Path, [System.Text.Encoding]::UTF8)
        $obj = $raw | ConvertFrom-Json
    } catch { return $null }
    if ($null -eq $obj) { return $null }
    if (-not $obj.PSObject.Properties['sha']) { return $null }
    return $obj
}

function Write-PsSuitesTicket {
    param(
        [Parameter(Mandatory=$true)][string]$Path,
        [Parameter(Mandatory=$true)]$Result
    )
    $obj = [ordered]@{
        sha        = [string]$Result.sha
        status     = [string]$Result.status
        suites     = [int]$Result.suites
        assertions = [int]$Result.assertions
        failing    = [int]$Result.failing
        parity     = [string]$Result.parity
        exit       = [int]$Result.exit
        ms         = [int]$Result.ms
        ts_utc     = [string]$Result.ts_utc
        tries      = [int]$Result.tries
        reds       = [string]$Result.reds
        redtail    = [string]$Result.redtail
        runs       = [string]$Result.runs
    }
    $dir = Split-Path -Parent $Path
    if ($dir -and -not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    $enc = New-Object System.Text.UTF8Encoding($false)
    # Unique side file per writer: two verify instances can overlap (5-minute tick
    # plus a sandbox that runs the gate in-process). A fixed `.new` name made the
    # loser die on Move-Item PathNotFound (r751); unique names + retry mean the
    # last writer wins with a complete ticket and nobody throws.
    $side = $Path + '.new-' + [System.IO.Path]::GetRandomFileName()
    try { [System.IO.File]::WriteAllText($side, ($obj | ConvertTo-Json -Compress), $enc) } catch { return }
    $published = $false
    for ($attempt = 0; $attempt -lt 3 -and -not $published; $attempt++) {
        if (-not (Test-Path -LiteralPath $side)) { break }
        try { Move-Item -LiteralPath $side -Destination $Path -Force -ErrorAction Stop; $published = $true } catch { Start-Sleep -Milliseconds 40 }
    }
    if (-not $published -and (Test-Path -LiteralPath $side)) {
        try { Remove-Item -LiteralPath $side -Force -ErrorAction SilentlyContinue } catch { }
    }
}

function Get-PsSuitesFamilyTicketName {
    param([ValidateSet('write','write2','verify','verify2')][string]$Family = 'write')
    if ($Family -eq 'verify2') { return 'logs\.ps-suites-verify2-last.json' }
    if ($Family -eq 'verify') { return 'logs\.ps-suites-verify-last.json' }
    if ($Family -eq 'write2') { return 'logs\.ps-suites-write2-last.json' }
    return 'logs\.ps-suites-last.json'
}

function Get-PsSuitesFamilyTimeout {
    # Measured: write family 19.5 s, verify family ~70 s (eight light suites,
    # 0.6 s .. 18.9 s each), verify2 80.5 s (one sandbox that boots the gate).
    # The caps keep ~2x headroom over a real run and still bound a hang.
    # main#105: verify2 was capped at 120 s when it measured 71.8 s (r758);
    # by r766 the same sandbox carried 160 assertions and measured 80.5 s,
    # i.e. 67% of the cap - past the 2/3 budget line r757 drew, so every tick
    # printed a WARN nobody could act on. Re-derived instead of guessed, by a
    # rule that can be re-run from the ticket's own `runs=` number:
    #   cap = 2x the last measured run, rounded up to the next 5 s
    # (80.5 s -> 161 -> 165 s, headroom 84.5 s). It stays under the light
    # family's 180 s (one sandbox must not get more rope than eight) and inside
    # the rule that no family cap may exceed 1/3 of the 600 s tick.
    param([ValidateSet('write','write2','verify','verify2')][string]$Family = 'write')
    if ($Family -eq 'verify') { return 180 }
    if ($Family -eq 'verify2') { return 165 }
    # main#117: both write-side halves keep the 45 s cap. Measured 11.6 s
    # (state writer) and 17.8 s (face + census) - the 2/3 line is 30 s, so
    # both fit with room and neither needs a bigger guess.
    return 45
}

function Get-PsSuitesTicketTries {
    # Consecutive cached citations since the last real run. Missing key (an
    # older ticket) reads as 0 - it simply starts counting now.
    param($Ticket)
    if ($null -eq $Ticket) { return 0 }
    if (-not $Ticket.PSObject.Properties['tries']) { return 0 }
    $n = 0
    if ([int]::TryParse([string]$Ticket.tries, [ref]$n) -and $n -ge 0) { return $n }
    return 0
}

function Add-PsSuitesRunHistory {
    # Appends one real run's duration and keeps the last $Keep (oldest first).
    # Kept as its own function so the trim rule is testable without timing a
    # child process.
    param([int[]]$Runs = @(), [int]$NewMs = -1, [int]$Keep = 3)
    $out = @()
    foreach ($v in @($Runs)) { if ($v -ge 0) { $out += [int]$v } }
    if ($NewMs -ge 0) { $out += [int]$NewMs }
    while ($out.Count -gt $Keep) { $out = @($out[1..($out.Count - 1)]) }
    return [int[]]$out
}

function Get-PsSuitesRunHistory {
    # The ticket stores the history as a comma-joined string ("11,22,33") - a
    # one-element JSON array is the kind of shape PS5.1 ConvertTo-Json likes to
    # flatten, and a flattened field would silently read as "no history".
    param($Ticket, [int]$Keep = 3)
    if ($null -eq $Ticket) { return @() }
    if (-not $Ticket.PSObject.Properties['runs']) { return @() }
    $vals = @()
    foreach ($part in ([string]$Ticket.runs -split ',')) {
        $n = 0
        if ([int]::TryParse($part.Trim(), [ref]$n) -and $n -ge 0) { $vals += $n }
    }
    return [int[]](Add-PsSuitesRunHistory -Runs $vals -Keep $Keep)
}

function Get-PsSuitesBaseline {
    # Mean of the recorded real runs. 0 = no history yet (never a fake number).
    param([int[]]$Runs = @())
    $vals = @(@($Runs) | Where-Object { $_ -gt 0 })
    if ($vals.Count -eq 0) { return 0 }
    $sum = 0
    foreach ($v in $vals) { $sum += [int]$v }
    return [int][math]::Round($sum / $vals.Count)
}

function Test-PsSuitesBudgetOver {
    # 2/3 of the family cap is the point where the next suite (or the next slow
    # box) turns the whole family into a `timeout` verdict, so that is where we
    # want to hear about it - not after it happens.
    param([int]$BaseMs = 0, [int]$TimeoutSec = 0)
    if ($BaseMs -le 0 -or $TimeoutSec -le 0) { return $false }
    # Units: BaseMs is milliseconds, TimeoutSec seconds. Comparing the two
    # directly made every family "over budget" (119000 > 120) - caught by y9.
    return ($BaseMs -gt ($TimeoutSec * 1000 * 2 / 3))
}

function Test-PsSuitesHealDue {
    # Only a NON-PASS verdict may age out. A passing ticket stays cached for
    # ever, which is the entire point of content addressing: unchanged code
    # must not buy a child process.
    param($Ticket, [int]$Tries = 0, [int]$AutoRetryAfter = 3)
    if ($null -eq $Ticket) { return $false }
    if ([string]$Ticket.status -eq 'pass') { return $false }
    if ($AutoRetryAfter -le 0) { return $false }
    return (($Tries + 1) -ge $AutoRetryAfter)
}

function Copy-PsSuitesTicketFields {
    # Single place that copies a cached verdict onto the result envelope, so the
    # CheckOnly path and the cached path can never disagree about what a ticket
    # says.
    param($Result, $Ticket)
    $Result.status = [string]$Ticket.status
    $Result.suites = [int]$Ticket.suites
    $Result.assertions = [int]$Ticket.assertions
    $Result.failing = [int]$Ticket.failing
    $Result.parity = [string]$Ticket.parity
    $Result.exit = [int]$Ticket.exit
    $Result.ms = [int]$Ticket.ms
    $Result.ts_utc = [string]$Ticket.ts_utc
    $Result.tries = Get-PsSuitesTicketTries $Ticket
    $Result.reds = ''
    if ($Ticket.PSObject.Properties['reds']) { $Result.reds = [string]$Ticket.reds }
    # The culprit's own last sentence (main#98): a cached red must still be able
    # to say what it said, not only who it was.
    $Result.redtail = ''
    if ($Ticket.PSObject.Properties['redtail']) { $Result.redtail = [string]$Ticket.redtail }
    # Baseline rides with the verdict so a cached tick can still say how close
    # the family is to its cap (main#96).
    $Result.runs = ''
    if ($Ticket.PSObject.Properties['runs']) { $Result.runs = [string]$Ticket.runs }
    $Result.base_ms = Get-PsSuitesBaseline -Runs (Get-PsSuitesRunHistory -Ticket $Ticket)
    $Result.budget_over = Test-PsSuitesBudgetOver -BaseMs ([int]$Result.base_ms) -TimeoutSec (Get-PsSuitesFamilyTimeout -Family ([string]$Result.family))
    $Result.age_min = 0
    try {
        $when = [datetime]::Parse($Result.ts_utc, [System.Globalization.CultureInfo]::InvariantCulture,
            [System.Globalization.DateTimeStyles]::AdjustToUniversal -bor [System.Globalization.DateTimeStyles]::AssumeUniversal)
        $age = ([datetime]::UtcNow - $when).TotalMinutes
        if ($age -ge 0) { $Result.age_min = [int][math]::Round($age) }
    } catch { $Result.age_min = -1 }
}

function Get-PsSuitesRedNames {
    # The runner prints one `FAIL  <name>  exit=N  <tail>` line per red suite and
    # `WARN  <name>  timeout>Ns  no verdict` for a hang. Keep both: without the
    # name a sticky red is undiagnosable, and r754 lost exactly that evidence on
    # a live verify-family red that re-ran clean.
    param([string]$Text)
    $names = @()
    if ([string]::IsNullOrEmpty($Text)) { return '' }
    foreach ($m in [regex]::Matches($Text, '(?m)^FAIL\s+(\S+)')) { $names += $m.Groups[1].Value }
    foreach ($m in [regex]::Matches($Text, '(?m)^WARN\s+(\S+)\s+timeout')) { $names += ($m.Groups[1].Value + ':timeout') }
    return ($names -join ',')
}

function ConvertTo-PsSuitesTail {
    # A red's own last sentence, made safe to travel on a VERIFY line: one line,
    # ASCII only, <= $MaxLen chars. The red word root is RENAMED here, not
    # dropped - r750 made that root illegal in every VERIFY line (case
    # insensitive), and a suite's own last line is often exactly
    # `RESULT: FAIL (3)`. `fail`->`red` keeps the sentence readable while the
    # census rule stays intact; the ticket is a display artefact, not a log.
    param([string]$Text, [int]$MaxLen = 200)
    if ([string]::IsNullOrEmpty($Text)) { return '' }
    $flat = ($Text -replace '\s+', ' ').Trim()
    $flat = [regex]::Replace($flat, '(?i)fail', 'red')
    $sb = New-Object System.Text.StringBuilder
    foreach ($ch in $flat.ToCharArray()) {
        $code = [int][char]$ch
        if ($code -lt 32) { continue }
        if ($code -gt 126) { [void]$sb.Append('?') } else { [void]$sb.Append($ch) }
    }
    $s = $sb.ToString()
    if ($MaxLen -gt 0 -and $s.Length -gt $MaxLen) { $s = $s.Substring(0, $MaxLen) }
    return $s
}

function Get-PsSuitesRedTail {
    # The runner prints `FAIL  <name>  exit=N  <that suite's last output line>`
    # (r754 kept the name and threw the sentence away). One culprit only: with
    # several, one line cannot carry them all and the name list already says
    # who they were. '' means "nothing to add", which covers the green case.
    param([string]$Text)
    if ([string]::IsNullOrEmpty($Text)) { return '' }
    $tails = @()
    foreach ($m in [regex]::Matches($Text, '(?m)^FAIL\s+(\S+)\s+exit=(-?\d+)\s?(.*)$')) {
        $tails += (ConvertTo-PsSuitesTail -Text $m.Groups[3].Value)
    }
    if ($tails.Count -ne 1) { return '' }
    return [string]$tails[0]
}

function Invoke-PsSuitesTick {
    param(
        [Parameter(Mandatory=$true)][string]$RepoDir,
        [ValidateSet('write','write2','verify','verify2')][string]$Family = 'write',
        [string]$TicketPath = '',
        [string[]]$Paths = @(),
        [string]$RunnerPath = '',
        [string[]]$ExtraArgs = @(),
        [int]$TimeoutSec = 0,
        [int]$AutoRetryAfter = 0,
        [switch]$Force,
        [switch]$CheckOnly
    )
    if ([string]::IsNullOrEmpty($TicketPath)) { $TicketPath = Join-Path $RepoDir (Get-PsSuitesFamilyTicketName -Family $Family) }
    if ([string]::IsNullOrEmpty($RunnerPath)) { $RunnerPath = Join-Path $RepoDir 'Tools\devloop\run-ps-suites.ps1' }
    if ($TimeoutSec -le 0) { $TimeoutSec = Get-PsSuitesFamilyTimeout -Family $Family }
    # How many consecutive cached citations of a NON-PASS ticket are tolerated
    # before re-running it once. 0 from the caller means "use the env knob or
    # the default 3"; an explicit 0 via FLUXVERSE_PS_SUITES_AUTORETRY disables
    # the retry (a sandbox needs that to pin the old sticky behaviour).
    if ($AutoRetryAfter -le 0) {
        $AutoRetryAfter = 3
        $envRetry = $env:FLUXVERSE_PS_SUITES_AUTORETRY
        $parsedRetry = 0
        if (-not [string]::IsNullOrWhiteSpace($envRetry)) {
            if ([int]::TryParse($envRetry, [ref]$parsedRetry) -and $parsedRetry -ge 0) { $AutoRetryAfter = $parsedRetry }
        }
    }
    # Each family names its own suites. `-Verify` would run all nine (including
    # the ~51 s heavy sandbox), which is exactly the coupling main#99 removed:
    # the light family runs the eight test-*.ps1 entries of its guarded set.
    # main#117: the write side is split the same way, so the runner's default
    # list (all seven) can never make one family pay for both halves.
    if ($ExtraArgs.Count -eq 0 -and $Family -eq 'write') {
        $ExtraArgs = @('-Suites', 'Tools\devloop\test-fastpath-state-live.ps1,logs\devloop-r197-writer-test.ps1,logs\devloop-r271-keep-negcon.ps1')
    }
    if ($ExtraArgs.Count -eq 0 -and $Family -eq 'write2') {
        $ExtraArgs = @('-Suites', 'Tools\devloop\test-write-status-face-bare.ps1,logs\devloop-r247-facewriter-test.ps1,Tools\devloop\test-nolivecheck-census.ps1,Tools\devloop\test-qa-rotation.ps1')
    }
    if ($ExtraArgs.Count -eq 0 -and $Family -eq 'verify') {
        $lightSuites = @(Get-PsSuitesTickDefaults -Family 'verify' | Where-Object { $_ -match 'test-[^\\]+\.ps1$' })
        $ExtraArgs = @('-Suites', ($lightSuites -join ','))
    }
    # verify2 runs exactly one suite: the sandbox that boots the gate.
    if ($ExtraArgs.Count -eq 0 -and $Family -eq 'verify2') { $ExtraArgs = @('-Suites', 'Tools\devloop\test-verify-ps-suites.ps1') }
    # Resolve the family's guarded source set here, not inside the fingerprint
    # helper (its no-path fallback is the write list, which silently made both
    # families share one fingerprint - caught by the r752 sandbox case l5).
    if ($null -eq $Paths -or $Paths.Count -eq 0) { $Paths = @(Get-PsSuitesTickDefaults -Family $Family) }

    $res = [ordered]@{
        family     = $Family
        status     = 'unknown'
        sha        = ''
        suites     = 0
        assertions = 0
        failing    = 0
        parity     = 'unknown'
        exit       = 0
        ms         = 0
        age_min    = -1
        ran        = $false
        needs_run  = $false
        tries      = 0
        reds       = ''
        redtail    = ''
        runs       = ''
        base_ms    = 0
        budget_over = $false
        heal       = $false
        note       = ''
        ts_utc     = ''
    }

    $res.sha = Get-PsSuitesFingerprint -RepoDir $RepoDir -Paths $Paths
    $runnerExists = Test-Path -LiteralPath $RunnerPath

    $ticket = Get-PsSuitesTicket -Path $TicketPath
    $fresh = ($null -ne $ticket) -and ([string]$ticket.sha -eq $res.sha)

    if ($CheckOnly) {
        # Answers "would this family spawn?" without spawning, so a caller with
        # a wall-clock budget can defer instead of paying twice in one round.
        $res.needs_run = (-not $fresh) -or $Force
        if ($fresh -and -not $res.needs_run) {
            $cachedTries = Get-PsSuitesTicketTries $ticket
            if (Test-PsSuitesHealDue -Ticket $ticket -Tries $cachedTries -AutoRetryAfter $AutoRetryAfter) {
                $res.needs_run = $true
                $res.note = 'retry due after ' + $cachedTries + ' cached citations'
            }
        }
        if (-not $runnerExists) {
            $res.status = 'missing'
            $res.note = 'runner not found: ' + $RunnerPath
            $res.needs_run = $true
            return [pscustomobject]$res
        }
        if (-not $res.needs_run) {
            Copy-PsSuitesTicketFields -Result $res -Ticket $ticket
            $res.needs_run = $false
            return [pscustomobject]$res
        } else {
            $res.status = 'stale'
            if ($res.note -eq '') { $res.note = 'fingerprint changed; a run is due' }
        }
        return [pscustomobject]$res
    }

    if (-not $runnerExists) {
        $res.status = 'missing'
        $res.note = 'runner not found: ' + $RunnerPath
        return [pscustomobject]$res
    }

    if ($fresh -and -not $Force) {
        $cachedTries = Get-PsSuitesTicketTries $ticket
        if (Test-PsSuitesHealDue -Ticket $ticket -Tries $cachedTries -AutoRetryAfter $AutoRetryAfter) {
            # Fall through to a real run: a verdict that is not `pass` cannot
            # prove the code is at fault, so it gets N chances to be re-measured.
            $res.note = 'retry after ' + $cachedTries + ' cached citations of a ' + ([string]$ticket.status) + ' verdict'
            $res.heal = $true
        } else {
            Copy-PsSuitesTicketFields -Result $res -Ticket $ticket
            $res.tries = $cachedTries + 1
            $res.ran = $false
            # Only a non-pass verdict needs the counter persisted; a green ticket
            # must stay byte-identical across ticks (case l6 asserts that a
            # verify run leaves the write ticket untouched).
            if ($res.status -ne 'pass') {
                Write-PsSuitesTicket -Path $TicketPath -Result ([pscustomobject]$res)
            } else {
                $res.tries = 0
            }
            return [pscustomobject]$res
        }
    }

    # ---------- run once, hard timeout ----------
    # The child goes through cmd.exe for exactly ONE reason: a Process object
    # from `Start-Process -PassThru` reports an EMPTY ExitCode on this box
    # (measured on PS5.1 and PS7 alike), so `[int]$proc.ExitCode` silently read
    # 0 and the ticket's `exit` field was permanently fake (main#97: a live
    # ticket said `failing=1 exit=0` while the runner must have been 2). Only
    # the `failing>0` half of the judge was doing any work, and a runner that
    # exited non-zero with a green-looking summary - a crash after the summary
    # line, or `exit 3` from a missing suite file - would have been cached as
    # `pass`. cmd /c writes both streams to the temp files AND yields the real
    # code; this is the same fix r751 landed inside run-ps-suites.ps1.
    $tmpOut = [System.IO.Path]::GetTempFileName()
    $tmpErr = [System.IO.Path]::GetTempFileName()
    $argList = @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', ('"' + $RunnerPath + '"'))
    foreach ($a in $ExtraArgs) { if ($a -ne '') { $argList += $a } }
    $cmdLine = '/c ""powershell.exe" ' + ($argList -join ' ') + ' > "' + $tmpOut + '" 2> "' + $tmpErr + '""'

    $sw = New-Object System.Diagnostics.Stopwatch
    $sw.Start()
    $proc = $null
    $exited = $false
    # Marker for nested gate runs: the runner starts suites, some of which run
    # verify.ps1 in process. Those see this and skip their own family run, so a
    # sandbox can never spawn a runner that spawns the same sandbox.
    $prevChild = $env:FLUXVERSE_PS_SUITES_CHILD
    $env:FLUXVERSE_PS_SUITES_CHILD = '1'
    try {
        $psi = New-Object System.Diagnostics.ProcessStartInfo
        $psi.FileName = 'cmd.exe'
        $psi.Arguments = $cmdLine
        $psi.UseShellExecute = $false
        $psi.CreateNoWindow = $true
        $proc = [System.Diagnostics.Process]::Start($psi)
        $exited = $proc.WaitForExit($TimeoutSec * 1000)
    } catch {
        $res.status = 'missing'
        $res.note = 'child launch failed: ' + ($_.Exception.Message -replace '[\r\n]', ' ')
    } finally {
        if ($null -eq $prevChild) { Remove-Item 'Env:\FLUXVERSE_PS_SUITES_CHILD' -ErrorAction SilentlyContinue }
        else { $env:FLUXVERSE_PS_SUITES_CHILD = $prevChild }
    }
    $sw.Stop()
    $res.ms = [int]$sw.ElapsedMilliseconds

    if ($exited -and $null -ne $proc) {
        # -1 means "the code could not be read"; the judge below treats any
        # non-zero as not-green, so an unreadable code fails closed rather than
        # quietly becoming a pass.
        $code = -1
        try { $code = [int]$proc.ExitCode } catch { $code = -1 }
        $res.exit = $code
    } elseif ($null -ne $proc) {
        # Kill the tree: cmd.exe alone would leave the runner and its per-suite
        # children alive as orphans (r751 lesson).
        try { & taskkill.exe /T /F /PID $proc.Id 2>&1 | Out-Null } catch { }
        try { if (-not $proc.HasExited) { $proc.Kill() } } catch { }
        $res.status = 'timeout'
        $res.note = 'runner did not finish in ' + $TimeoutSec + 's'
        $res.exit = -1
    }

    # ---- family baseline (main#96) ----
    # Only real runs move the history; a timeout contributes nothing (its ms is
    # just the cap, and a hang already reports its own verdict).
    $priorRuns = @(Get-PsSuitesRunHistory -Ticket $ticket)
    $newMs = -1
    if ($res.status -ne 'timeout') { $newMs = [int]$res.ms }
    $keepRuns = @(Add-PsSuitesRunHistory -Runs $priorRuns -NewMs $newMs)
    $res.runs = (($keepRuns | ForEach-Object { [string][int]$_ }) -join ',')
    $res.base_ms = Get-PsSuitesBaseline -Runs $keepRuns
    $res.budget_over = Test-PsSuitesBudgetOver -BaseMs ([int]$res.base_ms) -TimeoutSec $TimeoutSec

    $text = ''
    if (Test-Path -LiteralPath $tmpOut) {
        try { $text = [System.IO.File]::ReadAllText($tmpOut, [System.Text.Encoding]::UTF8) } catch { $text = '' }
    }
    $errText = ''
    if (Test-Path -LiteralPath $tmpErr) {
        try { $errText = ([System.IO.File]::ReadAllText($tmpErr, [System.Text.Encoding]::UTF8)).Trim() } catch { $errText = '' }
    }
    Remove-Item -LiteralPath $tmpOut -Force -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath $tmpErr -Force -ErrorAction SilentlyContinue

    if ($res.status -eq 'missing') {
        return [pscustomobject]$res
    }

    # Name the culprits before judging the summary: a red we cannot attribute is
    # only half a signal (main#91 r754).
    $res.reds = Get-PsSuitesRedNames -Text $text
    # ...and, when there is exactly one culprit, what it actually said (main#98).
    $res.redtail = Get-PsSuitesRedTail -Text $text

    $m = [regex]::Match($text, 'PS SUITES suites=(\d+)\s+assertions=(\d+)\s+counted=(\d+)\s+failing=(\d+)\s+parity=(\S+)')
    if (-not $m.Success) {
        if ($res.status -ne 'timeout') { $res.status = 'unreadable' }
        $tail = (($text -split "`r?`n") | Where-Object { $_.Trim() -ne '' } | Select-Object -Last 1)
        if ([string]::IsNullOrWhiteSpace($tail)) { $tail = '(no output)' }
        if ($errText -ne '') { $tail = $tail + ' / ' + (($errText -split "`r?`n") | Select-Object -Last 1) }
        $res.note = ($res.note + ' summary line not found; last output: ' + $tail + ' exit=' + $res.exit).Trim()
        $res.ts_utc = [datetime]::UtcNow.ToString('yyyy-MM-ddTHH:mm:ssZ')
        $res.tries = 0
        Write-PsSuitesTicket -Path $TicketPath -Result ([pscustomobject]$res)
        return [pscustomobject]$res
    }

    $res.suites = [int]$m.Groups[1].Value
    $res.assertions = [int]$m.Groups[2].Value
    $res.failing = [int]$m.Groups[4].Value
    $res.parity = [string]$m.Groups[5].Value
    # Scope change (main#99 moved the heavy sandbox out: 9 suites -> 8): the old
    # durations measured a different family, so averaging across the change
    # would keep the budget WARN ringing for three runs after the fix. Restart
    # the history with this run instead.
    # r766: a ticket whose last run was `unreadable` records `suites=0` (the
    # runner died before its summary), and the old `-gt 0` guard let those
    # duration samples into the average - measured live, the heavy family's
    # baseline read 26.7 s against a real 79.5 s run, i.e. exactly the silence
    # the baseline exists to break. A run whose length we never measured is
    # not a sample.
    $oldSuites = -1
    if ($null -ne $ticket) { $oldSuites = [int]$ticket.suites }
    if ($oldSuites -ne [int]$res.suites -and $res.status -ne 'timeout' -and [int]$res.suites -gt 0) {
        $res.runs = [string][int]$res.ms
        $res.base_ms = [int]$res.ms
        $res.budget_over = Test-PsSuitesBudgetOver -BaseMs ([int]$res.base_ms) -TimeoutSec $TimeoutSec
    }
    # Two independent halves, and neither may be skipped: a red suite list, or a
    # runner that did not exit 0 (crash after its summary, missing suite file ->
    # exit 3, an unreadable code -> -1). Before main#97 the second half could
    # never fire because the code was always 0.
    if ($res.status -eq 'unknown') {
        if ($res.failing -gt 0 -or $res.exit -ne 0) { $res.status = 'red' } else { $res.status = 'pass' }
    }
    $res.ran = $true
    $res.tries = 0
    $res.ts_utc = [datetime]::UtcNow.ToString('yyyy-MM-ddTHH:mm:ssZ')
    $res.age_min = 0
    Write-PsSuitesTicket -Path $TicketPath -Result ([pscustomobject]$res)
    return [pscustomobject]$res
}

function Format-PsSuitesLine {
    # Returns text that follows "VERIFY HEALTH: " / "VERIFY WARN: ".
    # Judge: healthy only when the last real run passed. Never call a cached red
    # "ok" and never hide a timeout behind a stale zero.
    # Word choice matters: the census sandboxes assert that no verify line
    # carries the red token at all (case-insensitive), so the counts print as
    # `red=` and a parity drift prints as `drift`. The runner's own `failing=`
    # summary stays inside the ticket, never in a VERIFY line.
    param([Parameter(Mandatory=$true)]$Result)
    $parityText = [string]$Result.parity
    if ($parityText -eq 'FAIL') { $parityText = 'drift' }
    $head = 'ps-suites: suites=' + $Result.suites + ' red=' + $Result.failing + ' assertions=' + $Result.assertions + ' parity=' + $parityText + ' sha=' + $Result.sha
    if ($Result.status -eq 'pass' -or $Result.status -eq 'red') {
        if ($Result.ran) { $head = $head + ' ran=' + $Result.ms + 'ms' }
        elseif ($Result.age_min -ge 0) { $head = $head + ' cached=' + $Result.age_min + 'm' }
        else { $head = $head + ' cached=age-unknown' }
    }
    # A red that cannot name its suite is a red nobody can act on (r754: a live
    # verify-family red re-ran clean and the identity was gone for good).
    if ([string]$Result.reds -ne '' -and [string]$Result.status -ne 'pass') {
        $head = $head + ' reds=' + [string]$Result.reds
    }
    # One culprit, one sentence: the (already single-line, ASCII, red-root-free)
    # tail is what turns "some suite is red" into "this suite died here" (main#98).
    if ([string]$Result.redtail -ne '' -and [string]$Result.status -ne 'pass') {
        $head = $head + ' redtail=' + [string]$Result.redtail
    }
    if ([int]$Result.tries -gt 0) { $head = $head + ' tries=' + [int]$Result.tries }
    # Family baseline (main#96): printed for cached ticks too, because the whole
    # point is to see the headroom between real runs.
    if ([int]$Result.base_ms -gt 0) { $head = $head + ' base=' + [int]$Result.base_ms + 'ms' }
    if ($Result.heal -eq $true) { $head = $head + ' auto=1' }
    return $head
}

function Test-PsSuitesHealthy {
    param([Parameter(Mandatory=$true)]$Result)
    return ([string]$Result.status -eq 'pass')
}