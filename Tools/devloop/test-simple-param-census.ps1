# test-simple-param-census.ps1 - sandbox proof for the bare-parameter census
# (queue main#127; tool landed r795)
#
# The tool's only job is to answer "which functions here take a parameter block,
# are not advanced, and declare a required path parameter that nothing
# validates?" so a mistyped call cannot look like a normal reading. The proof is
# about the detector's judgement, not about today's count:
#   a) a bare function with a required path param that returns an object is a
#      risk, and both reasons are named
#   b) an advanced function ([CmdletBinding()]) is out of scope
#   c) an attributed parameter is guarded (`[Alias()]` included - the r793 fix)
#   d) `[string]` is a type constraint, NOT an attribute (the bug this sandbox
#      caught while the tool was being written: everything looked validated)
#   e) Test-Path on the SAME line as the variable guards it; a Test-Path on
#      another line/variable does not
#   f) `throw` anywhere in the body guards the whole function
#   g) an omittable parameter (has a default) is never a risk
#   h) a function with no param block is not part of the family at all
#   i) a file that fails to parse is named and does not stop the census
#   j) a missing root reads as `<missing>`, not as zero files
#   k) CLI: summary always, per-item lines only with -List, -Json parses,
#      -FailOnRisk exits 2 with risk and 0 without
#   l) wiring: the write2 family guards the tool and runs its sandbox
#   m) both new files stay ASCII (PS5.1 encoding law)
#   n) live tree: the two shapes r792/r793 fixed are NOT in the risk list
#
# ASCII-only (no CJK typed here).

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$module = Join-Path $repoRoot 'Tools\devloop\simple-param-census.ps1'
$tick = Join-Path $repoRoot 'Tools\devloop\ps-suites-tick.ps1'

$pass = 0
$fail = 0
function Check([string]$name, [bool]$cond, [string]$detail = '') {
    if ($cond) { Write-Output ('  PASS ' + $name); $script:pass++ }
    else {
        $line = '  FAIL ' + $name
        if ($detail -ne '') { $line = $line + ' :: ' + $detail }
        Write-Output $line
        $script:fail++
    }
}

if (-not (Test-Path -LiteralPath $module)) { Write-Output ('setup FAIL: missing ' + $module); exit 1 }
. $module

$sandbox = Join-Path ([System.IO.Path]::GetTempPath()) ('fv-spc-' + $PID)
if (Test-Path -LiteralPath $sandbox) { Remove-Item -LiteralPath $sandbox -Recurse -Force }
New-Item -ItemType Directory -Force -Path $sandbox | Out-Null

function New-Fixture([string]$name, [string[]]$lines) {
    $p = Join-Path $sandbox $name
    $text = (@($lines) -join "`r`n") + "`r`n"
    [System.IO.File]::WriteAllText($p, $text, (New-Object System.Text.ASCIIEncoding))
    return $p
}

$fixture = New-Fixture 'fx.ps1' @(
    'function Get-Bare {',
    '    param([string]$QueueDir)',
    '    $r = [ordered]@{ exists = $false; open = 0 }',
    '    $r.dir = $QueueDir',
    '    return $r',
    '}',
    'function Get-Advanced {',
    '    [CmdletBinding()]',
    '    param([string]$Path)',
    '    return [ordered]@{ ok = 1 }',
    '}',
    'function Get-Aliased {',
    '    param([Alias("QueueDir")][string]$Dir)',
    '    return [ordered]@{ ok = 1 }',
    '}',
    'function Get-SameLineGuard {',
    '    param([string]$Path)',
    '    if (-not (Test-Path -LiteralPath $Path)) { return $null }',
    '    return [ordered]@{ ok = 1 }',
    '}',
    'function Get-OtherLineGuard {',
    '    param([string]$Path, [string]$Other)',
    '    if (-not (Test-Path -LiteralPath $Other)) { return $null }',
    '    return [ordered]@{ ok = 1 }',
    '}',
    'function Get-Throwing {',
    '    param([string]$Path)',
    '    if ($Path -eq "") { throw "no path" }',
    '    return [ordered]@{ ok = 1 }',
    '}',
    'function Get-Omittable {',
    '    param([string]$RepoDir = "")',
    '    return [ordered]@{ ok = 1 }',
    '}',
    'function Get-NoParams { return 2 }',
    'function Get-ValidateSetGuard {',
    '    param([ValidateSet("a","b")][string]$Mode)',
    '    return [ordered]@{ ok = 1 }',
    '}'
)

$bad = New-Fixture 'broken.ps1' @(
    'function Get-Half {',
    '    param([string]$Path)',
    '    return ('
)

$census = Get-SimpleParamCensus -Root $sandbox -RepoDir $sandbox
$single = @($census.simple)

function Find-Item([string]$name) {
    foreach ($it in @($census.simple)) { if ($it.name -eq $name) { return $it } }
    return $null
}

