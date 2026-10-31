# test-state-promote.ps1 - sandbox proof for Tools/devloop/state-promote.ps1
# (queue main#93).
# ---------------------------------------------------------------------------
# The r751 fix (Test-Path guard around Move-Item) was correct but unproven: the
# loser side of the promotion race showed up exactly once in the field, and
# reproducing it used to require writing into the production world/ directory.
# This sandbox drives every branch in process against temp dirs:
#   - nothing to promote                      -> no-candidate, disk untouched
#   - healthy candidate                       -> promoted, .new gone
#   - candidate over an older state           -> promoted (overwrite, not merge)
#   - move throws AND source vanished         -> lost-race, NOT a red
#   - move throws AND source still there      -> failed (+ path), source kept
#   - real move that really cannot happen     -> failed (exclusive lock)
#   - FAIL side: candidate discarded once, second discard reports false
#   - the gate itself: wired to the module, no private Move-Item left behind
# ASCII-only law: no CJK in this file.

$ErrorActionPreference = 'Stop'
$mod = Join-Path $PSScriptRoot 'state-promote.ps1'
if (-not (Test-Path -LiteralPath $mod)) { Write-Output 'setup FAIL: state-promote.ps1 missing'; exit 1 }
. $mod

$pass = 0
$fail = 0
function Check([string]$name, [bool]$cond) {
    if ($cond) { Write-Output ('  PASS ' + $name); $script:pass++ }
    else { Write-Output ('  FAIL ' + $name); $script:fail++ }
}

$utf8 = New-Object System.Text.UTF8Encoding($false)
$sandbox = Join-Path ([System.IO.Path]::GetTempPath()) ('fv-statepromote-' + $PID)

function New-Root([string]$tag) {
    $d = Join-Path $sandbox $tag
    New-Item -ItemType Directory -Path $d -Force | Out-Null
    return $d
}

# ---------- a. nothing to promote ----------
$r = New-Root 'a'
$stateFile = Join-Path $r 'world-state.json'
$newFile = Join-Path $r 'world-state.json.new'
[System.IO.File]::WriteAllText($stateFile, '{"protocol":"fluxverse/1","gen":"old"}', $utf8)
$before = [System.IO.File]::ReadAllText($stateFile, $utf8)
$res = Invoke-StatePromotion -NewPath $newFile -StatePath $stateFile
Check 'a1 no candidate -> status no-candidate' ($res.Status -eq 'no-candidate')
Check 'a2 no candidate -> state untouched' ([System.IO.File]::ReadAllText($stateFile, $utf8) -eq $before)

# ---------- b. healthy candidate ----------
$r = New-Root 'b'
$stateFile = Join-Path $r 'world-state.json'
$newFile = Join-Path $r 'world-state.json.new'
[System.IO.File]::WriteAllText($stateFile, '{"gen":"old"}', $utf8)
[System.IO.File]::WriteAllText($newFile, '{"gen":"new"}', $utf8)
$res = Invoke-StatePromotion -NewPath $newFile -StatePath $stateFile
Check 'b1 healthy candidate -> promoted' ($res.Status -eq 'promoted')
Check 'b2 state now holds the candidate' ([System.IO.File]::ReadAllText($stateFile, $utf8) -eq '{"gen":"new"}')
Check 'b3 candidate file is gone' (-not (Test-Path -LiteralPath $newFile))

# ---------- c. candidate over an existing state (overwrite, not merge) ----------
$r = New-Root 'c'
$stateFile = Join-Path $r 'world-state.json'
$newFile = Join-Path $r 'world-state.json.new'
[System.IO.File]::WriteAllText($stateFile, '{"gen":"old","extra":"kept-only-if-merged"}', $utf8)
[System.IO.File]::WriteAllText($newFile, '{"gen":"new"}', $utf8)
$res = Invoke-StatePromotion -NewPath $newFile -StatePath $stateFile
Check 'c1 promote over old state -> promoted' ($res.Status -eq 'promoted')
Check 'c2 replacement is the candidate verbatim' ([System.IO.File]::ReadAllText($stateFile, $utf8) -eq '{"gen":"new"}')

