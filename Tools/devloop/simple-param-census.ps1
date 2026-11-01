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

function Format-SimpleParamCensus {
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