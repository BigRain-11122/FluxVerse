# shell-chain-census.ps1 - who in verify.ps1's in-process chain can start a shell
# ---------------------------------------------------------------------------
# WHY (queue main#92): the hygiene assertion in test-verify-path-census.ps1 was a
# literal grep of verify.ps1 for 'powershell.exe|powershell -'. r750 moved the
# real spawn into a dot-sourced module (ps-suites-tick.ps1) and the literal grep
# stayed green - the letter was kept, the intent was not. This module answers the
# question the grep was trying to ask: "which file in the chain that verify.ps1
# runs IN THIS PROCESS can start a shell, and is each one accounted for?"
#
# Detection is token/AST based, not line based:
#   - comments are dropped, so a help header that prints "powershell -File x.ps1"
#     does not count as a spawn;
#   - variables are dropped, so a local $cmd (Get-Command result) is not a shell;
#   - string literals ARE scanned for exe forms, because
#     ProcessStartInfo.FileName = 'cmd.exe' is a real spawn written as a string;
#   - bare 'cmd' / 'powershell' count only as actual command names (CommandAst).
# That is the difference between "mentions a shell" and "can start one".
#
# ASCII-only law: no CJK in this file (PS5.1 GBK trap).

$script:ShellExePattern = '(?i)\b(powershell(?:\.exe)?|cmd\.exe|Start-Process)\b'

function Get-ShellTokenHits {
  param([Parameter(Mandatory = $true)][string]$Path)
  if (-not (Test-Path -LiteralPath $Path)) { return @() }
  $tokens = $null
  $parseErrors = $null
  $ast = [System.Management.Automation.Language.Parser]::ParseFile($Path, [ref]$tokens, [ref]$parseErrors)
  if ($null -eq $tokens) { return @() }
  $skip = @('Comment', 'Variable', 'NewLine', 'LineContinuation', 'EndOfInput')
  $hits = New-Object System.Collections.ArrayList
  foreach ($t in $tokens) {
    if ($skip -contains [string]$t.Kind) { continue }
    $txt = [string]$t.Text
    if (-not $txt) { continue }
    foreach ($m in [regex]::Matches($txt, $script:ShellExePattern)) {
      $hit = $m.Value.ToLower()
      if (-not $hits.Contains($hit)) { [void]$hits.Add($hit) }
    }
  }
  # Bare command names (cmd / powershell without the .exe suffix) only count
  # when they are the command of a pipeline element.
  if ($null -ne $ast) {
    $cmds = $ast.FindAll({ param($n) $n -is [System.Management.Automation.Language.CommandAst] }, $true)
    foreach ($c in $cmds) {
      $name = [string]$c.GetCommandName()
      if (-not $name) { continue }
      $leaf = ($name -split '[\\/]')[-1].ToLower()
      if ($leaf -eq 'cmd' -or $leaf -eq 'powershell' -or $leaf -eq 'powershell.exe' -or $leaf -eq 'cmd.exe' -or $leaf -eq 'start-process') {
        if (-not $hits.Contains($leaf)) { [void]$hits.Add($leaf) }
      }
    }
  }
  return @($hits)
}

function Get-ScriptCallTargets {
  # In-process call sites: dot-sourcing (. $x) and invocation (& $x). Both run
  # the target inside the current process, so both belong to the chain.
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [string]$RepoRoot = ''
  )
  $result = @{ Targets = @(); Unresolved = @() }
  if (-not (Test-Path -LiteralPath $Path)) { return $result }
  $src = [System.IO.File]::ReadAllText($Path)

  $map = @{}
  foreach ($m in [regex]::Matches($src, '\$(\w+)\s*=\s*Join-Path\s+\$\w+\s+''([^'']+)''')) {
    $map[$m.Groups[1].Value] = $m.Groups[2].Value
  }

  $targets = New-Object System.Collections.ArrayList
  $unresolved = New-Object System.Collections.ArrayList
  $seen = @{}
  foreach ($m in [regex]::Matches($src, '(?:^|[\s\(\{;])([.&])\s+\$(\w+)\b')) {
    $var = $m.Groups[2].Value
    if ($seen.ContainsKey($var)) { continue }
    $seen[$var] = $true
    if (-not $map.ContainsKey($var)) {
      [void]$unresolved.Add($var)
      continue
    }
    $rel = $map[$var]
    if ($RepoRoot -and -not [System.IO.Path]::IsPathRooted($rel)) {
      $rel = Join-Path $RepoRoot $rel
    }
    [void]$targets.Add($rel)
  }
  $result.Targets = @($targets)
  $result.Unresolved = @($unresolved)
  return $result
}

