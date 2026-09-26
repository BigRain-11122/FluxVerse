# check-fastpath.ps1 - DevLoop round-start seven-check mechanizer (read-only)
# ---------------------------------------------------------------------------
# T-FV-118 / TECH section-9 r198 row. WHY: the seven round-start checks were
# run by hand as ~5 shell commands every round = token cost + the
# display-surface illusion family (r163 tick-tail collapse illusion, r195
# state-file lost-key misjudged from a `type` display, r197 tail-capture
# swallowing lines). LAW: judge by byte reads, never by tool display.
# Single read-only judge = 7 fixed check lines + state line + VERDICT line.
#
# Checks (mandate fastpath paragraph stays the authority; this is the
# mechanical executor of it):
#   c1-red     tick log tail 40: gate/probe FAIL words or quarantined>0;
#              missing/empty tick log = trigger. Heartbeat tail: trailing
#              streak (>=2) of timeouts / non-zero exits = trigger; a single
#              bad entry is NOT a streak (r162/r181 single-kill precedent).
#   c2-tree    git status --porcelain -- . ':(exclude)world-public' non-empty
#              = trigger (r69 rotating-artifact exemption built in).
#   c3-ledger  cph4/evolution-ledger.md SHA12 vs state ledger_sha12.
#   c4-tech    TECH.md SHA12 vs state tech_sha12 (section-9 authority face).
#   c5-p16     media/BigStream recursive *.html present = trigger (unlock).
#   c6-dec     docs/decisions.md SHA12 vs state dec_sha12.
#   c7-orders  docs/orders.md SHA12 vs state orders_sha12.
#   c0-state   state file missing/bad keys = trigger (self-heal direction);
#              SHA checks report state-bad when c0 fires.
#
# Output (deterministic, no timestamps -> double-run byte comparable):
#   c1-red: QUIET|TRIGGER <detail>    ... c7-orders: ...  (7 lines, fixed)
#   state: OK | BAD <reason>
#   VERDICT: FASTPATH all-quiet                     -> exit 0
#   VERDICT: FULL-ROUND triggers=N (c1-red,...)     -> exit 2
# Fail-closed law: any per-check uncertainty (read fail, git fail, missing
# heartbeat, exception) = that check TRIGGERS - an idle fastpath verdict
# must never be produced by a broken check.
#
# Read-only: this script writes nothing anywhere (git status is read-only).
# Params all optional; defaults self-locate the <repo>\Tools\devloop\ layout
# (sandbox injects fixtures per param). ASCII-only body (PS5.1 GBK law).
# No auto-variable locals ($pid family, r164 law).
# ---------------------------------------------------------------------------

param(
    [string]$Root = '',
    [string]$StatePath = '',
    [string]$TickPath = '',
    [string]$HeartbeatPath = '',
    [string]$TechPath = '',
    [string]$LedgerPath = '',
    [string]$DecPath = '',
    [string]$OrdersPath = '',
    [string]$P16Dir = '',
    [string]$RepoRoot = ''
)

$ErrorActionPreference = 'Continue'

# --- self-locate + derived defaults (pass only -Root to exercise all of them) ---
if ([string]::IsNullOrEmpty($Root)) {
    $toolsDir = Split-Path -Parent $PSScriptRoot
    $Root = Split-Path -Parent $toolsDir
}
if ([string]::IsNullOrEmpty($RepoRoot)) { $RepoRoot = $Root }
if ([string]::IsNullOrEmpty($StatePath)) { $StatePath = Join-Path $Root 'logs\devloop-fastpath-state.txt' }
if ([string]::IsNullOrEmpty($TickPath)) {
    $TickPath = Join-Path $Root ('logs\tick-' + (Get-Date -Format 'yyyyMMdd') + '.log')
}
if ([string]::IsNullOrEmpty($HeartbeatPath)) { $HeartbeatPath = Join-Path $Root 'logs\devloop-heartbeat.txt' }
if ([string]::IsNullOrEmpty($TechPath)) { $TechPath = Join-Path $Root 'TECH.md' }
$upTwo = Split-Path -Parent (Split-Path -Parent $Root)
if ([string]::IsNullOrEmpty($LedgerPath)) { $LedgerPath = Join-Path $upTwo 'cph4\evolution-ledger.md' }
if ([string]::IsNullOrEmpty($DecPath)) { $DecPath = Join-Path $upTwo 'docs\decisions.md' }
if ([string]::IsNullOrEmpty($OrdersPath)) { $OrdersPath = Join-Path $upTwo 'docs\orders.md' }
if ([string]::IsNullOrEmpty($P16Dir)) { $P16Dir = Join-Path $upTwo 'media\BigStream' }

