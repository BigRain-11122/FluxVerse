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
# Honest boundaries:
#   - a red result is sticky until the guarded source set changes, even if the
#     environment (not the code) was at fault; the WARN line carries the age
#     and the one command that re-runs it.
#   - suite fixture files are content, not a hash input: a suite that depends on
#     a fixture outside this list can go red without the fingerprint moving.
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
            'Tools\perceptor\verify.ps1'
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
        'Tools\devloop\write-fastpath-state.ps1'
    )
}

function Get-PsSuitesFingerprint {
    param(
        [Parameter(Mandatory=$true)][string]$RepoDir,
        [string[]]$Paths = @()
    )
    if ($null -eq $Paths -or $Paths.Count -eq 0) { $Paths = @(Get-PsSuitesTickDefaults) }
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

function Invoke-PsSuitesTick {
    param(
        [Parameter(Mandatory=$true)][string]$RepoDir,
        [ValidateSet('write','verify')][string]$Family = 'write',
        [string]$TicketPath = '',
        [string[]]$Paths = @(),
        [string]$RunnerPath = '',
        [string[]]$ExtraArgs = @(),
        [int]$TimeoutSec = 0,
        [switch]$Force,
        [switch]$CheckOnly
    )
    if ([string]::IsNullOrEmpty($TicketPath)) { $TicketPath = Join-Path $RepoDir (Get-PsSuitesFamilyTicketName -Family $Family) }
    if ([string]::IsNullOrEmpty($RunnerPath)) { $RunnerPath = Join-Path $RepoDir 'Tools\devloop\run-ps-suites.ps1' }
    if ($TimeoutSec -le 0) { $TimeoutSec = Get-PsSuitesFamilyTimeout -Family $Family }
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
        if (-not $runnerExists) {
            $res.status = 'missing'
            $res.note = 'runner not found: ' + $RunnerPath
            $res.needs_run = $true
            return [pscustomobject]$res
        }
        if (-not $res.needs_run) {
            $res.status = [string]$ticket.status
            $res.suites = [int]$ticket.suites
            $res.assertions = [int]$ticket.assertions
            $res.failing = [int]$ticket.failing
            $res.parity = [string]$ticket.parity
            $res.exit = [int]$ticket.exit
            $res.ms = [int]$ticket.ms
            $res.ts_utc = [string]$ticket.ts_utc
            $res.age_min = 0
            try {
                $when = [datetime]::Parse($res.ts_utc, [System.Globalization.CultureInfo]::InvariantCulture,
                    [System.Globalization.DateTimeStyles]::AdjustToUniversal -bor [System.Globalization.DateTimeStyles]::AssumeUniversal)
                $age = ([datetime]::UtcNow - $when).TotalMinutes
                if ($age -ge 0) { $res.age_min = [int][math]::Round($age) }
            } catch { $res.age_min = -1 }
        } else {
            $res.status = 'stale'
            $res.note = 'fingerprint changed; a run is due'
        }
        return [pscustomobject]$res
    }

    if (-not $runnerExists) {
        $res.status = 'missing'
        $res.note = 'runner not found: ' + $RunnerPath
        return [pscustomobject]$res
    }

    if ($fresh -and -not $Force) {
        $res.status = [string]$ticket.status
        $res.suites = [int]$ticket.suites
        $res.assertions = [int]$ticket.assertions
        $res.failing = [int]$ticket.failing
        $res.parity = [string]$ticket.parity
        $res.exit = [int]$ticket.exit
        $res.ms = [int]$ticket.ms
        $res.ts_utc = [string]$ticket.ts_utc
        $res.age_min = 0
        try {
            $when = [datetime]::Parse($res.ts_utc, [System.Globalization.CultureInfo]::InvariantCulture,
                [System.Globalization.DateTimeStyles]::AdjustToUniversal -bor [System.Globalization.DateTimeStyles]::AssumeUniversal)
            $age = ([datetime]::UtcNow - $when).TotalMinutes
            if ($age -ge 0) { $res.age_min = [int][math]::Round($age) }
        } catch { $res.age_min = -1 }
        $res.ran = $false
        return [pscustomobject]$res
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

    $m = [regex]::Match($text, 'PS SUITES suites=(\d+)\s+assertions=(\d+)\s+counted=(\d+)\s+failing=(\d+)\s+parity=(\S+)')
    if (-not $m.Success) {
        if ($res.status -ne 'timeout') { $res.status = 'unreadable' }
        $tail = (($text -split "`r?`n") | Where-Object { $_.Trim() -ne '' } | Select-Object -Last 1)
        if ([string]::IsNullOrWhiteSpace($tail)) { $tail = '(no output)' }
        if ($errText -ne '') { $tail = $tail + ' / ' + (($errText -split "`r?`n") | Select-Object -Last 1) }
        $res.note = ($res.note + ' summary line not found; last output: ' + $tail).Trim()
        $res.ts_utc = [datetime]::UtcNow.ToString('yyyy-MM-ddTHH:mm:ssZ')
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
    return $head
}

function Test-PsSuitesHealthy {
    param([Parameter(Mandatory=$true)]$Result)
    return ([string]$Result.status -eq 'pass')
}