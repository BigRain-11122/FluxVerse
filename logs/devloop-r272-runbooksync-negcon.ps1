# r272 negative-control sandbox for check-runbook-sync.ps1 (tech#11, runbook<->section9 round sync)
# ASCII-only per mandate hard-constraint 3 (CJK fixture chars built from code points).
# TEMP isolation with prefix rbsync-ng-; zero repo writes from fixtures; real files get a
# read-only proof via SHA256 before/after. Verdict line: 'harness: pass=N fail=M' (fmtC lowercase,
# last-match judged per r269 lesson). Exit 0 iff fail=0.

$ErrorActionPreference = 'Stop'

$repo = Split-Path -Parent (Split-Path -Parent $PSCommandPath)   # logs\ -> repo root
$tool = Join-Path $repo 'Tools\devloop\check-runbook-sync.ps1'
$realRunbook = Join-Path $repo 'state\runbook.md'
$realTech = Join-Path $repo 'TECH.md'

$script:pass = 0
$script:fail = 0
$script:results = New-Object System.Collections.ArrayList
function Assert([bool]$Cond, [string]$Name) {
    if ($Cond) { $script:pass++; [void]$script:results.Add(('PASS ' + $Name)) }
    else { $script:fail++; [void]$script:results.Add(('FAIL ' + $Name)) }
}

function Run-Tool([string]$Rb, [string]$Tk) {
    $o = $null
    $code = -1
    try {
        if ($Rb -eq '') { $o = & $tool }
        else { $o = & $tool -RunbookPath $Rb -TechPath $Tk }
        $code = $LASTEXITCODE
    } catch {
        $code = -1
        $o = @(('EXCEPTION: ' + $_.Exception.Message))
    }
    $lines = @($o)
    $txt = (($lines | ForEach-Object { $_.ToString() }) -join "`n").Trim()
    return @{ lines = $lines; txt = $txt; code = $code }
}

# CJK fixture atoms (code-point construction, no literal CJK in this script)
$bi = [char]0x6BD5    # finish-marker char used by runbook current-round line
$jiu = [char]0x4E5D   # nine
$dun = [char]0x3001   # ideographic comma
$mid = [char]0x00B7   # middle dot
$ck = [char]0x2705    # checkmark prefix tolerated in section-9 rows
$utf8 = New-Object System.Text.UTF8Encoding($false)

$tmp = Join-Path ([System.IO.Path]::GetTempPath()) ('rbsync-ng-' + [guid]::NewGuid().ToString('N'))
[void](New-Item -ItemType Directory -Path $tmp -Force)

