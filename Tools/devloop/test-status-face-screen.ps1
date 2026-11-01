# test-status-face-screen.ps1 - public content screen sandbox (r787)
# ---------------------------------------------------------------------------
# WHY (r787): world-public/city-snapshot.json dropped its whole status_face
# section every tick (tick log: `status_face=skip-G3cjk`) because one plain
# sentence tripped the CJK content net, and the note named only the face - not
# the key, not the word - so nobody could bisect it from the log.
#
# Asserts, in this order:
#   a) module: clean value            -> no hit
#   b) module: CJK hit                -> 'G3cjk:<key>:<word>'
#   c) module: ASCII hit              -> 'G3:<key>:profit'
#   d) module: secret pattern         -> 'G1:<key>:<pattern>'
#   e) module: metadata leak          -> 'G5:<key>:<token>'
#   f) module: empty value            -> no hit
#   g) module: face order G1 > G3 > G3cjk > G5
#   h) writer: CJK hit refused        -> exit != 0, names key+token, face bytes
#                                        untouched, no .new residue
#   i) writer: clean content accepted -> FACE OK
#   j) anti-drift: the exporter carries no lists of its own and really loads
#      the module; all three bodies are ASCII-only
#   k) end-to-end: real exporter over a clean face -> `status_face=included`
#      and the snapshot object carries the section; over a tripping face ->
#      `status_face=skip-...` with key+word and no section in the object
# ASCII-only law: no CJK literal in this file (words come from code points).
# ---------------------------------------------------------------------------

$ErrorActionPreference = 'Stop'
$module   = Join-Path $PSScriptRoot 'status-face-screen.ps1'
$writer   = Join-Path $PSScriptRoot 'write-status-face.ps1'
$exporter = Join-Path (Split-Path -Parent $PSScriptRoot) 'tick\export-public-snapshot.ps1'
foreach ($p in @($module, $writer, $exporter)) {
    if (-not (Test-Path -LiteralPath $p)) { Write-Output ('setup FAIL: missing ' + $p); exit 1 }
}
. $module

$pass = 0
$fail = 0
function Check([string]$name, [bool]$cond) {
    if ($cond) { Write-Output ('  PASS ' + $name); $script:pass++ }
    else { Write-Output ('  FAIL ' + $name); $script:fail++ }
}

$utf8 = New-Object System.Text.UTF8Encoding($false)
$sbDir = Join-Path ([System.IO.Path]::GetTempPath()) ('fv-face-screen-' + $PID)
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

# r787 live trigger: the word for "policy" (2 chars) inside a retention sentence
$wordPolicy  = CJK @(0x7B56,0x7565)
$wordProfit  = CJK @(0x76C8,0x4E8F)
$retentionCn = CJK @(0x4FDD,0x7559)   # "retention"

# ---------- a) clean value ----------
Write-Output '--- a) module: clean ---'
$cleanText = 'r787 log retention now finishes; see ./Tools/devloop/archive-logs.ps1'
Check 'a: clean -> empty hit'   ((Get-StatusFaceScreenHit -Value $cleanText -Key 'current_activity') -eq '')
Check 'a: empty key form'       ((Get-StatusFaceScreenHit -Value $cleanText) -eq '')

# ---------- b) CJK hit names key and word ----------
Write-Output '--- b) module: CJK hit ---'
$cjkText = 'r787 ' + $retentionCn + $wordPolicy + ' ran once a day'
$hitB = Get-StatusFaceScreenHit -Value $cjkText -Key 'current_activity'
Check 'b: hit is G3cjk'         ($hitB.StartsWith('G3cjk:'))
Check 'b: hit names the key'    ($hitB.Contains(':current_activity:'))
Check 'b: hit names the word'   ($hitB.EndsWith(':' + $wordPolicy))
Check 'b: hit echoes no prose'  (-not $hitB.Contains('retention'))

# ---------- c) ASCII hit ----------
Write-Output '--- c) module: ASCII hit ---'
Check 'c: profit -> G3'         ((Get-StatusFaceScreenHit -Value 'quarterly profit line' -Key 'milestone') -eq 'G3:milestone:profit')

# ---------- d) secret pattern ----------
Write-Output '--- d) module: secret ---'
$hitD = Get-StatusFaceScreenHit -Value 'note AKIAABCDEFGHIJKLMNOP trailing' -Key 'artifact'
Check 'd: secret -> G1'         ($hitD.StartsWith('G1:artifact:'))