function Get-ShellChainAudit {
  # Walks the in-process chain from $VerifyPath and reports every file that can
  # start a shell. A whitelist entry must be (a) really in the chain and (b)
  # really spawning something - an allowance that no longer applies is itself
  # drift, so it is reported as stale instead of silently widening the hole.
  # -DynamicAllow declares call sites that resolve to no file on purpose
  # ("<leaf>:$<var>" -> reason); anything else unresolved is a hole.
  param(
    [Parameter(Mandatory = $true)][string]$VerifyPath,
    [string]$RepoRoot = '',
    [object[]]$Whitelist = @(),
    [hashtable]$DynamicAllow = @{},
    [int]$MaxDepth = 6
  )
  $files = New-Object System.Collections.ArrayList
  $hits = New-Object System.Collections.ArrayList
  $unresolved = New-Object System.Collections.ArrayList
  $declared = New-Object System.Collections.ArrayList
  $queue = New-Object System.Collections.Queue
  $visited = @{}

  $rootKey = [System.IO.Path]::GetFullPath($VerifyPath)
  $visited[$rootKey] = 0
  $queue.Enqueue(@{ Path = $rootKey; Depth = 0 })

  while ($queue.Count -gt 0) {
    $node = $queue.Dequeue()
    [void]$files.Add($node.Path)
    foreach ($h in (Get-ShellTokenHits -Path $node.Path)) {
      [void]$hits.Add(@{ Path = $node.Path; Hit = $h })
    }
    if ($node.Depth -ge $MaxDepth) { continue }
    $calls = Get-ScriptCallTargets -Path $node.Path -RepoRoot $RepoRoot
    $leaf = Split-Path $node.Path -Leaf
    foreach ($u in $calls.Unresolved) {
      $key = $leaf + ':$' + $u
      if ($DynamicAllow.ContainsKey($key)) { [void]$declared.Add($key); continue }
      [void]$unresolved.Add(@{ Path = $node.Path; Var = $u })
    }
    foreach ($t in $calls.Targets) {
      $abs = $t
      if (-not [System.IO.Path]::IsPathRooted($abs) -and $RepoRoot) { $abs = Join-Path $RepoRoot $abs }
      if (-not (Test-Path -LiteralPath $abs)) { continue }
      $key = [System.IO.Path]::GetFullPath($abs)
      if ($visited.ContainsKey($key)) { continue }
      $visited[$key] = 1
      $queue.Enqueue(@{ Path = $key; Depth = ($node.Depth + 1) })
    }
  }

  $entries = @()
  foreach ($w in $Whitelist) {
    $wAbs = $w.Path
    if (-not [System.IO.Path]::IsPathRooted($wAbs) -and $RepoRoot) { $wAbs = Join-Path $RepoRoot $wAbs }
    $wKey = [System.IO.Path]::GetFullPath($wAbs)
    $inChain = $visited.ContainsKey($wKey)
    $wHits = @()
    if ($inChain) { $wHits = @(Get-ShellTokenHits -Path $wKey) }
    $entries += @{ Path = $wKey; InChain = $inChain; Hits = ($wHits.Count); Reason = [string]$w.Reason; Stale = (-not $inChain -or $wHits.Count -eq 0) }
  }
  $whitelistKeys = @{}
  foreach ($e in $entries) { $whitelistKeys[$e.Path] = $true }

  $violations = @()
  foreach ($h in $hits) {
    if ($whitelistKeys.ContainsKey($h.Path)) { continue }
    $violations += $h
  }

  return @{
    Files = @($files)
    Hits = @($hits)
    Violations = @($violations)
    Unresolved = @($unresolved)
    Declared = @($declared)
    Whitelist = @($entries)
    StaleWhitelist = @($entries | Where-Object { $_.Stale })
  }
}

function Format-ShellChainVerdict {
  param([Parameter(Mandatory = $true)]$Audit)
  $names = @()
  foreach ($v in $Audit.Violations) { $names += ((Split-Path $v.Path -Leaf) + ':' + $v.Hit) }
  $line = 'SHELLCHAIN files=' + $Audit.Files.Count + ' hits=' + $Audit.Hits.Count
  $line += ' allow=' + $Audit.Whitelist.Count + ' violations=' + $Audit.Violations.Count
  $line += ' unresolved=' + $Audit.Unresolved.Count + ' stale_allow=' + $Audit.StaleWhitelist.Count
  if ($names.Count -gt 0) { $line += ' bad=' + ($names -join ',') }
  return $line
}