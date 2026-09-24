# FluxVerse DevLoop r70 / P-2026-09-24-54(2) slice 1: bake the city-lord
# greeting library (CityWatch welcome line) via a local Ollama batch (L2).
#
# Law source (TECH P-54(2) row; CEO local-compute max order 2026-09-24):
#   - r27 welcome line = live Ollama generation on every panel open; P-54
#     replaces live with pre-baked (r41 bake-resident-barks paradigm: offline
#     batch -> deterministic data file -> consumption picks deterministically).
#   - model = qwen2.5:7b-instruct (same as the live line - tone continuity).
#   - honesty law (BigLife cognition layer-2): pool lines = situational tone
#     only - zero facts / zero digits / zero events. The live events stay on
#     the events face of the panel; the greeting never fabricates.
#   - day-phase canon = clock probe four-tier (dawn/day/dusk/night - the r13
#     color-wheel canon); consumption contract (wired in the NEXT slice):
#     phase from the real Beijing clock, pick = md5("id|date|ctx") % len(bucket)
#     (r41 family law, day-granular, byte-stable per day).
#   - resumable: staging jsonl in logs\ (gitignored); staged keys are skipped,
#     budget-stopped runs continue on the next call; promote only fires when
#     every bucket is complete (all-or-nothing library).
#
# Inputs (read-only): docs\residents\*.md (the welcome rotation domain),
#   watch\greetings-bake-prompt.txt (UTF-8 CJK data file),
#   watch\greetings-phases.txt (k=v canon names, UTF-8 data file).
# Outputs: watch\greetings.json (deterministic library, committed),
#   logs\greetings-staging.jsonl (gitignored work file / incremental cursor),
#   logs\greetings-bake-report.txt (evidence, overwritten per run).
# Gates at promote (fail-loud): every bucket exactly LinesPerBucket lines;
#   every line 4..18 chars / zero digits / >=2 CJK chars; whole-library
#   zero-dup; two builds byte-identical; round-trip parse counts.
# ASCII-only script body (PS5.1 GBK law). CJK lives only in the data files.
param([int]$MaxSeconds = 220, [int]$LinesPerBucket = 4)
$ErrorActionPreference = "Stop"

$repo       = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent   # Tools\city -> repo
$cardsDir   = Join-Path $repo 'docs\residents'
$promptFile = Join-Path $repo 'watch\greetings-bake-prompt.txt'
$phaseFile  = Join-Path $repo 'watch\greetings-phases.txt'
$logsDir    = Join-Path $repo 'logs'
$staging    = Join-Path $logsDir 'greetings-staging.jsonl'
$out        = Join-Path $repo 'watch\greetings.json'
$report     = Join-Path $logsDir 'greetings-bake-report.txt'
if (-not (Test-Path $logsDir)) { New-Item -ItemType Directory -Path $logsDir | Out-Null }

$utf8   = New-Object System.Text.UTF8Encoding($false)
$model  = 'qwen2.5:7b-instruct'
$phases = @('dawn','day','dusk','night')

if (-not (Test-Path $promptFile)) { throw "prompt data file missing: $promptFile" }
if (-not (Test-Path $phaseFile))  { throw "phase data file missing: $phaseFile" }
$cards = @(Get-ChildItem -LiteralPath $cardsDir -Filter *.md | Sort-Object Name)
if ($cards.Count -lt 1) { throw "no resident cards under $cardsDir" }