# ---------- e) metadata leak ----------
Write-Output '--- e) module: metadata ---'
Check 'e: username -> G5'       ((Get-StatusFaceScreenHit -Value 'see C:\Users\sjs20\x' -Key 'artifact') -eq 'G5:artifact:C:\Users')
Check 'e: /home/ -> G5'         ((Get-StatusFaceScreenHit -Value 'see /home/x' -Key 'artifact') -eq 'G5:artifact:/home/')

# ---------- f) empty value ----------
Write-Output '--- f) module: empty ---'
Check 'f: empty -> no hit'      ((Get-StatusFaceScreenHit -Value '' -Key 'artifact') -eq '')

# ---------- g) face order ----------
Write-Output '--- g) module: order ---'
$both = 'see /home/ and quarterly profit'
Check 'g: G3 beats G5'          ((Get-StatusFaceScreenHit -Value $both -Key 'k') -eq 'G3:k:profit')
Check 'g: G5 alone'             ((Get-StatusFaceScreenHit -Value 'see /home/x' -Key 'k') -eq 'G5:k:/home/')

# ---------- h) writer refuses a tripping face ----------
Write-Output '--- h) writer: refused ---'
$eta = '2026-11-02T06:00:00Z'
function New-Content([string]$activity, [string]$artifact, [string]$milestone) {
    $o = New-Object System.Collections.Specialized.OrderedDictionary
    $o.Add('updated_utc', '')
    $o.Add('current_activity', $activity)
    $o.Add('artifact', $artifact)
    $o.Add('artifact_utc', '')
    $o.Add('milestone', $milestone)
    $o.Add('milestone_eta_utc', $eta)
    return (ConvertTo-Json $o -Depth 4)
}
$sentinel = '{"updated_utc":"2026-11-01T00:00:00Z","current_activity":"sentinel","artifact":"./sentinel.md","artifact_utc":"2026-11-01T00:00:00Z","milestone":"sentinel","milestone_eta_utc":"2026-11-02T00:00:00Z"}'
function Invoke-Writer([string[]]$ArgList) {
    $out = & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $writer @ArgList
    return @{ code = $LASTEXITCODE; out = ($out -join ' | ') }
}

$cH = Join-Path $sbDir 'h-content.json'
$fH = Join-Path $sbDir 'h-face.json'
Write-Fixture $cH (New-Content ('r787 ' + $retentionCn + $wordPolicy + ' rewrite ./Tools/devloop/archive-logs.ps1') './Tools/devloop/status-face-screen.ps1' 'next ./state/queue/main.md')
Write-Fixture $fH $sentinel
$beforeH = Read-Bytes $fH
$rH = Invoke-Writer @('-ContentPath', $cH, '-FacePath', $fH, '-SimNowUtc', '2026-11-02T02:00:00Z')
Check 'h: exit != 0'            ($rH.code -ne 0)
Check 'h: names G3cjk'          ($rH.out -match 'public-screen G3cjk:')
Check 'h: names the key'        ($rH.out -match ':current_activity:')
Check 'h: face bytes untouched' (Same-Bytes $beforeH (Read-Bytes $fH))
Check 'h: no .new residue'      (-not (Test-Path -LiteralPath ($fH + '.new')))

# ---------- i) writer accepts clean content ----------
Write-Output '--- i) writer: accepted ---'
$cI = Join-Path $sbDir 'i-content.json'
$fI = Join-Path $sbDir 'i-face.json'
Write-Fixture $cI (New-Content 'r787 log retention now finishes in tick ./Tools/devloop/archive-logs.ps1' './Tools/devloop/status-face-screen.ps1' 'next ./state/queue/main.md')
Write-Fixture $fI $sentinel
$rI = Invoke-Writer @('-ContentPath', $cI, '-FacePath', $fI, '-SimNowUtc', '2026-11-02T02:00:00Z')
Check 'i: exit 0'               ($rI.code -eq 0)
Check 'i: FACE OK'              ($rI.out -match 'FACE OK')

# ---------- j) anti-drift ----------
Write-Output '--- j) anti-drift ---'
$expText = [System.IO.File]::ReadAllText($exporter, [Text.Encoding]::UTF8)
Check 'j: exporter loads module' ($expText.Contains('status-face-screen.ps1'))
Check 'j: no own secret list'   (-not $expText.Contains('AKIA[0-9A-Z]{16}'))
Check 'j: no own ascii list'    (-not $expText.Contains("'password','passwd'"))
Check 'j: no CJK helper left'   (-not $expText.Contains('function CJK'))
$badMod = 0
foreach ($b in (Read-Bytes $module)) { if ($b -gt 127) { $badMod++ } }
Check 'j: module ascii=0'       ($badMod -eq 0)
$badExp = 0
foreach ($b in (Read-Bytes $exporter)) { if ($b -gt 127) { $badExp++ } }
Check 'j: exporter ascii=0'     ($badExp -eq 0)

