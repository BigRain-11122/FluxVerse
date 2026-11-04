# suite-registry-census.ps1 - does every sandbox in the tree get RUN by a family?
# ------------------------------------------------------------------------------
# Queue main#139 (r831). The recurring disease on this repo is "written, then
# nobody runs it": r786 found a red suite under a red ticket, r790 found
# test-run-ps-suites.ps1 outside every list, r795/r796 the same, and r831 found
# test-verify-residents.ps1 sitting in write3's GUARDED source list (so editing
# it re-ran the family) while the family's -Suites string never asked for it (so
# it never ran). Two halves of one registry - the guard and the spawn - and
# nothing compared them.
#
# This census asks the only question that matters: for each Tools/devloop/test-
# *.ps1 on disk, which family's spawn list names it? The registry is read as
# TEXT (the -Suites literals in ps-suites-tick.ps1) plus the verify family's
# defaults, which it derives its spawn list from.
#
# Four readings, each with its own meaning:
#   spawned       on disk AND named by a family's spawn list
#   unspawned     on disk and named by nobody, not even an exemption
#   guarded_only  in a family's guarded sources but NOT spawned (r831's bug)
#   stale_exempt  an exemption that stopped meaning anything (the file is gone,
#                 or the suite is spawned now) - delete it (r800 lesson: an
#                 allowlist nobody re-reads becomes a permanent pass)
#
# Two shapes: dot-sourced it only defines Get-SuiteRegistryReading (the gate
# calls it in process - verify.ps1 may not spawn a shell, r750); run as a file
# it prints the summary line and exits.
# Read-only, no state file, no child process. ASCII-only law.
#
# NOTE: the param block exists for the CLI form. Dot-sourcing this file (as
# verify.ps1 does) assigns these five names in the caller's scope, so the names
# are deliberately not ones the gate uses for anything else.
param(
    [string]$RepoDir = '',
    [string]$RegistryPath = '',
    [string[]]$ExemptNames = @(),
    [switch]$FailOnUnregistered,
    [switch]$List
)

# Exemptions: suites that are known not to be spawned yet, each with the date by
# which that has to change and the cost that makes registering them a family
# shape decision instead of a one-line edit.
$script:SuiteRegistryExempt = @(
    [pscustomobject]@{ Name = 'test-archive-logs.ps1'; Due = '2026-11-19'; Ms = 2559; Note = 'log archive tool sandbox; overlaps test-log-archive-duty.ps1, keep-or-retire undecided' },
    [pscustomobject]@{ Name = 'test-city-duty.ps1'; Due = '2026-11-19'; Ms = 19726; Note = 'panel duty card (42 assertions); heavy, needs a 4th write family' },
    [pscustomobject]@{ Name = 'test-city-shot-census.ps1'; Due = '2026-11-19'; Ms = 25608; Note = 'shot census shape gate (44 assertions); heavy, needs a 4th write family' },
    [pscustomobject]@{ Name = 'test-city-shot-shape.ps1'; Due = '2026-11-19'; Ms = 2190; Note = 'shot shape helpers (11 assertions); light, fits a family as is' },
    [pscustomobject]@{ Name = 'test-panel-bare-artifact.ps1'; Due = '2026-11-19'; Ms = 4999; Note = 'pre-r746 bare-name check; test-write-status-face-bare.ps1 may already supersede it' }
)

