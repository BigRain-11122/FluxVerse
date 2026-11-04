# simple-param-census.ps1 - static census of "bare function + named params"
# (queue main#127, opened r793)
# ---------------------------------------------------------------------------
# Why: r792/r793 found that `Get-QueueDue -QueueDir <path>` did not error. It
# returned `exists=false open=0` - word for word the same reading as "the queue
# is genuinely empty". PowerShell only rejects unknown named parameters for
# ADVANCED functions ([CmdletBinding()] / [Parameter()]); for a plain function
# the unknown pair lands in $args and the real parameter stays at its default.
# One such function cost a whole round of misreading.
#
# This tool answers one question mechanically, without running anything:
#   "which functions in this tree take a parameter block, are NOT advanced,
#    and declare a path-ish parameter that nothing validates?"
# For those, a caller's natural spelling (or a typo) is silently swallowed and
# the function still hands back a normal-looking object with default values.
#
# Judgement is deliberately narrow so the list does not drown in noise:
#   * a function with no param block is not listed at all (nothing to mistype)
#   * an advanced function is out of scope (PowerShell already fails loud)
#   * risk needs a path-ish parameter (path/dir/file/root) that is
#     - not attributed at all (no [Parameter]/[ValidateSet]/...), and
#     - not guarded in the body for THAT parameter (no Test-Path naming the
#       variable on the same line, and no throw anywhere)
#   * `returns-default-object` is reported as an AGGRAVATOR, not as the risk
#     itself: an unvalidated path parameter that returns an object is exactly
#     the r792 shape, but the swallow happens either way.
#
# Read-only: parses text, writes nothing, starts no process.
# ASCII-only (PS5.1 GBK law). No auto-variable locals.
# ---------------------------------------------------------------------------
param(
    [string]$Root = '',
    [string]$RepoDir = '',
    [switch]$List,
    [switch]$Json,
    [switch]$FailOnRisk
)

function Get-FunctionParamFacts {
    # Facts about one function definition: does it take a param block, is it
    # advanced, which parameters are there, and which of them carry any
    # attribute at all (an attribute is the only place validation can live).
    param([System.Management.Automation.Language.FunctionDefinitionAst]$Ast)

    $facts = [ordered]@{
        hasParamBlock   = $false
        hasCmdletBinding = $false
        names           = @()
        attributed      = @()
        required        = @()
        stringish       = @()
        body            = ''
    }
    if ($null -eq $Ast) { return $facts }
    if ($null -ne $Ast.Body -and $null -ne $Ast.Body.Extent) { $facts.body = $Ast.Body.Extent.Text }
    $pb = $null
    try { $pb = $Ast.Body.ParamBlock } catch { $pb = $null }
    if ($null -eq $pb) { return $facts }

    $facts.hasParamBlock = $true
    foreach ($attr in @($pb.Attributes)) {
        if ($null -eq $attr) { continue }
        if ($null -eq $attr.TypeName) { continue }
        if ($attr.TypeName.Name -eq 'CmdletBinding') { $facts.hasCmdletBinding = $true }
    }
    foreach ($p in @($pb.Parameters)) {
        if ($null -eq $p) { continue }
        $n = ''
        try { $n = $p.Name.VariablePath.UserPath } catch { $n = '' }
        if ($n -eq '') { continue }
        $facts.names += $n
        # A type constraint (`[string]$Path`) is NOT an attribute: PowerShell
        # parses it as a TypeConstraintAst in the same collection, so counting
        # every entry made every parameter look validated and the risk list
        # came out empty against the r792 shape itself (caught by the sandbox
        # negative control, r795).
        $attrCount = 0
        foreach ($a in @($p.Attributes)) {
            if ($a -is [System.Management.Automation.Language.AttributeAst]) { $attrCount++ }
        }
        if ($attrCount -gt 0) { $facts.attributed += $n }
        # `-Required` = the caller must supply it (no default value). Only these
        # can be "mistyped into the default": an omittable parameter is meant
        # to be omitted.
        $hasDefault = $false
        try { $hasDefault = ($null -ne $p.DefaultValue) } catch { $hasDefault = $false }
        if (-not $hasDefault) { $facts.required += $n }
        # A path parameter has to be a string. Without this the name pattern
        # also caught `[scriptblock]$MoveFile` (state-promote) - a test seam,
        # not a path, and a mistyped path is not its failure mode.
        $typeName = ''
        try { if ($null -ne $p.StaticType) { $typeName = $p.StaticType.FullName } } catch { $typeName = '' }
        if ($typeName -eq '' -or $typeName -eq 'System.String' -or $typeName -eq 'System.Object') { $facts.stringish += $n }
    }
    return $facts
}

