# ambient-verdict.ps1 - ONE definition of "does this scene ship a lighting baseline?"
# ---------------------------------------------------------------------------
# Queue main#63 (r725). r722 fixed the black right wall of the street frames by
# adding a three-colour hemisphere ambient (Trilight) plus a probe refresh - but
# that lives in the build entries only (CityRebuildR2.NormalizeAmbient()). A
# scene opened or imported anywhere else keeps the project default and never
# generates an ambient probe, so indirect light is zero on back-lit surfaces and
# nobody notices until a shot comes back black. r722's own street frame was the
# proof: the fix was invisible to the tick.
#
# So the baseline lives HERE once and verify re-publishes it every tick:
#   - Tools\perceptor\verify.ps1 dot-sources it -> VERIFY HEALTH / WARN line
# Nothing else may compare an ambient mode or colour to its own literal.
#
# Parse-only and fail-soft by contract: a missing or unreadable scene yields
# ran=false with a reason, never an exception - a moved path must not take the
# whole city scan down with it. No 'FAIL' token in these messages (the tick
# red-scan keys on that word).
# ASCII-only (PS5.1 GBK law).

# Unity AmbientMode: 0 Skybox, 1 Trilight, 3 Flat, 4 Custom.
$script:AmbientModeNames = @{ '0' = 'Skybox'; '1' = 'Trilight'; '3' = 'Flat'; '4' = 'Custom' }

# Trilight is the only mode that actually consumes the three colours r722 sets;
# in any other mode those colours are decorative and the ambient probe is
# whatever the renderer happened to generate (usually nothing).
$script:AmbientRequiredMode = 1

# RenderSettings is the leading document in a Unity scene, so the ambient block
# is in the head. Reading 400 lines instead of 80 MB keeps the tick cheap
# (CitySim_CityV1.unity alone is 80 MB) and makes a moved block a WARN, not a
# silent pass.
$script:AmbientHeadLines = 400

$script:AmbientDefaultScene = 'City3D\Assets\Scenes\CityRebuild_R2.unity'

function Get-AmbientModeName
{
    param([string]$ModeText)
    if ($script:AmbientModeNames.ContainsKey($ModeText)) {
        return [string]$script:AmbientModeNames[$ModeText]
    }
    return ('mode ' + $ModeText)
}

# Pull {r: .., g: .., b: ..} off one key line. Returns $null when absent so the
# caller can tell "key missing" from "colour is zero".
function ConvertFrom-AmbientColorLine
{
    param([string]$Line, [string]$Key)
    if ($null -eq $Line) { return $null }
    $m = [regex]::Match($Line, '^\s*' + [regex]::Escape($Key) +
        ':\s*\{\s*r:\s*([-\d.eE+]+),\s*g:\s*([-\d.eE+]+),\s*b:\s*([-\d.eE+]+)')
    if (-not $m.Success) { return $null }
    $inv = [Globalization.CultureInfo]::InvariantCulture
    return [ordered]@{
        r = [double]::Parse($m.Groups[1].Value, $inv)
        g = [double]::Parse($m.Groups[2].Value, $inv)
        b = [double]::Parse($m.Groups[3].Value, $inv)
    }
}

function Format-AmbientColor
{
    param($Color)
    if ($null -eq $Color) { return 'none' }
    $inv = [Globalization.CultureInfo]::InvariantCulture
    return (('{0:0.00},{1:0.00},{2:0.00}') -f
        [Math]::Round($Color.r, 2), [Math]::Round($Color.g, 2), [Math]::Round($Color.b, 2))
}

