# ---------------------------------------------------------------------------
# benchmark-duty.ps1 - read the benchmark face's OWN declared due date
# (queue main#23; the face itself is docs/global-benchmarks.md).
#
# The problem this exists for: docs/global-benchmarks.md already writes down when
# it is due again (the "senior 7-day" date in its last table row), but nothing
# machine-readable ever read that date. main#23 sat five days past due with the
# only traces being a queue row and a line of prose inside the document itself -
# the same disease as the qa-cite record (main#119): an obligation that lives in
# prose does not age out loud, it quietly becomes false while the page keeps
# rendering as if someone had checked.
#
# Judged before deciding (the queue row's judge questions):
#   - the date is already written down by the document, so nothing new has to be
#     invented or kept in sync: there is no state file and no drift surface. The
#     reading is a projection of the file, not a second copy of the truth.
#   - a fresh mtime is NOT evidence of a refresh. The declared date wins; the
#     mtime+limit fallback exists only for a file that declares nothing, and it
#     says so out loud (basis=), same stance as qa-cite-duty.ps1's basis=.
#   - a missing file is "no reading" and the caller says so; it is never folded
#     into "zero" or "fresh".
#   - nothing here writes, moves, touches or deletes a file. It is a report.
#   - the caller renders this as HEALTH/WARN, never as the tick red-scan token.
#
# Contract: Get-BenchmarkReading returns
#   exists   - the file is there (a missing face is a reading, not an error)
#   ok       - a due date could be established
#   due      - yyyy-MM-dd the face says it is due
#   days_left- whole days from today to due (negative = days overdue)
#   limit_days - the fallback window, reported for context
#   basis    - declared | mtime | missing
#   bytes    - size of the face
#
# ASCII-only (group PS5.1 encoding law). The one CJK anchor lives in code
# points, never typed into this file.
# ---------------------------------------------------------------------------

function Get-BenchmarkDuePattern {
    # The document's own anchor: <senior> 7 <day>=<date>
    #   senior = U+53F8 U+7EA7, day = U+5929. Built from code points so this
    #   file stays ASCII (same reason the other duties avoid raw CJK).
    $senior = ([string][char]0x53F8) + ([string][char]0x7EA7)
    $day = [string][char]0x5929
    return ('(?:' + [regex]::Escape($senior) + ')\s*7\s*' + [regex]::Escape($day) + '\s*=\s*\**\s*(\d{4}-\d{2}-\d{2})')
}

function ConvertTo-BenchmarkDate {
    param([string]$Text)
    $d = [datetime]::MinValue
    if ([datetime]::TryParseExact($Text, 'yyyy-MM-dd', [System.Globalization.CultureInfo]::InvariantCulture,
            [System.Globalization.DateTimeStyles]::None, [ref]$d)) {
        return $d.Date
    }
    return $null
}

function Get-BenchmarkReading {
    [CmdletBinding()]
    param(
        [string]$Path = '',
        [int]$LimitDays = 7,
        [datetime]$Now = [DateTime]::UtcNow
    )

    $r = [pscustomobject]@{
        exists     = $false
        ok         = $false
        due        = ''
        days_left  = 0
        limit_days = $LimitDays
        basis      = 'missing'
        bytes      = 0
    }
    if ([string]::IsNullOrWhiteSpace($Path)) { return $r }
    if (-not (Test-Path -LiteralPath $Path)) { return $r }

    $r.exists = $true
    $r.bytes = (Get-Item -LiteralPath $Path).Length

    $text = ''
    try { $text = [System.IO.File]::ReadAllText($Path, [System.Text.Encoding]::UTF8) }
    catch { $text = '' }

    $due = $null
    if (-not [string]::IsNullOrWhiteSpace($text)) {
        $pattern = Get-BenchmarkDuePattern
        $ms = [regex]::Matches($text, $pattern)
        # The document appends one row per refresh, so the LAST anchor is the
        # current promise. Matching every row and taking the tail is what keeps
        # an old row from answering for today.
        for ($i = $ms.Count - 1; $i -ge 0 -and $due -eq $null; $i--) {
            $due = ConvertTo-BenchmarkDate $ms[$i].Groups[1].Value
        }
        if ($due -ne $null) { $r.basis = 'declared' }
    }

    if ($due -eq $null) {
        # Fallback only: a face that declares nothing still gets an honest
        # window, anchored on when the file last changed - and says so.
        $local = $Now
        try { $local = (Get-Item -LiteralPath $Path).LastWriteTimeUtc } catch { }
        $due = ([datetime]$local).Date.AddDays($LimitDays)
        $r.basis = 'mtime'
    }

    $r.ok = $true
    $r.due = $due.ToString('yyyy-MM-dd')
    $r.days_left = [int]($due.Date - ([datetime]$Now).Date).TotalDays
    return $r
}