function Get-SimpleParamRiskReasons {
    # Which of the listed reasons apply. Empty result = not a risk.
    # Only parameters the CALLER must supply are candidates (`-Required`): a
    # parameter with a default value is designed to be omittable, so leaving it
    # alone is not a swallow. Measured r795: without this, every optional
    # -RepoDir/-Root in the tree read as a risk and buried the real ones.
    param([string[]]$Names = @(), [string[]]$Attributed = @(), [string]$Body = '', [string[]]$Required = @(), [string[]]$Stringish = @())

    $reasons = @()
    $pathish = @()
    foreach ($n in @($Names)) {
        if ($n -match '(?i)(path|dir|file|root)$' -and (@($Stringish) -contains $n)) { $pathish += $n }
    }
    if ($pathish.Count -eq 0) { return $reasons }

    # What counts as a guard for THIS parameter:
    #   * an attribute on it (any attribute - it is the only place validation
    #     can be declared), or
    #   * a Test-Path on the same line that names the variable (a `Test-Path`
    #     somewhere else in the body guards something else), or
    #   * a throw anywhere in the body (the function cannot return a
    #     default-shaped object instead of complaining).
    # Deliberately not "Test-Path anywhere": every path function in this tree
    # touches Test-Path for its own reasons, and counting that would empty the
    # risk list without changing a single real swallow (measured r795: the
    # generous version read risky=0 while the shape was still unproven).
    $bodyLines = @()
    if (-not [string]::IsNullOrEmpty($Body)) { $bodyLines = @($Body -split "`r?`n") }
    $throws = ($Body -match '(?i)\bthrow\b')
    $unguarded = @()
    foreach ($n in $pathish) {
        if (@($Required) -notcontains $n) { continue }
        if (@($Attributed) -contains $n) { continue }
        if ($throws) { continue }
        $hit = $false
        $needle = '$' + $n
        foreach ($ln in $bodyLines) {
            if ($ln -match '(?i)Test-Path' -and $ln.IndexOf($needle, [System.StringComparison]::OrdinalIgnoreCase) -ge 0) { $hit = $true; break }
        }
        if (-not $hit) { $unguarded += $n }
    }
    if ($unguarded.Count -eq 0) { return $reasons }

    $reasons += ('path-param-unvalidated(' + ($unguarded -join ',') + ')')
    if ($Body -match '(?i)\[ordered\]@\{') { $reasons += 'returns-default-object' }
    elseif ($Body -match '(?i)\[pscustomobject\]@\{') { $reasons += 'returns-default-object' }
    elseif ($Body -match '(?i)New-Object.*psobject') { $reasons += 'returns-default-object' }
    return $reasons
}

