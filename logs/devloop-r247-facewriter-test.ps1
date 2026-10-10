# devloop-r247-facewriter-test.ps1 - sandbox harness for write-status-face.ps1 (r247)
# ---------------------------------------------------------------------------
# ASCII-only body (PS5.1 GBK law); CJK enters fixtures via code points only.
# Subprocess calls: .NET Process with double redirect + CreateNoWindow
# (trap #29 law, r244/r246 form; zero console flash, U060).
# Determinism: -SimNowUtc sandbox clock -> double-run byte-identical is
# assertable (real-clock runs are time-dependent by design and are NOT
# byte-asserted, only format/freshness asserted - A8).
# Sandbox: logs\devloop-r247-fx\ (gitignored). Real repo files untouched
# (writer gets -ContentPath/-FacePath overrides inside the sandbox).
# ---------------------------------------------------------------------------
$ErrorActionPreference = 'Continue'

$repo   = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$writer = Join-Path $repo 'Tools\devloop\write-status-face.ps1'
$gate   = Join-Path $repo 'Tools\tick\statusface-freshness.ps1'
$fx     = Join-Path $repo 'logs\devloop-r247-fx'
$u8     = New-Object System.Text.UTF8Encoding($false)

if (Test-Path -LiteralPath $fx) { Remove-Item -LiteralPath $fx -Recurse -Force }
New-Item -ItemType Directory -Path $fx | Out-Null

$pass = 0
$fail = 0
function Ok
{
    param([bool]$Cond, [string]$Name)
    if ($Cond) { $script:pass = $script:pass + 1; Write-Output ('PASS ' + $Name) }
    else { $script:fail = $script:fail + 1; Write-Output ('FAIL ' + $Name) }
}

function Run-Script
{
    param([string]$ScriptPath, [string[]]$ExtraArgs)
    $al = @('-NoProfile','-ExecutionPolicy','Bypass','-File', $ScriptPath)
    if ($null -ne $ExtraArgs) { foreach ($a in $ExtraArgs) { $al = $al + $a } }
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = 'powershell.exe'
    $psi.Arguments = ($al -join ' ')
    $psi.UseShellExecute = $false
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    $psi.CreateNoWindow = $true
    $proc = New-Object System.Diagnostics.Process
    $proc.StartInfo = $psi
    [void]$proc.Start()
    $out = $proc.StandardOutput.ReadToEnd()
    $err = $proc.StandardError.ReadToEnd()
    $proc.WaitForExit()
    return @{ exit = $proc.ExitCode; out = $out; err = $err }
}

function Write-Utf8
{
    param([string]$Path, [string]$Text)
    [IO.File]::WriteAllText($Path, $Text, $u8)
}

$SIM = '2026-10-10T20:00:00Z'

# ---- A0 static -------------------------------------------------------------
Ok (Test-Path -LiteralPath $writer) 'A0.1 writer file exists'
$wbytes = [IO.File]::ReadAllBytes($writer)
$nonAscii = 0
foreach ($b in $wbytes) { if ($b -gt 127) { $nonAscii = $nonAscii + 1 } }
Ok ($nonAscii -eq 0) 'A0.2 writer ASCII-only body'
$wtxt = [IO.File]::ReadAllText($writer, [Text.Encoding]::ASCII)
Ok (($wtxt -like '*SimNowUtc*') -and ($wtxt -like '*FACE OK*')) 'A0.3 writer params + OK marker present'

# ---- A1 happy path: hallucinated updated_utc killed, valid past artifact kept
$c1 = Join-Path $fx 'c1.json'
$f1 = Join-Path $fx 'face1.json'
Write-Utf8 $c1 '{"updated_utc":"2030-01-01T00:00:00Z","current_activity":"act-x","artifact":"art-x","artifact_utc":"2026-10-10T19:00:00Z","milestone":"ms-x","milestone_eta_utc":"2026-10-11T18:00:00Z"}'
$r1 = Run-Script $writer @('-ContentPath', $c1, '-FacePath', $f1, '-SimNowUtc', $SIM)
Ok ($r1.exit -eq 0) 'A1.1 happy path exit 0'
Ok ($r1.out -like '*FACE OK*') 'A1.2 stdout FACE OK'
Ok ([string]::IsNullOrWhiteSpace($r1.err)) 'A1.3 stderr clean'
$fo1 = ConvertFrom-Json ([IO.File]::ReadAllText($f1, [Text.Encoding]::UTF8))
Ok ([string]$fo1.updated_utc -eq $SIM) 'A1.4 updated_utc machine-stamped (2030 fake ignored = hallucination kill)'
Ok ([string]$fo1.artifact_utc -eq '2026-10-10T19:00:00Z') 'A1.5 artifact_utc kept (valid past)'
Ok ((($fo1.PSObject.Properties | Measure-Object).Count) -eq 6) 'A1.6 six keys present'

# ---- A2 future artifact_utc replaced by machine stamp ----------------------
$c2 = Join-Path $fx 'c2.json'
$f2 = Join-Path $fx 'face2.json'
Write-Utf8 $c2 '{"updated_utc":"","current_activity":"act-x","artifact":"art-x","artifact_utc":"2099-01-01T00:00:00Z","milestone":"ms-x","milestone_eta_utc":"2026-10-11T18:00:00Z"}'
$r2 = Run-Script $writer @('-ContentPath', $c2, '-FacePath', $f2, '-SimNowUtc', $SIM)
Ok ($r2.exit -eq 0) 'A2.1 future-artifact exit 0'
$fo2 = ConvertFrom-Json ([IO.File]::ReadAllText($f2, [Text.Encoding]::UTF8))
Ok ([string]$fo2.artifact_utc -eq $SIM) 'A2.2 future artifact_utc replaced with machine stamp'

