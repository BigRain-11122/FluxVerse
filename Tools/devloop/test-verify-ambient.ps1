# test-verify-ambient.ps1 - sandbox proof for the ambient baseline in verify (main#63)
# ---------------------------------------------------------------------------
# r722 fixed the street frame's black right wall with a Trilight ambient, but the
# fix only runs inside the build entries. A scene opened or imported elsewhere
# keeps Skybox with a never-generated probe and nobody notices. r725 wires
# Tools\devloop\ambient-verdict.ps1 into Tools\perceptor\verify.ps1 as section 2f
# so every tick publishes the baseline.
#
# This sandbox runs the REAL verify.ps1 against four fixtures and asserts:
#   a) Trilight + colours -> VERIFY HEALTH mode=Trilight
#   b) Trilight + all zero colours -> VERIFY WARN naming zero colours
#   c) Skybox mode -> VERIFY WARN naming Skybox (colours are decorative there)
#   d) scene gone -> VERIFY WARN, nothing thrown, verify still exits 0
# plus: ambient lines never carry the FAIL token (tick red-scan), a parse-only
# case with no ambient block reports not-read, and the live R2 scene is healthy.
# ASCII-only law: no CJK in this file.

$ErrorActionPreference = 'Stop'
$verify = Join-Path (Split-Path -Parent $PSScriptRoot) 'perceptor\verify.ps1'
$ambMod = Join-Path $PSScriptRoot 'ambient-verdict.ps1'
$fixtures = Join-Path $PSScriptRoot 'fixtures\ambient'
$sceneOk = Join-Path $fixtures 'scene-ok.unity'
$sceneZero = Join-Path $fixtures 'scene-zero.unity'
$sceneSkybox = Join-Path $fixtures 'scene-skybox.unity'
foreach ($p in @($verify, $ambMod, $sceneOk, $sceneZero, $sceneSkybox)) {
    if (-not (Test-Path -LiteralPath $p)) { Write-Output ('setup FAIL: missing ' + $p); exit 1 }
}

$pass = 0
$fail = 0
function Check([string]$name, [bool]$cond) {
    if ($cond) { Write-Output ('  PASS ' + $name); $script:pass++ }
    else { Write-Output ('  FAIL ' + $name); $script:fail++ }
}

# Runs the real verify with the ambient reader pointed at a fixture.
function Invoke-Verify([string]$scenePath) {
    if ($scenePath) { $env:FLUXVERSE_AMBIENT_SCENE = $scenePath }
    else { Remove-Item Env:\FLUXVERSE_AMBIENT_SCENE -ErrorAction SilentlyContinue }
    try {
        $log = (& powershell -NoProfile -ExecutionPolicy Bypass -File $verify) -join "`n"
        $code = $LASTEXITCODE
    } finally {
        Remove-Item Env:\FLUXVERSE_AMBIENT_SCENE -ErrorAction SilentlyContinue
    }
    return @{ log = $log; code = $code }
}

$ambLinesOf = {
    param([string]$log)
    @($log -split "`n" | Where-Object { $_ -match 'VERIFY (HEALTH|WARN): ambient:' })
}

# ---------- a) healthy Trilight fixture ----------
$a = Invoke-Verify $sceneOk
Write-Output '--- a) Trilight fixture ---'
Check 'ok: verify exits 0'            ($a.code -eq 0)
Check 'ok: health line emitted'       ($a.log -match 'VERIFY HEALTH: ambient: mode=Trilight')
Check 'ok: colours reported'          ($a.log -match 'sky=0\.34,0\.46,0\.55 equator=0\.28,0\.29,0\.28 ground=0\.22,0\.20,0\.16')
Check 'ok: intensity reported'        ($a.log -match 'intensity=1')
Check 'ok: no ambient warning'        (-not ($a.log -match 'VERIFY WARN: ambient:'))

# ---------- b) all-zero colours ----------
$b = Invoke-Verify $sceneZero
Write-Output '--- b) zero-colour fixture ---'
Check 'zero: verify exits 0'          ($b.code -eq 0)
Check 'zero: warn (not fail)'         ($b.log -match 'VERIFY WARN: ambient: mode=Trilight sky=0\.00,0\.00,0\.00')
Check 'zero: names zero colours'      ($b.log -match 'all three ambient colours are zero')
Check 'zero: no ambient health line'  (-not ($b.log -match 'VERIFY HEALTH: ambient:'))

# ---------- c) Skybox mode ----------
$c = Invoke-Verify $sceneSkybox
Write-Output '--- c) Skybox fixture ---'
Check 'skybox: verify exits 0'        ($c.code -eq 0)
Check 'skybox: warn naming the mode'  ($c.log -match 'VERIFY WARN: ambient: mode=Skybox')
Check 'skybox: explains unused colours' ($c.log -match 'the three colours are unused until it is Trilight')

# ---------- d) scene gone ----------
$missing = Join-Path ([System.IO.Path]::GetTempPath()) ('fv-missing-ambient-' + $PID + '.unity')
$d = Invoke-Verify $missing
Write-Output '--- d) missing scene ---'
Check 'missing: verify did not throw'  ($null -ne $d.log)
Check 'missing: verify still exits 0'  ($d.code -eq 0)
Check 'missing: warns not-read'        ($d.log -match 'VERIFY WARN: ambient: not-read reason=scene missing')

# ---------- e) token hygiene + parse-only ----------
Write-Output '--- e) token hygiene + parser ---'
$allAmb = @(& $ambLinesOf $a.log) + @(& $ambLinesOf $b.log) + @(& $ambLinesOf $c.log) + @(& $ambLinesOf $d.log)
Check 'ambient lines present'          ($allAmb.Count -ge 4)
Check 'ambient lines never say FAIL'   (@($allAmb | Where-Object { $_ -match 'FAIL' }).Count -eq 0)

. $ambMod
$noBlock = ConvertFrom-AmbientSceneText -Text "RenderSettings:`n  m_Fog: 0`n"
Check 'parser: no block -> not ran'    (-not $noBlock.ran -and -not $noBlock.parsed)
Check 'parser: no block names reason'  ($noBlock.reason -match 'no m_AmbientMode')
$zeroInt = ConvertFrom-AmbientSceneText -Text (
    "  m_AmbientSkyColor: {r: 0.1, g: 0.2, b: 0.3, a: 1}`n" +
    "  m_AmbientEquatorColor: {r: 0.1, g: 0.2, b: 0.3, a: 1}`n" +
    "  m_AmbientGroundColor: {r: 0.1, g: 0.2, b: 0.3, a: 1}`n" +
    "  m_AmbientIntensity: 0`n  m_AmbientMode: 1`n")
Check 'parser: zero intensity flagged' ($zeroInt.ran -and $zeroInt.verdict -eq 'ZERO_INTENSITY')

# ---------- f) live R2 scene ----------
Write-Output '--- f) live scene ---'
$live = Invoke-Verify ''
$mLive = [regex]::Match($live.log, 'VERIFY HEALTH: ambient: mode=Trilight sky=([\d.]+),([\d.]+),([\d.]+)')
Check 'live: R2 scene is healthy'      ($mLive.Success)
Check 'live: names the scene file'     ($live.log -match 'scene=CityRebuild_R2\.unity')

Write-Output ''
Write-Output ('RESULT: pass=' + $pass + ' fail=' + $fail)
if ($fail -gt 0) { exit 1 }
exit 0