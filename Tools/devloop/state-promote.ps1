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