try {
    # ---------- fixtures (all under TEMP, nothing touches the repo) ----------
    $fxSyncRb = Join-Path $tmp 'rb-sync.md'          # marker r001
    $fxBwRb = Join-Path $tmp 'rb-backward.md'        # marker r270
    $fxMultiRb = Join-Path $tmp 'rb-multi.md'        # markers r269 then r272 (last wins)
    $fxNoMark = Join-Path $tmp 'rb-nomark.md'        # no marker at all
    $fxMissRb = Join-Path $tmp 'rb-missing.md'       # never created

    $s9head = '## ' + $jiu + $dun + ' backlog'
    $fxTech1 = Join-Path $tmp 'tech-r001.md'         # section9 tail row r001
    $fxTech271 = Join-Path $tmp 'tech-r271.md'       # section9 tail row r271
    $fxNoS9 = Join-Path $tmp 'tech-nos9.md'          # no section9 heading
    $fxEmptyS9 = Join-Path $tmp 'tech-emptys9.md'    # section9 heading, no dated rows
    $fxMissTk = Join-Path $tmp 'tech-missing.md'     # never created

    [System.IO.File]::WriteAllText($fxSyncRb, ('## now' + "`r`n" + 'r001 ' + $bi + ' done round one' + "`r`n"), $utf8)
    [System.IO.File]::WriteAllText($fxBwRb, ('## now' + "`r`n" + 'r270 ' + $bi + ' done round two-seventy' + "`r`n"), $utf8)
    [System.IO.File]::WriteAllText($fxMultiRb, ('## now' + "`r`n" + 'r269 ' + $bi + ' older line' + "`r`n" + 'r272 ' + $bi + ' latest line' + "`r`n"), $utf8)
    [System.IO.File]::WriteAllText($fxNoMark, ('## now' + "`r`n" + 'no current round marker in here' + "`r`n"), $utf8)

    [System.IO.File]::WriteAllText($fxTech1, ($s9head + "`r`n`r`n" + '- [2026-01-01' + $mid + 'r001 close]' + "`r`n"), $utf8)
    [System.IO.File]::WriteAllText($fxTech271, ($s9head + "`r`n`r`n" + '- [2026-01-02' + $mid + 'r271 close]' + "`r`n"), $utf8)
    [System.IO.File]::WriteAllText($fxNoS9, ('## other' + "`r`n" + 'plain file without the nine section' + "`r`n"), $utf8)
    [System.IO.File]::WriteAllText($fxEmptyS9, ($s9head + "`r`n" + 'heading exists but no dated rows at all' + "`r`n"), $utf8)

    # ---------- read-only proof: hash real files before all runs ----------
    $rbHashBefore = (Get-FileHash -LiteralPath $realRunbook -Algorithm SHA256).Hash
    $tkHashBefore = (Get-FileHash -LiteralPath $realTech -Algorithm SHA256).Hash

    # A1: real-file run (no params = self-locating defaults) -> SYNC
    $r1 = Run-Tool '' ''
    Assert (($r1.code) -eq 0) 'a1-realrun-exit0'
    Assert ((@($r1.lines).Count) -eq 1) 'a1-realrun-oneline'
    Assert ($r1.txt -cmatch '^runbook-sync: SYNC runbook=r(\d+) tech_tail=r\1$') 'a1-realrun-sync-equal'

    # A2: determinism - second identical run, byte-comparable output (no timestamps)
    $r2 = Run-Tool '' ''
    Assert (($r2.code) -eq 0) 'a2-doublerun-exit0'
    Assert (($r1.txt) -ceq $r2.txt) 'a2-doublerun-bytes-same'

    # A11: fixture positive control - equal numbers on fixtures -> SYNC branch independent of repo state
    $r11 = Run-Tool $fxSyncRb $fxTech1
    Assert (($r11.code) -eq 0) 'a11-fixture-sync-exit0'
    Assert (($r11.txt) -ceq 'runbook-sync: SYNC runbook=r001 tech_tail=r001') 'a11-fixture-sync-output'

    # A3: backward drift fixture -> DRIFT exit 2
    $r3 = Run-Tool $fxBwRb $fxTech271
    Assert (($r3.code) -eq 2) 'a3-backward-drift-exit2'
    Assert (($r3.txt) -ceq 'runbook-sync: DRIFT runbook=r270 tech_tail=r271') 'a3-backward-drift-output'

    # A4: two markers in runbook -> last match wins
    $r4 = Run-Tool $fxMultiRb $fxTech1
    Assert (($r4.code) -eq 2) 'a4-last-marker-exit2'
    Assert (($r4.txt) -ceq 'runbook-sync: DRIFT runbook=r272 tech_tail=r001') 'a4-last-marker-output'

    # A5: runbook missing -> fail-loud
    $r5 = Run-Tool $fxMissRb $fxTech1
    Assert (($r5.code) -eq 1) 'a5-runbook-missing-exit1'
    Assert (($r5.txt) -ceq 'runbook-sync: FAIL runbook-missing') 'a5-runbook-missing-output'

    # A6: TECH missing -> fail-loud
    $r6 = Run-Tool $fxSyncRb $fxMissTk
    Assert (($r6.code) -eq 1) 'a6-tech-missing-exit1'
    Assert (($r6.txt) -ceq 'runbook-sync: FAIL tech-missing') 'a6-tech-missing-output'

    # A7: runbook without current-round marker
    $r7 = Run-Tool $fxNoMark $fxTech1
    Assert (($r7.code) -eq 1) 'a7-no-marker-exit1'
    Assert (($r7.txt) -ceq 'runbook-sync: FAIL runbook-no-current-round-marker') 'a7-no-marker-output'

    # A8: TECH without section nine
    $r8 = Run-Tool $fxSyncRb $fxNoS9
    Assert (($r8.code) -eq 1) 'a8-no-section9-exit1'
    Assert (($r8.txt) -ceq 'runbook-sync: FAIL tech-no-section9') 'a8-no-section9-output'

    # A9: section nine present but no dated round rows
    $r9 = Run-Tool $fxSyncRb $fxEmptyS9
    Assert (($r9.code) -eq 1) 'a9-empty-section9-exit1'
    Assert (($r9.txt) -ceq 'runbook-sync: FAIL tech-section9-no-rows') 'a9-empty-section9-output'

    # A10: read-only proof - real files byte-identical after all runs
    $rbHashAfter = (Get-FileHash -LiteralPath $realRunbook -Algorithm SHA256).Hash
    $tkHashAfter = (Get-FileHash -LiteralPath $realTech -Algorithm SHA256).Hash
    Assert (($rbHashBefore) -ceq $rbHashAfter) 'a10-realrunbook-readonly'
    Assert (($tkHashBefore) -ceq $tkHashAfter) 'a10-realtech-readonly'
}
finally {
    if (Test-Path -LiteralPath $tmp) { Remove-Item -LiteralPath $tmp -Recurse -Force -ErrorAction SilentlyContinue }
}

foreach ($line in $script:results) { Write-Output $line }
Write-Output ('harness: pass=' + $script:pass + ' fail=' + $script:fail)
if ($script:fail -eq 0) { exit 0 } else { exit 1 }