function Get-SuiteRegistryReading
{
    param(
        [string]$RepoDir = '',
        [string]$RegistryPath = '',
        [string[]]$ExemptNames = @()
    )
    $res = [pscustomobject]@{
        ok = $false
        error = ''
        files = 0
        spawned = 0
        exempt = 0
        stale = @()
        guarded_only = @()
        unspawned = @()
        names = @()
        line = ''
    }
    if ([string]::IsNullOrWhiteSpace($RepoDir)) { $RepoDir = Split-Path -Parent (Split-Path -Parent $PSScriptRoot) }
    if (-not (Test-Path -LiteralPath $RepoDir)) { $res.error = 'repo not found: ' + $RepoDir; return $res }
    $suiteDir = Join-Path $RepoDir 'Tools\devloop'
    if (-not (Test-Path -LiteralPath $suiteDir)) { $res.error = 'suite dir not found: ' + $suiteDir; return $res }
    if ([string]::IsNullOrWhiteSpace($RegistryPath)) { $RegistryPath = Join-Path $suiteDir 'ps-suites-tick.ps1' }
    # Never report 0 of anything when the registry itself is unreadable: a
    # missing registry is a broken measurement, not a clean tree.
    if (-not (Test-Path -LiteralPath $RegistryPath)) { $res.error = 'registry not found: ' + $RegistryPath; return $res }

    $exempt = @($script:SuiteRegistryExempt)
    if ($ExemptNames.Count -gt 0) {
        $exempt = @($ExemptNames | ForEach-Object {
            [pscustomobject]@{ Name = $_; Due = ''; Ms = 0; Note = 'fixture exemption' }
        })
    }

    $onDisk = @(Get-ChildItem -LiteralPath $suiteDir -Filter 'test-*.ps1' -File | ForEach-Object { $_.Name })

    $regText = ''
    try { $regText = [System.IO.File]::ReadAllText($RegistryPath, [System.Text.Encoding]::UTF8) } catch {
        $res.error = 'registry unreadable: ' + $RegistryPath
        return $res
    }
    # The -Suites literals are the only thing that decides what a family
    # actually spawns, so they are the registry. Everything else is a claim.
    $spawnSet = @{}
    foreach ($m in [regex]::Matches($regText, "-Suites',\s*'([^']+)'")) {
        foreach ($tok in ($m.Groups[1].Value -split ',')) {
            $t = $tok.Trim()
            if ($t -match '[\\/]') { $t = ($t -split '[\\/]')[-1] }
            if ($t -match '\.ps1$') { $spawnSet[$t.ToLowerInvariant()] = $true }
        }
    }

    $isLiveRegistry = ($RegistryPath -eq (Join-Path $suiteDir 'ps-suites-tick.ps1'))
    if ($isLiveRegistry) {
        # The verify family derives its spawn list from its guarded sources, so
        # a test-*.ps1 there really is spawned. Read that shape too (dot-source
        # the module: it only defines functions).
        try {
            . $RegistryPath
            $vDefs = @(Get-PsSuitesTickDefaults -Family verify)
            foreach ($p in $vDefs) {
                $leaf = $p
                if ($leaf -match '[\\/]') { $leaf = ($leaf -split '[\\/]')[-1] }
                if ($leaf -match '^test-.*\.ps1$') {
                    $spawnSet[$leaf.ToLowerInvariant()] = $true
                }
            }
        } catch {
            $res.error = 'verify defaults unreadable: ' + $_.Exception.Message
            return $res
        }
    }

    $exemptSet = @{}
    foreach ($e in $exempt) { $exemptSet[$e.Name.ToLowerInvariant()] = $e }

    $spawned = 0
    $unspawned = @()
    $names = @()
    foreach ($n in $onDisk) {
        $k = $n.ToLowerInvariant()
        $isSpawned = $spawnSet.ContainsKey($k)
        $isExempt = $exemptSet.ContainsKey($k)
        $names += [pscustomobject]@{ Name = $n; Status = $(if ($isSpawned) { 'spawned' } elseif ($isExempt) { 'exempt' } else { 'UNSPAWNED' }) }
        if ($isSpawned) { $spawned++ }
        elseif (-not $isExempt) { $unspawned += $n }
    }
    # An exemption that names nothing (file gone) or names a suite that is now
    # spawned has stopped carrying information.
    $stale = @()
    foreach ($e in $exempt) {
        $exists = ($onDisk -contains $e.Name)
        if (-not $exists -or $spawnSet.ContainsKey($e.Name.ToLowerInvariant())) { $stale += $e.Name }
    }

    # Guarded-but-unspawned: read every family's defaults, keep the test-*.ps1
    # ones that no spawn list asks for. This is exactly the r828 shape.
    $guardedOnly = @()
    if ($isLiveRegistry) {
        foreach ($fam in @('write', 'write2', 'write3', 'verify2')) {
            try { $defs = @(Get-PsSuitesTickDefaults -Family $fam) } catch { $defs = @() }
            foreach ($p in $defs) {
                $leaf = $p
                if ($leaf -match '[\\/]') { $leaf = ($leaf -split '[\\/]')[-1] }
                if ($leaf -notmatch '^test-.*\.ps1$') { continue }
                if (-not $spawnSet.ContainsKey($leaf.ToLowerInvariant())) { $guardedOnly += ($fam + ':' + $leaf) }
            }
        }
    }

    $line = 'suite-registry: files=' + $onDisk.Count + ' spawned=' + $spawned +
        ' exempt=' + $exempt.Count + ' unspawned=' + $unspawned.Count +
        ' stale_exempt=' + $stale.Count + ' guarded_only=' + $guardedOnly.Count
    if ($unspawned.Count -gt 0) { $line = $line + ' :: ' + ($unspawned -join ', ') }
    if ($guardedOnly.Count -gt 0) { $line = $line + ' :: guarded-only: ' + ($guardedOnly -join ', ') }
    if ($stale.Count -gt 0) { $line = $line + ' :: stale-exempt: ' + ($stale -join ', ') }

    $res.ok = $true
    $res.files = $onDisk.Count
    $res.spawned = $spawned
    $res.exempt = $exempt.Count
    $res.unspawned = $unspawned
    $res.stale = $stale
    $res.guarded_only = $guardedOnly
    $res.names = $names
    $res.line = $line
    return $res
}

# CLI entry: only when this file is run, not when it is dot-sourced by the gate.
if ($MyInvocation.InvocationName -ne '.') {
    $argv = @{}
    if (-not [string]::IsNullOrWhiteSpace($RepoDir)) { $argv['RepoDir'] = $RepoDir }
    if (-not [string]::IsNullOrWhiteSpace($RegistryPath)) { $argv['RegistryPath'] = $RegistryPath }
    if ($ExemptNames.Count -gt 0) { $argv['ExemptNames'] = $ExemptNames }
    $r = Get-SuiteRegistryReading @argv
    if (-not $r.ok) { Write-Output ('SUITE-REGISTRY: ' + $r.error); exit 1 }
    if ($List) {
        Write-Output 'name | status'
        foreach ($n in $r.names) { Write-Output ('  ' + $n.Name + ' | ' + $n.Status) }
    }
    Write-Output ('SUITE-REGISTRY: files=' + $r.files + ' spawned=' + $r.spawned +
        ' exempt=' + $r.exempt + ' unspawned=' + $r.unspawned.Count +
        ' stale_exempt=' + $r.stale.Count + ' guarded_only=' + $r.guarded_only.Count +
        $(if ($r.unspawned.Count -gt 0) { ' :: ' + ($r.unspawned -join ', ') } else { '' }) +
        $(if ($r.guarded_only.Count -gt 0) { ' :: guarded-only: ' + ($r.guarded_only -join ', ') } else { '' }) +
        $(if ($r.stale.Count -gt 0) { ' :: stale-exempt: ' + ($r.stale -join ', ') } else { '' }))
    if ($FailOnUnregistered -and $r.unspawned.Count -gt 0) { exit 2 }
    exit 0
}