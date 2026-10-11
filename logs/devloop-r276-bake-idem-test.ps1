# r276 bake idempotency spot-check (tech#2 claim): 3 pure-local-input bakers
# Law: same inputs -> byte-identical PNG (r97/r140 GDI+ paradigm, re-bake SHA gate)
# ASCII-only per mandate hard-constraint 3. Evidence: logs/devloop-r276-bake-idem.json
$ErrorActionPreference = 'Stop'
$repo = Split-Path $PSScriptRoot -Parent   # logs\ -> repo root
$cityTools = Join-Path $repo 'Tools\city'

function Hash-File($p) {
    if (-not (Test-Path $p)) { return 'MISSING' }
    $sha = [System.Security.Cryptography.SHA256]::Create()
    try {
        $fs = [System.IO.File]::OpenRead($p)
        try { $bytes = $sha.ComputeHash($fs) } finally { $fs.Close() }
    } finally { $sha.Dispose() }
    return ([BitConverter]::ToString($bytes) -replace '-', '')
}

# baker -> output files under repo
$bakers = @(
    @{ name = 'bake-being-glow';     script = 'bake-being-glow.ps1';
       outs = @('City\Assets\ArtPacks\residents-atlas\being-glow.png') },
    @{ name = 'bake-ground-shadows'; script = 'bake-ground-shadows.ps1';
       outs = @('City\Assets\ArtPacks\residents-crowd\shadows\shadow-res.png',
                'City\Assets\ArtPacks\residents-crowd\shadows\shadow-res32.png',
                'City\Assets\ArtPacks\tophat-robot\shadows\shadow-bot.png') },
    @{ name = 'bake-banner-text';    script = 'bake-banner-text.ps1';
       outs = @('City\BannerData\interior-banner-text.png') }
)

$pass = 0; $fail = 0
$evidence = @()
foreach ($b in $bakers) {
    $scriptPath = Join-Path $cityTools $b.script
    $ev = @{ baker = $b.name; checks = @() }
    $pre = @{}
    foreach ($rel in $b.outs) { $pre[$rel] = Hash-File (Join-Path $repo $rel) }

    # run 1
    $out1 = & powershell -NoProfile -ExecutionPolicy Bypass -File $scriptPath 2>&1
    $exit1 = $LASTEXITCODE
    $run1 = @{}
    foreach ($rel in $b.outs) { $run1[$rel] = Hash-File (Join-Path $repo $rel) }

    # run 2
    $out2 = & powershell -NoProfile -ExecutionPolicy Bypass -File $scriptPath 2>&1
    $exit2 = $LASTEXITCODE
    $run2 = @{}
    foreach ($rel in $b.outs) { $run2[$rel] = Hash-File (Join-Path $repo $rel) }

    foreach ($rel in $b.outs) {
        $label = Split-Path $rel -Leaf
        $c1 = 'reproduce-pre';   $ok1 = ($pre[$rel] -eq $run1[$rel]) -and ($pre[$rel] -ne 'MISSING')
        $c2 = 'idem-run1-run2';  $ok2 = ($run1[$rel] -eq $run2[$rel])
        foreach ($pair in @(@($c1, $ok1), @($c2, $ok2))) {
            $ev.checks += @{ file = $label; check = $pair[0]; ok = $pair[1] }
            if ($pair[1]) { $pass++ } else { $fail++ }
        }
    }
    foreach ($pair in @(@('exit-run1', ($exit1 -eq 0)), @('exit-run2', ($exit2 -eq 0)))) {
        $ev.checks += @{ file = $b.name; check = $pair[0]; ok = $pair[1] }
        if ($pair[1]) { $pass++ } else { $fail++ }
    }
    $ev.exit1 = $exit1; $ev.exit2 = $exit2
    $ev.lastline1 = (@($out1) | Where-Object { $_ -is [string] } | Select-Object -Last 1)
    $evidence += $ev
}

# final gate: touched paths leave the tree byte-clean (no drift vs HEAD)
$gitExe = 'C:\Program Files\Git\cmd\git.exe'
& $gitExe -C $repo status --porcelain -- 'City/Assets/ArtPacks/residents-atlas' 'City/Assets/ArtPacks/residents-crowd/shadows' 'City/Assets/ArtPacks/tophat-robot/shadows' 'City/BannerData' | Out-Null
$treeDirty = (& $gitExe -C $repo status --porcelain -- 'City/Assets/ArtPacks/residents-atlas' 'City/Assets/ArtPacks/residents-crowd/shadows' 'City/Assets/ArtPacks/tophat-robot/shadows' 'City/BannerData')
$treeOk = $null -eq $treeDirty -or @($treeDirty).Count -eq 0
if ($treeOk) { $pass++ } else { $fail++ }
$evidence += @{ baker = 'tree-clean-gate'; checks = @(); tree_dirty = (@($treeDirty) -join ';') ; ok = $treeOk }

$payload = @{ round = 'r276'; pass = $pass; fail = $fail; tree_clean = $treeOk; bakers = $evidence }
$json = $payload | ConvertTo-Json -Depth 5
$outJson = Join-Path $PSScriptRoot 'devloop-r276-bake-idem.json'
[System.IO.File]::WriteAllText($outJson, $json, (New-Object System.Text.UTF8Encoding($false)))

Write-Output ("PASS=$pass FAIL=$fail TREE_CLEAN=$treeOk")
if ($fail -gt 0) { exit 2 } else { exit 0 }
