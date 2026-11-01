# ---------------------------------------------------------------------------
# qa-cite-duty.ps1 - keep the citation-audit READING from going stale on its own
# (queue main#119; the reading itself landed in r782 / main#116).
#
# The problem this exists for: r782 made Tools\devloop\qa-rotation.ps1 able to
# say whether a frozen citation still points at something current (-Record), but
# the record only ever changed when a person ran that command by hand. A number
# nobody refreshes does not stay true - it stays frozen while the page keeps
# rendering it, and "the reading is very old" is itself a signal that needs a
# human (exactly the disease r757 / r767 / r780 treated: an unattended warning
# becomes noise, and real warnings drown in it).
#
# Measured before deciding (judge question 1 of the queue row):
#   - a -Record run costs ~1.0 s on this tree (indexes 383 tracked md/txt files;
#     r782's ~2.4 s figure was a cold first run), so once a day is affordable and
#     every tick is not (main#104 forbids raising the per-tick budget instead).
#   - before this module existed the record had been refreshed exactly zero
#     times by anything but a human: it was born in r782 and every later tick
#     would have carried the same numbers under a newer page.
# So the refresh path chosen is "attach to an existing daily duty" (verify runs
# this in-process like the log-archive duty), not "let the page complain forever".
#
# Contract:
#   - the age is read from the record's OWN utc stamp, falling back to the file
#     mtime and saying so (basis=). Copying an old record must still read old.
#   - a missing / unreadable / unparsable reading is DUE, never "fresh": no
#     reading is not a current reading.
#   - after a refresh the reading must actually be recent; "I called the tool" is
#     not evidence that a record was written (verdict NOTWRITTEN, caller warns).
#   - nothing here rotates, moves or deletes a file. The reading is a report.
#   - the caller renders this as HEALTH/WARN, never as the tick red-scan token.
# ASCII-only (group PS5.1 encoding law).
# ---------------------------------------------------------------------------

function Get-QaCiteReadingAge {
    [CmdletBinding()]
    param(
        [string]$Path = '',
        [datetime]$Now = [DateTime]::UtcNow
    )

    $r = [pscustomobject]@{
        exists = $false
        ok = $false
        utc = ''
        age_hours = -1.0
        basis = ''
    }
    if ([string]::IsNullOrWhiteSpace($Path)) { $r.basis = 'no-path'; return $r }
    if (-not (Test-Path -LiteralPath $Path)) { $r.basis = 'missing'; return $r }
    $r.exists = $true

    $raw = ''
    try { $raw = [IO.File]::ReadAllText($Path, [Text.Encoding]::UTF8) } catch {
        $r.basis = 'unreadable'
        return $r
    }
    $o = $null
    try { $o = $raw | ConvertFrom-Json } catch { $o = $null }
    if ($null -eq $o) { $r.basis = 'unparsable'; return $r }

    $stamp = ''
    $p = $o.PSObject.Properties['utc']
    if ($null -ne $p -and $null -ne $p.Value) { $stamp = ([string]$p.Value).Trim() }

    $t = [DateTime]::MinValue
    $parsed = $false
    if ($stamp) {
        try {
            $t = [DateTime]::Parse($stamp, [Globalization.CultureInfo]::InvariantCulture)
            $parsed = $true
        } catch { $parsed = $false }
    }

    $source = ''
    if ($parsed) {
        if ($t.Kind -eq [DateTimeKind]::Unspecified) { $t = [DateTime]::SpecifyKind($t, [DateTimeKind]::Utc) }
        $source = 'utc'
        $r.utc = $t.ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
    } else {
        # No usable stamp inside the record: fall back to the file's own mtime and
        # label it, so a reader can tell "the record says it is old" from "the file
        # was written a while ago".
        try {
            $t = (Get-Item -LiteralPath $Path).LastWriteTimeUtc
            $source = 'mtime'
            $r.utc = $t.ToString('yyyy-MM-ddTHH:mm:ssZ')
        } catch {
            $r.basis = 'no-stamp'
            return $r
        }
    }

    $age = ((($Now).ToUniversalTime()) - $t.ToUniversalTime()).TotalHours
    # A stamp in the future is clock skew, not negative age: clamp to 0 and keep
    # the source label so nobody reads it as "refreshed just now by magic".
    if ($age -lt 0) { $age = 0.0 }
    $r.age_hours = [math]::Round($age, 2)
    $r.basis = $source
    $r.ok = $true
    return $r
}

