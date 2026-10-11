# devloop-r212-psa-test.ps1 -- T-FV-125 PSScriptAnalyzer advisor-seat wiring
# harness (P-2026-09-26-08 oss-harvest slice 1 landing 3, OH-20260926-fluxverse.md).
# Chk order = sandbox family law, cond-first (r191 pin; bake family is
# name-first -- never mix the two shapes in one file, r159c family law).
# A0 static: ASCII audit (edited faces) + advisor gate-rules census + Tools-tree
#   advisor GREEN (the wiring judgment: a sandbox round's A0 PSA high-value
#   subset runs green) + harness self-scan + double-run byte-stable output.
# A1 advisor behavior: ListRules / target-missing exit 1 / negative-control
#   fixture RED exit 2 with BOTH named findings (gate non-vacuous, r123 law).
#   Module-missing path is untestable while the module is installed -- code
#   review + template note line are the documented degrade face.
# A2 digestion census: high-value layer (4 rules) per edited file = 0 findings;
#   fresh full-rules Tools scan -> null/dead/BOM/auto-var all 0, empty-catch >= 28
#   (fail-soft canon; r279 rot-proof lower bound -- exact pins rotted twice r267/r279
#   as the tree legally grows fail-soft files: +1 check-fastpath r267, +5 r274/r275)
#   r198 enforcement file; refreshed baseline json written (r210 copy kept).
# A3 baker determinism after edits: re-run cards/silhouettes/skyline-far/
#   water-tiles/cropper; pinned SHA12 reproduce; git-clean output dirs.
# A4 template wiring: sandbox template direct-run pass=9 fail=0 (A0b seat),
#   bake template ALL GREEN, FILL counts 10/9 unchanged, install copies synced,
#   standing smokes r192/r171 retired at r279 (purged by r274 rotation; the
#   consolidated tracked door is the r279-rolls family seat -- see A4 tail).
# A5 probes: real-machine scan + verify double green (probe-edit law).
$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot
$pass = 0; $fail = 0
function Chk([bool]$cond, [string]$name) {
    if ($cond) { $script:pass++ } else { $script:fail++; Write-Output ('FAIL: ' + $name) }
}
function IsAsciiFile($path) {
    $bytes = [IO.File]::ReadAllBytes($path)
    foreach ($x in $bytes) { if ($x -gt 127) { return $false } }
    return $true
}
function Sha12($path) { (Get-FileHash -Algorithm SHA256 -Path $path).Hash.Substring(0, 12) }
function RunCap([string]$file, [string[]]$argv) {
    $p = New-Object System.Diagnostics.Process
    $p.StartInfo.FileName = 'powershell.exe'
    $p.StartInfo.Arguments = '-NoProfile -ExecutionPolicy Bypass -File "' + $file + '" ' + ($argv -join ' ')
    $p.StartInfo.UseShellExecute = $false
    $p.StartInfo.RedirectStandardOutput = $true
    $p.StartInfo.RedirectStandardError = $true
    $p.StartInfo.WorkingDirectory = $repo
    [void]$p.Start()
    $txt = $p.StandardOutput.ReadToEnd()
    [void]$p.StandardError.ReadToEnd()
    $p.WaitForExit()
    return @{ code = $p.ExitCode; txt = $txt }   # .NET Process holds the handle: ExitCode reliable (r66 law)
}
$advisor = Join-Path $repo 'Tools\devloop\psa-advisor.ps1'

# ============ A0 static: ASCII + advisor gate census + Tools-tree GREEN ============
$edited = @(
    (Join-Path $repo 'Tools\devloop\psa-advisor.ps1'),
    (Join-Path $repo 'Tools\city\bake-resident-cards.ps1'),
    (Join-Path $repo 'Tools\city\bake-landmark-silhouettes.ps1'),
    (Join-Path $repo 'Tools\city\bake-skyline-far.ps1'),
    (Join-Path $repo 'Tools\city\bake-water-tiles.ps1'),
    (Join-Path $repo 'Tools\city\crop-office-towers.ps1'),
    (Join-Path $repo 'Tools\perceptor\scan.ps1'),
    (Join-Path $repo 'Tools\perceptor\probes\residents.ps1'),
    (Join-Path $repo 'Tools\skills\fluxverse-city-sandbox\scripts\sandbox-harness-template.ps1'),
    (Join-Path $repo 'Tools\skills\fluxverse-bake-pipeline\scripts\bake-harness-template.ps1')
)
$asciiAll = $true
foreach ($e in $edited) { if (-not (IsAsciiFile $e)) { $asciiAll = $false; Write-Output ('  non-ascii: ' + $e) } }
Chk ($asciiAll) 'A0: 10 edited .ps1 faces pure ASCII'

