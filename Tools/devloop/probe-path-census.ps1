# probe-path-census.ps1 - main#25: does every perceptor probe's target path exist?
# ------------------------------------------------------------------------------
# WHY (r687, from r684~r686): three dead read paths were found in three
# consecutive rounds (ctx.root emptied; snapshot.ps1 double Join-Path;
# orders_bg.ps1 pointing at the pre-10-04 flat GLOBAL layout). Each one had been
# silently returning nothing for weeks while reporting OK, because nobody ever
# asked "does the path this probe builds actually exist on this machine?".
# The scan-side floors (main#22, r685) catch a zero READ at runtime but say
# nothing about WHICH path died or whether the other 25 probes are one rename
# away from the same fate.
#
# WHAT: a static census. For each probe we replay its own path algebra - literal
# joins, the $ctx anchors, Split-Path -Parent, and probe-local variables declared
# earlier in the same file - then Test-Path the result (read-only, no probe is
# executed, so this instrument cannot perturb the perception chain).
#
# HONEST BOUNDARY: a path whose last segment comes from runtime data (per-machine
# json, per-day log name) is reported as a PREFIX check on the statically known
# base directory, not an exact-path verdict. Runtime-empty variables (the r684
# class) are not reproducible statically - those stay covered by the scan WARN
# floors from main#22.
#
# Usage:  powershell -ExecutionPolicy Bypass -File probe-path-census.ps1 [-Md <path>] [-FailOnDead]
# Exit:   0 = census produced; 2 = dead path(s) found AND -FailOnDead given.
# ASCII-only law: no CJK in this file (PS5.1 GBK trap).

param(
  [string]$Md = '',
  [string]$ProbeDirOverride = '',
  [switch]$Trace,
  [switch]$FailOnDead
)

$ErrorActionPreference = 'Stop'
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$upTwo = (Resolve-Path (Join-Path $repoRoot '..\..')).Path
$resolver = Join-Path $PSScriptRoot 'resolve-group-root.ps1'
if (Test-Path -LiteralPath $resolver) {
  . $resolver
  $groupRoot = Resolve-GroupRoot -RepoRoot $repoRoot -LegacyRoot $upTwo
} else {
  $groupRoot = $upTwo
}
# NOTE: PowerShell variable names are case-insensitive, so the sandbox override
# cannot be spelled $ProbeDir next to $probeDir (r687: it silently self-assigned
# and the switch was ignored - the sandbox test caught it).
$probeDir = Join-Path $repoRoot 'Tools\perceptor\probes'
if ($ProbeDirOverride -ne '') { $probeDir = $ProbeDirOverride }
# A relative -Md resolves against the repo root, not the process CWD (r687: a
# relative path from the caller's shell landed nowhere and said nothing).
if ($Md -ne '' -and -not [System.IO.Path]::IsPathRooted($Md)) { $Md = Join-Path $repoRoot $Md }

# ---------------- tokenizer (quotes and balanced parens survive as one token)
function Split-Tokens([string]$s) {
  $toks = New-Object System.Collections.ArrayList
  $i = 0
  $n = $s.Length
  while ($i -lt $n) {
    $c = $s[$i]
    if ($c -eq ' ' -or $c -eq "`t") { $i++; continue }
    if ($c -eq "'") {
      $j = $s.IndexOf("'", $i + 1)
      if ($j -lt 0) { break }
      [void]$toks.Add($s.Substring($i, $j - $i + 1))
      $i = $j + 1
      continue
    }
    if ($c -eq '(') {
      $depth = 0
      $j = $i
      $closed = $false
      while ($j -lt $n) {
        if ($s[$j] -eq '(') { $depth++ }
        elseif ($s[$j] -eq ')') { $depth--; if ($depth -eq 0) { $closed = $true; break } }
        $j++
      }
      if (-not $closed) { break }
      [void]$toks.Add($s.Substring($i, $j - $i + 1))
      $i = $j + 1
      continue
    }
    $j = $i
    while ($j -lt $n -and $s[$j] -ne ' ' -and $s[$j] -ne "`t") { $j++ }
    [void]$toks.Add($s.Substring($i, $j - $i))
    $i = $j
  }
  return $toks
}