function Get-SimpleParamCensus {
    # Walk the tree, parse every *.ps1, and report the bare-parameter family.
    # Parsing is done by the PowerShell parser itself (no regex heuristics):
    # brace counting on text would be fooled by strings and comments.
    param(
        [Parameter(Mandatory=$true)][string]$Root,
        [string]$RepoDir = ''
    )

    $res = [ordered]@{
        root         = $Root
        files        = 0
        functions    = 0
        simple_count = 0
        risky_count  = 0
        simple       = @()
        parse_errors = @()
    }
    if (-not (Test-Path -LiteralPath $Root)) {
        $res.root = '<missing>'
        return $res
    }

    $fileList = @(Get-ChildItem -LiteralPath $Root -File -Filter '*.ps1' -ErrorAction SilentlyContinue | Sort-Object -Property Name)
    foreach ($f in $fileList) {
        $res.files++
        $rel = $f.Name
        if (-not [string]::IsNullOrEmpty($RepoDir)) {
            $full = $f.FullName
            if ($full.StartsWith($RepoDir, [System.StringComparison]::OrdinalIgnoreCase)) {
                $rel = $full.Substring($RepoDir.Length).TrimStart('\', '/').Replace('\', '/')
            }
        }
        $tokens = $null
        $errs = $null
        $ast = $null
        try {
            $ast = [System.Management.Automation.Language.Parser]::ParseFile($f.FullName, [ref]$tokens, [ref]$errs)
        } catch {
            $ast = $null
        }
        if ($null -eq $ast) {
            $res.parse_errors += $rel
            continue
        }
        # A file that parses with errors still yields definitions; record it so
        # a half-parsed file is not read as "clean".
        if (@($errs).Count -gt 0) { $res.parse_errors += $rel }

        $defs = @($ast.FindAll({ param($n) $n -is [System.Management.Automation.Language.FunctionDefinitionAst] }, $true))
        $res.functions += $defs.Count
        foreach ($d in $defs) {
            $facts = Get-FunctionParamFacts -Ast $d
            if (-not $facts.hasParamBlock) { continue }
            if ($facts.hasCmdletBinding) { continue }
            $reasons = @(Get-SimpleParamRiskReasons -Names $facts.names -Attributed $facts.attributed -Body $facts.body -Required $facts.required -Stringish $facts.stringish)
            $why = ''
            if ($reasons.Count -gt 0) { $why = ($reasons -join '+') }
            $item = [ordered]@{
                rel    = $rel
                line   = [int]$d.Extent.StartLineNumber
                name   = [string]$d.Name
                params = (@($facts.names) -join ',')
                why    = $why
            }
            $res.simple += $item
            $res.simple_count++
            if ($why -ne '') { $res.risky_count++ }
        }
    }
    return $res
}

function Get-SimpleParamSha12
{
    param([string]$Text)
    try {
        $sha = [System.Security.Cryptography.SHA256]::Create()
        try { $bytes = $sha.ComputeHash([System.Text.Encoding]::UTF8.GetBytes([string]$Text)) }
        finally { $sha.Dispose() }
        $sb = New-Object System.Text.StringBuilder
        for ($i = 0; $i -lt 6; $i++) { [void]$sb.Append($bytes[$i].ToString('x2')) }
        return $sb.ToString()
    } catch { return '' }
}

function Get-SimpleParamRootIdentity
{
    # Spelling-independent identity of the DIRECTORY OBJECT, not of the string
    # the caller happened to type (queue main#140, r834).
    #
    # Measured r834 on this box: `...\Tools\devloop`, the same path with a
    # trailing separator, with `.`, with `..`, and the same directory reached
    # through its second drive letter all addressed one directory object - yet
    # the raw string went into the fingerprint, so every spelling produced its
    # own key and the cache said `stale` for a tree that had not moved. Note
    # `Get-Item(...).FullName` does NOT help: it hands back the input spelling
    # (it kept the trailing separator and the `..` segment verbatim).
    #
    # What IS shared by all spellings of one object and not shared by two
    # different directories: the creation stamp of the directory itself. It is
    # a property of the filesystem object, so it cannot be produced by copying
    # the file LIST - which is exactly what the r834 criterion asked for (do
    # not just delete the root: two distinct directories whose *.ps1 listing
    # happens to match must not share an answer).
    #
    # Returns '' when no identity can be read; the caller then refuses to cache
    # (recompute every time) rather than key on something unproven.
    param([string]$Root)
    if ([string]::IsNullOrWhiteSpace($Root)) { return '' }
    if (-not (Test-Path -LiteralPath $Root)) { return '' }
    try {
        $it = Get-Item -LiteralPath $Root -Force -ErrorAction Stop
        if ($null -eq $it) { return '' }
        $ticks = [long]$it.CreationTimeUtc.Ticks
        if ($ticks -le 0) { return '' }
        return ('dir|' + $ticks)
    } catch { return '' }
}

function Get-SimpleParamFingerprint
{
    # What has to be identical for a cached answer to still be true: the file
    # list (name|length|mtime), the directory identity (spelling-independent,
    # r834), AND this module - the parse rules live here, so editing a rule
    # must invalidate every cached count (same law as the city-shot census,
    # r769).
    param([string]$Root, [string]$ModulePath = '')
    if ([string]::IsNullOrWhiteSpace($Root)) { return '' }
    if (-not (Test-Path -LiteralPath $Root)) { return '' }
    $identity = Get-SimpleParamRootIdentity -Root $Root
    if ([string]::IsNullOrWhiteSpace($identity)) { return '' }
    $fileList = @()
    try {
        $fileList = @(Get-ChildItem -LiteralPath $Root -File -Filter '*.ps1' -ErrorAction Stop | Sort-Object -Property Name)
    } catch { return '' }
    $parts = New-Object System.Collections.ArrayList
    [void]$parts.Add($identity)
    foreach ($f in $fileList) {
        [void]$parts.Add($f.Name + '|' + $f.Length + '|' + $f.LastWriteTimeUtc.Ticks)
    }
    if (-not [string]::IsNullOrWhiteSpace($ModulePath)) {
        try {
            $mb = [System.IO.File]::ReadAllBytes($ModulePath)
            [void]$parts.Add('module|' + $mb.Length + '|' + (Get-SimpleParamSha12 -Text ([System.Text.Encoding]::UTF8.GetString($mb))))
        } catch { [void]$parts.Add('module|?') }
    }
    return (Get-SimpleParamSha12 -Text ($parts -join "`n"))
}

function Get-SimpleParamCensusCached
{
    # A fresh census parses 66 files and costs ~560 ms - too much to pay every
    # ten minutes for an answer that only changes when a *.ps1 changes. So the
    # caller may hand in a cache path; the fingerprint above decides whether the
    # recorded answer still answers. Fail-open: a stale/corrupt/missing cache is
    # never an error, it just means recompute (a read-only tree only gets slower).
    #
    # `reason` says WHY the cache did not answer, so the page can tell "the key
    # never matches" from "the cache was never written" - the same vocabulary as
    # the city-shot census (r770): '' (hit or genuine first run) / stale /
    # unreadable / unwritable / no-cache-path / no-dir / no-identity (r834: the
    # directory has no spelling-independent identity, so nothing is cached).
    # Never a zero standing in for "not measured": a missing root reports
    # `<missing>` plus no-dir.
    param(
        [string]$Root,
        [string]$RepoDir = '',
        [string]$CachePath = '',
        [string]$ModulePath = '',
        [switch]$NoWrite
    )

    $res = [ordered]@{
        root      = $Root
        files     = 0
        functions = 0
        simple    = 0
        risky     = 0
        items     = @()
        cached    = $false
        reason    = ''
        fp        = ''
        wrote     = $false
    }

    if ([string]::IsNullOrWhiteSpace($Root) -or -not (Test-Path -LiteralPath $Root)) {
        $res.root = '<missing>'
        $res.reason = 'no-dir'
        return $res
    }

    $census = $null
    $fp = Get-SimpleParamFingerprint -Root $Root -ModulePath $ModulePath
    $res.fp = $fp

    if ([string]::IsNullOrWhiteSpace($CachePath)) {
        $census = Get-SimpleParamCensus -Root $Root -RepoDir $RepoDir
        $res.reason = 'no-cache-path'
    } elseif ([string]::IsNullOrWhiteSpace($fp)) {
        # A cache path was offered but the directory has no identity we trust:
        # answer fresh and NEVER write a key we could not re-derive (r834).
        $census = Get-SimpleParamCensus -Root $Root -RepoDir $RepoDir
        $res.reason = 'no-identity'
    } elseif (Test-Path -LiteralPath $CachePath) {
        try {
            $cache = Get-Content -LiteralPath $CachePath -Raw -Encoding UTF8 | ConvertFrom-Json
            if ($cache -and $cache.PSObject.Properties['fingerprint'] -and ([string]$cache.fingerprint -eq $fp)) {
                $res.files = [int]$cache.files
                $res.functions = [int]$cache.functions
                $res.simple = [int]$cache.simple
                $res.risky = [int]$cache.risky
                $res.items = @($cache.items)
                $res.cached = $true
                return $res
            }
            $res.reason = 'stale'
        } catch { $res.reason = 'unreadable' }
    }

    if ($null -eq $census) { $census = Get-SimpleParamCensus -Root $Root -RepoDir $RepoDir }
    $res.files = [int]$census.files
    $res.functions = [int]$census.functions
    $res.simple = [int]$census.simple_count
    $res.risky = [int]$census.risky_count
    $riskyItems = @()
    foreach ($it in @($census.simple)) {
        if ($it.why -eq '') { continue }
        $riskyItems += [ordered]@{ rel = $it.rel; line = [int]$it.line; name = $it.name; why = $it.why }
    }
    $res.items = $riskyItems

    if ((-not $NoWrite) -and $fp -and -not [string]::IsNullOrWhiteSpace($CachePath)) {
        $tmp = ''
        try {
            $parent = Split-Path -Parent $CachePath
            if ($parent -and -not (Test-Path -LiteralPath $parent)) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
            $payload = [ordered]@{
                fingerprint = $fp
                written_utc = [DateTime]::UtcNow.ToString('yyyy-MM-ddTHH:mm:ssZ')
                root        = $res.root
                files       = $res.files
                functions   = $res.functions
                simple      = $res.simple
                risky       = $res.risky
                items       = @($riskyItems)
            }
            $json = ConvertTo-Json -InputObject $payload -Depth 5 -Compress
            $tmp = $CachePath + '.new'
            [System.IO.File]::WriteAllText($tmp, $json, (New-Object System.Text.UTF8Encoding($false)))
            Move-Item -LiteralPath $tmp -Destination $CachePath -Force
            $res.wrote = $true
        } catch {
            $res.reason = 'unwritable'
            if ($tmp) { try { Remove-Item -LiteralPath $tmp -Force -ErrorAction SilentlyContinue } catch { } }
        }
    }
    return $res
}

function Format-SimpleParamCensus
{
    # Human/line-oriented form: one summary line, then every risky item, then
    # (with -List) every simple item. ASCII only, stable order (input order).
    param($Census, [switch]$List)

    $out = @()
    $out += ('SIMPLE-PARAM CENSUS: root=' + $Census.root + ' files=' + $Census.files +
        ' functions=' + $Census.functions + ' simple=' + $Census.simple_count +
        ' risky=' + $Census.risky_count)
    if (@($Census.parse_errors).Count -gt 0) {
        $out += ('SIMPLE-PARAM PARSE: errors=' + @($Census.parse_errors).Count + ' ' + (@($Census.parse_errors) -join ','))
    }
    foreach ($it in @($Census.simple)) {
        if ($it.why -eq '') { continue }
        $out += ('RISKY  ' + $it.rel + ':' + $it.line + ' ' + $it.name + ' params=' + $it.params + ' why=' + $it.why)
    }
    if ($List) {
        foreach ($it in @($Census.simple)) {
            $why = $it.why
            if ($why -eq '') { $why = 'no' }
            $out += ('SIMPLE ' + $it.rel + ':' + $it.line + ' ' + $it.name + ' params=' + $it.params + ' risk=' + $why)
        }
    }
    return $out
}

# ---------- CLI entry (dot-sourcing defines the functions only) ----------
if ($MyInvocation.InvocationName -ne '.') {
    $repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
    if ([string]::IsNullOrEmpty($RepoDir)) { $RepoDir = $repoRoot }
    if ([string]::IsNullOrEmpty($Root)) { $Root = Join-Path $RepoDir 'Tools\devloop' }

    $census = Get-SimpleParamCensus -Root $Root -RepoDir $RepoDir
    if ($Json) {
        $payload = [ordered]@{
            root         = $census.root
            files        = $census.files
            functions    = $census.functions
            simple       = $census.simple_count
            risky        = $census.risky_count
            parse_errors = @($census.parse_errors)
            items        = @($census.simple)
        }
        $payload | ConvertTo-Json -Depth 6
        exit 0
    }
    foreach ($ln in @(Format-SimpleParamCensus -Census $census -List:$List)) { Write-Output $ln }
    if ($FailOnRisk -and $census.risky_count -gt 0) { exit 2 }
    exit 0
}