function JsonEsc([string]$s) {
    $sb = New-Object System.Text.StringBuilder
    foreach ($ch in $s.ToCharArray()) {
        $c = [int]$ch
        if ($ch -eq '"') { [void]$sb.Append('\"') }
        elseif ($ch -eq '\') { [void]$sb.Append('\\') }
        elseif ($c -lt 32) { [void]$sb.Append('\u' + $c.ToString('x4')) }
        else { [void]$sb.Append($ch) }
    }
    return $sb.ToString()
}

# ---- phase canon names (k=v data law: ASCII keys / CJK values) ----
$phaseName = @{}
foreach ($ln in [System.IO.File]::ReadAllLines($phaseFile, [System.Text.Encoding]::UTF8)) {
    $t = [string]$ln
    if ($t.Trim().Length -eq 0) { continue }
    $i = $t.IndexOf('=')
    if ($i -lt 1) { throw "bad phase data line (want k=v)" }
    $phaseName[$t.Substring(0, $i)] = $t.Substring($i + 1)
}
foreach ($p in $phases) {
    if (-not $phaseName.ContainsKey($p)) { throw "phase canon name missing for: $p" }
}
$promptTmpl = [System.IO.File]::ReadAllText($promptFile, [System.Text.Encoding]::UTF8)

# ---- staging load (resumable; explicit UTF8 - r53 law) ----
$done = @{}
if (Test-Path -LiteralPath $staging) {
    foreach ($ln in [System.IO.File]::ReadAllLines($staging, [System.Text.Encoding]::UTF8)) {
        $t = [string]$ln
        if ($t.Trim().Length -eq 0) { continue }
        $o = $t | ConvertFrom-Json
        $k = [string]$o.key
        $v = [string]$o.line
        if ($k.Length -eq 0 -or $v.Length -eq 0) { throw "staging line missing key/line: $staging" }
        $done[$k] = $v
    }
}
$resumed = $done.Count

$keys = New-Object 'System.Collections.Generic.List[string]'
foreach ($c in $cards) {
    foreach ($p in $phases) {
        for ($i = 0; $i -lt $LinesPerBucket; $i++) { $keys.Add($c.BaseName + '|' + $p + '|' + $i) }
    }
}
$total = $keys.Count

# ---- line post-processing + gates ----
$stripChars = New-Object 'System.Collections.Generic.List[char]'
foreach ($cp in @(0x300C, 0x300D, 0x300E, 0x300F, 0x201C, 0x201D, 0x2018, 0x2019, 0x22, 0x27)) { $stripChars.Add([char]$cp) }

function Normalize-Line([string]$raw) {
    $s = ([string]$raw) -replace "`r`n", ' ' -replace "`n", ' ' -replace "`t", ' '
    foreach ($ch in $stripChars.ToArray()) { $s = $s.Replace([string]$ch, '') }
    return $s.Trim()
}
function Line-Ok([string]$s) {
    if ($null -eq $s) { return $false }
    $t = ([string]$s).Trim()
    if ($t.Length -lt 4 -or $t.Length -gt 18) { return $false }
    if ($t -cmatch '[0-9]') { return $false }
    $cjk = [regex]::Matches($t, '[\u4E00-\u9FFF]').Count
    if ($cjk -lt 2) { return $false }
    return $true
}

# ---- batch generation (budget-guarded, resumable, per-line durable append) ----
$sw = [System.Diagnostics.Stopwatch]::StartNew()
$bakedNew = 0
$failedKeys = New-Object 'System.Collections.Generic.List[string]'
foreach ($k in $keys) {
    if ($done.ContainsKey($k)) { continue }
    if ($sw.Elapsed.TotalSeconds -ge $MaxSeconds) { break }
    $parts = $k.Split('|')
    $cardId = $parts[0]
    $ph     = $parts[1]
    $card = $null
    foreach ($c in $cards) { if ($c.BaseName -eq $cardId) { $card = $c; break } }
    if ($null -eq $card) { throw "key card not found: $cardId" }
    $cardText = [System.IO.File]::ReadAllText($card.FullName, [System.Text.Encoding]::UTF8)
    $prompt = $promptTmpl.Replace('__CARD__', $cardText).Replace('__PHASE__', [string]$phaseName[$ph])
    $body = @{ model = $model; prompt = $prompt; stream = $false; options = @{ num_predict = 40; temperature = 0.9 } } | ConvertTo-Json -Depth 4
    $ok = $false
    $tried = $false
    for ($attempt = 1; $attempt -le 3 -and -not $ok; $attempt++) {
        if ($sw.Elapsed.TotalSeconds -ge $MaxSeconds) { break }
        $tried = $true
        $resp = $null
        try {
            $resp = Invoke-RestMethod -Uri 'http://127.0.0.1:11434/api/generate' -Method Post -Body ([System.Text.Encoding]::UTF8.GetBytes($body)) -ContentType 'application/json; charset=utf-8' -TimeoutSec 30
        } catch {
            throw ("ollama call failed (is the server up?): " + $_.Exception.Message)
        }
        $cand = Normalize-Line ([string]$resp.response)
        $dup = $false
        foreach ($dv in $done.Values) { if ($dv -ceq $cand) { $dup = $true; break } }
        if ((Line-Ok $cand) -and -not $dup) {
            $done[$k] = $cand
            $rec = '{"key":"' + (JsonEsc $k) + '","line":"' + (JsonEsc $cand) + '"}'
            [System.IO.File]::AppendAllText($staging, $rec + "`n", $utf8)
            $bakedNew++
            $ok = $true
            Write-Output ("baked [" + $k + "] " + $cand)
        }
    }
    if (-not $ok -and $tried) { $failedKeys.Add($k) }
}
$elapsed = [int]$sw.Elapsed.TotalSeconds

if ($done.Count -lt $total) {
    $rl = New-Object 'System.Collections.Generic.List[string]'
    $rl.Add("status=INCOMPLETE")
    $rl.Add("staged=" + $done.Count + "/" + $total)
    $rl.Add("baked_this_run=" + $bakedNew)
    $rl.Add("resumed_with=" + $resumed)
    $rl.Add("seconds=" + $elapsed)
    $rl.Add("failed_keys=" + ($failedKeys -join ','))
    [System.IO.File]::WriteAllLines($report, $rl, $utf8)
    Write-Output ("BAKE INCOMPLETE staged=" + $done.Count + "/" + $total + " baked_this_run=" + $bakedNew + " seconds=" + $elapsed + " (rerun to continue)")
    exit 0
}

# ---- promote (all buckets complete - all-or-nothing) ----
function Build-Library() {
    $sb = New-Object System.Text.StringBuilder
    [void]$sb.Append('{"protocol":"fluxverse-greetings/0.1","model":"' + $model + '","phases":[')
    for ($i = 0; $i -lt $phases.Count; $i++) {
        [void]$sb.Append('"' + $phases[$i] + '"')
        if ($i -lt $phases.Count - 1) { [void]$sb.Append(',') }
    }
    [void]$sb.Append('],"cards":[')
    for ($ci = 0; $ci -lt $cards.Count; $ci++) {
        [void]$sb.Append('{"id":"' + (JsonEsc $cards[$ci].BaseName) + '","phases":[')
        for ($pi = 0; $pi -lt $phases.Count; $pi++) {
            [void]$sb.Append('{"phase":"' + $phases[$pi] + '","lines":[')
            for ($li = 0; $li -lt $LinesPerBucket; $li++) {
                $ln = [string]$done[($cards[$ci].BaseName + '|' + $phases[$pi] + '|' + $li)]
                [void]$sb.Append('"' + (JsonEsc $ln) + '"')
                if ($li -lt $LinesPerBucket - 1) { [void]$sb.Append(',') }
            }
            [void]$sb.Append(']}')
            if ($pi -lt $phases.Count - 1) { [void]$sb.Append(',') }
        }
        [void]$sb.Append(']}')
        if ($ci -lt $cards.Count - 1) { [void]$sb.Append(',') }
    }
    [void]$sb.Append(']}')
    return $sb.ToString()
}

$lib1 = Build-Library
$lib2 = Build-Library
if ($lib1 -cne $lib2) { throw "library build is not deterministic - two builds differ" }

$seen = @{}
$lineTotal = 0
foreach ($c in $cards) {
    foreach ($p in $phases) {
        for ($i = 0; $i -lt $LinesPerBucket; $i++) {
            $ln = [string]$done[($c.BaseName + '|' + $p + '|' + $i)]
            if (-not (Line-Ok $ln)) { throw ("gate fail: bad line at " + $c.BaseName + "|" + $p + "|" + $i + ": [" + $ln + "]") }
            if ($seen.ContainsKey($ln)) { throw ("gate fail: duplicate line (zero-dup law): " + $ln) }
            $seen[$ln] = $true
            $lineTotal++
        }
    }
}
if ($lineTotal -ne $total) { throw "gate fail: line total drift ($lineTotal vs $total)" }

$rt = $lib1 | ConvertFrom-Json
if (@($rt.cards).Count -ne $cards.Count) { throw "round-trip card count drift" }
foreach ($rc in @($rt.cards)) {
    if (@($rc.phases).Count -ne $phases.Count) { throw "round-trip phase count drift" }
    foreach ($rp in @($rc.phases)) {
        if (@($rp.lines).Count -ne $LinesPerBucket) { throw "round-trip bucket size drift" }
    }
}

[System.IO.File]::WriteAllText($out, $lib1, $utf8)
$sha = (Get-FileHash -LiteralPath $out -Algorithm SHA256).Hash
$rl = New-Object 'System.Collections.Generic.List[string]'
$rl.Add("status=COMPLETE")
$rl.Add("model=" + $model)
$rl.Add("cards=" + $cards.Count)
$rl.Add("phases=" + $phases.Count)
$rl.Add("lines_total=" + $lineTotal)
$rl.Add("baked_this_run=" + $bakedNew)
$rl.Add("resumed_with=" + $resumed)
$rl.Add("seconds=" + $elapsed)
$rl.Add("sha256=" + $sha)
[System.IO.File]::WriteAllLines($report, $rl, $utf8)
Write-Output ("BAKE COMPLETE cards=" + $cards.Count + " lines=" + $lineTotal + " seconds=" + $elapsed)
Write-Output ("sha256=" + $sha)
Write-Output ("out=" + $out)