$lr = RunCap $advisor @('-ListRules')
Chk ($lr.code -eq 0) 'A0: advisor -ListRules exit 0'
Chk ((@($lr.txt -split "`r?`n") | Where-Object { $_ -match '^(PSAvoidAssignmentToAutomaticVariable|PSPossibleIncorrectComparisonWithNull|PSUseBOMForUnicodeEncodedFile)$' }).Count -eq 3) 'A0: gate rules census = 3 exact'

$r1 = RunCap $advisor @('-Target', (Join-Path $repo 'Tools'))
Chk ($r1.code -eq 0) 'A0: Tools-tree advisor exit 0 (GREEN)'
Chk ($r1.txt -match 'PSA-ADVISOR: GREEN 0 findings') 'A0: Tools-tree 3-rule gate 0 findings'
$r2 = RunCap $advisor @('-Target', (Join-Path $repo 'Tools'))
Chk ($r2.code -eq 0) 'A0: Tools-tree advisor rerun exit 0'
Chk ($r2.txt -eq $r1.txt) 'A0: advisor double-run byte-identical output'

$self = RunCap $advisor @('-Target', $PSCommandPath)
Chk ($self.code -eq 0) 'A0: harness self-scan GREEN'

# ============ A1 advisor behavior: missing target + negative control ============
$missing = RunCap $advisor @('-Target', (Join-Path $repo 'logs\no-such-file-r212.ps1'))
Chk ($missing.code -eq 1) 'A1: missing target exit 1'

$fx = Join-Path $env:TEMP 'fv-psa-fixture-bad-r212.ps1'
[IO.File]::WriteAllText($fx, "`$pid = 5`r`nif (`$x -eq `$null) { Write-Output 'x' }`r`n", (New-Object System.Text.UTF8Encoding($false)))
$neg = RunCap $advisor @('-Target', $fx)
Chk ($neg.code -eq 2) 'A1: negative control exit 2 (RED)'
Chk ($neg.txt -match 'PSAvoidAssignmentToAutomaticVariable') 'A1: negative control names auto-var rule'
Chk ($neg.txt -match 'PSPossibleIncorrectComparisonWithNull') 'A1: negative control names null-order rule'
Chk ($neg.txt -match 'RED 2 finding\(s\)') 'A1: negative control RED count = 2 exact'
Remove-Item $fx -Force

# ============ A2 digestion census: 13 findings resolved ============
$highRules = @('PSAvoidAssignmentToAutomaticVariable', 'PSPossibleIncorrectComparisonWithNull', 'PSUseBOMForUnicodeEncodedFile', 'PSUseDeclaredVarsMoreThanAssignments')
$digestedAll = $true
foreach ($e in $edited) {
    if ($e -like '*psa-advisor.ps1' -or $e -like '*harness-template.ps1') { continue }
    $f = @(Invoke-ScriptAnalyzer -Path $e -IncludeRule $highRules -ErrorAction SilentlyContinue)
    if ($f.Count -gt 0) { $digestedAll = $false; Write-Output ('  residual: ' + (Split-Path $e -Leaf) + ' x' + $f.Count) }
}
Chk ($digestedAll) 'A2: 7 edited production files 0 high-value findings (4-rule layer)'