Write-Output '--- a) bare + required path + object return is a risk ---'
$itBare = Find-Item 'Get-Bare'
Check 'a1 listed in the family' ($null -ne $itBare)
Check 'a2 flagged as a risk' ($null -ne $itBare -and $itBare.why -ne '') ([string]$itBare.why)
Check 'a3 names the offending parameter' ($null -ne $itBare -and $itBare.why -match 'path-param-unvalidated\(QueueDir\)') ([string]$itBare.why)
Check 'a4 object return is the aggravator' ($null -ne $itBare -and $itBare.why -match 'returns-default-object') ([string]$itBare.why)

Write-Output '--- b) advanced functions are out of scope ---'
Check 'b1 advanced function is not listed' ($null -eq (Find-Item 'Get-Advanced'))

Write-Output '--- c) an attribute is a guard ---'
$itAlias = Find-Item 'Get-Aliased'
Check 'c1 aliased parameter is still in the family' ($null -ne $itAlias)
Check 'c2 aliased parameter is not a risk' ($null -ne $itAlias -and $itAlias.why -eq '') ([string]$itAlias.why)
$itVs = Find-Item 'Get-ValidateSetGuard'
Check 'c3 a ValidateSet parameter is not a risk' ($null -ne $itVs -and $itVs.why -eq '') ([string]$itVs.why)

Write-Output '--- d) [string] is a type, not an attribute ---'
# The fixture's Get-Bare declares `param([string]$QueueDir)`; if the type
# constraint were counted as an attribute it would read as guarded - which is
# exactly how the first cut of the tool came out empty against this shape.
Check 'd1 a [string]-typed parameter is still judged' ($null -ne $itBare -and $itBare.why -ne '') ([string]$itBare.why)

Write-Output '--- e) Test-Path must name THIS variable ---'
$itSame = Find-Item 'Get-SameLineGuard'
Check 'e1 same-line Test-Path on the variable guards it' ($null -ne $itSame -and $itSame.why -eq '') ([string]$itSame.why)
$itOther = Find-Item 'Get-OtherLineGuard'
Check 'e2 a Test-Path on another variable does not guard' ($null -ne $itOther -and $itOther.why -match 'path-param-unvalidated\(Path\)') ([string]$itOther.why)

Write-Output '--- f) throw guards the function ---'
$itThrow = Find-Item 'Get-Throwing'
Check 'f1 a body that throws is not a silent zero' ($null -ne $itThrow -and $itThrow.why -eq '') ([string]$itThrow.why)

Write-Output '--- g) omittable parameters are never risks ---'
$itOpt = Find-Item 'Get-Omittable'
Check 'g1 a defaulted path parameter is not a risk' ($null -ne $itOpt -and $itOpt.why -eq '') ([string]$itOpt.why)

Write-Output '--- h) no param block = not in the family ---'
Check 'h1 a function without a param block is not listed' ($null -eq (Find-Item 'Get-NoParams'))
Check 'h2 but it is still counted as a function' ($census.functions -ge 9) ([string]$census.functions)

Write-Output '--- i) a broken file is named, not fatal ---'
Check 'i1 the broken file is reported' (@($census.parse_errors) -contains 'broken.ps1') ((@($census.parse_errors) -join ','))
Check 'i2 the good file still produced items' (@($census.simple).Count -ge 7) ([string]@($census.simple).Count)

Write-Output '--- j) missing root is not zero files ---'
$missing = Get-SimpleParamCensus -Root (Join-Path $sandbox 'nope') -RepoDir $sandbox
Check 'j1 missing root says so' ($missing.root -eq '<missing>') ([string]$missing.root)
Check 'j2 missing root reports zero files counted, not a fresh zero' ($missing.files -eq 0 -and $missing.simple_count -eq 0)

