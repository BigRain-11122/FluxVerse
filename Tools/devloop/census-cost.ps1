# census-cost.ps1 - how a per-tick census judges its own cost (main#118, r780)
# ---------------------------------------------------------------------------
# WHY: Tools\devloop\nolivecheck-census.ps1 has printed its own milliseconds
# against a stated budget since r768 (main#104). That reading is only useful if
# the judgement built on it is not itself noise. On 2026-11-01 it was: one tick
# reported ms=2854 against budget=250 and the gate printed
#   VERIFY WARN: ... census cost is over its own budget; move it out of the
#   per-tick section ... or shrink the scan
# while the 24 ticks around it read 93-191 ms and the same census run by hand in
# the same minute read 103-106 ms. Nothing had changed; the disk was busy. So a
# single wall-clock sample turned a transient IO spike into a standing "somebody
# must decide this" line - exactly the failure r757 and r767 were written about
# (one unactionable WARN per tick pickles the real ones).
#
# WHAT: the decision is split out of the scan so it can be driven directly
# rather than inferred from a lucky or unlucky run. The rule is best-of-two:
# a first sample over the budget buys exactly ONE re-measure, and the census is
# judged on the lower of the two. A real regression reproduces in both samples;
# a contention spike does not. The first sample is never discarded from the
# report - it travels as ms1= so the spike stays visible as a reading instead of
# becoming a decision.
#
# WHAT THIS IS NOT: it does not raise the budget (main#104 forbids absorbing
# cost that way), it does not average away a genuine doubling of the scan, and
# it does not judge whether the census is worth its cost - only whether this
# run's cost is evidence or noise. Bounded by construction: at most two scans,
# so worst case pays one extra ~100 ms pass, still inside the 250 ms budget.
#
# ASCII-only law (PS5.1 GBK trap). No auto-variable locals (r164).

function Test-CensusCostRetry {
    # A re-measure is bought only when the first sample is over the line. An
    # under-budget run pays nothing: this census runs on every tick.
    param(
        [int]$Ms = 0,
        [int]$BudgetMs = 250
    )
    return ($Ms -gt $BudgetMs)
}

function Get-CensusCostVerdict {
    # Judged value = lowest sample; over = that value still exceeds the budget.
    # Callers pass one sample normally and two after a retry; more are accepted
    # (sandboxes drill the policy directly) and judged the same way.
    param(
        [int[]]$Samples = @(),
        [int]$BudgetMs = 250
    )
    $list = @($Samples)
    if ($list.Count -eq 0) {
        # No sample means "cost unknown", which is not the same as "cheap".
        # It is reported as not-over (informational) with its own reason word so
        # a reader can see the difference instead of reading a silent zero.
        return [pscustomobject]@{
            Samples = @(); FirstMs = 0; Ms = 0; BudgetMs = $BudgetMs
            Over = $false; Retried = $false; Reason = 'no-sample'
        }
    }
    $first = [int]$list[0]
    $low = $first
    foreach ($sample in $list) {
        if ([int]$sample -lt $low) { $low = [int]$sample }
    }
    $didRetry = ($list.Count -gt 1)
    $reason = 'single'
    if ($didRetry) { $reason = 'best-of-2' }
    return [pscustomobject]@{
        Samples = $list
        FirstMs = $first
        Ms = $low
        BudgetMs = $BudgetMs
        Over = ($low -gt $BudgetMs)
        Retried = $didRetry
        Reason = $reason
    }
}