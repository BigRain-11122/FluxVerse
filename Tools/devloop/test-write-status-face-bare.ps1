# test-write-status-face-bare.ps1 - write-side bare-name sandbox (queue main#84)
# ---------------------------------------------------------------------------
# WHY (r746): the builder counts bare artifact names (`PANEL WARN:
# bare-artifact-names=N`) and then drops them, so a face line saying
# `TECH.md` looks fine to the author. r743 and r744 each paid a red round for
# exactly this. Tools\devloop\write-status-face.ps1 now refuses such a face
# BEFORE writing, using the same rule as the builder (one module:
# Tools\devloop\face-path-lint.ps1).
#
# Asserts against the REAL writer:
#   a) compliant face           -> exit 0, FACE OK, six keys, sim clock kept
#   b) bare name in activity    -> exit 1, names token + line, face untouched
#   c) bare name in milestone   -> exit 1, names that line
#   d) two bare names, two lines-> both named in one refusal
#   e) absolute path token      -> accepted (a path is a path)
#   f) './TECH.md' and dir paths-> accepted
#   g) -CheckOnly compliant     -> exit 0, no write
#   h) -CheckOnly with bare     -> exit 1 (validation precedes the read-only exit)
#   i) empty required key       -> still refused (prior contract intact)
#   j) rule parity              -> lint module pattern == builder $artPattern
#   k) module is ASCII-only     -> no byte > 127
#   l) token fidelity           -> `.jsonl` keeps its `l` (r803: prefix order)
# Rejection cases also assert: no `.new` residue, no half-written face.
# ASCII-only law: no CJK in this file.
# ---------------------------------------------------------------------------

$ErrorActionPreference = 'Stop'
$writer = Join-Path $PSScriptRoot 'write-status-face.ps1'
$lint   = Join-Path $PSScriptRoot 'face-path-lint.ps1'
$builder = Join-Path $PSScriptRoot 'build-city-panel.ps1'
foreach ($p in @($writer, $lint, $builder)) {
    if (-not (Test-Path -LiteralPath $p)) { Write-Output ('setup FAIL: missing ' + $p); exit 1 }
}
. $lint

$pass = 0
$fail = 0
function Check([string]$name, [bool]$cond) {
    if ($cond) { Write-Output ('  PASS ' + $name); $script:pass++ }
    else { Write-Output ('  FAIL ' + $name); $script:fail++ }
}

$utf8 = New-Object System.Text.UTF8Encoding($false)
$sbDir = Join-Path ([System.IO.Path]::GetTempPath()) ('fv-face-bare-' + $PID)
if (Test-Path -LiteralPath $sbDir) { Remove-Item -LiteralPath $sbDir -Recurse -Force }
$null = New-Item -ItemType Directory -Path $sbDir

function Write-Fixture([string]$p, [string]$body) { [System.IO.File]::WriteAllText($p, $body, $utf8) }
function Read-Bytes([string]$p) { return [System.IO.File]::ReadAllBytes($p) }
function Same-Bytes([byte[]]$a, [byte[]]$b) {
    if ($null -eq $a -or $null -eq $b) { return $false }
    if ($a.Length -ne $b.Length) { return $false }
    for ($i = 0; $i -lt $a.Length; $i++) { if ($a[$i] -ne $b[$i]) { return $false } }
    return $true
}

function New-Content([string]$activity, [string]$artifact, [string]$milestone, [string]$eta) {
    $o = New-Object System.Collections.Specialized.OrderedDictionary
    $o.Add('updated_utc', '')
    $o.Add('current_activity', $activity)
    $o.Add('artifact', $artifact)
    $o.Add('artifact_utc', '')
    $o.Add('milestone', $milestone)
    $o.Add('milestone_eta_utc', $eta)
    return (ConvertTo-Json $o -Depth 4)
}

function Invoke-Writer {
    param([string[]]$ArgList)
    $out = & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $writer @ArgList
    return @{ code = $LASTEXITCODE; out = ($out -join ' | ') }
}

$simNow = '2026-11-01T02:00:00Z'
$eta = '2026-11-01T06:00:00Z'
$sentinel = '{"updated_utc":"2026-10-01T00:00:00Z","current_activity":"sentinel","artifact":"./sentinel.md","artifact_utc":"2026-10-01T00:00:00Z","milestone":"sentinel",' + '"milestone_eta_utc":"2026-10-02T00:00:00Z"}'

function New-Case([string]$name, [string]$json) {
    $c = Join-Path $sbDir ($name + '-content.json')
    $f = Join-Path $sbDir ($name + '-face.json')
    Write-Fixture $c $json
    Write-Fixture $f $sentinel
    return @{ content = $c; face = $f; newp = ($f + '.new') }
}