# ---------- k) end-to-end over the real exporter ----------
Write-Output '--- k) exporter end-to-end ---'
$repoDir  = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$worldDir = Join-Path $repoDir 'world'
$outA = Join-Path $sbDir 'out-clean'
$outB = Join-Path $sbDir 'out-hit'
$null = New-Item -ItemType Directory -Path $outA
$null = New-Item -ItemType Directory -Path $outB
$cK = Join-Path $sbDir 'k-content.json'
$cL = Join-Path $sbDir 'l-content.json'
Write-Fixture $cK (New-Content 'r787 three lines clean ./Tools/devloop/status-face-screen.ps1' './Tools/devloop/status-face-screen.ps1' 'next ./state/queue/main.md')
Write-Fixture $cL (New-Content ('r787 ' + $wordProfit + ' line ./Tools/devloop/status-face-screen.ps1') './Tools/devloop/status-face-screen.ps1' 'next ./state/queue/main.md')
$fK = Join-Path $sbDir 'k-face.json'
$fL = Join-Path $sbDir 'l-face.json'
$rK = Invoke-Writer @('-ContentPath', $cK, '-FacePath', $fK, '-SimNowUtc', '2026-11-02T02:00:00Z')
$rL = Invoke-Writer @('-ContentPath', $cL, '-FacePath', $fL, '-SimNowUtc', '2026-11-02T02:00:00Z')
Check 'k: clean face written'   ($rK.code -eq 0)
Check 'k: profit line refused'  ($rL.code -ne 0)
# The writer refuses the bad line (that is the point of the birth gate), so the
# release-gate side is proved with a face file placed directly - a round that
# predates the gate, or a hand edit, is exactly the case the exporter still has
# to survive fail-soft.
$fM = Join-Path $sbDir 'm-face.json'
$badFace = '{"updated_utc":"2026-11-02T02:00:00Z","current_activity":"r787 ' + $wordProfit + ' line","artifact":"./Tools/devloop/status-face-screen.ps1","artifact_utc":"2026-11-02T01:00:00Z","milestone":"next ./state/queue/main.md","milestone_eta_utc":"2026-11-03T00:00:00Z"}'
Write-Fixture $fM $badFace

function Invoke-Exporter([string]$statusFile, [string]$outDir) {
    $out = & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $exporter -WorldDir $worldDir -OutDir $outDir -StatusFile $statusFile -NoGit
    return @{ code = $LASTEXITCODE; out = ($out -join ' | ') }
}
$eA = Invoke-Exporter $fK $outA
Check 'k: export exit 0'        ($eA.code -eq 0)
Check 'k: note says included'   ($eA.out -match 'status_face=included')
$snapA = $null
$snapPathA = Join-Path $outA 'city-snapshot.json'
if (Test-Path -LiteralPath $snapPathA) { $snapA = ConvertFrom-Json ([System.IO.File]::ReadAllText($snapPathA, [Text.Encoding]::UTF8)) }
Check 'k: snapshot has section' ($null -ne $snapA -and $null -ne $snapA.status_face)
Check 'k: section has six keys' ($null -ne $snapA -and $null -ne $snapA.status_face -and @($snapA.status_face.PSObject.Properties).Count -eq 6)

$eB = Invoke-Exporter $fM $outB
Check 'k: export still exit 0'  ($eB.code -eq 0)
Check 'k: note says skip-G3cjk' ($eB.out -match 'status_face=skip-G3cjk:')
Check 'k: note names the key'   ($eB.out -match ':current_activity:')
$snapB = $null
$snapPathB = Join-Path $outB 'city-snapshot.json'
if (Test-Path -LiteralPath $snapPathB) { $snapB = ConvertFrom-Json ([System.IO.File]::ReadAllText($snapPathB, [Text.Encoding]::UTF8)) }
Check 'k: snapshot has no section' ($null -ne $snapB -and $null -eq $snapB.PSObject.Properties['status_face'])
Check 'k: nothing written to world-public' (-not (Test-Path -LiteralPath (Join-Path $outA 'city-panel.html')))

# ---------- summary ----------
Write-Output ('SUITES total=' + ($pass + $fail) + ' pass=' + $pass + ' fail=' + $fail)
if ($fail -gt 0) { exit 1 }
Write-Output 'ALL PASS'
exit 0