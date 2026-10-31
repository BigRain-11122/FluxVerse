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
# Honest boundaries:
#   - auto-retry heals the environment case, not a real defect: a genuine red
#     re-runs every N ticks (write 19 s, verify ~100 s) instead of every tick.
#   - 45 s cap (write) / 180 s cap (verify): the write run measured 19.5 s, the
#     verify family 101 s on a loaded box (r752 live run, 8 suites). A hit means
#     the machine is loaded or a suite hangs; we report `timeout`, never a
#     verdict. 180 s keeps ~1.8x headroom and still bounds a hang inside one
#     5-minute tick.
#
# ASCII-only (PS5.1 GBK law). No auto-variable locals ($pid family, r164).
# ---------------------------------------------------------------------------

function Get-PsSuitesTickDefaults {
    # Guarded sources, per family. The two sets are deliberately disjoint:
    # editing build-city-panel.ps1 must not buy an 80 s verify-family run, and
    # editing site-verdict.ps1 must not buy a write-side run.
    param([ValidateSet('write','verify')][string]$Family = 'write')
    if ($Family -eq 'verify') {
        return @(
            'Tools\devloop\test-verify-r2-site.ps1',
            'Tools\devloop\test-verify-ambient.ps1',
            'Tools\devloop\test-verify-path-census.ps1',
            'Tools\devloop\test-verify-queue-due.ps1',
            'Tools\devloop\test-queue-due.ps1',
            'Tools\devloop\test-log-archive-duty.ps1',
            'Tools\devloop\test-verify-ps-suites.ps1',
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
            'Tools\perceptor\verify.ps1',
            'Tools\devloop\fixtures\*\*'
        )
    }
    # Guarded sources: the five write-side suites plus everything whose change
    # can flip their verdict (runner, builder regex, lint constant, the two
    # writers under test).
    return @(
        'Tools\devloop\test-write-status-face-bare.ps1',
        'Tools\devloop\test-fastpath-state-live.ps1',
        'logs\devloop-r247-facewriter-test.ps1',
        'logs\devloop-r197-writer-test.ps1',
        'logs\devloop-r271-keep-negcon.ps1',
        'Tools\devloop\run-ps-suites.ps1',
        'Tools\devloop\build-city-panel.ps1',
        'Tools\devloop\face-path-lint.ps1',
        'Tools\devloop\write-status-face.ps1',
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
    param([ValidateSet('write','verify')][string]$Family = 'write')
    if ($Family -eq 'verify') { return 'logs\.ps-suites-verify-last.json' }
    return 'logs\.ps-suites-last.json'
}

function Get-PsSuitesFamilyTimeout {
    # Measured: write family 19.5 s, verify family ~80 s (0.6 s .. 18.9 s per
    # suite). The caps keep ~2x headroom over a real run and still bound a hang.
    param([ValidateSet('write','verify')][string]$Family = 'write')
    if ($Family -eq 'verify') { return 180 }
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

function Invoke-PsSuitesTick {
    param(
        [Parameter(Mandatory=$true)][string]$RepoDir,
        [ValidateSet('write','verify')][string]$Family = 'write',
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
    if ($ExtraArgs.Count -eq 0 -and $Family -eq 'verify') { $ExtraArgs = @('-Verify') }
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
    $tmpOut = [System.IO.Path]::GetTempFileName()
    $tmpErr = [System.IO.Path]::GetTempFileName()
    $argList = @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', ('"' + $RunnerPath + '"'))
    foreach ($a in $ExtraArgs) { if ($a -ne '') { $argList += $a } }

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
        $proc = Start-Process -FilePath 'powershell.exe' -ArgumentList $argList -NoNewWindow -PassThru `
            -RedirectStandardOutput $tmpOut -RedirectStandardError $tmpErr
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

    if (-not $exited -and $proc -ne $null) {
        try { if (-not $proc.HasExited) { $proc.Kill() } } catch { }
        $res.status = 'timeout'
        $res.note = 'runner did not finish in ' + $TimeoutSec + 's'
    }

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

    $m = [regex]::Match($text, 'PS SUITES suites=(\d+)\s+assertions=(\d+)\s+counted=(\d+)\s+failing=(\d+)\s+parity=(\S+)')
    if (-not $m.Success) {
        if ($res.status -ne 'timeout') { $res.status = 'unreadable' }
        $tail = (($text -split "`r?`n") | Where-Object { $_.Trim() -ne '' } | Select-Object -Last 1)
        if ([string]::IsNullOrWhiteSpace($tail)) { $tail = '(no output)' }
        if ($errText -ne '') { $tail = $tail + ' / ' + (($errText -split "`r?`n") | Select-Object -Last 1) }
        $res.note = ($res.note + ' summary line not found; last output: ' + $tail).Trim()
        $res.ts_utc = [datetime]::UtcNow.ToString('yyyy-MM-ddTHH:mm:ssZ')
        $res.tries = 0
        Write-PsSuitesTicket -Path $TicketPath -Result ([pscustomobject]$res)
        return [pscustomobject]$res
    }

    $res.suites = [int]$m.Groups[1].Value
    $res.assertions = [int]$m.Groups[2].Value
    $res.failing = [int]$m.Groups[4].Value
    $res.parity = [string]$m.Groups[5].Value
    if ($null -ne $proc) { $res.exit = [int]$proc.ExitCode }
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
    if ([int]$Result.tries -gt 0) { $head = $head + ' tries=' + [int]$Result.tries }
    if ($Result.heal -eq $true) { $head = $head + ' auto=1' }
    return $head
}

function Test-PsSuitesHealthy {
    param([Parameter(Mandatory=$true)]$Result)
    return ([string]$Result.status -eq 'pass')
}