# ---------- a) compliant face ----------
Write-Output '--- a) compliant face ---'
$ca = New-Case 'a' (New-Content 'r746 writing ./TECH.md rule check' 'Tools/devloop/face-path-lint.ps1, state/status-face.json' 'next ./state/queue/main.md then world-public/city-panel.html' $eta)
$ra = Invoke-Writer @('-ContentPath', $ca.content, '-FacePath', $ca.face, '-SimNowUtc', $simNow)
Check 'a: exit 0'                     ($ra.code -eq 0)
Check 'a: FACE OK reported'           ($ra.out -match 'FACE OK')
Check 'a: no .new residue'            (-not (Test-Path -LiteralPath $ca.newp))
$faceA = $null
if (Test-Path -LiteralPath $ca.face) { $faceA = ConvertFrom-Json ([System.IO.File]::ReadAllText($ca.face, [Text.Encoding]::UTF8)) }
Check 'a: face has six keys'          ($null -ne $faceA -and @($faceA.PSObject.Properties).Count -eq 6)
Check 'a: updated_utc is sim clock'   ($null -ne $faceA -and [string]$faceA.updated_utc -eq $simNow)
$bareA = 0
if ($null -ne $faceA) {
    foreach ($k in @('current_activity','artifact','milestone')) { $bareA += @(Get-FaceBareNames -Raw ([string]$faceA.$k)).Count }
}
Check 'a: written face has bare=0'    ($bareA -eq 0)

# ---------- b) bare name in current_activity ----------
Write-Output '--- b) bare in activity ---'
$cb = New-Case 'b' (New-Content 'r746 touched TECH.md today' './state/status-face.json' './state/queue/main.md' $eta)
$beforeB = Read-Bytes $cb.face
$rb = Invoke-Writer @('-ContentPath', $cb.content, '-FacePath', $cb.face, '-SimNowUtc', $simNow)
Check 'b: exit != 0'                  ($rb.code -ne 0)
Check 'b: names the token'            ($rb.out -match 'bare artifact name: TECH\.md')
Check 'b: names the line'             ($rb.out -match '\(current_activity\)')
Check 'b: face bytes untouched'       (Same-Bytes $beforeB (Read-Bytes $cb.face))
Check 'b: no .new residue'            (-not (Test-Path -LiteralPath $cb.newp))

# ---------- c) bare name in milestone ----------
Write-Output '--- c) bare in milestone ---'
$cc = New-Case 'c' (New-Content 'r746 rule check' './state/status-face.json' 'then run test-panel-url.ps1' $eta)
$rc = Invoke-Writer @('-ContentPath', $cc.content, '-FacePath', $cc.face, '-SimNowUtc', $simNow)
Check 'c: exit != 0'                  ($rc.code -ne 0)
Check 'c: names the token'            ($rc.out -match 'bare artifact name: test-panel-url\.ps1')
Check 'c: names the line'             ($rc.out -match '\(milestone\)')
Check 'c: face bytes untouched'       (Same-Bytes $beforeB (Read-Bytes $cc.face))

# ---------- d) two bare names on two lines ----------
Write-Output '--- d) two bare names ---'
$cd = New-Case 'd' (New-Content 'r746 read decisions.md' 'TECH.md' './state/queue/main.md' $eta)
$rd = Invoke-Writer @('-ContentPath', $cd.content, '-FacePath', $cd.face, '-SimNowUtc', $simNow)
Check 'd: exit != 0'                  ($rd.code -ne 0)
Check 'd: names decisions.md'         ($rd.out -match 'decisions\.md \(current_activity\)')
Check 'd: names TECH.md'              ($rd.out -match 'TECH\.md \(artifact\)')

# ---------- e) absolute path token is a path ----------
# r787: the original fixture used C:/Users/<username>/... and now stops at the
# public-screen gate (G5 username net) before bare-name lint ever runs - which
# is correct, that path is a leak. The rule under test here is "a path is a
# path", so the fixture carries an absolute path with no machine identity.
Write-Output '--- e) absolute path ---'
$ce = New-Case 'e' (New-Content 'r746 see C:/Agent/legacy/evolution-ledger.md' './state/status-face.json' './state/queue/main.md' $eta)
$re = Invoke-Writer @('-ContentPath', $ce.content, '-FacePath', $ce.face, '-SimNowUtc', $simNow)
Check 'e: exit 0'                     ($re.code -eq 0)
Check 'e: FACE OK reported'           ($re.out -match 'FACE OK')

# ---------- e2) local username path is a leak, not a path (r787) ----------
Write-Output '--- e2) username path refused ---'
$ce2 = New-Case 'e2' (New-Content 'r746 see C:/Users/sjs20/Desktop/FluxGroup/x.md' './state/status-face.json' './state/queue/main.md' $eta)
$beforeE2 = Read-Bytes $ce2.face
$re2 = Invoke-Writer @('-ContentPath', $ce2.content, '-FacePath', $ce2.face, '-SimNowUtc', $simNow)
Check 'e2: exit != 0'                 ($re2.code -ne 0)
Check 'e2: names G5'                  ($re2.out -match 'public-screen G5:')
Check 'e2: face untouched'            (Same-Bytes $beforeE2 (Read-Bytes $ce2.face))