$toolFiles = @(Get-ChildItem (Join-Path $repo 'Tools') -Recurse -Filter '*.ps1' -File)
$full = @()
foreach ($t in $toolFiles) { $full += @(Invoke-ScriptAnalyzer -Path $t.FullName -ErrorAction SilentlyContinue) }
$nNull = @($full | Where-Object { $_.RuleName -eq 'PSPossibleIncorrectComparisonWithNull' }).Count
$nDead = @($full | Where-Object { $_.RuleName -eq 'PSUseDeclaredVarsMoreThanAssignments' }).Count
$nBom = @($full | Where-Object { $_.RuleName -eq 'PSUseBOMForUnicodeEncodedFile' }).Count
$nAuto = @($full | Where-Object { $_.RuleName -eq 'PSAvoidAssignmentToAutomaticVariable' }).Count
$nCatch = @($full | Where-Object { $_.RuleName -eq 'PSAvoidUsingEmptyCatchBlock' }).Count
Chk ($nNull -eq 0) 'A2: full Tools scan null-order findings = 0 (baseline 4)'
Chk ($nDead -eq 0) 'A2: full Tools scan dead-var findings = 0 (baseline 9)'
Chk ($nBom -eq 0) 'A2: full Tools scan BOM findings = 0 (baseline 1, r210 fixed)'
Chk ($nAuto -eq 0) 'A2: full Tools scan auto-var findings = 0 (baseline 0)'
Chk ($nCatch -ge 28) 'A2: empty-catch observation list >= 28 (fail-soft canon lower bound r279; exact pin rotted r267/r279 with legal tree growth)'
Write-Output ('  A2 report: files=' + $toolFiles.Count + ' findings=' + $full.Count + ' (r210 baseline 416; delta = 13 digested + 1 r210 BOM fix + template/A0b noise drift)')
$full | ConvertTo-Json -Depth 4 | Set-Content (Join-Path $repo 'logs\devloop-oss-psa-baseline-r212.json') -Encoding UTF8

# ============ A3 baker determinism: pinned SHAs reproduce after digestion edits ============
$cards = RunCap (Join-Path $repo 'Tools\city\bake-resident-cards.ps1') @()
Chk ($cards.code -eq 0) 'A3: cards baker exit 0'
Chk ($cards.txt -match 'manifest_sha256=9CD2661830C8341E') 'A3: cards manifest sha pinned (r108)'

$lm = RunCap (Join-Path $repo 'Tools\city\bake-landmark-silhouettes.ps1') @()
Chk ($lm.code -eq 0) 'A3: landmark baker exit 0'
$ot = Join-Path $repo 'City\Assets\ArtPacks\office-towers'
Chk ((Sha12 (Join-Path $ot 'quant-twist.png')) -eq 'D713172B83C3') 'A3: quant-twist SHA pinned (r175)'
Chk ((Sha12 (Join-Path $ot 'media-pearl.png')) -eq '325E701ABFD6') 'A3: media-pearl SHA pinned (r175)'
Chk ((Sha12 (Join-Path $ot 'brain-crown.png')) -eq 'D0CDC03794A0') 'A3: brain-crown SHA pinned (r175)'

$sky = RunCap (Join-Path $repo 'Tools\city\bake-skyline-far.ps1') @()
Chk ($sky.code -eq 0) 'A3: skyline-far baker exit 0'
Chk ((Sha12 (Join-Path $repo 'City\Assets\ArtPacks\skyline-shanghai\far-shanghai.png')) -eq '28E97574B38F') 'A3: far-shanghai SHA pinned (r207)'

$wt = RunCap (Join-Path $repo 'Tools\city\bake-water-tiles.ps1') @()
Chk ($wt.code -eq 0) 'A3: water-tiles baker exit 0'
$wtPins = @('D2D74DECF189', '84E06A1172FD', '7A41F7082B8A', 'E5144172F4B4', '9EB18625C8ED', '6748B670CAF9', 'D1CC849A56AB', '73E1B95512B3')
$wtOk = $true
for ($i = 0; $i -lt 8; $i++) {
    $p = Join-Path $repo ('City\Assets\Art\CleanCityv3\WaterTiles\water_wave_0' + $i + '.png')
    if ((Sha12 $p) -ne $wtPins[$i]) { $wtOk = $false; Write-Output ('  tile drift: ' + $i) }
}
Chk ($wtOk) 'A3: 8 water tile SHAs pinned (r203)'

$cr = RunCap (Join-Path $repo 'Tools\city\crop-office-towers.ps1') @()
Chk ($cr.code -eq 0) 'A3: cropper exit 0 (srcPath init removal behavior-neutral)'

$dirtyA3 = @(git status --porcelain -- 'City/CardData' 'City/Assets/ArtPacks/office-towers' 'City/Assets/Art/CleanCityv3/WaterTiles' 'City/Assets/ArtPacks/skyline-shanghai')
Chk ($dirtyA3.Count -eq 0) 'A3: all re-baked outputs byte-identical to HEAD (git-clean)'