$script:trig = New-Object System.Collections.Generic.List[string]

function Get-Sha12
{
    param([string]$Path)
    if (-not (Test-Path -LiteralPath $Path)) { return '' }
    try { return (Get-FileHash -LiteralPath $Path -Algorithm SHA256).Hash.Substring(0,12).ToUpper() }
    catch { return '' }
}

# --- c0: state parse (byte read, r195 law: never trust tool display) ---
$stateVals = @{}
$stateBad = $false
$stateReason = ''
if (-not (Test-Path -LiteralPath $StatePath)) {
    $stateBad = $true
    $stateReason = 'state-missing'
} else {
    $sLines = @()
    try { $sLines = [IO.File]::ReadAllLines($StatePath) }
    catch { $stateBad = $true; $stateReason = 'state-read-fail' }
    foreach ($ln in $sLines) {
        $m = [regex]::Match($ln, '^(tech_sha12|ledger_sha12|dec_sha12|orders_sha12)=([0-9A-Fa-f]{12})\s*$')
        if ($m.Success) {
            $kk = $m.Groups[1].Value
            if (-not $stateVals.ContainsKey($kk)) { $stateVals[$kk] = $m.Groups[2].Value.ToUpper() }
        }
    }
    foreach ($need in @('tech_sha12','ledger_sha12','dec_sha12','orders_sha12')) {
        if (-not $stateVals.ContainsKey($need)) {
            $stateBad = $true
            if ([string]::IsNullOrEmpty($stateReason)) { $stateReason = 'state-missing-key:' + $need }
        }
    }
}
if ($stateBad) { $script:trig.Add('c0-state') }

# --- c1: red scan (normalized byte reads, r163 law) ---
$c1Trig = $false
$c1d = ''
$fails = 0
$qmax = -1
if (-not (Test-Path -LiteralPath $TickPath)) {
    $c1Trig = $true
    $c1d = ' ticklog-missing'
} else {
    $tLines = @()
    $tOk = $true
    try { $tLines = [IO.File]::ReadAllLines($TickPath) } catch { $tOk = $false }
    if (-not $tOk) {
        $c1Trig = $true
        $c1d = ' ticklog-read-fail'
    } elseif ($tLines.Length -eq 0) {
        $c1Trig = $true
        $c1d = ' ticklog-empty'
    } else {
        $startAt = 0
        if ($tLines.Length -gt 40) { $startAt = $tLines.Length - 40 }
        for ($ix = $startAt; $ix -lt $tLines.Length; $ix++) {
            $ln = $tLines[$ix]
            if ($ln -match '(gate|probe).*FAIL') { $fails++ }
            $mq = [regex]::Match($ln, 'quarantined=(\d+)')
            if ($mq.Success) {
                $qv = 0
                if ([int]::TryParse($mq.Groups[1].Value, [ref]$qv)) {
                    if ($qv -gt $qmax) { $qmax = $qv }
                }
            }
        }
        if ($fails -gt 0) { $c1Trig = $true; $c1d = $c1d + ' gate-probe-fail=' + $fails }
        if ($qmax -gt 0) { $c1Trig = $true; $c1d = $c1d + ' quarantined=' + $qmax }
    }
}
$hbStreak = 0
if (-not (Test-Path -LiteralPath $HeartbeatPath)) {
    $c1Trig = $true
    $c1d = $c1d + ' hb-missing'
} else {
    $hLines = @()
    $hOk = $true
    try { $hLines = [IO.File]::ReadAllLines($HeartbeatPath) } catch { $hOk = $false }
    if (-not $hOk) {
        $c1Trig = $true
        $c1d = $c1d + ' hb-read-fail'
    } else {
        for ($ix = $hLines.Length - 1; $ix -ge 0; $ix--) {
            $ln = $hLines[$ix]
            if ([string]::IsNullOrEmpty($ln)) { continue }
            $badLine = $false
            $known = $false
            if ($ln -match 'timeout') {
                $known = $true
                $badLine = $true
            } else {
                # LAW (r198): -match capture groups are bare strings in
                # $Matches - $Matches[1].Value is silently $null (String has
                # no .Value). Use [regex]::Match + Groups[1].Value instead.
                $me = [regex]::Match($ln, 'exit=(\d+)')
                if ($me.Success) {
                    $known = $true
                    $ev = 0
                    if ([int]::TryParse($me.Groups[1].Value, [ref]$ev)) {
                        if ($ev -ne 0) { $badLine = $true }
                    }
                }
            }
            if (-not $known) { break }
            if (-not $badLine) { break }
            $hbStreak++
        }
        if ($hbStreak -ge 2) { $c1Trig = $true; $c1d = $c1d + ' hb-bad-streak=' + $hbStreak }
    }
}
if ($c1Trig) { $script:trig.Add('c1-red') }
if ($c1Trig) { Write-Output ('c1-red: TRIGGER' + $c1d) }
else { Write-Output ('c1-red: QUIET fails=' + $fails + ' qmax=' + $qmax + ' hb_streak=' + $hbStreak) }

