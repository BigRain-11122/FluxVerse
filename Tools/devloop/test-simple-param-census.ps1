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
#   o) cache (r797): a first run writes, the second answers from disk, a changed
#      source invalidates, a corrupt cache reads 'unreadable', a missing root
#      reads 'no-dir', an unwritable cache keeps the answer - and no miss ever
#      hands back a zero that looks measured
#   p) root identity (r834, queue main#140): four spellings of ONE directory
#      share one fingerprint and one cache entry; two genuinely different
#      directories with byte-identical *.ps1 listings never share a key (that
#      is the criterion that forbids "just drop the root from the hash")
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

Write-Output '--- l) wiring: the tooling half guards it and runs it ---'
if (-not (Test-Path -LiteralPath $tick)) { Write-Output ('setup FAIL: missing ' + $tick); exit 1 }
. $tick
$tickText = [System.IO.File]::ReadAllText($tick, [Text.Encoding]::UTF8)
# main#133: the census moved out of the face half into write3 (its sandbox was
# one of the three that pushed the face half onto the 2/3 line). The judgment
# is unchanged - a family that guards a tool must also run that tool's suite.
$w3 = @(Get-PsSuitesTickDefaults -Family write3)
$w2now = @(Get-PsSuitesTickDefaults -Family write2)
Check 'l1 the tooling half guards the tool' (@($w3 | Where-Object { $_ -eq 'Tools\devloop\simple-param-census.ps1' }).Count -eq 1)
Check 'l2 the tooling half guards the sandbox' (@($w3 | Where-Object { $_ -eq 'Tools\devloop\test-simple-param-census.ps1' }).Count -eq 1)
Check 'l3 the tooling half runs the sandbox by name' ($tickText -match 'test-simple-param-census\.ps1')
Check 'l4 the face half no longer carries it' (@($w2now | Where-Object { $_ -match 'simple-param-census' }).Count -eq 0) ($w2now -join ',')

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

