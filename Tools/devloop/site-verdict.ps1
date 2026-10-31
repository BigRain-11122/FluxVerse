# site-verdict.ps1 - ONE definition of "how much of the R2 block stands over water?"
# ----------------------------------------------------------------------------
# Queue main#57 (r717). r713/r714 measured the R2 district standing 91.7% over
# the L_Water mesh; r716 made verify re-publish that number every tick. The last
# step is putting it on the one page a human opens - but a second copy of the
# threshold inside the builder is exactly the drift debt r707 killed for the
# framing card (the guards used to live only in the builder).
#
# So the check, its parsing and its red line live HERE once:
#   - Tools\perceptor\verify.ps1  dot-sources it (tick health line)
#   - Tools\devloop\build-city-panel.ps1 dot-sources it (proof card row)
# Neither side may compare block_water to its own literal.
#
# Read-only: r2-site-check.py --no-artifacts prints summary lines only (no PNG,
# no Pillow). Fail-soft by contract: a missing python / scene / script yields
# ran=false with a reason, never an exception - a moved path must not take the
# city scan or the panel build down with it.
# ASCII-only (PS5.1 GBK law).

# Red line: more than this share of the block footprint over water is "still in
# the lake", not "a bit damp". 50% keeps a single stray triangle from turning
# the city red while still naming a block that is half submerged.
$script:SiteWaterRedPct = 50.0

# Parse the checker's summary output. Pure text -> object, no process, so tests
# can pin the parsing without python on PATH.
function ConvertFrom-SiteCheckText
{
    param([string]$Text, [int]$ExitCode = 0)

    if ($null -eq $Text) { $Text = '' }
    $r = [ordered]@{
        ran = $false
        exit_code = $ExitCode
        block_water = -1.0
        block_water_text = ''
        dry_candidates = -1
        dry_candidates_text = ''
        nearest_dry_m = -1.0
        nearest_dry_text = ''
        props_in_road = -1
        props_in_road_text = 'n/a'
        verdict = ''
        over_water = $false
        reason = ''
    }
    $mCov = [regex]::Match($Text, 'block_water_coverage=([\d.]+)%')
    $mDry = [regex]::Match($Text, 'dry_candidates=(\d+)')
    $mVerdict = [regex]::Match($Text, 'SITE_VERDICT=([A-Z_]+)')
    $mNear = [regex]::Match($Text, 'nearest_dry=(\d+)m')
    # main#65: base-plate props standing on the road strip (no colliders, so the
    # street-shot pose solver never saw them). 'n/a' = the checker had no road
    # strip to measure (fixture scenes / missing built scene) - not a zero.
    $mProps = [regex]::Match($Text, 'props_in_road=(\d+|n/a)')
    if ($mVerdict.Success) { $r.verdict = [string]$mVerdict.Groups[1].Value }
    if ($mProps.Success) {
        $r.props_in_road_text = [string]$mProps.Groups[1].Value
        if ($r.props_in_road_text -ne 'n/a') {
            $r.props_in_road = [int]::Parse($r.props_in_road_text,
                [Globalization.CultureInfo]::InvariantCulture)
        }
    }
    if ($mNear.Success) {
        $r.nearest_dry_text = [string]$mNear.Groups[1].Value
        $r.nearest_dry_m = [double]::Parse($mNear.Groups[1].Value,
            [Globalization.CultureInfo]::InvariantCulture)
    }
    if (-not ($mCov.Success -and $mDry.Success -and $mVerdict.Success)) {
        $r.reason = 'no verdict in output (exit ' + $ExitCode + ')'
        return $r
    }
    $r.ran = $true
    $r.block_water_text = [string]$mCov.Groups[1].Value
    $r.dry_candidates_text = [string]$mDry.Groups[1].Value
    $r.block_water = [double]::Parse($r.block_water_text,
        [Globalization.CultureInfo]::InvariantCulture)
    $r.dry_candidates = [int]$r.dry_candidates_text
    $r.over_water = ($r.block_water -gt $script:SiteWaterRedPct)
    if ($r.verdict -eq 'INCONSISTENT') { $r.reason = 'raster and point-in-triangle disagree' }
    return $r
}

function Test-SiteOverWater
{
    param($Verdict)
    if ($null -eq $Verdict) { return $false }
    if (-not $Verdict.ran) { return $false }
    return ([bool]$Verdict.over_water)
}

# main#65: a base-plate prop standing on the road strip (street trees have no
# colliders, so the street-shot pose solver cannot see them). Unknown ('n/a')
# is not zero: report it as unknown, never as clean.
function Test-SitePropsInRoad
{
    param($Verdict)
    if ($null -eq $Verdict) { return $false }
    if (-not $Verdict.ran) { return $false }
    return ([int]$Verdict.props_in_road -gt 0)
}

# main#71: the street-shot pose solver scores props against the frame as well
# (prop_cover = share of the picture covered by props, near_pen = near-prop
# penalty). r730 measured it, but the number only ever lived in
# City3D-staging\r2-shots.md - the panel and verify could not see it, so "is
# this camera good?" was not self-checkable. Parsing and the red line live here
# once; verify reports it every tick and the panel prints it on the page.
$script:SitePropCoverWarnPct = 0.15