# --- c2: tree with r69 rotating-artifact exemption ---
$c2Trig = $false
$c2d = ''
$gitCmd = Get-Command git -ErrorAction SilentlyContinue
if ($null -eq $gitCmd) {
    $c2Trig = $true
    $c2d = 'git-not-found'
} else {
    try {
        $out = @(& git -C $RepoRoot status --porcelain -- . ':(exclude)world-public')
        $gExit = $LASTEXITCODE
        $nonEmpty = 0
        foreach ($ol in $out) {
            if ($null -ne $ol) {
                $s = "$ol".Trim()
                if ($s.Length -gt 0) { $nonEmpty++ }
            }
        }
        if ($gExit -ne 0) { $c2Trig = $true; $c2d = 'git-exit=' + $gExit }
        elseif ($nonEmpty -gt 0) { $c2Trig = $true; $c2d = 'dirty=' + $nonEmpty }
        else { $c2d = 'dirty=0' }
    } catch {
        $c2Trig = $true
        $c2d = 'git-exception'
    }
}
if ($c2Trig) { $script:trig.Add('c2-tree') }
if ($c2Trig) { Write-Output ('c2-tree: TRIGGER ' + $c2d) }
else { Write-Output ('c2-tree: QUIET ' + $c2d) }

# --- c3/c4/c6/c7: SHA12 vs state (print on call, fixed label order) ---
function Compare-ShaCheck
{
    param([string]$Label, [string]$DiskPath, [string]$StateKey)
    if ($stateBad) {
        $script:trig.Add($Label)
        Write-Output ($Label + ': TRIGGER state-bad')
        return
    }
    $diskSha = Get-Sha12 -Path $DiskPath
    if ([string]::IsNullOrEmpty($diskSha)) {
        $script:trig.Add($Label)
        Write-Output ($Label + ': TRIGGER disk-missing')
        return
    }
    $wantSha = $stateVals[$StateKey]
    if ($diskSha -ne $wantSha) {
        $script:trig.Add($Label)
        Write-Output ($Label + ': TRIGGER state=' + $wantSha + ' disk=' + $diskSha)
        return
    }
    Write-Output ($Label + ': QUIET sha=' + $diskSha)
}

Compare-ShaCheck -Label 'c3-ledger' -DiskPath $LedgerPath -StateKey 'ledger_sha12'
Compare-ShaCheck -Label 'c4-tech' -DiskPath $TechPath -StateKey 'tech_sha12'

# --- c5: P-16 unlock quick check (still blocked = quiet) ---
$c5Trig = $false
$c5d = 'no-dir'
if (Test-Path -LiteralPath $P16Dir) {
    $htmls = @(Get-ChildItem -LiteralPath $P16Dir -Recurse -Filter *.html -ErrorAction SilentlyContinue)
    if ($htmls.Count -gt 0) {
        $c5Trig = $true
        $c5d = 'p16-unlock html=' + $htmls.Count
    } else {
        $c5d = 'html=0'
    }
}
if ($c5Trig) { $script:trig.Add('c5-p16') }
if ($c5Trig) { Write-Output ('c5-p16: TRIGGER ' + $c5d) }
else { Write-Output ('c5-p16: QUIET ' + $c5d) }

Compare-ShaCheck -Label 'c6-dec' -DiskPath $DecPath -StateKey 'dec_sha12'
Compare-ShaCheck -Label 'c7-orders' -DiskPath $OrdersPath -StateKey 'orders_sha12'

# --- state line + verdict ---
if ($stateBad) { Write-Output ('state: BAD ' + $stateReason) }
else { Write-Output 'state: OK' }
$nTrig = $script:trig.Count
if ($nTrig -eq 0) {
    Write-Output 'VERDICT: FASTPATH all-quiet'
    exit 0
}
Write-Output ('VERDICT: FULL-ROUND triggers=' + $nTrig + ' (' + ($script:trig -join ',') + ')')
exit 2