function Test-QaCiteRefreshDue {
    [CmdletBinding()]
    param(
        # -1 means "no reading" (missing / unreadable), which is always due.
        [double]$AgeHours = -1,
        [double]$MaxAgeHours = 24
    )
    if ($AgeHours -lt 0) { return $true }
    return ($AgeHours -ge $MaxAgeHours)
}

function Invoke-QaCiteDuty {
    [CmdletBinding()]
    param(
        [string]$Root = '',
        [string]$RecordPath = '',
        [string]$RecorderPath = '',
        [double]$MaxAgeHours = 24,
        [datetime]$Now = [DateTime]::UtcNow,
        # A refresh that leaves a reading this recent counts as written. Three
        # minutes covers one -Record run (~1 s) with room for a slow disk, and it
        # stops "same second as the previous record" from reading as a failure.
        [double]$FreshMinutes = 3,
        [switch]$Force,
        [switch]$DryRun
    )

    $result = [pscustomobject]@{
        ran = $false
        reason = ''
        verdict = 'SKIP'
        age_before_hours = -1.0
        age_after_hours = -1.0
        max_age_hours = $MaxAgeHours
        basis = ''
        output = @()
    }

    if (-not $Root) { $Root = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path }
    if (-not $RecordPath) { $RecordPath = Join-Path $Root 'logs\.qa-cite-audit.json' }
    if (-not $RecorderPath) { $RecorderPath = Join-Path $Root 'Tools\devloop\qa-rotation.ps1' }

    $before = Get-QaCiteReadingAge -Path $RecordPath -Now $Now
    $result.age_before_hours = $before.age_hours
    $result.basis = $before.basis

    $due = $Force -or (Test-QaCiteRefreshDue -AgeHours $before.age_hours -MaxAgeHours $MaxAgeHours)
    if (-not $due) {
        $result.reason = 'fresh'
        $result.verdict = 'SKIP'
        return $result
    }
    if ($DryRun) {
        $result.reason = 'due'
        $result.verdict = 'DRYRUN'
        return $result
    }
    if (-not (Test-Path -LiteralPath $RecorderPath)) {
        $result.reason = 'recorder-missing'
        $result.verdict = 'MISSING'
        return $result
    }

    $lines = @()
    try {
        # In-process invocation (no new console): the same form verify.ps1 already
        # uses for the archiver and the census. Exit status of a .ps1 call is not
        # consumable, so success is judged by re-reading the record, below.
        $lines = @(& $RecorderPath -RecordPath $RecordPath *>&1 | ForEach-Object { [string]$_ })
    } catch {
        $result.ran = $true
        $result.reason = 'threw'
        $result.verdict = 'THROW'
        $result.output = @([string]$_.Exception.Message)
        return $result
    }

    $result.ran = $true
    $result.reason = 'run'
    $result.output = $lines

    $after = Get-QaCiteReadingAge -Path $RecordPath -Now $Now
    $result.age_after_hours = $after.age_hours
    if (-not $after.ok) {
        $result.reason = 'no-record-after'
        $result.verdict = 'NOTWRITTEN'
        return $result
    }
    $freshLine = ($FreshMinutes / 60.0)
    if ($after.age_hours -gt $freshLine) {
        $result.reason = 'record-not-freshened'
        $result.verdict = 'NOTWRITTEN'
        return $result
    }
    $result.verdict = 'OK'
    return $result
}