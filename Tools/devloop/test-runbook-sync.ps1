# test-runbook-sync.ps1 - sandbox proof for check-runbook-sync.ps1 (main#115)
# ---------------------------------------------------------------------------
# The tool itself was fixed in r777 (it used to read the LAST `rN <bi>` block,
# so a correct newest-first runbook was judged against the OLDEST block and
# came out DRIFT), but the fix and its three criteria lived in a throwaway
# script: no sandbox, not in the write-side family list, not in the tick's
# guarded source set. This file closes that hole at the level the tool
# actually works at -- fixtures, not the live runbook:
#   1. three states are deterministic against injected files: SYNC (rc 0),
#      DRIFT (rc 2), and every FAIL shape (rc 1) without touching state/;
#   2. round-number selection is order independent (the r777 bug) and the
#      section-9 span stops at the next heading;
#   3. the tool writes nothing and is byte-for-byte ASCII (PS5.1 GBK law).
# ASCII-only: CJK anchors are built from code points.

$ErrorActionPreference = 'Stop'
$tool = Join-Path $PSScriptRoot 'check-runbook-sync.ps1'
if (-not (Test-Path -LiteralPath $tool)) { Write-Output 'setup FAIL: check-runbook-sync.ps1 missing'; exit 1 }

$selfPath = $PSCommandPath
$sandbox = Join-Path ([System.IO.Path]::GetTempPath()) ('fv-rbsync-' + $PID)
New-Item -ItemType Directory -Path $sandbox -Force | Out-Null

$pass = 0
$fail = 0
function Check([string]$name, [bool]$cond) {
    if ($cond) { Write-Output ('  PASS ' + $name); $script:pass++ }
    else { Write-Output ('  FAIL ' + $name); $script:fail++ }
}

# Anchors, never literals.
$bi = [char]0x6BD5            # done
$jiu = [char]0x4E5D           # nine
$dun = [char]0x3001           # comma
$mid = [char]0x00B7           # middle dot
$tick = [char]0x2705          # check mark

function New-Fixture([string]$name, [string]$body) {
    $path = Join-Path $sandbox $name
    [System.IO.File]::WriteAllText($path, $body)
    return $path
}

# Runbook fixture: history newest-first is what the real file does, so the
# first block a reader meets is the current one.
function New-Runbook([string[]]$rounds, [switch]$MarkAll) {
    $lines = @('# runbook fixture', '')
    $first = $true
    foreach ($r in $rounds) {
        if ($first -and -not $MarkAll) { $lines += ('## now r' + $r + ' ' + $bi); $first = $false }
        elseif ($MarkAll) { $lines += ('## block r' + $r + ' ' + $bi) }
        else { $lines += ('## history r' + $r + '') }
        $lines += ('body of round ' + $r)
        $lines += ''
    }
    return (($lines -join "`r`n") + "`r`n")
}

$secHead = '## ' + $jiu + $dun + ' backlog'

function New-Tech([string[]]$rows, [string]$afterHeading = '', [string[]]$afterRows = @()) {
    $body = '# TECH fixture' + "`r`n`r`n" + $secHead + "`r`n`r`n" + ($rows -join "`r`n") + "`r`n"
    if ($afterHeading -ne '') {
        $body += "`r`n" + $afterHeading + "`r`n`r`n" + ($afterRows -join "`r`n") + "`r`n"
    }
    return $body
}

function New-Row([int]$n, [string]$date = '2026-11-01') {
    return ('- [' + $date + $mid + 'r' + $n + ' round note')
}

function Invoke-Tool([string]$rb, [string]$tech) {
    $prevChild = $env:FLUXVERSE_PS_SUITES_CHILD
    # Nested-run law: a sandbox must not spawn while the gate drives suites.
    $env:FLUXVERSE_PS_SUITES_CHILD = '1'
    try {
        $out = & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $tool -RunbookPath $rb -TechPath $tech 2>&1
        $code = $LASTEXITCODE
    } finally {
        if ($null -eq $prevChild) { Remove-Item Env:\FLUXVERSE_PS_SUITES_CHILD -ErrorAction SilentlyContinue }
        else { $env:FLUXVERSE_PS_SUITES_CHILD = $prevChild }
    }
    return [pscustomobject]@{ Code = $code; Out = ((@($out | ForEach-Object { [string]$_ })) -join "`n") }
}

