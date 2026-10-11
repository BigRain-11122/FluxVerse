# logs/devloop-r279-rolls-test.ps1
# r279 law-roll seat (consolidated, rotation-immune gate for BOTH skill ledgers).
# Born from a structural loss found this round: the r170/r171/r192 per-round smoke
# scripts lived gitignored in logs/ and were PURGED by the r274 log rotation
# (>14d threshold) -- a standing gate referenced by TECH rows rotted silently.
# Gate essence of all three doors, consolidated into ONE tracked seat:
#   A  BOTH harness templates machinery: sandbox (copy to logs/, direct run
#      pass=9 fail=0) + bake sample mode (VERDICT: ALL GREEN, FAIL=0, pass>=15
#      lower bound -- r171 A-gate essence, completing the three-door charter)
#   A0b PSA advisor self-scan of this seat (module absent = visible note)
#   B  ledger census rot-proof lower bounds (ps51-traps bullet families by section
#      ORDER - no CJK literals in this body; gdi-traps numbered entries) + roll markers
#   C  FILL marker lower bounds + zero TODO sentinels in both templates
#   D  install-copy sync (inst absent = NOTE downgrade, never RED -- cross-machine law,
#      r171 D-gate precedent; present + mismatch = RED)
# Census law: lower bounds only (monotone, legal growth, never rot -- r266 a3root-v2
# lesson; exact pins rot, cf. r212 A2 observation-pin drift found at r267).
# All subprocess via .NET Process double-redirect (r244 law #29), Arguments string
# form -- PS5.1 ProcessStartInfo has NO ArgumentList (r279 law entry, this seat is
# its first standing consumer). ASCII-only body (PS5.1 GBK law).
# Self-location: logs -> parent (one level, r276 fifth-case precedent).
$ErrorActionPreference = 'Stop'

$repo = Split-Path -Parent $PSScriptRoot
$pass = 0; $fail = 0
$notes = New-Object System.Collections.Generic.List[string]
function Assert($name, $cond) {
    if ($cond) { $script:pass++; Write-Output ("PASS " + $name) }
    else { $script:fail++; Write-Output ("FAIL " + $name) }
}
function Invoke-Captured($exe, $argString, $workDir) {
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = $exe
    $psi.Arguments = $argString
    $psi.WorkingDirectory = $workDir
    $psi.UseShellExecute = $false
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    $psi.CreateNoWindow = $true
    $p = [System.Diagnostics.Process]::Start($psi)
    $so = $p.StandardOutput.ReadToEnd()
    $se = $p.StandardError.ReadToEnd()
    $p.WaitForExit()
    return @{ code = $p.ExitCode; out = $so; err = $se }
}
function Read-Utf8($p) { return [IO.File]::ReadAllText($p, (New-Object System.Text.UTF8Encoding($false))) }
function Count-NonAsciiBytes($p) {
    $b = [IO.File]::ReadAllBytes($p); $n = 0
    foreach ($x in $b) { if ($x -gt 127) { $n++ } }
    return $n
}
function Sha256($p) {
    $sha = [System.Security.Cryptography.SHA256]::Create()
    try {
        $fs = [IO.File]::OpenRead($p)
        try { return ([BitConverter]::ToString($sha.ComputeHash($fs)) -replace '-', '') } finally { $fs.Close() }
    } finally { $sha.Clear() }
}
# Section census by ORDER (headers = lines starting '## '); ASCII-clean, no CJK here.
# LAW (r279 #1, expression-mode mirror of r64): `A -op1 p, r -op2 s` NEVER parses as
# ((A -op1 p, r) -op2 s) -- the comma array absorbs `r -op2 s` as an operand and
# -op2 never applies to the whole. Parenthesize every operator application.
# LAW (r279 #3): collection-LHS null comparison is FILTER semantics -- an empty
# List/array LHS makes `$x -ne $null` return an EMPTY collection = falsy in if(),
# so non-null guards silently never fire. Null tests ALWAYS put $null on the LEFT.
# Nested collection out of a function needs the unary comma (r65 pipeline flatten).
function Get-Sections($path) {
    $txt = Read-Utf8 $path
    $lines = @( ($txt -replace "`r", '') -split "`n" )
    $secs = New-Object System.Collections.Generic.List[object]
    $cur = $null
    foreach ($ln in $lines) {
        if ($ln.StartsWith('## ')) {
            if ($null -ne $cur) { $secs.Add($cur) }
            $cur = New-Object System.Collections.Generic.List[string]
        } elseif ($null -ne $cur) { $cur.Add($ln) }
    }
    if ($null -ne $cur) { $secs.Add($cur) }
    return ,$secs
}
function Count-Bullets($secLines) {
    $n = 0
    foreach ($ln in $secLines) { if ($ln.StartsWith('- **')) { $n++ } }
    return $n
}
function Count-Numbered($secLines) {
    $n = 0
    foreach ($ln in $secLines) { if ($ln -match '^\s*\d+\. \*\*') { $n++ } }
    return $n
}