# ---------- d. lost race: move throws, source already gone ----------
$r = New-Root 'd'
$stateFile = Join-Path $r 'world-state.json'
$newFile = Join-Path $r 'world-state.json.new'
[System.IO.File]::WriteAllText($stateFile, '{"gen":"old"}', $utf8)
[System.IO.File]::WriteAllText($newFile, '{"gen":"new"}', $utf8)
$loser = { param($src, $dst) Remove-Item -LiteralPath $src -Force; throw 'PathNotFound' }
$res = Invoke-StatePromotion -NewPath $newFile -StatePath $stateFile -MoveFile $loser
Check 'd1 vanished source -> lost-race (not failed)' ($res.Status -eq 'lost-race')
Check 'd2 lost race leaves the published state alone' ([System.IO.File]::ReadAllText($stateFile, $utf8) -eq '{"gen":"old"}')

# ---------- e. real failure: move throws, source still there ----------
$r = New-Root 'e'
$stateFile = Join-Path $r 'world-state.json'
$newFile = Join-Path $r 'world-state.json.new'
[System.IO.File]::WriteAllText($stateFile, '{"gen":"old"}', $utf8)
[System.IO.File]::WriteAllText($newFile, '{"gen":"new"}', $utf8)
$broken = { param($src, $dst) throw 'sharing violation' }
$res = Invoke-StatePromotion -NewPath $newFile -StatePath $stateFile -MoveFile $broken
Check 'e1 failed move with source present -> failed' ($res.Status -eq 'failed')
Check 'e2 failed result names the kept candidate' ($res.Detail -eq $newFile)
Check 'e3 real failure keeps the candidate' (Test-Path -LiteralPath $newFile)
Check 'e4 real failure keeps the old state' ([System.IO.File]::ReadAllText($stateFile, $utf8) -eq '{"gen":"old"}')

# ---------- f. a move that really cannot succeed (exclusive lock on target) ----------
$r = New-Root 'f'
$stateFile = Join-Path $r 'world-state.json'
$newFile = Join-Path $r 'world-state.json.new'
[System.IO.File]::WriteAllText($stateFile, '{"gen":"old"}', $utf8)
[System.IO.File]::WriteAllText($newFile, '{"gen":"new"}', $utf8)
$lock = [System.IO.File]::Open($stateFile, [System.IO.FileMode]::Open, [System.IO.FileAccess]::ReadWrite, [System.IO.FileShare]::None)
try {
    $res = Invoke-StatePromotion -NewPath $newFile -StatePath $stateFile
} finally {
    $lock.Dispose()
}
Check 'f1 locked destination -> failed (real filesystem, no seam)' ($res.Status -eq 'failed')
Check 'f2 locked destination keeps the candidate' (Test-Path -LiteralPath $newFile)

# ---------- g. FAIL side: candidate discarded exactly once ----------
$r = New-Root 'g'
$newFile = Join-Path $r 'world-state.json.new'
[System.IO.File]::WriteAllText($newFile, '{"gen":"rejected"}', $utf8)
$first = Clear-StateCandidate -NewPath $newFile
$second = Clear-StateCandidate -NewPath $newFile
Check 'g1 first discard removes the candidate' ($first -eq $true)
Check 'g2 candidate is gone after discard' (-not (Test-Path -LiteralPath $newFile))
Check 'g3 second discard reports false (nothing left)' ($second -eq $false)

