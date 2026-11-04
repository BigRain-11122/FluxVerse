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
    param([ValidateSet('write','write2','write3','write4','write5','verify','verify2')][string]$Family = 'write')
    if ($Family -eq 'write2') {
        # main#117: the seven-suite write family measured 32.0 s against a 45 s
        # cap - past the 2/3 budget line, so every tick printed a WARN. Timed
        # one suite at a time it was 3.4 / 3.6 / 4.0 / 4.3 / 3.7 / 3.2 / 7.2 s:
        # no single suite eats the bulk, ~2.5-3 s per suite is PowerShell
        # process start. So the honest fix is to split by what each suite
        # guards and let one tick pay one half. (r787: the nolivecheck census
        # suite moved to the state half - it guards the state writer's escape
        # hatch, and this half crossed its 2/3 line at 30.2 s of 45 s.)
        # main#133: after main#130 this half measured 27.7 / 28.1 s with a
        # 36.5 s spike (the sixth suite plus a parallel-evidence run), i.e. it
        # sat on the 2/3 line every tick. Each of the six suites timed alone:
        # 4.3 / 4.7 / 10.2 / 3.5 / 3.5 / 3.6 s - again no single hog, so the
        # face writer keeps the three suites that prove the rendered face, and
        # the QA-evidence / census / fixture tools move to write3 (12.5 s and
        # 17.3 s measured; the 45 s cap was not touched).
        return @(
            'Tools\devloop\test-write-status-face-bare.ps1',
            'logs\devloop-r247-facewriter-test.ps1',
            'Tools\devloop\test-status-face-screen.ps1',
            # r825: the proof-row sandbox (28 -> 34 assertions) guarded the same
            # builder this half already protects but was in NO family, so an
            # edit to the proof block would have rotted silently - the exact
            # "written, nobody runs it" shape of main#86/main#88/main#120.
            # Measured 8.4 s alone; this half last ticked 13.2 s, so the pair
            # stays under the 30 s (2/3 of 45 s) line.
            'Tools\devloop\test-city-panel-proof.ps1',
            'Tools\devloop\run-ps-suites.ps1',
            'Tools\devloop\build-city-panel.ps1',
            'Tools\devloop\city-panel-template.html',
            'Tools\devloop\face-path-lint.ps1',
            'Tools\devloop\status-face-screen.ps1',
            'Tools\tick\export-public-snapshot.ps1',
            'Tools\devloop\write-status-face.ps1',
            'Tools\devloop\fixtures\*\*'
        )
    }
    if ($Family -eq 'write3') {
        # main#133: the third write-side half. These three suites prove tools
        # that PRODUCE evidence rather than the face itself: the qa/ rotation
        # (10.2 s, the one suite that actually costs double digits because it
        # moves real files), the bare-parameter census over the devloop tree
        # (main#127), and the panel fixture generator (main#130). Editing any
        # of them used to buy the whole six-suite face run.
        return @(
            'Tools\devloop\test-qa-rotation.ps1',
            'Tools\devloop\test-simple-param-census.ps1',
            'Tools\devloop\test-rebuild-panel-fixtures-bad.ps1',
            # r828 (main#138): the resident-voice face (37 assertions, measured
            # 631 ms end to end - no child processes, pure functions). It rides
            # here, not in the verify family: r790 measured that family at 53%
            # of its cap and forbade adding another entry. It also guards
            # resident-verdict.ps1, so an edit to the verdict cannot rot unseen.
            'Tools\devloop\test-verify-residents.ps1',
            # r831 (main#139): the sandbox registry census. It guards "does some
            # family actually spawn this suite?", so both the census and its own
            # sandbox have to be spawned here - the point of the round.
            'Tools\devloop\test-suite-registry-census.ps1',
            # r831: the panel relative-link math. It was RED 15/23 from r796 to
            # r831 because no family ran it; it costs 0.4 s, so it is registered
            # outright instead of sitting on the exemption list.
            'Tools\devloop\test-panel-url.ps1',
            'Tools\devloop\panel-url.ps1',
            'Tools\devloop\suite-registry-census.ps1',
            'Tools\devloop\run-ps-suites.ps1',
            'Tools\devloop\qa-rotation.ps1',
            'Tools\devloop\simple-param-census.ps1',
            'Tools\devloop\rebuild-panel-fixtures.ps1',
            'Tools\devloop\resident-verdict.ps1',
            'Tools\devloop\fixtures\*\*'
        )
    }
    if ($Family -eq 'write4') {
        # r832 (main#139): the census found five sandboxes that no family
        # spawned - written, never run, the main#86/#88/#120 shape. Timed one
        # at a time: test-city-duty 20.1 s, test-city-shot-shape 2.2 s,
        # test-panel-bare-artifact 5.3 s, test-city-shot-census 7.9 s,
        # test-archive-logs 2.6 s. All five in one family measured 38.2 s, past
        # the 30 s line (2/3 of the 45 s cap), and the first split put 28.6 s
        # here - 1.4 s of headroom is how main#133 started. So: the one heavy
        # suite keeps its own half, and the cheap ones share the other.
        return @(
            'Tools\devloop\test-city-duty.ps1',
            'Tools\devloop\test-city-shot-shape.ps1',
            'Tools\devloop\build-city-panel.ps1',
            'Tools\devloop\city-panel-template.html',
            'Tools\devloop\city-shot-shape.ps1',
            'Tools\devloop\run-ps-suites.ps1',
            'Tools\devloop\fixtures\*\*'
        )
    }
    if ($Family -eq 'write5') {
        # r832 (main#139): the remaining three exempt suites, 5.3 + 7.9 + 2.6 s.
        # test-city-shot-census measured 176 s on a cold run before this round -
        # not because the suite is slow but because it drove the whole gate as a
        # child and the gate spawned every family underneath it. It now carries
        # FLUXVERSE_PS_SUITES_CHILD=1 for that child call, which is also why it
        # can sit in a family without recursing.
        return @(
            'Tools\devloop\test-city-shot-census.ps1',
            'Tools\devloop\test-archive-logs.ps1',
            'Tools\devloop\test-panel-bare-artifact.ps1',
            'Tools\devloop\build-city-panel.ps1',
            'Tools\devloop\city-shot-shape.ps1',
            'Tools\devloop\archive-logs.ps1',
            'Tools\perceptor\verify.ps1',
            'Tools\devloop\run-ps-suites.ps1',
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
            'Tools\devloop\test-qa-cite-duty.ps1',
            'Tools\devloop\test-benchmark-duty.ps1',
            'Tools\devloop\test-probe-path-census.ps1',
            # main#123: the runner's own sandbox had no per-tick entry - r787
            # raised the default list to nine suites while this one still
            # asserted eight, and it stayed red for a full round unseen. It is
            # a light suite (measured 27.2 s standalone, incl. the l-group
            # sleeps) so it rides here, not with the 165 s heavy family
            # (life + 27 s would sit at 65% of that cap).
            'Tools\devloop\test-run-ps-suites.ps1',
            'Tools\devloop\test-state-promote.ps1',
            'Tools\devloop\state-promote.ps1',
            'Tools\devloop\run-ps-suites.ps1',
            'Tools\devloop\ps-suites-tick.ps1',
            'Tools\devloop\site-verdict.ps1',
            'Tools\devloop\ambient-verdict.ps1',
            'Tools\devloop\queue-due.ps1',
            'Tools\devloop\log-archive-duty.ps1',
            'Tools\devloop\qa-cite-duty.ps1',
            'Tools\devloop\benchmark-duty.ps1',
            'Tools\devloop\archive-logs.ps1',
            'Tools\devloop\shell-chain-census.ps1',
            'Tools\perceptor\verify.ps1',
            'Tools\devloop\fixtures\*\*'
        )
    }
    # The other half of main#117: the state-file writer and the suites that
    # prove it. Editing write-fastpath-state.ps1 must not buy the face
    # suites anymore (and vice versa).
    # r787: the nolivecheck census moved here - it guards the state writer's
    # unverified-write escape hatch, not the face, and the face half
    # crossed its own 2/3 line (30.2 s of a 45 s cap) when the public-screen
    # suite joined it. Rebalancing halves is the same discipline as splitting
    # one: no budget was raised.
    # r797: the runbook/TECH round-number sync moved here. The face half had
    # grown to six suites and measured 30.7 s of its 45 s cap - past the 2/3
    # line again, so every tick printed a budget WARN nobody could act on. That
    # suite guards two BOOKKEEPING docs (state/runbook.md and TECH.md), not the
    # rendered panel, so it belongs with the state-file half. Same discipline as
    # r787: rebalance the halves, never raise the cap.
    return @(
        'Tools\devloop\test-fastpath-state-live.ps1',
        'logs\devloop-r197-writer-test.ps1',
        'logs\devloop-r271-keep-negcon.ps1',
        'Tools\devloop\test-nolivecheck-census.ps1',
        'Tools\devloop\test-runbook-sync.ps1',
        'Tools\devloop\run-ps-suites.ps1',
        'Tools\devloop\write-fastpath-state.ps1',
        'Tools\devloop\nolivecheck-census.ps1',
        'Tools\devloop\census-cost.ps1',
        'Tools\devloop\check-runbook-sync.ps1',
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

function Test-PsSuitesSourceList {
    # Are the guarded sources this family fingerprints actually on disk?
    # (queue main#3 / P3-003, landed r788.)
    # The fingerprint lists every source path and hashes it; an absent path
    # hashes as the literal string `=MISSING`, which is as stable as a real
    # hash - so a renamed or mis-resolved source is invisible. The measured
    # case (r754): a sandbox passed RepoDir=Tools\, every path became
    # Tools\Tools\... and the fingerprint stayed perfectly stable while
    # guarding nothing. The guard had silently stopped guarding.
    # Judgement is kept deliberately narrow so it cannot cry wolf:
    #   * a literal entry that is absent -> gap (we know what it should be)
    #   * a glob that matches nothing    -> allowed, reported as nofiles
    #     (Expand-PsSuitesSourceList records `=NOFILES` on purpose: "the first
    #      fixture has not been added yet" is a legal state, a broken registry
    #      is not)
    param(
        [Parameter(Mandatory=$true)][string]$RepoDir,
        [string[]]$Paths = @()
    )
    $expanded = @(Expand-PsSuitesSourceList -RepoDir $RepoDir -Paths $Paths)
    $gaps = @()
    $nofiles = @()
    $checked = 0
    foreach ($rel in $expanded) {
        if ($rel -like '*=NOFILES') { $nofiles += $rel; continue }
        $checked++
        $full = Join-Path $RepoDir $rel
        if (-not (Test-Path -LiteralPath $full)) { $gaps += $rel }
    }
    return [pscustomobject]@{
        Gaps    = [string[]]$gaps
        NoFiles = [string[]]$nofiles
        Checked = $checked
    }
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
        redlog     = [string]$Result.redlog
        runs       = [string]$Result.runs
        gaps       = [string]$Result.gaps
        req_suites = [int]$Result.req_suites
        suites_short = [bool]$Result.suites_short
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
    param([ValidateSet('write','write2','write3','write4','write5','verify','verify2')][string]$Family = 'write')
    if ($Family -eq 'verify2') { return 'logs\.ps-suites-verify2-last.json' }
    if ($Family -eq 'verify') { return 'logs\.ps-suites-verify-last.json' }
    if ($Family -eq 'write2') { return 'logs\.ps-suites-write2-last.json' }
    if ($Family -eq 'write3') { return 'logs\.ps-suites-write3-last.json' }
    if ($Family -eq 'write4') { return 'logs\.ps-suites-write4-last.json' }
    if ($Family -eq 'write5') { return 'logs\.ps-suites-write5-last.json' }
    return 'logs\.ps-suites-last.json'
}

function Get-PsSuitesRedLogPath {
    # The evidence file sits NEXT TO the ticket it belongs to. That one rule
    # keeps a sandbox (which points the ticket at its own temp dir) out of the
    # real logs\, and puts the production evidence in logs\ as before.
    param([Parameter(Mandatory=$true)][string]$TicketPath)
    $dir = Split-Path -Parent $TicketPath
    $leaf = [System.IO.Path]::GetFileName($TicketPath)
    if ($leaf -like '*.json') { $leaf = $leaf.Substring(0, $leaf.Length - 5) }
    return (Join-Path $dir ($leaf + '-red.txt'))
}

function Set-PsSuitesRedLog {
    # Red tickets could name the culprit (r754) and, when there was exactly one,
    # quote its last sentence (r761). What they never kept was the runner's own
    # output, which is where the assertions that actually died are printed: the
    # text was read, mined for those two fields, and deleted. A live
    # verify-family red then reported "14 passed, 8 reded (of 22)" with no way
    # left to learn WHICH eight, so the same flake could only be waited for
    # again - which is what happened (r784).
    # Contract: a non-pass run keeps its whole output here; a pass run REMOVES
    # the file, so "the evidence exists" always means "the last real run was not
    # green" and never a red that has since healed.
    param(
        [Parameter(Mandatory=$true)][string]$TicketPath,
        [string]$RepoDir = '',
        [string]$Text = '',
        [string]$Status = 'unknown'
    )
    $path = Get-PsSuitesRedLogPath -TicketPath $TicketPath
    if ([string]$Status -eq 'pass') {
        if (Test-Path -LiteralPath $path) { try { Remove-Item -LiteralPath $path -Force -ErrorAction SilentlyContinue } catch { } }
        return ''
    }
    try {
        $dir = Split-Path -Parent $path
        if ($dir -and -not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
        $body = [string]$Text
        if ([string]::IsNullOrWhiteSpace($body)) { $body = '(no output)' }
        [System.IO.File]::WriteAllText($path, $body, (New-Object System.Text.UTF8Encoding($false)))
    } catch {
        # Evidence we cannot write must never change a verdict.
        return ''
    }
    $show = ''
    if (-not [string]::IsNullOrEmpty($RepoDir)) {
        try {
            $full = [System.IO.Path]::GetFullPath($path)
            $root = [System.IO.Path]::GetFullPath($RepoDir).TrimEnd('\') + '\'
            if ($full.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) { $show = $full.Substring($root.Length) }
        } catch { $show = '' }
    }
    if ([string]::IsNullOrEmpty($show)) { $show = [System.IO.Path]::GetFileName($path) }
    return $show
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
    param([ValidateSet('write','write2','write3','write4','write5','verify','verify2')][string]$Family = 'write')
    if ($Family -eq 'verify') { return 180 }
    if ($Family -eq 'verify2') { return 165 }
    # main#117: both write-side halves keep the 45 s cap. Measured 11.6 s
    # (state writer) and 17.8 s (face + census) - the 2/3 line is 30 s, so
    # both fit with room and neither needs a bigger guess.
    # main#133: write3 is a third 45 s family. Its measured run is 17.3 s, so
    # the same cap fits; adding a family was chosen over raising a cap, which
    # r757 made a forbidden move.
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
    # ...and where the full output of that run was left (main#119's sibling): a
    # cached red must still point at the evidence, not only quote one line of it.
    $Result.redlog = ''
    if ($Ticket.PSObject.Properties['redlog']) { $Result.redlog = [string]$Ticket.redlog }
    # Baseline rides with the verdict so a cached tick can still say how close
    # the family is to its cap (main#96).
    $Result.runs = ''
    if ($Ticket.PSObject.Properties['runs']) { $Result.runs = [string]$Ticket.runs }
    # A recorded source gap (main#122) has to survive the cached path too, or the
    # warning would appear on the tick that found it and never again.
    $Result.gaps = ''
    if ($Ticket.PSObject.Properties['gaps']) { $Result.gaps = [string]$Ticket.gaps }
    # main#129: a cached verdict must still say whether that run covered every
    # suite this tick asked for, otherwise the reading disappears the moment
    # the cache answers. The request is the CURRENT one; the count is the
    # ticket's, so a changed suite list shows up as a short reading.
    $Result.suites_short = Test-PsSuitesCountShort -Requested ([int]$Result.req_suites) -Reported ([int]$Result.suites)
    if ($Result.suites_short -and [string]$Result.status -eq 'pass') {
        $Result.note = ('requested ' + [int]$Result.req_suites + ' suite(s), runner reported ' + [int]$Result.suites)
    }
    if ([string]$Result.status -eq 'gap' -and $Result.gaps -ne '') {
        $Result.note = 'guarded source(s) absent: ' + $Result.gaps
    }
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

function Get-PsSuitesRequestedCount {
    # main#129: how many suites did THIS tick actually ask the runner for?
    # Returns 0 when the request is unknown (no explicit -Suites -> the runner
    # falls back to its own default list, and this module has no business
    # guessing what that list holds today).
    # NOTE: the parameter is $ArgList on purpose - $Args is an automatic
    # variable and a parameter named $Args reads as "no path given" (r793).
    param($ArgList)
    if ($null -eq $ArgList) { return 0 }
    $list = @($ArgList)
    for ($i = 0; $i -lt $list.Count; $i++) {
        if ([string]$list[$i] -eq '-Suites' -and ($i + 1) -lt $list.Count) {
            $val = [string]$list[$i + 1]
            $parts = @($val -split '[,;]' | Where-Object { $_.Trim() -ne '' })
            return $parts.Count
        }
    }
    return 0
}

function Test-PsSuitesCountShort {
    # main#129: true only when we KNOW the request and the runner reported a
    # different number of suites. 0 means "unknown request", never a mismatch.
    # This is a READING, not a verdict: r800 found a ticket printing
    # `suites=4` for a five-suite request for a while, and every line stayed
    # green because nothing compared the two halves.
    param([int]$Requested, [int]$Reported)
    if ($Requested -le 0) { return $false }
    return ($Reported -ne $Requested)
}

function Invoke-PsSuitesTick {
    param(
        [Parameter(Mandatory=$true)][string]$RepoDir,
        [ValidateSet('write','write2','write3','write4','write5','verify','verify2')][string]$Family = 'write',
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
        $ExtraArgs = @('-Suites', 'Tools\devloop\test-fastpath-state-live.ps1,logs\devloop-r197-writer-test.ps1,logs\devloop-r271-keep-negcon.ps1,Tools\devloop\test-nolivecheck-census.ps1,Tools\devloop\test-runbook-sync.ps1')
    }
    if ($ExtraArgs.Count -eq 0 -and $Family -eq 'write2') {
        # r825: the proof-row sandbox rides this half (its guarded sources are
        # here too) - a family that guards a file but never runs its suite is
        # the r758 "split and nothing changed" trap.
        $ExtraArgs = @('-Suites', 'Tools\devloop\test-write-status-face-bare.ps1,logs\devloop-r247-facewriter-test.ps1,Tools\devloop\test-status-face-screen.ps1,Tools\devloop\test-city-panel-proof.ps1')
    }
    # main#133: the tooling half names its own three suites for the same reason -
    # the runner's default list has no idea which half asked.
    if ($ExtraArgs.Count -eq 0 -and $Family -eq 'write3') { $ExtraArgs = @('-Suites', 'Tools\devloop\test-qa-rotation.ps1,Tools\devloop\test-simple-param-census.ps1,Tools\devloop\test-rebuild-panel-fixtures-bad.ps1,Tools\devloop\test-verify-residents.ps1,Tools\devloop\test-suite-registry-census.ps1,Tools\devloop\test-panel-url.ps1') }
    # r832 (main#139): both new halves pass an explicit list. Without it the
    # runner falls back to its own nine-suite default and the "split" would pay
    # the full list under a new name (the r779 lesson).
    if ($ExtraArgs.Count -eq 0 -and $Family -eq 'write4') { $ExtraArgs = @('-Suites', 'Tools\devloop\test-city-duty.ps1,Tools\devloop\test-city-shot-shape.ps1') }
    if ($ExtraArgs.Count -eq 0 -and $Family -eq 'write5') { $ExtraArgs = @('-Suites', 'Tools\devloop\test-city-shot-census.ps1,Tools\devloop\test-archive-logs.ps1,Tools\devloop\test-panel-bare-artifact.ps1') }
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

    # main#129: remember the size of the request we are about to make. Every
    # family above names its suites explicitly, so this is normally a real
    # number and the runner's summary has something to be compared against.
    $reqSuites = Get-PsSuitesRequestedCount -ArgList $ExtraArgs

    $res = [ordered]@{
        family     = $Family
        status     = 'unknown'
        sha        = ''
        req_suites = $reqSuites
        suites_short = $false
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
        redlog     = ''
        runs       = ''
        base_ms    = 0
        budget_over = $false
        heal       = $false
        note       = ''
        gaps       = ''
        gap_n      = 0
        checked    = 0
        ts_utc     = ''
    }

    $res.sha = Get-PsSuitesFingerprint -RepoDir $RepoDir -Paths $Paths

    # ---- guarded-source preflight (main#122) ----
    # The fingerprint hashes every guarded source, and an ABSENT path hashes to
    # the literal string `=MISSING` - which is exactly as stable as a real hash.
    # A source that was never on disk (renamed, mis-resolved, dropped from the
    # registry's reality) therefore yields the same fingerprint every tick, so
    # the family never spawns, the ticket never changes, and the guard silently
    # guards nothing. That is the same shape r788 fixed for the runner side, one
    # layer down: "unchanged" may never be read as "guarded". So ask the
    # registry directly on EVERY pass, before the cache is allowed to answer.
    # A glob that matches nothing is a legal state (=NOFILES, the first fixture
    # has not been added yet) and is not a gap; a literal entry that is absent
    # is, because we know what it should be.
    $preflight = Test-PsSuitesSourceList -RepoDir $RepoDir -Paths $Paths
    $gapList = @($preflight.Gaps)
    $res.checked = [int]$preflight.Checked
    if ($gapList.Count -gt 0) {
        $res.status = 'gap'
        $res.gaps = ($gapList -join ',')
        $res.gap_n = $gapList.Count
        $res.needs_run = $false
        $res.note = 'guarded source(s) absent: ' + $res.gaps
        if (-not $CheckOnly) {
            # Record it. Speaking once is not enough: the fingerprint of a
            # missing source does not move again, so nothing would ever re-run.
            $res.ts_utc = [datetime]::UtcNow.ToString('yyyy-MM-ddTHH:mm:ssZ')
            $res.tries = 0
            Write-PsSuitesTicket -Path $TicketPath -Result ([pscustomobject]$res)
        }
        return [pscustomobject]$res
    }

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
        $res.redlog = Set-PsSuitesRedLog -TicketPath $TicketPath -RepoDir $RepoDir -Text ($text + "`n" + $errText) -Status $res.status
        Write-PsSuitesTicket -Path $TicketPath -Result ([pscustomobject]$res)
        return [pscustomobject]$res
    }

    $res.suites = [int]$m.Groups[1].Value
    $res.assertions = [int]$m.Groups[2].Value
    $res.failing = [int]$m.Groups[4].Value
    $res.parity = [string]$m.Groups[5].Value
    # main#129: the request lives in this module, the count is reported only by
    # the runner's summary - nothing compared them, so a family could run four
    # of its five suites and still read `pass`. Recorded as a reading (the
    # verdict is unchanged): a short run is a missing measurement, not a red.
    $res.suites_short = Test-PsSuitesCountShort -Requested ([int]$res.req_suites) -Reported ([int]$res.suites)
    if ($res.suites_short) {
        $res.note = ($res.note + ' requested ' + [int]$res.req_suites + ' suite(s), runner reported ' + [int]$res.suites).Trim()
    }
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
    $res.redlog = Set-PsSuitesRedLog -TicketPath $TicketPath -RepoDir $RepoDir -Text ($text + "`n" + $errText) -Status $res.status
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
    # main#129: the size of the request, printed every tick. Without it the
    # reader cannot tell "five suites passed" from "five were asked for, four
    # answered" - those looked identical for a whole round in r800.
    if ([int]$Result.req_suites -gt 0) { $head = $head + ' req=' + [int]$Result.req_suites }
    if ($Result.suites_short -eq $true) { $head = $head + ' suite_short=req' + [int]$Result.req_suites + '/got' + [int]$Result.suites }
    if ($Result.status -eq 'pass' -or $Result.status -eq 'red') {
        if ($Result.ran) { $head = $head + ' ran=' + $Result.ms + 'ms' }
        elseif ($Result.age_min -ge 0) { $head = $head + ' cached=' + $Result.age_min + 'm' }
        else { $head = $head + ' cached=age-unknown' }
    }
    # A guarded source that is not on disk gets named on the line, the same way
    # a red suite is (main#122). Without the names the reader only learns
    # "something is off", and the fingerprint cannot narrow it down.
    if ([string]$Result.gaps -ne '') { $head = $head + ' gaps=' + [string]$Result.gaps }
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
    # Where that run's whole output was kept, so "which assertions" is answerable
    # without waiting for the flake to happen again.
    if ([string]$Result.redlog -ne '' -and [string]$Result.status -ne 'pass') {
        $head = $head + ' redlog=' + [string]$Result.redlog
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