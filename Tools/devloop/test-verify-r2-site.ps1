# test-verify-r2-site.ps1 - sandbox proof for the R2 site check in verify (main#55)
# ---------------------------------------------------------------------------
# r714 measured the R2 district standing 91.7% over the L_Water mesh, but that
# number lived only in a hand-run report: move the block or reshape the water
# and the panel keeps quoting the old figure. r716 wires the checker into
# Tools\perceptor\verify.ps1 as section 2d, so every tick republishes it.
#
# This sandbox runs the REAL verify.ps1 against three fixtures and asserts:
#   a) dry ground  -> VERIFY HEALTH with block_water=0.0% and dry cands > 0
#   b) over water  -> VERIFY WARN naming block_water=100.0%, zero dry cands
#   c) scene gone  -> VERIFY WARN, nothing thrown, verify still exits 0
# plus: the r2-site lines never carry the FAIL token (tick red-scan), and the
# live scene still reports its real 91.7%.
# ASCII-only law: no CJK in this file.

$ErrorActionPreference = 'Stop'
$verify = Join-Path (Split-Path -Parent $PSScriptRoot) 'perceptor\verify.ps1'
$fixtures = Join-Path $PSScriptRoot 'fixtures\r2-site'
$sceneDry = Join-Path $fixtures 'scene-dry.unity'
$sceneWet = Join-Path $fixtures 'scene-wet.unity'
$rebuild = Join-Path $fixtures 'rebuild-fixture.cs'
foreach ($p in @($verify, $sceneDry, $sceneWet, $rebuild)) {
    if (-not (Test-Path -LiteralPath $p)) { Write-Output ('setup FAIL: missing ' + $p); exit 1 }
}

$pass = 0
$fail = 0
function Check([string]$name, [bool]$cond) {
    if ($cond) { Write-Output ('  PASS ' + $name); $script:pass++ }
    else { Write-Output ('  FAIL ' + $name); $script:fail++ }
}

# Runs the real verify with the site checker pointed at a fixture. Returns the
# console text plus the exit code, so the caller can assert both.
function Invoke-Verify([string]$scenePath) {
    $env:FLUXVERSE_SITE_SCENE = $scenePath
    $env:FLUXVERSE_SITE_REBUILD = $rebuild
    try {
        $log = (& powershell -NoProfile -ExecutionPolicy Bypass -File $verify) -join "`n"
        $code = $LASTEXITCODE
    } finally {
        Remove-Item Env:\FLUXVERSE_SITE_SCENE -ErrorAction SilentlyContinue
        Remove-Item Env:\FLUXVERSE_SITE_REBUILD -ErrorAction SilentlyContinue
    }
    return @{ log = $log; code = $code }
}

# ---------- a) dry ground ----------
$a = Invoke-Verify $sceneDry
Write-Output '--- a) dry fixture ---'
Check 'dry: verify exits 0'            ($a.code -eq 0)
Check 'dry: health line emitted'       ($a.log -match 'VERIFY HEALTH: r2-site: block_water=0\.0% dry_candidates=\d+')
Check 'dry: no over-water warning'     (-not ($a.log -match 'VERIFY WARN: r2-site:'))
$mDry = [regex]::Match($a.log, 'r2-site: block_water=0\.0% dry_candidates=(\d+)')
Check 'dry: dry candidates counted'    ($mDry.Success -and [int]$mDry.Groups[1].Value -ge 1000)

# ---------- b) over water ----------
$b = Invoke-Verify $sceneWet
Write-Output '--- b) over-water fixture ---'
Check 'wet: verify exits 0'            ($b.code -eq 0)
Check 'wet: warn (not fail)'           ($b.log -match 'VERIFY WARN: r2-site: block_water=100\.0% dry_candidates=0')
Check 'wet: names the water problem'   ($b.log -match 'stands over water')
Check 'wet: no health line for it'     (-not ($b.log -match 'VERIFY HEALTH: r2-site:'))