Write-Output '--- k) CLI three forms ---'
$cleanDir = Join-Path $sandbox 'clean'
New-Item -ItemType Directory -Force -Path $cleanDir | Out-Null
$null = New-Fixture 'clean\clean.ps1' @(
    'function Get-Clean {',
    '    param([Parameter(Mandatory=$true)][string]$Path)',
    '    return 1',
    '}'
)
$outDefault = @(& powershell.exe -NoProfile -ExecutionPolicy Bypass -File $module -Root $sandbox -RepoDir $sandbox 2>&1 | ForEach-Object { [string]$_ })
$sumLine = @($outDefault | Where-Object { $_ -match '^SIMPLE-PARAM CENSUS:' })
Check 'k1 exactly one summary line' ($sumLine.Count -eq 1) ([string]$sumLine.Count)
Check 'k2 summary carries files/simple/risky' ($sumLine.Count -eq 1 -and $sumLine[0] -match 'files=\d+' -and $sumLine[0] -match 'simple=\d+' -and $sumLine[0] -match 'risky=\d+') ([string]$sumLine)
$riskyLines = @($outDefault | Where-Object { $_ -match '^RISKY  ' })
$simpleLines = @($outDefault | Where-Object { $_ -match '^SIMPLE ' })
Check 'k3 default form prints the risk lines' ($riskyLines.Count -ge 1) ([string]$riskyLines.Count)
Check 'k4 default form does not print every simple line' ($simpleLines.Count -eq 0) ([string]$simpleLines.Count)
$outList = @(& powershell.exe -NoProfile -ExecutionPolicy Bypass -File $module -Root $sandbox -RepoDir $sandbox -List 2>&1 | ForEach-Object { [string]$_ })
$listLines = @($outList | Where-Object { $_ -match '^SIMPLE ' })
Check 'k5 -List prints the whole family' ($listLines.Count -ge 7) ([string]$listLines.Count)
$jsonText = (@(& powershell.exe -NoProfile -ExecutionPolicy Bypass -File $module -Root $sandbox -RepoDir $sandbox -Json 2>&1) -join "`n")
$jsonOk = $false
$jsonObj = $null
try { $jsonObj = $jsonText | ConvertFrom-Json; $jsonOk = $true } catch { $jsonOk = $false }
Check 'k6 -Json parses' ($jsonOk)
Check 'k7 -Json carries the three counters' ($jsonOk -and $null -ne $jsonObj.simple -and $null -ne $jsonObj.risky -and $jsonObj.files -ge 1)
& powershell.exe -NoProfile -ExecutionPolicy Bypass -File $module -Root $sandbox -RepoDir $sandbox -FailOnRisk 2>&1 | Out-Null
$codeRisk = $LASTEXITCODE
Check 'k8 -FailOnRisk exits 2 when risks exist' ($codeRisk -eq 2) ([string]$codeRisk)
& powershell.exe -NoProfile -ExecutionPolicy Bypass -File $module -Root $cleanDir -RepoDir $cleanDir -FailOnRisk 2>&1 | Out-Null
$codeClean = $LASTEXITCODE
Check 'k9 -FailOnRisk exits 0 on a clean tree' ($codeClean -eq 0) ([string]$codeClean)

Write-Output '--- l) wiring: the face half guards it and runs it ---'
if (-not (Test-Path -LiteralPath $tick)) { Write-Output ('setup FAIL: missing ' + $tick); exit 1 }
. $tick
$tickText = [System.IO.File]::ReadAllText($tick, [Text.Encoding]::UTF8)
$w2 = @(Get-PsSuitesTickDefaults -Family write2)
Check 'l1 the face half guards the tool' (@($w2 | Where-Object { $_ -eq 'Tools\devloop\simple-param-census.ps1' }).Count -eq 1)
Check 'l2 the face half guards the sandbox' (@($w2 | Where-Object { $_ -eq 'Tools\devloop\test-simple-param-census.ps1' }).Count -eq 1)
Check 'l3 the face half runs the sandbox by name' ($tickText -match 'test-simple-param-census\.ps1')

Write-Output '--- m) both new files stay ASCII ---'
$toolBytes = [System.IO.File]::ReadAllBytes($module)
$nonAscii = @($toolBytes | Where-Object { $_ -gt 127 }).Count
Check 'm1 tool is ASCII-only' ($nonAscii -eq 0) ([string]$nonAscii)
$selfBytes = [System.IO.File]::ReadAllBytes($PSCommandPath)
$selfNonAscii = @($selfBytes | Where-Object { $_ -gt 127 }).Count
Check 'm2 this sandbox is ASCII-only' ($selfNonAscii -eq 0) ([string]$selfNonAscii)

Write-Output '--- n) live tree: the two fixed shapes stay clean ---'
$live = Get-SimpleParamCensus -Root (Join-Path $repoRoot 'Tools\devloop') -RepoDir $repoRoot
$liveRisky = @($live.simple | Where-Object { $_.why -ne '' })
Check 'n1 live tree is readable and non-trivial' ($live.files -ge 60 -and $live.functions -ge 100) ('files=' + $live.files + ' functions=' + $live.functions)
$queueDue = @($liveRisky | Where-Object { $_.name -eq 'Get-QueueDue' })
$bench = @($liveRisky | Where-Object { $_.name -eq 'Get-BenchmarkReading' })
Check 'n2 Get-QueueDue is not a risk any more (r793 alias + note)' ($queueDue.Count -eq 0)
Check 'n3 Get-BenchmarkReading is not a risk any more (r793 note)' ($bench.Count -eq 0)
# The census must not pass by listing nothing at all: the family itself has to
# be populated, otherwise a broken parser would read as "all clean".
Check 'n4 the live family still lists simple functions' ($live.simple_count -ge 50) ([string]$live.simple_count)

Remove-Item -LiteralPath $sandbox -Recurse -Force -ErrorAction SilentlyContinue

Write-Output ''
Write-Output ('RESULT: pass=' + $pass + ' fail=' + $fail)
if ($fail -gt 0) { exit 2 }
exit 0