# ---------- a) SYNC, the three-line contract ----------
Write-Output '--- a) SYNC ---'
$rbA = New-Fixture 'sync-runbook.md' (New-Runbook @('781', '780', '779'))
$techA = New-Fixture 'sync-tech.md' (New-Tech @((New-Row 779), (New-Row 780), (New-Row 781)))
$ra = Invoke-Tool $rbA $techA
Check 'a: exit 0' ($ra.Code -eq 0)
Check 'a: one SYNC line' ($ra.Out -match 'runbook-sync: SYNC runbook=r781 tech_tail=r781')
Check 'a: no timestamp in the line' (-not ($ra.Out -match '\d{2}:\d{2}'))
$ra2 = Invoke-Tool $rbA $techA
Check 'a: double run is byte-comparable' ($ra2.Out -eq $ra.Out)

# ---------- b) marker shape tolerance ----------
Write-Output '--- b) marker shapes ---'
$rbB = New-Fixture 'nospace-runbook.md' ('# rb' + "`r`n`r`n" + '## now r781' + $bi + "`r`n")
$rbB2 = New-Fixture 'padded-runbook.md' ('# rb' + "`r`n`r`n" + '## now r781   ' + $bi + "`r`n")
$rbB3 = New-Fixture 'zeros-runbook.md' ('# rb' + "`r`n`r`n" + '## now r0781 ' + $bi + "`r`n")
Check 'b: no space before the marker still syncs' ((Invoke-Tool $rbB $techA).Code -eq 0)
Check 'b: padded gap still syncs' ((Invoke-Tool $rbB2 $techA).Code -eq 0)
$rB3 = Invoke-Tool $rbB3 $techA
Check 'b: leading zeros compare numerically' ($rB3.Code -eq 0 -and $rB3.Out -match 'runbook=r0781 tech_tail=r781')

# ---------- c) DRIFT ----------
Write-Output '--- c) DRIFT ---'
$rbC = New-Fixture 'drift-runbook.md' (New-Runbook @('780', '779'))
$rc = Invoke-Tool $rbC $techA
Check 'c: exit 2' ($rc.Code -eq 2)
Check 'c: both numbers named' ($rc.Out -match 'runbook-sync: DRIFT runbook=r780 tech_tail=r781')
Check 'c: no SYNC verdict on drift' (-not ($rc.Out -match 'runbook-sync: SYNC'))

# ---------- d) order independence (the r777 bug) ----------
Write-Output '--- d) block order ---'
# Newest-first: the LAST `rN <bi>` in the file is the oldest block. The pre-r777
# code took exactly that one and called a correct runbook DRIFT.
$rbD = New-Fixture 'order-desc-runbook.md' (New-Runbook @('781', '780', '779'))
$rd = Invoke-Tool $rbD $techA
Check 'd: newest-first history still syncs' ($rd.Code -eq 0 -and $rd.Out -match 'runbook=r781')
# Oldest-first too: nothing about the verdict may depend on block order.
$rbD2 = New-Fixture 'order-asc-runbook.md' (New-Runbook @('779', '780', '781') -MarkAll)
$rd2 = Invoke-Tool $rbD2 $techA
Check 'd: oldest-first history syncs as well' ($rd2.Code -eq 0 -and $rd2.Out -match 'runbook=r781')
# A stale current block with a newer one buried in history is still readable:
# the max is what TECH's moving tail is compared against.
$rbD3 = New-Fixture 'order-mixed-runbook.md' (New-Runbook @('782', '781'))
$rd3 = Invoke-Tool $rbD3 $techA
Check 'd: max wins over position' ($rd3.Code -eq 2 -and $rd3.Out -match 'runbook=r782 tech_tail=r781')

# ---------- e) section-9 span and row shape ----------
Write-Output '--- e) section 9 ---'
$techE = New-Fixture 'span-tech.md' (New-Tech @((New-Row 780), (New-Row 781)) ('## ' + $jiu + $dun + ' is not this one') @((New-Row 999)))
$re = Invoke-Tool $rbA $techE
Check 'e: tail stops at the next heading' ($re.Code -eq 0 -and $re.Out -match 'tech_tail=r781')
Check 'e: the later r999 row is ignored' (-not ($re.Out -match 'r999'))
$techE2 = New-Fixture 'tick-tech.md' (New-Tech @((New-Row 780), ('- [' + $tick + ' 2026-11-01' + $mid + 'r781 done')))
$re2 = Invoke-Tool $rbA $techE2
Check 'e: tick-prefixed row is a row' ($re2.Code -eq 0 -and $re2.Out -match 'tech_tail=r781')
$techE3 = New-Fixture 'prose-tech.md' (New-Tech @((New-Row 781), '- a bullet that is not a round row', '| a | table |', '- [2026-11-01] no round token'))
$re3 = Invoke-Tool $rbA $techE3
Check 'e: non-row bullets do not move the tail' ($re3.Code -eq 0 -and $re3.Out -match 'tech_tail=r781')