# ============ A4 template wiring: A0b seat live in both families ============
$tplS = Join-Path $repo 'Tools\skills\fluxverse-city-sandbox\scripts\sandbox-harness-template.ps1'
$tplB = Join-Path $repo 'Tools\skills\fluxverse-bake-pipeline\scripts\bake-harness-template.ps1'
$r170 = Join-Path $repo 'logs\devloop-r170-skill-smoke.ps1'
Copy-Item $tplS $r170 -Force
$runS = RunCap $r170 @()
Chk ($runS.code -eq 0) 'A4: sandbox template direct-run exit 0'
Chk ($runS.txt -match 'pass=9 fail=0') 'A4: sandbox template verdict pass=9 fail=0 (8 census + A0b)'
Chk ($runS.txt -notmatch 'advisor seat skipped') 'A4: sandbox A0b real-gate path (no degrade note)'
Chk ($runS.txt -notmatch 'PSA ') 'A4: sandbox A0b zero finding lines'

$runB = RunCap $tplB @()
Chk ($runB.code -eq 0) 'A4: bake template sample-mode exit 0'
Chk ($runB.txt -match 'VERDICT: ALL GREEN') 'A4: bake template ALL GREEN'
Chk ($runB.txt -match 'A0b PSA high-value subset clean') 'A4: bake template A0b seat fired (PASS line)'
Chk ($runB.txt -notmatch 'advisor seat skipped') 'A4: bake A0b real-gate path (no degrade note)'

$ts = [IO.File]::ReadAllText($tplS); $tb = [IO.File]::ReadAllText($tplB)
Chk (([regex]::Matches($ts, '# FILL')).Count -eq 10) 'A4: sandbox FILL markers = 10 (pin unchanged)'
Chk (([regex]::Matches($tb, '# FILL')).Count -eq 9) 'A4: bake FILL markers = 9 (pin unchanged)'

$syncOk = $true
$srcRoot = Join-Path $repo 'Tools\skills'
$instRoot = Join-Path $repo '.codely-cli\skills'
foreach ($f in (Get-ChildItem $srcRoot -Recurse -File)) {
    $rel = $f.FullName.Substring($srcRoot.Length + 1)
    $dst = Join-Path $instRoot $rel
    if (-not (Test-Path $dst)) { $syncOk = $false; Write-Output ('  missing: ' + $rel); continue }
    if ((Get-FileHash $f.FullName).Hash -ne (Get-FileHash $dst).Hash) { $syncOk = $false; Write-Output ('  sha drift: ' + $rel) }
}
Chk ($syncOk) 'A4: install copies synced (10 files SHA==source)'

# r279: the per-round smoke scripts (r170/r171/r192 standing copies) were purged
# by the r274 log rotation (>14d gitignored) -- standing doors must reference
# TRACKED seats. The consolidated law-roll door is the r279-rolls family seat
# (its A/B/C/D cover the retired smokes' essences; family-run owns its execution).
$rollsSeat = Join-Path $repo 'logs\devloop-r279-rolls-test.ps1'
Chk (Test-Path $rollsSeat) 'A4: r279-rolls standing door on disk'
$trackedSeats = @(git ls-files 'logs/')
Chk (@($trackedSeats | Where-Object { $_ -eq 'logs/devloop-r279-rolls-test.ps1' }).Count -eq 1) 'A4: r279-rolls standing door git-tracked (rotation-immune)'
$seatsTxt = [IO.File]::ReadAllText((Join-Path $repo 'Tools\devloop\family-seats.txt'))
$rollsLine = [regex]::Match($seatsTxt, 'r279-rolls\|devloop-r279-rolls-test\.ps1\|(\d+)\|(\d+)')
Chk ($rollsLine.Success) 'A4: family wiring has r279-rolls seat line'
Chk ($rollsLine.Success -and $rollsLine.Groups[1].Value -eq '32' -and $rollsLine.Groups[2].Value -eq '0') 'A4: r279-rolls seat pin = 32|0'

# ============ A5 probes: real-machine scan + verify double green ============
$scanR = RunCap (Join-Path $repo 'Tools\perceptor\scan.ps1') @()
Chk ($scanR.code -eq 0) 'A5: scan exit 0 (probe-edit law)'
Chk ($scanR.txt -match 'OK') 'A5: scan probe lines OK'
$verR = RunCap (Join-Path $repo 'Tools\perceptor\verify.ps1') @()
Chk ($verR.code -eq 0) 'A5: verify exit 0'
Chk ($verR.txt -match 'VERIFY PASS') 'A5: VERIFY PASS'

# ============ verdict ============
Write-Output ''
Write-Output ('r212 psa-advisor wiring harness: pass=' + $pass + ' fail=' + $fail)
if ($fail -gt 0) { exit 1 } else { exit 0 }