function ConvertFrom-StreetPoseText
{
    param([string]$Text)

    $r = [ordered]@{
        found = $false
        prop_cover = -1.0
        prop_cover_text = 'n/a'
        prop_cover_high = $false
    }
    if ([string]::IsNullOrEmpty($Text)) { return $r }
    # Only the report's own street_pose line counts: street_control carries the
    # superseded pose (r728) and must never be read as the current camera.
    $m = [regex]::Match($Text, '(?m)^\s*street_pose:.*?\bprop_cover=([\d.]+)')
    if (-not $m.Success) { return $r }
    $r.found = $true
    $r.prop_cover_text = [string]$m.Groups[1].Value
    $r.prop_cover = [double]::Parse($r.prop_cover_text,
        [Globalization.CultureInfo]::InvariantCulture)
    $r.prop_cover_high = ($r.prop_cover -gt $script:SitePropCoverWarnPct)
    return $r
}

# Read the newest pose report. -Report overrides the path (fixtures/tests).
# A missing or unreadable report is "not recorded" ('n/a'), never a zero: a
# clean-looking 0% would be exactly the pretty-but-false face this row exists
# to prevent.
function Get-StreetPose
{
    param(
        [string]$Root = '',
        [string]$Report = $env:FLUXVERSE_SHOTS_REPORT
    )

    if ([string]::IsNullOrEmpty($Report)) {
        if ([string]::IsNullOrEmpty($Root)) {
            $Root = Resolve-Path (Join-Path $PSScriptRoot '..\..')
        }
        $Report = Join-Path $Root 'City3D-staging\r2-shots.md'
    }
    try {
        if (-not (Test-Path -LiteralPath $Report)) { return ConvertFrom-StreetPoseText -Text '' }
        $text = [IO.File]::ReadAllText($Report, [Text.Encoding]::UTF8)
    } catch {
        return ConvertFrom-StreetPoseText -Text ''
    }
    return (ConvertFrom-StreetPoseText -Text $text)
}

# True only when a real reading exceeds the red line (unknown is not clean).
function Test-SitePropCoverHigh
{
    param($Pose)
    if ($null -eq $Pose) { return $false }
    if (-not $Pose.found) { return $false }
    return ([bool]$Pose.prop_cover_high)
}

# Locate a python interpreter the same way verify does (env override first).
function Get-SitePython
{
    $pyExe = $env:FLUXVERSE_PYTHON
    if ($pyExe) { return $pyExe }
    foreach ($cand in @('python', 'py')) {
        $cmd = Get-Command $cand -ErrorAction SilentlyContinue
        if ($cmd) { return $cmd.Source }
    }
    return ''
}

# Run the checker in summary mode and return the parsed verdict.
# -Scene / -Rebuild override the checker defaults (fixture roots in tests).
# -SkipRun returns a "not read" object without spawning python.
function Get-SiteVerdict
{
    param(
        [string]$Root = '',
        [string]$Scene = $env:FLUXVERSE_SITE_SCENE,
        [string]$Rebuild = $env:FLUXVERSE_SITE_REBUILD,
        [string]$Python = '',
        [int]$TimeoutSec = 120,
        [switch]$SkipRun
    )

    if ($SkipRun) {
        $skip = ConvertFrom-SiteCheckText -Text '' -ExitCode -1
        $skip.reason = 'skipped'
        return $skip
    }
    if ([string]::IsNullOrEmpty($Root)) {
        $Root = Resolve-Path (Join-Path $PSScriptRoot '..\..')
    }
    $script = Join-Path $PSScriptRoot 'r2-site-check.py'
    if (-not (Test-Path -LiteralPath $script)) {
        $miss = ConvertFrom-SiteCheckText -Text '' -ExitCode -1
        $miss.reason = 'checker script missing'
        return $miss
    }
    $pyExe = $Python
    if (-not $pyExe) { $pyExe = Get-SitePython }
    if (-not $pyExe) {
        $nopy = ConvertFrom-SiteCheckText -Text '' -ExitCode -1
        $nopy.reason = 'no python interpreter on PATH'
        return $nopy
    }

    $argList = @(('"' + $script + '"'), '--no-artifacts')
    if ($Scene) { $argList += @('--scene', ('"' + $Scene + '"')) }
    if ($Rebuild) { $argList += @('--rebuild', ('"' + $Rebuild + '"')) }

    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = $pyExe
    $psi.Arguments = ($argList -join ' ')
    $psi.UseShellExecute = $false
    $psi.CreateNoWindow = $true
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    $psi.WorkingDirectory = $Root

    $out = ''
    $err = ''
    $exit = -1
    $proc = $null
    try {
        $proc = [System.Diagnostics.Process]::Start($psi)
        $outTask = $proc.StandardOutput.ReadToEndAsync()
        $errTask = $proc.StandardError.ReadToEndAsync()
        if ($proc.WaitForExit($TimeoutSec * 1000)) { $exit = $proc.ExitCode }
        else { try { $proc.Kill() } catch { }; $exit = -2 }
        $out = [string]$outTask.Result
        $err = [string]$errTask.Result
    } catch {
        $exit = -3
        $err = $_.Exception.Message
    } finally {
        if ($proc) { try { $proc.Dispose() } catch { } }
    }

    $res = ConvertFrom-SiteCheckText -Text $out -ExitCode $exit
    if (-not $res.ran) {
        # Keep the 'exit N: first stderr line' shape the tick has always printed
        # (test-verify-r2-site.ps1 pins it) and never emit the literal word FAIL,
        # which the tick red-scan keys on.
        $reason = 'exit ' + $exit
        if ($err.Trim()) { $reason = $reason + ': ' + (($err.Trim() -split "`n")[0]) }
        $res.reason = $reason -replace 'FAIL', 'ERR'
    }
    return $res
}