# ---------- c) scene gone ----------
$missing = Join-Path ([System.IO.Path]::GetTempPath()) ('fv-missing-scene-' + $PID + '.unity')
$c = Invoke-Verify $missing
Write-Output '--- c) missing scene ---'
Check 'missing: verify did not throw'  ($null -ne $c.log)
Check 'missing: verify still exits 0'  ($c.code -eq 0)
Check 'missing: warn about no verdict' ($c.log -match 'VERIFY WARN: r2-site: the district site check produced no verdict')
Check 'missing: reason carries exit'   ($c.log -match 'VERIFY WARN: r2-site: the district site check produced no verdict \(exit 2')

# ---------- d) red-scan hygiene + live scene ----------
Write-Output '--- d) token hygiene + live ---'
$r2Lines = ($a.log + "`n" + $b.log + "`n" + $c.log) -split "`n" | Where-Object { $_ -match 'r2-site' }
Check 'r2-site lines never say FAIL'   (@($r2Lines | Where-Object { $_ -match 'FAIL' }).Count -eq 0)

$live = (& powershell -NoProfile -ExecutionPolicy Bypass -File $verify) -join "`n"
$mLive = [regex]::Match($live, 'r2-site: block_water=([\d.]+)% dry_candidates=(\d+)')
Check 'live: site line present'        $mLive.Success
Check 'live: block on dry ground'      ($mLive.Success -and [double]$mLive.Groups[1].Value -le 5)
Check 'live: candidates reported'      ($mLive.Success -and [int]$mLive.Groups[2].Value -gt 0)

# ---------- e) district placement reader (main#54) ----------
# The checker used to assume the block stood on the City_GAME origin. main#54
# moved it, so the local position must come from an artifact: the built scene
# first, the anchor decision record second. A fixture scene without a district
# keeps the historical origin (cases a/b above prove that did not shift).
Write-Output '--- e) district placement ---'
$checker = Join-Path $PSScriptRoot 'r2-site-check.py'
$siteTxt = (& python $checker --no-artifacts) -join "`n"
Check 'site: district local reported'  ($siteTxt -match 'district_local=\([\d.\-]+,[\d.\-]+\) src=built-scene')
$pyTest = Join-Path $PSScriptRoot 'test-r2-district-local.py'
$pyOut = (& python $pyTest) -join "`n"
if ($LASTEXITCODE -ne 0) { Write-Output $pyOut }
Check 'site: placement unit test green' ($LASTEXITCODE -eq 0)

# ---------- f) road-strip prop census (main#65) ----------
# Base-plate street trees carry no colliders, so the street-shot pose solver
# never saw them standing on the road strip. The census names them; these
# assertions keep the count on the tick line and pin the geometry rules.
Write-Output '--- f) road-strip props ---'
$propTest = Join-Path $PSScriptRoot 'test-road-props.py'
$propOut = (& python $propTest) -join "`n"
if ($LASTEXITCODE -ne 0) { Write-Output $propOut }
Check 'props: census unit test green' ($LASTEXITCODE -eq 0)
Check 'props: health line carries the count' ($live -match 'props_in_road=\d+')
$mPropsLive = [regex]::Match($live, 'props_in_road=(\d+)')
Check 'props: live road strip clear'   ($mPropsLive.Success -and [int]$mPropsLive.Groups[1].Value -eq 0)
Check 'props: fixture says n/a not 0'  ($a.log -match 'props_in_road=n/a')
Check 'props: no FAIL token'           (-not ($a.log -match 'props_in_road=[^\n]*FAIL'))

Remove-Item -LiteralPath $missing -Force -ErrorAction SilentlyContinue
Write-Output ('test-verify-r2-site: ' + $pass + ' passed, ' + $fail + ' failed (of ' + ($pass + $fail) + ')')
if ($fail -gt 0) { exit 1 }
exit 0