# ---------- h. the gate is wired to the module ----------
$gatePath = Join-Path (Split-Path $PSScriptRoot -Parent) 'perceptor\verify.ps1'
$gate = [System.IO.File]::ReadAllText($gatePath, $utf8)
Check 'h1 gate dot-sources state-promote.ps1' ($gate -match 'state-promote\.ps1')
Check 'h2 gate calls Invoke-StatePromotion' ($gate -match 'Invoke-StatePromotion')
Check 'h3 gate calls Clear-StateCandidate on the FAIL side' ($gate -match 'Clear-StateCandidate')
Check 'h4 gate has no private Move-Item promotion left' (-not ($gate -match 'Move-Item'))
Check 'h5 gate treats failed as red' ($gate -match "Status -eq 'failed'")
Check 'h6 gate still exits 1 on a real promote failure' ($gate -match "state promote failed, candidate kept")
Check 'h7 gate fails loud when the module is missing' ($gate -match 'state-promote module missing')

# ---------- j/k. the GATE end to end (queue main#95) ----------
# Groups a..h prove the decision; groups j/k prove the gate that uses it, by
# running Tools/perceptor/verify.ps1 as a child with FLUXVERSE_WORLD_DIR
# pointed at a temp directory. Without the knob this file could only ever
# test-verify the live world/, which no sandbox may write.
$repoRootSandbox = Split-Path (Split-Path $gatePath -Parent) -Parent
$liveWorld = Join-Path $repoRootSandbox 'world'

# Minimal state that passes every field check (protocol/zones/fleet/tasks/
# flows/products/governance/history). Kept literal so the fixture cannot drift
# with the live file.
$validState = '{"protocol":"fluxverse/1","ts_utc":"2026-11-01T00:00:00Z",' +
    '"zones":[{"id":"gaming","name":"Gaming","status":"ok","activity":"idle"},' +
    '{"id":"quant","name":"Quant","status":"ok","activity":"idle"},' +
    '{"id":"media","name":"Media","status":"ok","activity":"idle"}],' +
    '"fleet":[],"tasks":[],"flows":[],"products":[],' +
    '"governance":{"ceo_orders_pending":0},' +
    '"history":{"commits_total":1,"last_commit_ts":"2026-11-01T00:00:00Z"}}'

function Get-LiveFingerprint {
    # Byte length + write time of the two files a misdirected run would touch.
    $fp = @{}
    foreach ($n in @('world-state.json', 'world-events.jsonl')) {
        $p = Join-Path $liveWorld $n
        if (Test-Path -LiteralPath $p) {
            $it = Get-Item -LiteralPath $p
            $fp[$n] = ('' + $it.Length + '@' + $it.LastWriteTimeUtc.Ticks)
        } else {
            $fp[$n] = 'MISSING'
        }
    }
    return $fp
}

function Invoke-Gate([string]$world) {
    $prevWorld = $env:FLUXVERSE_WORLD_DIR
    $prevChild = $env:FLUXVERSE_PS_SUITES_CHILD
    $env:FLUXVERSE_WORLD_DIR = $world
    # Nested-run law (r752): the gate's own sandbox families must not spawn
    # while a sandbox is driving the gate.
    $env:FLUXVERSE_PS_SUITES_CHILD = '1'
    try {
        $out = & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $gatePath 2>&1
        $code = $LASTEXITCODE
    } finally {
        if ($null -eq $prevWorld) { Remove-Item Env:\FLUXVERSE_WORLD_DIR -ErrorAction SilentlyContinue }
        else { $env:FLUXVERSE_WORLD_DIR = $prevWorld }
        if ($null -eq $prevChild) { Remove-Item Env:\FLUXVERSE_PS_SUITES_CHILD -ErrorAction SilentlyContinue }
        else { $env:FLUXVERSE_PS_SUITES_CHILD = $prevChild }
    }
    return [pscustomobject]@{ Code = $code; Out = @($out | ForEach-Object { [string]$_ }) }
}

$liveBefore = Get-LiveFingerprint