Write-Output '--- o) cache: the fingerprint decides, the reason has a name ---'
# r797: a fresh census parses 66 files (~560 ms) and the panel wants the number
# every tick. The cache is only honest if (a) the key really covers what the
# answer depends on, and (b) a miss says WHY it missed instead of handing back
# a zero. Both are proved here on fixtures, not on the live tree.
$cDir = Join-Path $sandbox 'cache'
New-Item -ItemType Directory -Force -Path $cDir | Out-Null
$null = New-Fixture 'cache\c1.ps1' @(
    'function Get-Bare2 {',
    '    param([string]$FilePath)',
    '    return [ordered]@{ ok = 0 }',
    '}'
)
$cachePath = Join-Path $sandbox 'spc-cache.json'
$c1 = Get-SimpleParamCensusCached -Root $cDir -RepoDir $sandbox -CachePath $cachePath -ModulePath $module
Check 'o1 first run recomputes and writes the cache' ($c1.cached -eq $false -and $c1.wrote -eq $true) ('cached=' + [string]$c1.cached + ' wrote=' + [string]$c1.wrote)
Check 'o2 first run still reports the risk' ($c1.risky -eq 1) ([string]$c1.risky)
Check 'o3 cache file is on disk afterwards' (Test-Path -LiteralPath $cachePath)
$c2 = Get-SimpleParamCensusCached -Root $cDir -RepoDir $sandbox -CachePath $cachePath -ModulePath $module
Check 'o4 second run answers from the cache' ($c2.cached -eq $true -and $c2.reason -eq '') ('cached=' + [string]$c2.cached + ' reason=' + [string]$c2.reason)
Check 'o5 cached answer carries the same counts' ($c2.risky -eq $c1.risky -and $c2.files -eq $c1.files -and $c2.functions -eq $c1.functions)
Check 'o6 cached answer still names the offending function' (@($c2.items).Count -eq 1 -and (@($c2.items)[0].name -eq 'Get-Bare2')) ([string](@($c2.items)[0].name))
$null = New-Fixture 'cache\c1.ps1' @(
    'function Get-Bare2 {',
    '    param([string]$FilePath)',
    '    return [ordered]@{ ok = 0 }',
    '}',
    'function Get-Clean2 {',
    '    param([Parameter(Mandatory=$true)][string]$Path)',
    '    return 2',
    '}'
)
$c3 = Get-SimpleParamCensusCached -Root $cDir -RepoDir $sandbox -CachePath $cachePath -ModulePath $module
Check 'o7 a changed source invalidates the cache' ($c3.cached -eq $false -and $c3.reason -eq 'stale') ('cached=' + [string]$c3.cached + ' reason=' + [string]$c3.reason)
Check 'o8 the recomputed answer sees the new function' ($c3.simple -eq 2 -and $c3.risky -eq 1) ('simple=' + [string]$c3.simple + ' risky=' + [string]$c3.risky)
[System.IO.File]::WriteAllText($cachePath, '{not json', (New-Object System.Text.ASCIIEncoding))
$c4 = Get-SimpleParamCensusCached -Root $cDir -RepoDir $sandbox -CachePath $cachePath -ModulePath $module
Check 'o9 a corrupt cache reads as unreadable, not as zero' ($c4.cached -eq $false -and $c4.reason -eq 'unreadable' -and $c4.files -gt 0) ('reason=' + [string]$c4.reason + ' files=' + [string]$c4.files)
$c5 = Get-SimpleParamCensusCached -Root $cDir -RepoDir $sandbox
Check 'o10 no cache path says so and still answers' ($c5.cached -eq $false -and $c5.reason -eq 'no-cache-path' -and $c5.files -gt 0) ('reason=' + [string]$c5.reason)
$c6 = Get-SimpleParamCensusCached -Root (Join-Path $sandbox 'nope') -CachePath $cachePath
Check 'o11 a missing root is no-dir and names <missing>' ($c6.reason -eq 'no-dir' -and $c6.root -eq '<missing>') ('reason=' + [string]$c6.reason + ' root=' + [string]$c6.root)
$blocker = New-Fixture 'blocker.bin' @('x')
$badCache = Join-Path $blocker 'cache.json'
$c7 = Get-SimpleParamCensusCached -Root $cDir -RepoDir $sandbox -CachePath $badCache -ModulePath $module
Check 'o12 an unwritable cache keeps the answer and says so' ($c7.reason -eq 'unwritable' -and $c7.risky -eq $c3.risky) ('reason=' + [string]$c7.reason + ' risky=' + [string]$c7.risky)