# ---------- f) dot-slash and directory paths accepted ----------
Write-Output '--- f) ./-prefixed and dir paths ---'
$cf = New-Case 'f' (New-Content 'r746 wrote ./TECH.md and docs/city-problem-registry-annex.md' 'Tools/devloop/face-path-lint.ps1' 'next ./state/queue/main.md' $eta)
$rf = Invoke-Writer @('-ContentPath', $cf.content, '-FacePath', $cf.face, '-SimNowUtc', $simNow)
Check 'f: exit 0'                     ($rf.code -eq 0)

# ---------- g) CheckOnly compliant, no write ----------
Write-Output '--- g) CheckOnly compliant ---'
$cg = New-Case 'g' (New-Content 'r746 check only ./TECH.md' './state/status-face.json' './state/queue/main.md' $eta)
$beforeG = Read-Bytes $cg.face
$rg = Invoke-Writer @('-ContentPath', $cg.content, '-FacePath', $cg.face, '-CheckOnly')
Check 'g: exit 0'                     ($rg.code -eq 0)
Check 'g: FACE CHECK OK'              ($rg.out -match 'FACE CHECK OK')
Check 'g: face untouched (no write)'  (Same-Bytes $beforeG (Read-Bytes $cg.face))

# ---------- h) CheckOnly with bare name still refused ----------
Write-Output '--- h) CheckOnly with bare ---'
$ch = New-Case 'h' (New-Content 'r746 check TECH.md' './state/status-face.json' './state/queue/main.md' $eta)
$rh = Invoke-Writer @('-ContentPath', $ch.content, '-FacePath', $ch.face, '-CheckOnly')
Check 'h: exit != 0'                  ($rh.code -ne 0)
Check 'h: names the token'            ($rh.out -match 'bare artifact name: TECH\.md')

# ---------- i) prior contract intact: empty required key ----------
Write-Output '--- i) empty required key ---'
$ci = New-Case 'i' (New-Content 'r746 rule check ./TECH.md' './state/status-face.json' '' $eta)
$ri = Invoke-Writer @('-ContentPath', $ci.content, '-FacePath', $ci.face, '-SimNowUtc', $simNow)
Check 'i: exit != 0'                  ($ri.code -ne 0)
Check 'i: names the empty key'        ($ri.out -match 'content key missing/empty: milestone')

# ---------- j) rule parity with the builder ----------
Write-Output '--- j) rule parity ---'
$bText = [System.IO.File]::ReadAllText($builder, [Text.Encoding]::UTF8)
$bm = [regex]::Match($bText, '\$artPattern\s*=\s*''([^'']+)''')
Check 'j: builder pattern found'      ($bm.Success)
Check 'j: pattern identical'          ($bm.Success -and $bm.Groups[1].Value -eq $script:FaceArtPattern)

# ---------- k) module and writer are ASCII-only ----------
Write-Output '--- k) ASCII-only bodies ---'
$badLint = 0
foreach ($b in (Read-Bytes $lint)) { if ($b -gt 127) { $badLint++ } }
Check 'k: lint module ascii=0'        ($badLint -eq 0)
$badWriter = 0
foreach ($b in (Read-Bytes $writer)) { if ($b -gt 127) { $badWriter++ } }
Check 'k: writer ascii=0'             ($badWriter -eq 0)

# ---------- l) token fidelity: a longer extension must not be cut to its prefix
Write-Output '--- l) token fidelity ---'
$tok = @(Get-FaceArtTokens -Raw 'history ./logs/panel-history.jsonl and ./logs/panel-fixture-bad-hist.jsonl plus ./TECH.md ./Tools/devloop/rebuild-panel-fixtures.ps1 ./state/status-face.json')
Check 'l: jsonl token kept whole'     ($tok -contains './logs/panel-history.jsonl')
Check 'l: jsonl not cut to .json'     (-not ($tok -contains './logs/panel-history.json'))
Check 'l: second jsonl kept whole'    ($tok -contains './logs/panel-fixture-bad-hist.jsonl')
Check 'l: json token still kept'      ($tok -contains './state/status-face.json')
Check 'l: md token kept'              ($tok -contains './TECH.md')
Check 'l: ps1 token kept'             ($tok -contains './Tools/devloop/rebuild-panel-fixtures.ps1')
Check 'l: token count'                ($tok.Count -eq 5)
$bareJsonl = @(Get-FaceBareNames -Raw 'wrote panel-history.jsonl in prose')
Check 'l: bare jsonl still flagged'   ($bareJsonl -contains 'panel-history.jsonl')

# ---------- summary ----------
Write-Output ('SUITES total=' + ($pass + $fail) + ' pass=' + $pass + ' fail=' + $fail)
if ($fail -gt 0) { exit 1 }
Write-Output 'ALL PASS'
exit 0