$sbSkill = 'fluxverse-city-sandbox'
$bkSkill = 'fluxverse-bake-pipeline'
$skillRoot = Join-Path $repo 'Tools\skills'
$instRoot = Join-Path $repo '.codely-cli\skills'
$sbDir = Join-Path $skillRoot $sbSkill
$bkDir = Join-Path $skillRoot $bkSkill
$manifest = @(
    @{ s = $sbSkill; f = 'SKILL.md' },
    @{ s = $sbSkill; f = 'references\active-tables.md' },
    @{ s = $sbSkill; f = 'references\gate-family.md' },
    @{ s = $sbSkill; f = 'references\ps51-traps.md' },
    @{ s = $sbSkill; f = 'scripts\sandbox-harness-template.ps1' },
    @{ s = $bkSkill; f = 'SKILL.md' },
    @{ s = $bkSkill; f = 'references\bake-recipes.md' },
    @{ s = $bkSkill; f = 'references\ps51-gdi-traps.md' },
    @{ s = $bkSkill; f = 'references\style-gate.md' },
    @{ s = $bkSkill; f = 'scripts\bake-harness-template.ps1' }
)
$sbTpl = Join-Path $sbDir 'scripts\sandbox-harness-template.ps1'
$bkTpl = Join-Path $bkDir 'scripts\bake-harness-template.ps1'
$sbTraps = Join-Path $sbDir 'references\ps51-traps.md'
$gdiTraps = Join-Path $bkDir 'references\ps51-gdi-traps.md'

# --- A0: hygiene ---------------------------------------------------------------
Assert 'a0-self-ascii' ((Count-NonAsciiBytes $PSCommandPath) -eq 0)
$present = 0
foreach ($m in $manifest) { if (Test-Path -LiteralPath (Join-Path (Join-Path $skillRoot $m.s) $m.f)) { $present++ } }
Assert 'a0-skill-files-10-10' ($present -eq 10)
Assert 'a0-sandbox-tpl-ascii' ((Count-NonAsciiBytes $sbTpl) -eq 0)
Assert 'a0-bake-tpl-ascii' ((Count-NonAsciiBytes $bkTpl) -eq 0)
Assert 'a0-sandbox-tpl-zero-todo' (((Read-Utf8 $sbTpl).Contains('TODO')) -eq $false)
Assert 'a0-bake-tpl-zero-todo' (((Read-Utf8 $bkTpl).Contains('TODO')) -eq $false)

# --- A0b: PSA advisor self-scan (r212 template precedent, promoted to this seat:
# the r279 null-comparison bug class in fresh harness code would have been caught
# here. Module absent = visible note downgrade, never silent, never red.) ---------
$psa = Invoke-Captured 'powershell' ('-NoProfile -ExecutionPolicy Bypass -File "' +
    (Join-Path $repo 'Tools\devloop\psa-advisor.ps1') + '" -Target "' + $PSCommandPath + '"') $repo