# ---- A3 empty required key: fail loud, target untouched ---------------------
$c3 = Join-Path $fx 'c3.json'
$f3 = Join-Path $fx 'face3.json'
Write-Utf8 $c3 '{"updated_utc":"","current_activity":"act-x","artifact":"art-x","artifact_utc":"","milestone":"","milestone_eta_utc":"2026-10-11T18:00:00Z"}'
Write-Utf8 $f3 'SENTINEL'
$r3 = Run-Script $writer @('-ContentPath', $c3, '-FacePath', $f3, '-SimNowUtc', $SIM)
Ok ($r3.exit -eq 1) 'A3.1 empty-milestone exit 1'
Ok ($r3.out -like '*FAIL:*') 'A3.2 FAIL line on stdout'
Ok (([IO.File]::ReadAllText($f3)) -eq 'SENTINEL') 'A3.3 target untouched on failure (atomicity)'

# ---- A4 bad milestone_eta_utc ----------------------------------------------
$c4 = Join-Path $fx 'c4.json'
$f4 = Join-Path $fx 'face4.json'
Write-Utf8 $c4 '{"updated_utc":"","current_activity":"a","artifact":"b","artifact_utc":"","milestone":"m","milestone_eta_utc":"not-a-date"}'
$r4 = Run-Script $writer @('-ContentPath', $c4, '-FacePath', $f4, '-SimNowUtc', $SIM)
Ok ($r4.exit -eq 1) 'A4.1 bad eta exit 1'

# ---- A5 content file missing ------------------------------------------------
$r5 = Run-Script $writer @('-ContentPath', (Join-Path $fx 'nope.json'), '-FacePath', (Join-Path $fx 'face5.json'), '-SimNowUtc', $SIM)
Ok ($r5.exit -eq 1) 'A5.1 missing content exit 1'

# ---- A6 bad JSON -----------------------------------------------------------
$c6 = Join-Path $fx 'c6.json'
Write-Utf8 $c6 '{oops'
$r6 = Run-Script $writer @('-ContentPath', $c6, '-FacePath', (Join-Path $fx 'face6.json'), '-SimNowUtc', $SIM)
Ok ($r6.exit -eq 1) 'A6.1 bad JSON exit 1'

# ---- A7 CJK UTF-8 roundtrip (code-point built, zero inline CJK in body) ----
$cjk = ([string][char]0x6D4B) + ([string][char]0x8BD5)
$c7 = Join-Path $fx 'c7.json'
$f7 = Join-Path $fx 'face7.json'
Write-Utf8 $c7 ('{"updated_utc":"","current_activity":"' + $cjk + '","artifact":"b","artifact_utc":"","milestone":"m","milestone_eta_utc":"2026-10-11T18:00:00Z"}')
$r7 = Run-Script $writer @('-ContentPath', $c7, '-FacePath', $f7, '-SimNowUtc', $SIM)
Ok ($r7.exit -eq 0) 'A7.1 CJK content exit 0'
$fo7 = ConvertFrom-Json ([IO.File]::ReadAllText($f7, [Text.Encoding]::UTF8))
Ok ([string]$fo7.current_activity -eq $cjk) 'A7.2 CJK roundtrip intact (U+6D4B U+8BD5)'

# ---- A8 real-clock production form + freshness gate integration ------------
$f8 = Join-Path $fx 'face8.json'
$r8 = Run-Script $writer @('-ContentPath', $c1, '-FacePath', $f8)
Ok ($r8.exit -eq 0) 'A8.1 real-clock write exit 0'
$fo8 = ConvertFrom-Json ([IO.File]::ReadAllText($f8, [Text.Encoding]::UTF8))
$ageS = [Math]::Abs(([DateTimeOffset]::UtcNow - [DateTimeOffset]::Parse([string]$fo8.updated_utc)).TotalSeconds)
Ok ($ageS -lt 300) 'A8.2 real clock stamp fresh (<300s)'
$g8 = Run-Script $gate @('-FacePath', $f8)
Ok ($g8.exit -eq 0) 'A8.3 freshness gate exit 0 on writer output'
Ok ($g8.out -like 'statusface: fresh*') 'A8.4 gate line = fresh'

# ---- A9 no BOM on output face -----------------------------------------------
$b8 = [IO.File]::ReadAllBytes($f8)
Ok (-not ($b8.Length -ge 3 -and $b8[0] -eq 0xEF -and $b8[1] -eq 0xBB -and $b8[2] -eq 0xBF)) 'A9.1 face UTF-8 no BOM'

# ---- A10 fixed-clock double run byte-identical ------------------------------
$f10a = Join-Path $fx 'face10a.json'
$f10b = Join-Path $fx 'face10b.json'
[void](Run-Script $writer @('-ContentPath', $c1, '-FacePath', $f10a, '-SimNowUtc', $SIM))
[void](Run-Script $writer @('-ContentPath', $c1, '-FacePath', $f10b, '-SimNowUtc', $SIM))
Ok ((Get-FileHash -Algorithm SHA256 -LiteralPath $f10a).Hash -eq (Get-FileHash -Algorithm SHA256 -LiteralPath $f10b).Hash) 'A10.1 fixed-clock double run byte-identical'

Write-Output ('RESULT pass=' + $pass + ' fail=' + $fail)
if ($fail -eq 0) { exit 0 } else { exit 2 }