Write-Output '--- p) root identity: one object, one key; two objects, two keys ---'
# r834 (queue main#140). The fingerprint used to add the RAW root string, so
# every spelling of one directory minted its own key: the cache said 'stale'
# for a tree that had not moved, which is the cache vouching "something changed"
# when nothing did. The fix keys on the directory object's own creation stamp.
# These checks are the criterion: (1) spellings of one directory agree, (2) two
# genuinely different directories never agree even when their *.ps1 listing is
# byte-identical.
$pA = Join-Path $sandbox 'proot-a'
New-Item -ItemType Directory -Force -Path $pA | Out-Null
$pLeaf = Split-Path -Leaf $pA
$null = New-Fixture 'proot-a\p1.ps1' @(
    'function Get-Bare3 {',
    '    param([string]$FilePath)',
    '    return [ordered]@{ ok = 0 }',
    '}'
)
$spellings = @(
    $pA,
    ($pA + '\'),
    (Join-Path $pA '.'),
    (Join-Path $pA ('..\' + $pLeaf))
)
$fps = @()
foreach ($sp in $spellings) { $fps += (Get-SimpleParamFingerprint -Root $sp -ModulePath $module) }
$distinct = @($fps | Sort-Object -Unique)
Check 'p1 four spellings of one directory share one fingerprint' ($distinct.Count -eq 1 -and $distinct[0] -ne '') ('fps=' + ($fps -join ','))
$ident = Get-SimpleParamRootIdentity -Root ($pA + '\')
Check 'p2 the identity token is not the path string' ($ident -ne '' -and $ident.StartsWith('dir|') -and $ident.IndexOf('proot-a', [System.StringComparison]::OrdinalIgnoreCase) -lt 0) $ident
$pCache = Join-Path $sandbox 'spc-cache-identity.json'
$s1 = Get-SimpleParamCensusCached -Root $pA -RepoDir $sandbox -CachePath $pCache -ModulePath $module
$s2 = Get-SimpleParamCensusCached -Root (Join-Path $pA ('..\' + $pLeaf)) -RepoDir $sandbox -CachePath $pCache -ModulePath $module
Check 'p3 a cache written under one spelling answers another spelling' ($s1.cached -eq $false -and $s1.wrote -eq $true -and $s2.cached -eq $true) ('run1=' + [string]$s1.cached + '/' + [string]$s1.reason + ' run2=' + [string]$s2.cached + '/' + [string]$s2.reason)
Check 'p4 the answered spelling reports the same counts' ($s2.files -eq $s1.files -and $s2.risky -eq $s1.risky) ('files=' + [string]$s2.files + ' risky=' + [string]$s2.risky)

# Two different directories, identical listing: same name, same length, same
# mtime - only the directory object differs. A fingerprint that ignores the
# directory identity (or keys on the raw string) would either cross-answer or,
# in the raw-string version, differ for the wrong reason.
$pB = Join-Path $sandbox 'proot-b'
New-Item -ItemType Directory -Force -Path $pB | Out-Null
$pSrc = Join-Path $pA 'p1.ps1'
$pDst = Join-Path $pB 'p1.ps1'
[System.IO.File]::WriteAllBytes($pDst, [System.IO.File]::ReadAllBytes($pSrc))
$stamp = [datetime]::new(2026, 1, 2, 3, 4, 5, [System.DateTimeKind]::Utc)
[System.IO.File]::SetLastWriteTimeUtc($pSrc, $stamp)
[System.IO.File]::SetLastWriteTimeUtc($pDst, $stamp)
[System.IO.Directory]::SetCreationTimeUtc($pA, $stamp.AddDays(-3))
[System.IO.Directory]::SetCreationTimeUtc($pB, $stamp.AddDays(-2))
$fpA = Get-SimpleParamFingerprint -Root $pA -ModulePath $module
$fpB = Get-SimpleParamFingerprint -Root $pB -ModulePath $module
$listA = @(Get-ChildItem -LiteralPath $pA -File -Filter '*.ps1' | ForEach-Object { $_.Name + '|' + $_.Length + '|' + $_.LastWriteTimeUtc.Ticks }) -join ';'
$listB = @(Get-ChildItem -LiteralPath $pB -File -Filter '*.ps1' | ForEach-Object { $_.Name + '|' + $_.Length + '|' + $_.LastWriteTimeUtc.Ticks }) -join ';'
Check 'p5 the two fixture listings really are identical' ($listA -eq $listB -and $listA -ne '') $listA
Check 'p6 identical listings in different directories do not share a key' ($fpA -ne '' -and $fpB -ne '' -and $fpA -ne $fpB) ('a=' + $fpA + ' b=' + $fpB)
$s3 = Get-SimpleParamCensusCached -Root $pB -RepoDir $sandbox -CachePath $pCache -ModulePath $module
Check 'p7 and the cache is not answered across them' ($s3.cached -eq $false -and $s3.reason -eq 'stale') ('cached=' + [string]$s3.cached + ' reason=' + [string]$s3.reason)
$noIdent = Get-SimpleParamRootIdentity -Root (Join-Path $sandbox 'nope')
$noFp = Get-SimpleParamFingerprint -Root (Join-Path $sandbox 'nope') -ModulePath $module
Check 'p8 a missing root has no identity and therefore no key' ($noIdent -eq '' -and $noFp -eq '') ('ident=' + $noIdent + ' fp=' + $noFp)

Remove-Item -LiteralPath $sandbox -Recurse -Force -ErrorAction SilentlyContinue

Write-Output ''
Write-Output ('RESULT: pass=' + $pass + ' fail=' + $fail)
if ($fail -gt 0) { exit 2 }
exit 0