if ($psa.code -eq 3) {
    $notes.Add('NOTE psa-module-absent-selfscan')
    Assert 'a0b-psa-selfscan-module-absent-note' ($true)
} else {
    Assert 'a0b-psa-selfscan-green' ($psa.code -eq 0)
}

# --- B: ledger census (rot-proof lower bounds by section order) -----------------
$sbSecs = Get-Sections $sbTraps
Assert 'ps51-sections-4' ($sbSecs.Count -eq 4)
$secCounts = @(0) * 4
for ($i = 0; $i -lt 4; $i++) { $secCounts[$i] = Count-Bullets $sbSecs[$i] }
Assert 'ps51-sec1-enc-ge6' ($secCounts[0] -ge 6)
Assert 'ps51-sec2-parse-ge11' ($secCounts[1] -ge 11)
Assert 'ps51-sec3-vars-ge10' ($secCounts[2] -ge 10)
Assert 'ps51-sec4-disc-ge6' ($secCounts[3] -ge 6)
$tot = 0; foreach ($c in $secCounts) { $tot += $c }
Assert 'ps51-total-ge33' ($tot -ge 33)
Assert 'ps51-marker-argumentlist' ((Read-Utf8 $sbTraps).Contains('ArgumentList'))

$gdiSecs = Get-Sections $gdiTraps
Assert 'gdi-sections-6' ($gdiSecs.Count -eq 6)
$gtot = 0
foreach ($s in $gdiSecs) { $gtot += (Count-Numbered $s) }
Assert 'gdi-total-ge29' ($gtot -ge 29)
Assert 'gdi-marker-nativecommanderror' ((Read-Utf8 $gdiTraps).Contains('NativeCommandError'))

# --- C: FILL markers ------------------------------------------------------------
function Count-Fill($p) {
    $n = 0
    $txt = (Read-Utf8 $p) -replace "`r", ''
    foreach ($ln in @($txt -split "`n")) {
        if ($ln.Contains('# FILL')) { $n++ }
    }
    return $n
}
Assert 'sandbox-fill-markers-ge10' ((Count-Fill $sbTpl) -ge 10)
Assert 'bake-fill-markers-ge9' ((Count-Fill $bkTpl) -ge 9)

# --- D: install-copy sync (absent = note downgrade, present+mismatch = red) -----
$syncRows = New-Object System.Collections.Generic.List[object]
$i = 0
foreach ($m in $manifest) {
    $i++
    $src = Join-Path (Join-Path $skillRoot $m.s) $m.f
    $dst = Join-Path (Join-Path $instRoot $m.s) $m.f
    $row = @{ i = $i; s = $m.s; f = (Split-Path -Leaf $m.f) }
    if (-not (Test-Path -LiteralPath $dst)) {
        $notes.Add(('NOTE sync-absent-' + $i + '-' + (Split-Path -Leaf $m.f)))
        Assert ('sync-' + $i + '-' + (Split-Path -Leaf $m.f) + '-absent-note') ($true)
        $row['state'] = 'absent-note'
    } else {
        $eq = ((Sha256 $src) -eq (Sha256 $dst))
        Assert ('sync-' + $i + '-' + (Split-Path -Leaf $m.f)) ($eq)
        $row['state'] = $eq
    }
    $syncRows.Add($row)
}

# --- A: sandbox template machinery (direct-run proof) ---------------------------
$tplCopy = Join-Path $PSScriptRoot 'devloop-r279-rolls-tpl.ps1'
$tplOut = ''
$tplCode = -1
try {
    Copy-Item -LiteralPath $sbTpl -Destination $tplCopy -Force
    $r = Invoke-Captured 'powershell' ('-NoProfile -ExecutionPolicy Bypass -File "' + $tplCopy + '"') $repo
    $tplCode = $r.code; $tplOut = $r.out
    [IO.File]::WriteAllText((Join-Path $PSScriptRoot 'devloop-r279-rolls-tpl.txt'), ($tplOut + "`n--err--`n" + $r.err), (New-Object System.Text.UTF8Encoding($false)))
} finally {
    if (Test-Path -LiteralPath $tplCopy) { Remove-Item -LiteralPath $tplCopy -Force }
}
Assert 'tpl-run-exit0' ($tplCode -eq 0)
Assert 'tpl-verdict-pass9-fail0' ($tplOut.Contains('pass=9 fail=0'))
Assert 'tpl-temp-cleaned' ((Test-Path -LiteralPath $tplCopy) -eq $false)