# Pure text -> verdict. No file IO, so tests can pin the parsing without a scene.
function ConvertFrom-AmbientSceneText
{
    param([string]$Text, [int]$ExitCode = 0, [string]$Source = '')

    if ($null -eq $Text) { $Text = '' }
    $r = [ordered]@{
        ran = $false
        parsed = $false
        source = $Source
        mode = -1
        mode_text = ''
        mode_name = ''
        mode_line = 0
        sky = $null
        equator = $null
        ground = $null
        sky_text = 'none'
        equator_text = 'none'
        ground_text = 'none'
        intensity = -1.0
        intensity_text = ''
        colors_zero = $false
        healthy = $false
        verdict = 'UNKNOWN'
        reason = ''
        exit_code = $ExitCode
    }

    $lines = $Text -split "`n"
    $modeLine = ''
    $intLine = ''
    $skyLine = ''
    $eqLine = ''
    $grdLine = ''
    for ($i = 0; $i -lt $lines.Count; $i++) {
        $ln = $lines[$i]
        if ($null -eq $ln) { continue }
        if ($modeLine -eq '' -and $ln -match '^\s*m_AmbientMode:\s*(-?\d+)') {
            $modeLine = $Matches[1]; $r.mode_line = $i + 1
        } elseif ($intLine -eq '' -and $ln -match '^\s*m_AmbientIntensity:\s*([-\d.eE+]+)\s*$') {
            $intLine = $Matches[1]
        } elseif ($skyLine -eq '' -and $ln -match '^\s*m_AmbientSkyColor') {
            $skyLine = $ln
        } elseif ($eqLine -eq '' -and $ln -match '^\s*m_AmbientEquatorColor') {
            $eqLine = $ln
        } elseif ($grdLine -eq '' -and $ln -match '^\s*m_AmbientGroundColor') {
            $grdLine = $ln
        }
    }

    if ($modeLine -eq '') {
        $r.reason = 'no m_AmbientMode in the first ' + $script:AmbientHeadLines + ' lines'
        return $r
    }

    $inv = [Globalization.CultureInfo]::InvariantCulture
    $r.parsed = $true
    $r.mode = [int]$modeLine
    $r.mode_text = [string]$modeLine
    $r.mode_name = Get-AmbientModeName $modeLine
    if ($intLine -ne '') {
        try { $r.intensity = [double]::Parse($intLine, $inv) } catch { $r.intensity = -1.0 }
        $r.intensity_text = $intLine
    }
    $r.sky = ConvertFrom-AmbientColorLine -Line $skyLine -Key 'm_AmbientSkyColor'
    $r.equator = ConvertFrom-AmbientColorLine -Line $eqLine -Key 'm_AmbientEquatorColor'
    $r.ground = ConvertFrom-AmbientColorLine -Line $grdLine -Key 'm_AmbientGroundColor'
    $r.sky_text = Format-AmbientColor $r.sky
    $r.equator_text = Format-AmbientColor $r.equator
    $r.ground_text = Format-AmbientColor $r.ground

    # "Zero" means every channel of all three colours is exactly 0 - a single
    # non-zero channel is a real (if dim) baseline and must not be red-flagged.
    $r.colors_zero = $true
    foreach ($c in @($r.sky, $r.equator, $r.ground)) {
        if ($null -ne $c -and (($c.r -ne 0) -or ($c.g -ne 0) -or ($c.b -ne 0))) {
            $r.colors_zero = $false
        }
    }

    if ($r.mode -ne $script:AmbientRequiredMode) {
        $r.verdict = 'BAD_MODE'
        $r.reason = 'ambient mode is ' + $r.mode_name + ' (line ' + $r.mode_line + '); the three colours are unused until it is Trilight'
    } elseif ($r.colors_zero) {
        $r.verdict = 'ZERO_COLORS'
        $r.reason = 'all three ambient colours are zero (line ' + $r.mode_line + ' RenderSettings block)'
    } elseif ($r.intensity -le 0) {
        $r.verdict = 'ZERO_INTENSITY'
        $r.reason = 'ambient intensity is ' + $r.intensity_text + ', so the colours contribute nothing'
    } else {
        $r.verdict = 'OK'
        $r.healthy = $true
    }
    $r.ran = $true
    return $r
}

function Test-AmbientHealthy
{
    param($Verdict)
    if ($null -eq $Verdict) { return $false }
    if (-not $Verdict.ran) { return $false }
    return [bool]$Verdict.healthy
}

# One-line shape the tick and the tests both key on. Kept stable on purpose.
function Format-AmbientLine
{
    param($Verdict)
    if ($null -eq $Verdict) { return 'ambient: no verdict' }
    $parts = @('ambient:')
    if (-not $Verdict.ran) { $parts += 'not-read'; $parts += ('reason=' + $Verdict.reason); return ($parts -join ' ') }
    if ($Verdict.parsed) {
        $parts += ('mode=' + $Verdict.mode_name)
        $parts += ('sky=' + $Verdict.sky_text)
        $parts += ('equator=' + $Verdict.equator_text)
        $parts += ('ground=' + $Verdict.ground_text)
        $parts += ('intensity=' + $Verdict.intensity_text)
    } else {
        $parts += ('reason=' + ($Verdict.reason -replace ' ', '-'))
    }
    if ($Verdict.source) { $parts += ('scene=' + (Split-Path -Leaf $Verdict.source)) }
    return ($parts -join ' ')
}

# Read the scene head and parse it. Fail-soft: every failure path returns a
# verdict object so the caller can WARN instead of dying.
function Get-AmbientVerdict
{
    param(
        [string]$Root = '',
        [string]$Scene = '',
        [int]$HeadLines = 0
    )

    if ([string]::IsNullOrEmpty($Root)) {
        $Root = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
    }
    if ([string]::IsNullOrEmpty($Scene)) { $Scene = Join-Path $Root $script:AmbientDefaultScene }
    if ($HeadLines -le 0) { $HeadLines = $script:AmbientHeadLines }

    if (-not (Test-Path -LiteralPath $Scene)) {
        $miss = ConvertFrom-AmbientSceneText -Text '' -ExitCode -2 -Source $Scene
        $miss.reason = 'scene missing'
        return $miss
    }

    $text = ''
    try {
        $text = (Get-Content -LiteralPath $Scene -TotalCount $HeadLines -Encoding UTF8) -join "`n"
    } catch {
        $bad = ConvertFrom-AmbientSceneText -Text '' -ExitCode -3 -Source $Scene
        $bad.reason = 'scene unreadable: ' + $_.Exception.Message
        return $bad
    }

    $v = ConvertFrom-AmbientSceneText -Text $text -Source $Scene
    return $v
}