# j. PASS side: a healthy candidate is published by the gate itself.
$r = New-Root 'j'
$stateFile = Join-Path $r 'world-state.json'
$newFile = Join-Path $r 'world-state.json.new'
[System.IO.File]::WriteAllText($stateFile, '{"protocol":"fluxverse/1","gen":"old"}', $utf8)
[System.IO.File]::WriteAllText($newFile, $validState, $utf8)
$run = Invoke-Gate $r
Check 'j1 gate exits 0 on a healthy candidate' ($run.Code -eq 0)
Check 'j2 gate prints VERIFY PASS' (@($run.Out | Where-Object { $_ -match '^VERIFY PASS' }).Count -eq 1)
Check 'j3 gate promoted the candidate into world-state.json' ([System.IO.File]::ReadAllText($stateFile, $utf8) -eq $validState)
Check 'j4 gate consumed the .new candidate' (-not (Test-Path -LiteralPath $newFile))

# k. FAIL side: a broken candidate is rejected, the old state survives.
$r = New-Root 'k'
$stateFile = Join-Path $r 'world-state.json'
$newFile = Join-Path $r 'world-state.json.new'
[System.IO.File]::WriteAllText($stateFile, $validState, $utf8)
[System.IO.File]::WriteAllText($newFile, '{"protocol":"fluxverse/1","zones":[', $utf8)
$run = Invoke-Gate $r
Check 'k1 gate exits 1 on a broken candidate' ($run.Code -eq 1)
Check 'k2 gate names the failure' (@($run.Out | Where-Object { $_ -match '^VERIFY FAIL: state: not parseable JSON' }).Count -eq 1)
Check 'k3 gate says it discarded the candidate' (@($run.Out | Where-Object { $_ -match 'discarded, old world-state.json kept' }).Count -eq 1)
Check 'k4 gate discarded the .new candidate' (-not (Test-Path -LiteralPath $newFile))
Check 'k5 gate kept the old state verbatim' ([System.IO.File]::ReadAllText($stateFile, $utf8) -eq $validState)

# l. Neither run may touch the live world/ directory.
$liveAfter = Get-LiveFingerprint
Check 'l1 live world-state.json untouched by both gate runs' ($liveBefore['world-state.json'] -eq $liveAfter['world-state.json'])
Check 'l2 live world-events.jsonl untouched by both gate runs' ($liveBefore['world-events.jsonl'] -eq $liveAfter['world-events.jsonl'])

# m. The knob itself: injected when set, live dir when not.
Check 'm1 gate reads FLUXVERSE_WORLD_DIR' ($gate -match 'FLUXVERSE_WORLD_DIR')
Check 'm2 gate falls back to the live world dir when unset' ($gate -match "Join-Path \`$repoRoot 'world'")

# ---------- i. shape and hygiene ----------
$r = New-Root 'i'
$res = Invoke-StatePromotion -NewPath (Join-Path $r 'nope.new') -StatePath (Join-Path $r 'nope.json')
Check 'i1 result always carries a Status property' ($null -ne $res.PSObject.Properties['Status'])
Check 'i2 result always carries a Detail property' ($null -ne $res.PSObject.Properties['Detail'])
$modBytes = [System.IO.File]::ReadAllBytes($mod)
$nonAscii = @($modBytes | Where-Object { $_ -gt 127 }).Count
Check 'i3 module is ASCII-only' ($nonAscii -eq 0)
$selfBytes = [System.IO.File]::ReadAllBytes($PSCommandPath)
$selfNonAscii = @($selfBytes | Where-Object { $_ -gt 127 }).Count
Check 'i4 sandbox is ASCII-only' ($selfNonAscii -eq 0)
# Exactly the two branches that must keep their candidate (e. and f.) may leave
# a .new behind; any third one means a quiet branch silently stranded a file.
$residue = @(Get-ChildItem -Path $sandbox -Recurse -Filter '*.new' -ErrorAction SilentlyContinue)
Check 'i5 only the two loud-failure branches keep a .new' ($residue.Count -eq 2)

Remove-Item -LiteralPath $sandbox -Recurse -Force -ErrorAction SilentlyContinue
Write-Output ('test-state-promote: ' + $pass + ' passed, ' + $fail + ' failed (of ' + ($pass + $fail) + ')')
if ($fail -gt 0) { exit 1 }
exit 0