# --- A2: bake template machinery (r171 A-gate essence; sample mode = deterministic
# PNG bake + six-face gates A0-A5; rot-proof asserts -- VERDICT line + FAIL=0 +
# pass lower bound, never a hard PASS pin: template gates grow legally, cf. the
# r212 A0b promotion that moved 15 -> 16). Sample scratch dirs under TEMP are
# template-managed (pre-cleaned per run) but swept here too = zero residue law. --
$bkCopy = Join-Path $PSScriptRoot 'devloop-r279-rolls-bktpl.ps1'
$bkOut = ''
$bkCode = -1
try {
    Copy-Item -LiteralPath $bkTpl -Destination $bkCopy -Force
    $r2 = Invoke-Captured 'powershell' ('-NoProfile -ExecutionPolicy Bypass -File "' + $bkCopy + '"') $repo
    $bkCode = $r2.code; $bkOut = $r2.out
    [IO.File]::WriteAllText((Join-Path $PSScriptRoot 'devloop-r279-rolls-bktpl.txt'), ($bkOut + "`n--err--`n" + $r2.err), (New-Object System.Text.UTF8Encoding($false)))
} finally {
    if (Test-Path -LiteralPath $bkCopy) { Remove-Item -LiteralPath $bkCopy -Force }
    foreach ($rd in @('fv-bake-harness-run1', 'fv-bake-harness-run2', 'fv-bake-harness-run3')) {
        $td = Join-Path $env:TEMP $rd
        if (Test-Path -LiteralPath $td) { Remove-Item -LiteralPath $td -Recurse -Force }
    }
}
Assert 'bktpl-run-exit0' ($bkCode -eq 0)
Assert 'bktpl-verdict-allgreen' ($bkOut.Contains('VERDICT: ALL GREEN'))
Assert 'bktpl-verdict-fail0' (([regex]::Match($bkOut, 'FAIL=\d+')).Value -eq 'FAIL=0')
$bkPassN = [int](([regex]::Match($bkOut, 'PASS=\d+')).Value -replace 'PASS=', '')
Assert 'bktpl-pass-ge15' ($bkPassN -ge 15)
Assert 'bktpl-temp-cleaned' ((Test-Path -LiteralPath $bkCopy) -eq $false)