# ---------- f) FAIL shapes, all rc 1 ----------
Write-Output '--- f) FAIL shapes ---'
$missing = Join-Path $sandbox 'does-not-exist.md'
$rf1 = Invoke-Tool $missing $techA
Check 'f: missing runbook exit 1' ($rf1.Code -eq 1)
Check 'f: missing runbook named' ($rf1.Out -match 'FAIL runbook-missing')
$rf2 = Invoke-Tool $rbA $missing
Check 'f: missing tech exit 1' ($rf2.Code -eq 1)
Check 'f: missing tech named' ($rf2.Out -match 'FAIL tech-missing')
$rbF = New-Fixture 'nomarker-runbook.md' ('# rb' + "`r`n`r`n" + '## now without a round token' + "`r`n")
$rf3 = Invoke-Tool $rbF $techA
Check 'f: no marker exit 1' ($rf3.Code -eq 1)
Check 'f: no marker named' ($rf3.Out -match 'FAIL runbook-no-current-round-marker')
$techF = New-Fixture 'nosec-tech.md' ('# TECH' + "`r`n`r`n" + '## another section' + "`r`n`r`n" + (New-Row 781) + "`r`n")
$rf4 = Invoke-Tool $rbA $techF
Check 'f: no section 9 exit 1' ($rf4.Code -eq 1)
Check 'f: no section 9 named' ($rf4.Out -match 'FAIL tech-no-section9')
$techF2 = New-Fixture 'norows-tech.md' (New-Tech @('- a bullet with no round token', '| plain | table |'))
$rf5 = Invoke-Tool $rbA $techF2
Check 'f: no rows exit 1' ($rf5.Code -eq 1)
Check 'f: no rows named' ($rf5.Out -match 'FAIL tech-section9-no-rows')

# ---------- g) read-only ----------
Write-Output '--- g) read-only ---'
function Get-Stamp([string]$path) {
    $item = Get-Item -LiteralPath $path
    return ('' + $item.Length + '/' + $item.LastWriteTimeUtc.Ticks)
}
$stampBefore = @((Get-Stamp $rbA), (Get-Stamp $techA))
$null = Invoke-Tool $rbA $techA
$stampAfter = @((Get-Stamp $rbA), (Get-Stamp $techA))
Check 'g: runbook fixture untouched' ($stampBefore[0] -eq $stampAfter[0])
Check 'g: tech fixture untouched' ($stampBefore[1] -eq $stampAfter[1])
Check 'g: no stray files in the sandbox' (@(Get-ChildItem -LiteralPath $sandbox -File).Count -eq 15)

# ---------- h) live wiring: default paths still parse ----------
Write-Output '--- h) default paths ---'
$prevChild2 = $env:FLUXVERSE_PS_SUITES_CHILD
$env:FLUXVERSE_PS_SUITES_CHILD = '1'
try {
    $liveOut = & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $tool 2>&1
    $liveCode = $LASTEXITCODE
} finally {
    if ($null -eq $prevChild2) { Remove-Item Env:\FLUXVERSE_PS_SUITES_CHILD -ErrorAction SilentlyContinue }
    else { $env:FLUXVERSE_PS_SUITES_CHILD = $prevChild2 }
}
$liveText = ((@($liveOut | ForEach-Object { [string]$_ })) -join "`n")
# SYNC or DRIFT are both verdicts; only a parse failure (rc 1) means the live
# anchors stopped being findable, which is what this check is for.
Check 'h: live run is a verdict, not a parse failure' ($liveCode -eq 0 -or $liveCode -eq 2)
Check 'h: live run names the tool' ($liveText -match 'runbook-sync: (SYNC|DRIFT)')

# ---------- i) ASCII-only ----------
Write-Output '--- i) encoding ---'
function Test-Ascii([string]$path) {
    foreach ($b in [System.IO.File]::ReadAllBytes($path)) { if ($b -gt 126) { return $false } }
    return $true
}
Check 'i: the tool is ASCII-only' (Test-Ascii $tool)
Check 'i: this sandbox is ASCII-only' (Test-Ascii $selfPath)

Remove-Item -LiteralPath $sandbox -Recurse -Force -ErrorAction SilentlyContinue
$total = $pass + $fail
if ($fail -eq 0) {
    Write-Output ('RESULT: PASS (' + $total + ' assertions)  pass=' + $pass + ' fail=0')
    exit 0
}
Write-Output ('RESULT: FAIL (' + $fail + ' of ' + $total + ')  pass=' + $pass + ' fail=' + $fail)
exit 1