# ---------------- expression evaluator over the token list
# Returns a resolved path string, or $null when the expression needs runtime data.
$script:tokList = @()
$script:tokIdx = 0

function Test-Pathish([string]$v) {
  if ([string]::IsNullOrEmpty($v)) { return $false }
  return ($v -match '^(?:[A-Za-z]:\\|\\\\)')
}

function Join-Paths([string]$a, [string]$b) {
  # NOTE: '[string]' parameters coerce $null to '' on binding, so the checks must
  # be IsNullOrEmpty - a $null check here silently lost the dynamic-tail marker
  # (r687 sandbox test caught it).
  if ([string]::IsNullOrEmpty($a)) { return $null }
  if ([string]::IsNullOrEmpty($b)) {
    # Dynamic tail (runtime file name): the base directory is still checkable.
    # The '?' sentinel marks the row as a prefix check, never an exact file.
    return ($a.TrimEnd('\', '/') + '\?')
  }
  $a = $a.TrimEnd('\', '/')
  $b = $b.TrimStart('\', '/')
  if ($b -eq '') { return $a }
  return ($a + '\' + $b)
}

function Resolve-Atom([string]$t, [hashtable]$vars) {
  if ($t -eq '') { return $null }
  if ($t.StartsWith("'")) {
    $v = $t.Trim("'")
    if ($v.EndsWith('\')) { return $v }        # keep a trailing separator as a marker
    return $v
  }
  if ($t.StartsWith('$')) {
    # $ctx.root / $ctx.worldDir are the two documented anchors
    if ($t -eq '$ctx.root') { return $vars['ctx.root'] }
    if ($t -eq '$ctx.worldDir') { return $vars['ctx.worldDir'] }
    if ($t -eq '$PSScriptRoot') { return $vars['PSScriptRoot'] }
    $name = $t.TrimStart('$')
    $name = ($name -split '\.')[0]             # $x.member -> $x
    if ($vars.ContainsKey($name)) { return $vars[$name] }
    return $null
  }
  return $null                                  # -LiteralPath, operators, numbers
}

function Get-Expr([hashtable]$vars) {
  if ($script:tokIdx -ge $script:tokList.Count) { return $null }
  $t = $script:tokList[$script:tokIdx]
  if ($t -like '(*)' -and $t.EndsWith(')')) {
    $script:tokIdx++
    $inner = $t.Substring(1, $t.Length - 2)
    $saveList = $script:tokList
    $saveIdx = $script:tokIdx
    $script:tokList = Split-Tokens $inner
    $script:tokIdx = 0
    $v = Get-Expr $vars
    # a '+' after the first atom means the operand is a concatenation, not a path
    if ($script:tokIdx -lt $script:tokList.Count -and $script:tokList[$script:tokIdx] -eq '+') { $v = $null }
    # a dynamic inner expression may still start with a static path literal:
    # keep that literal as a prefix so the base directory stays checkable
    if ($null -eq $v) {
      $lead = [regex]::Match($inner, "'([^']*)'")
      if ($lead.Success) {
        $cand = $lead.Groups[1].Value
        if ($cand -match '[\\/]') { $v = ($cand.TrimEnd('\', '/') + '\?') }   # prefix sentinel
      }
    }
    $script:tokList = $saveList
    $script:tokIdx = $saveIdx
    return $v
  }
  if ($t -eq 'Join-Path') {
    $script:tokIdx++
    $a = Get-Expr $vars
    $b = Get-Expr $vars
    # 'a' + 'b' concatenation: the first atom is only a fragment, never a path
    if ($script:tokIdx -lt $script:tokList.Count -and $script:tokList[$script:tokIdx] -eq '+') { return $null }
    return (Join-Paths $a $b)
  }
  if ($t -eq 'Split-Path') {
    $script:tokIdx++
    $a = Get-Expr $vars
    if ($script:tokIdx -lt $script:tokList.Count -and $script:tokList[$script:tokIdx] -eq '-Parent') { $script:tokIdx++ }
    if ($null -eq $a) { return $null }
    try { return [System.IO.Path]::GetDirectoryName($a) } catch { return $null }
  }
  $script:tokIdx++
  return (Resolve-Atom $t $vars)
}

function Get-ExprValue([string]$text, [hashtable]$vars) {
  $script:tokList = Split-Tokens $text
  $script:tokIdx = 0
  return (Get-Expr $vars)
}

# ---------------- run the census
$rows = New-Object System.Collections.ArrayList
$probeFiles = @(Get-ChildItem -LiteralPath $probeDir -Filter *.ps1 | Where-Object { $_.Name -notlike '_*' } | Sort-Object Name)
foreach ($pf in $probeFiles) {
  if ($pf.Name -like '_*') { continue }
  $vars = @{
    'ctx.root'     = $groupRoot
    'ctx.worldDir' = (Join-Path $repoRoot 'world')
    'PSScriptRoot' = $probeDir
    'repoRoot'     = $repoRoot
    'root'         = $groupRoot
  }
  $lines = [System.IO.File]::ReadAllLines($pf.FullName, [System.Text.Encoding]::UTF8)
  $lineno = 0
  foreach ($ln in $lines) {
    $lineno++
    $body = $ln
    $hash = $body.IndexOf(' #')
    if ($hash -gt 0) { $body = $body.Substring(0, $hash) }
    if ($body -match '^\s*#') { continue }

    # 1) probe-local variable assignments (path algebra is reused further down)
    $mAssign = [regex]::Match($body, '^\s*\$(\w+)\s*=\s*(.+)$')
    if ($mAssign.Success) {
      $vn = $mAssign.Groups[1].Value
      $vx = $mAssign.Groups[2].Value.Trim()
      if ($vx.StartsWith('Join-Path') -or $vx.StartsWith('Split-Path') -or $vx.StartsWith("'")) {
        $val = Get-ExprValue $vx $vars
        if ($null -ne $val) { $vars[$vn] = $val.TrimEnd('\') }
      }
    }

    # 2) every Join-Path occurrence on the line
    $pos = 0
    while ($true) {
      $idx = $body.IndexOf('Join-Path', $pos)
      if ($idx -lt 0) { break }
      $pos = $idx + 9
      $expr = $body.Substring($idx)
      $val = Get-ExprValue $expr $vars
      if ($Trace) { Write-Output ('  trace ' + $pf.BaseName + ':' + $lineno + ' [' + $expr + '] => [' + $val + ']') }
      $kind = 'exact'
      if ($null -ne $val -and $val.EndsWith('\?')) {
        $val = $val.Substring(0, $val.Length - 2)
        $kind = 'prefix'
      }
      if (-not (Test-Pathish $val)) {
        # unresolved: try the leading literal as a prefix, else record as dynamic
        $lead = [regex]::Match($expr, "^Join-Path\s+(?:\([^)]*?\s)?'([^']*)'")
        if ($lead.Success -and $lead.Groups[1].Value -match '[\\/]') {
          $val = Join-Paths $groupRoot $lead.Groups[1].Value
          $kind = 'prefix'
        } else {
          $val = $null
          $kind = 'dynamic'
        }
      }
      if ($null -ne $val) { $val = $val.TrimEnd('\') }
      # normalize '..' hops so the table shows the file the probe really targets
      if ((Test-Pathish $val) -and $val -match '\\\.\.') {
        try { $val = [System.IO.Path]::GetFullPath($val).TrimEnd('\') } catch {}
      }
      if ($null -eq $val) { $exists = 'n/a'; $shown = '(runtime-composed)' }
      else {
        $exists = if (Test-Path -LiteralPath $val) { 'YES' } else { 'NO' }
        $shown = $val
      }
      $dup = $false
      foreach ($r in $rows) {
        if ($r.Probe -eq $pf.BaseName -and $r.Path -eq $shown -and $r.Kind -eq $kind) { $dup = $true; break }
      }
      if (-not $dup) {
        [void]$rows.Add([pscustomobject]@{
            Probe = $pf.BaseName; Line = $lineno; Kind = $kind; Exists = $exists; Path = $shown
          })
      }
    }
  }
}

# Conscious absence: for these faces a missing file IS the design (the probe
# reads presence as a gate). Kept apart from DEAD so a DEAD row always means
# "nobody decided this".
$knownAbsent = @(
  @{ Suffix = '\Tools\perceptor\inbox-live.flag'; Note = 'inbox day-1 observe gate (TECH sec9 r65) - absent keeps ingest count-only by design' }
)
$gateRows = New-Object System.Collections.ArrayList
foreach ($r in $rows) {
  if ($r.Exists -ne 'NO') { continue }
  foreach ($k in $knownAbsent) {
    if ($r.Path.EndsWith($k.Suffix)) {
      $r.Exists = 'GATE'
      [void]$gateRows.Add([pscustomobject]@{ Probe = $r.Probe; Path = $r.Path; Note = $k.Note })
      break
    }
  }
}

$dead = @($rows | Where-Object { $_.Exists -eq 'NO' })
$dyn = @($rows | Where-Object { $_.Kind -eq 'dynamic' })
$okCount = @($rows | Where-Object { $_.Exists -eq 'YES' }).Count

Write-Output ('probe-path-census: probes=' + $probeFiles.Count + ' rows=' + $rows.Count + ' OK=' + $okCount + ' DEAD=' + $dead.Count + ' dynamic=' + $dyn.Count)
Write-Output ('group root: ' + $groupRoot)
Write-Output ''
Write-Output ('{0,-22} {1,-7} {2,-6} {3}' -f 'PROBE', 'KIND', 'EXISTS', 'PATH')
foreach ($r in ($rows | Sort-Object Probe, Line)) {
  Write-Output ('{0,-22} {1,-7} {2,-6} {3}' -f $r.Probe, $r.Kind, $r.Exists, $r.Path)
}
if ($gateRows.Count -gt 0) {
  Write-Output ''
  Write-Output 'GATE PATHS (absent by design - presence would flip behavior):'
  foreach ($g in $gateRows) { Write-Output ('  ' + $g.Probe + ' -> ' + $g.Path + '  [' + $g.Note + ']') }
}
if ($dead.Count -gt 0) {
  Write-Output ''
  Write-Output 'DEAD PATHS (must be fixed or consciously retired):'
  foreach ($d in $dead) { Write-Output ('  ' + $d.Probe + ':' + $d.Line + ' -> ' + $d.Path) }
}

if ($Md -ne '') {
  $sb = New-Object System.Text.StringBuilder
  [void]$sb.AppendLine('# Perceptor probe path census (bm-a)')
  [void]$sb.AppendLine('')
  [void]$sb.AppendLine('Generated by Tools/devloop/probe-path-census.ps1 - static replay of each')
  [void]$sb.AppendLine('probe path algebra, then a read-only existence test. No probe is executed.')
  [void]$sb.AppendLine('')
  [void]$sb.AppendLine('- group root: `' + $groupRoot + '`')
  [void]$sb.AppendLine('- probes: ' + $probeFiles.Count + ', path expressions: ' + $rows.Count)
  [void]$sb.AppendLine('- existing: ' + $okCount + ', dead: ' + $dead.Count + ', runtime-composed: ' + $dyn.Count)
  [void]$sb.AppendLine('')
  [void]$sb.AppendLine('| probe | kind | exists | path |')
  [void]$sb.AppendLine('|---|---|---|---|')
  foreach ($r in ($rows | Sort-Object Probe, Line)) {
    [void]$sb.AppendLine('| ' + $r.Probe + ' | ' + $r.Kind + ' | ' + $r.Exists + ' | `' + $r.Path + '` |')
  }
  [System.IO.File]::WriteAllText($Md, $sb.ToString(), (New-Object System.Text.UTF8Encoding($false)))
  Write-Output ''
  Write-Output ('written: ' + $Md)
}

if ($FailOnDead -and $dead.Count -gt 0) { exit 2 }
exit 0