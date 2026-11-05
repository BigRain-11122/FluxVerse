# state-promote.ps1 - single point for the two-phase world-state promotion
# (queue main#93).
# ---------------------------------------------------------------------------
# WHY: verify.ps1 keeps the live gate safe with two-phase state - scan writes
# world-state.json.new, and only a PASSing verify promotes it onto
# world-state.json. Two verify instances can overlap (the 5-minute tick plus a
# sandbox running the gate in process), so both compute "is there a candidate?"
# from the same .new file. r751 hit the loser side of that race exactly once in
# the field: the second instance called Move-Item on a file the first one had
# already moved away, got PathNotFound, and reported exit 1 - a red that looked
# like a real gate failure but was only "someone else published the same
# candidate".
#
# The in-place fix (a Test-Path guard around Move-Item) was correct but had no
# deterministic sandbox: the failing move only happened once in the wild, and
# reproducing it meant writing into the production world/ directory, which no
# test may do. This module is that missing seam: the promotion decision lives
# here, verify.ps1 calls it, and a sandbox can drive every branch in process -
# including a move that throws while the source is still there (the real
# failure the guard must keep loud).
#
# CONTRACT (status -> meaning):
#   no-candidate  nothing to promote; not an error (the normal tick, no scan ran)
#   promoted      candidate is now world-state.json
#   lost-race     the move failed AND the candidate is gone -> someone else
#                 promoted the same candidate. Not an error, not a red.
#   failed        the move failed AND the candidate is still there -> a real
#                 promote failure. Detail carries the path; the caller must
#                 stay loud (exit 1) and must not delete the candidate.
#
# -MoveFile is a test seam only: production callers omit it and get the real
# Move-Item. A sandbox passes a scriptblock to recreate both failure shapes
# without needing a loaded disk or a second process.
#
# Read-only otherwise; never deletes anything it did not move.
# ASCII-only (PS5.1 GBK law).

# ---------------------------------------------------------------------------
# WRITE half of the same two-phase handoff (queue main#144).
#
# WHY: scan.ps1 wrote the candidate with [IO.File]::WriteAllText straight onto
# world-state.json.new. That call truncates the destination first and then
# streams the bytes, so a reader that arrives between those two moments reads a
# prefix - a torn candidate that fails to parse. r841 measured the consequence
# once (2026-11-05 03:21:01 lost the resident readings for a whole build) and
# could not prove who lost the file, because the window is structural: there is
# nothing to look up afterwards.
#
# The fix is the shape r742 already proved for screenshots: write the bytes to a
# unique side file IN THE SAME DIRECTORY, then move that file onto the
# destination. Move-Item within one directory is a rename, so a reader of the
# destination sees either the whole previous candidate or the whole new one,
# never a prefix. The partial bytes only ever land on a path nobody reads.
#
# CONTRACT (status -> meaning):
#   written       destination now holds the text verbatim; side file is gone
#   empty-text    nothing written: an empty candidate IS the torn-file disease
#                 (r840/r841), so it is refused before any disk touch
#   write-failed  the write threw; destination untouched, side file removed
#   move-failed   the move threw; destination untouched, side file removed
# The caller must stay loud on every non-written status: scan.ps1 prints the
# status and exits 1, leaving the previous candidate for verify to judge.
#
# -WriteFile / -MoveFile are test seams only; production callers omit them and
# get real disk writes. Both failure shapes (writer dies mid-write, rename
# cannot happen) are otherwise unreachable from a test without a crash.

function Write-StateCandidate {
    param(
        [Parameter(Mandatory = $true)][ValidateNotNullOrEmpty()][string]$DestPath,
        [AllowEmptyString()][string]$Text = '',
        [string]$SidePath = '',
        [scriptblock]$WriteFile,
        [scriptblock]$MoveFile
    )

    # An empty (or whitespace-only) state body is exactly what a torn write used
    # to produce; refusing it here is the same rule one step earlier.
    if ([string]::IsNullOrWhiteSpace($Text)) {
        return [pscustomobject]@{ Status = 'empty-text'; Detail = '' }
    }

    if ([string]::IsNullOrEmpty($SidePath)) { $SidePath = $DestPath + '.' + $PID }

    if (-not $WriteFile) {
        $WriteFile = {
            param($path, $body)
            [System.IO.File]::WriteAllText($path, $body, (New-Object System.Text.UTF8Encoding($false)))
        }
    }
    if (-not $MoveFile) {
        $MoveFile = { param($src, $dst) Move-Item -Force -LiteralPath $src -Destination $dst -ErrorAction Stop }
    }

    $written = $false
    try { & $WriteFile $SidePath $Text; $written = $true } catch { $written = $false }

    if (-not $written) {
        Remove-StateSideFile -Path $SidePath | Out-Null
        return [pscustomobject]@{ Status = 'write-failed'; Detail = $SidePath }
    }

    $moved = $false
    try { & $MoveFile $SidePath $DestPath; $moved = $true } catch { $moved = $false }

    if (-not $moved) {
        Remove-StateSideFile -Path $SidePath | Out-Null
        return [pscustomobject]@{ Status = 'move-failed'; Detail = $SidePath }
    }

    return [pscustomobject]@{ Status = 'written'; Detail = '' }
}

function Remove-StateSideFile {
    # Best-effort cleanup of a staging file Write-StateCandidate created. Never
    # throws: a leftover side file is litter nobody reads, not a broken tick.
    param(
        [Parameter(Mandatory = $true)][ValidateNotNullOrEmpty()][string]$Path
    )

    if (-not (Test-Path -LiteralPath $Path)) { return $false }
    try { Remove-Item -LiteralPath $Path -Force -ErrorAction Stop; return $true } catch { return $false }
}

function Invoke-StatePromotion {
    param(
        [Parameter(Mandatory = $true)][string]$NewPath,
        [Parameter(Mandatory = $true)][string]$StatePath,
        [scriptblock]$MoveFile
    )

    if (-not (Test-Path -LiteralPath $NewPath)) {
        return [pscustomobject]@{ Status = 'no-candidate'; Detail = '' }
    }

    if (-not $MoveFile) {
        $MoveFile = { param($src, $dst) Move-Item -Force -LiteralPath $src -Destination $dst -ErrorAction Stop }
    }

    $moved = $false
    try { & $MoveFile $NewPath $StatePath; $moved = $true } catch { $moved = $false }

    if ($moved) { return [pscustomobject]@{ Status = 'promoted'; Detail = '' } }

    # Source vanished between the check and the move: another instance published
    # the same candidate. Same content, same rule -> quiet.
    if (-not (Test-Path -LiteralPath $NewPath)) {
        return [pscustomobject]@{ Status = 'lost-race'; Detail = '' }
    }

    return [pscustomobject]@{ Status = 'failed'; Detail = $NewPath }
}

function Clear-StateCandidate {
    # The FAIL side of two-phase state: a rejected candidate must not linger and
    # be re-judged by the next tick. Returns $true only when something was
    # actually removed.
    param(
        [Parameter(Mandatory = $true)][string]$NewPath
    )

    if (-not (Test-Path -LiteralPath $NewPath)) { return $false }
    try { Remove-Item -LiteralPath $NewPath -Force -ErrorAction Stop; return $true } catch { return $false }
}