# --- A3: poisoned-template negative controls (tech#13, r270 negcon 5th application)
# The A2 four-assert face has only ever seen green (r285: PASS=16 FAIL=0). This section
# proves the seat asserts are NON-CONSTANT by feeding three known-bad COPIES of the
# tracked template (TEMP GUID sandbox; the canonical template is never touched).
# Single-point text splices on the copy; splice-applied asserts fail loud if the anchor
# text ever drifts (r235 silent-miss lesson).
#   n1 baker-tamper: opaque band FromArgb 255 -> 200 (baked output no longer matches
#      the A5 recount spec) -> FAIL A5 recount alpha 250..255 -> VERDICT: RED + exit 1.
#   n2 variant-collapse: RunDir3 hue 160 -> 64 (variant byte-identical to run1) ->
#      FAIL A3 variant inter-different -> VERDICT: RED + exit 1.
#   n3 verdict-sabotage (stacked on n1): FAIL threshold 0 -> 99 -> FAIL=1 yet
#      VERDICT: ALL GREEN + exit 0 = fake green. The seat's bktpl-verdict-fail0
#      assert reads the count line, not the verdict marker, so it still goes red --
#      three-surface redundancy (VERDICT marker / exit code / FAIL=N count) pays.
# Seat-assert-face census across the three poisons ($a3SeatRed counts RED asserts of
# the four-assert face, i.e. each `if` fires when the seat assert's condition is
# FALSE): n1 = 3 red (exit0/allgreen/fail0 red; pass-ge15 stays green at PASS=15 --
# the lower bound's legal insensitivity to one poisoned gate, recorded as boundary,
# not a defect); n2 = 3 red (same face, PASS=15 again green at floor); n3 = 1 red
# (exit0 and allgreen go green by sabotage design, pass-ge15 green at floor; only
# fail0 catches the fake green -- the count-line redundancy is the payoff).
# Rot-proof law: asserts bind to gate LOGIC (named red line, exit code, fail-ge1),
# never to exact PASS pins (r212/r266 lessons).
$bkTplText = [IO.File]::ReadAllText($bkTpl)
$negRoot = Join-Path $env:TEMP ('r279-rolls-negcon-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $negRoot | Out-Null
$a3SeatRed = 0
try {
    $n1Path = Join-Path $negRoot 'bktpl-n1-tamper.ps1'
    $n1Text = $bkTplText.Replace('[System.Drawing.Color]::FromArgb(255, 30, 40, 50)', '[System.Drawing.Color]::FromArgb(200, 30, 40, 50)')
    Assert 'a3-n1-splice-applied' ($n1Text -ne $bkTplText)
    [IO.File]::WriteAllText($n1Path, $n1Text)
    $rN1 = Invoke-Captured 'powershell' ('-NoProfile -ExecutionPolicy Bypass -File "' + $n1Path + '"') $repo
    Assert 'a3-n1-exit1' ($rN1.code -eq 1)
    Assert 'a3-n1-verdict-red' ($rN1.out.Contains('VERDICT: RED'))
    $n1FailN = 0
    $m1 = [regex]::Match($rN1.out, 'FAIL=(\d+)')
    if ($m1.Success) { $n1FailN = [int]$m1.Groups[1].Value }
    Assert 'a3-n1-fail-ge1' ($n1FailN -ge 1)
    Assert 'a3-n1-a5-red-named' ($rN1.out.Contains('FAIL A5 recount alpha 250..255'))
    $n1PassN = -1
    $p1 = [regex]::Match($rN1.out, 'PASS=(\d+)')
    if ($p1.Success) { $n1PassN = [int]$p1.Groups[1].Value }
    if ($rN1.code -ne 0) { $a3SeatRed++ }
    if (-not $rN1.out.Contains('VERDICT: ALL GREEN')) { $a3SeatRed++ }
    if ($n1FailN -ne 0) { $a3SeatRed++ }
    if ($n1PassN -lt 15) { $a3SeatRed++ }

    $n2Path = Join-Path $negRoot 'bktpl-n2-collapse.ps1'
    $n2Text = $bkTplText.Replace('Bake-Sample $RunDir3 160', 'Bake-Sample $RunDir3 64')
    Assert 'a3-n2-splice-applied' ($n2Text -ne $bkTplText)
    [IO.File]::WriteAllText($n2Path, $n2Text)
    $rN2 = Invoke-Captured 'powershell' ('-NoProfile -ExecutionPolicy Bypass -File "' + $n2Path + '"') $repo
    Assert 'a3-n2-exit1' ($rN2.code -eq 1)
    Assert 'a3-n2-verdict-red' ($rN2.out.Contains('VERDICT: RED'))
    $n2FailN = 0
    $m2 = [regex]::Match($rN2.out, 'FAIL=(\d+)')
    if ($m2.Success) { $n2FailN = [int]$m2.Groups[1].Value }
    Assert 'a3-n2-fail-ge1' ($n2FailN -ge 1)
    Assert 'a3-n2-variant-red-named' ($rN2.out.Contains('FAIL A3 variant inter-different'))
    $n2PassN = -1
    $p2 = [regex]::Match($rN2.out, 'PASS=(\d+)')
    if ($p2.Success) { $n2PassN = [int]$p2.Groups[1].Value }
    if ($rN2.code -ne 0) { $a3SeatRed++ }
    if (-not $rN2.out.Contains('VERDICT: ALL GREEN')) { $a3SeatRed++ }
    if ($n2FailN -ne 0) { $a3SeatRed++ }
    if ($n2PassN -lt 15) { $a3SeatRed++ }

    $n3Path = Join-Path $negRoot 'bktpl-n3-verdict-sabotage.ps1'
    $n3Text = $n1Text.Replace('if ($script:FAIL -gt 0)', 'if ($script:FAIL -gt 99)')
    Assert 'a3-n3-splice-applied' ($n3Text -ne $n1Text)
    [IO.File]::WriteAllText($n3Path, $n3Text)
    $rN3 = Invoke-Captured 'powershell' ('-NoProfile -ExecutionPolicy Bypass -File "' + $n3Path + '"') $repo
    Assert 'a3-n3-exit0-fake-green' ($rN3.code -eq 0)
    Assert 'a3-n3-verdict-allgreen-fake' ($rN3.out.Contains('VERDICT: ALL GREEN'))
    $n3FailN = 0
    $m3 = [regex]::Match($rN3.out, 'FAIL=(\d+)')
    if ($m3.Success) { $n3FailN = [int]$m3.Groups[1].Value }
    Assert 'a3-n3-fail-ge1-count-survives' ($n3FailN -ge 1)
    Assert 'a3-n3-fail0-assert-red' (($m3.Success) -and ($m3.Groups[1].Value -ne '0'))
    Assert 'a3-n3-a5-red-named' ($rN3.out.Contains('FAIL A5 recount alpha 250..255'))
    $n3PassN = -1
    $p3 = [regex]::Match($rN3.out, 'PASS=(\d+)')
    if ($p3.Success) { $n3PassN = [int]$p3.Groups[1].Value }
    if ($rN3.code -ne 0) { $a3SeatRed++ }
    if (-not $rN3.out.Contains('VERDICT: ALL GREEN')) { $a3SeatRed++ }
    if ($n3FailN -ne 0) { $a3SeatRed++ }
    if ($n3PassN -lt 15) { $a3SeatRed++ }

    Assert 'a3-posctrl-preceded' ($bkCode -eq 0)
    Assert 'a3-seat-asserts-red-ge6' ($a3SeatRed -ge 6)
} finally {
    if (Test-Path -LiteralPath $negRoot) { Remove-Item -LiteralPath $negRoot -Recurse -Force -ErrorAction SilentlyContinue }
    foreach ($rd in @('fv-bake-harness-run1', 'fv-bake-harness-run2', 'fv-bake-harness-run3')) {
        $td = Join-Path $env:TEMP $rd
        if (Test-Path -LiteralPath $td) { Remove-Item -LiteralPath $td -Recurse -Force -ErrorAction SilentlyContinue }
    }
}

# --- evidence json ---------------------------------------------------------------
$evidence = [ordered]@{ round = 'r279'; seat = 'law-roll consolidated gate';
    pass = $pass; fail = $fail; notes = $notes; sync = $syncRows;
    ps51_sections = $secCounts; gdi_total = $gtot;
    tpl_exit = $tplCode; tpl_verdict = ([regex]::Match($tplOut, 'pass=\d+ fail=\d+').Value);
    bk_exit = $bkCode; bk_verdict = ([regex]::Match($bkOut, 'PASS=\d+ FAIL=\d+').Value);
    neg_exits = @($rN1.code, $rN2.code, $rN3.code); a3_seat_red = $a3SeatRed }
$ej = ConvertTo-Json $evidence -Depth 4
[IO.File]::WriteAllText((Join-Path $PSScriptRoot 'devloop-r279-rolls.json'), $ej, (New-Object System.Text.UTF8Encoding($false)))

foreach ($n in $notes) { Write-Output $n }
Write-Output ("SUMMARY rolls-r279 pass=" + $pass + " fail=" + $fail)
if ($fail -ne 0) { exit 1 } else { exit 0 }
