# psa-advisor.ps1 -- PSScriptAnalyzer advisor seat (T-FV-125 wiring, round r212;
# P-2026-09-26-08 oss-harvest slice 1 -> OH-20260926-fluxverse.md landing 3).
# One call = the HIGH-VALUE rule-subset gate over target files/dirs
# (directories are recursed for *.ps1). This gate is deliberately NARROW and
# maps one-to-one onto in-house PS5.1 trap families (the two skill law
# books exist because these recurred AFTER the docs did):
#   PSAvoidAssignmentToAutomaticVariable  -> r164 $pid silent-green family
#   PSPossibleIncorrectComparisonWithNull  -> r28/r32 null-order family
#   PSUseBOMForUnicodeEncodedFile          -> r53 encoding-law family
# GRANDFATHER EXCLUSION (declared, style/noise layer -- NOT scanned and NOT
# to be widened without a declared reason; baseline OH-20260926 ledger):
#   positional parameters 246 / unapproved verbs 89 (Probe-/Bake-/Draw- naming
#   canon) / ShouldProcess 9 / plural nouns 16 / Write-Host 14 / unused
#   parameter 1 / empty catch 27 (probe fail-soft canon: failures degrade
#   silently by contract -- observation list only, NEVER batch-edit).
#   Dead-var layer (PSUseDeclaredVarsMoreThanAssignments, baseline 9) was
#   digested at r212 and stays OUT of the standing gate: skill harness
#   templates keep FILL-fed tables assigned-by-design until a round
#   consumes them (sandbox $propsCells family = structural false positive).
# Exit codes: 0 = GREEN (0 gate findings) / 2 = RED (findings listed) /
#   3 = PSScriptAnalyzer module missing (caller MUST degrade with a visible
#   note, never silently) / 1 = usage error (missing target path).
# Deterministic output (no timestamps, sorted targets). ASCII-only body
# (encoding law). No automatic-variable assignments (r164 law).
param(
    # not Mandatory by design: a missing arg must fail-loud with this message,
    # never hang an unattended round on an interactive prompt
    [string[]]$Target,
    [switch]$ListRules
)
$ErrorActionPreference = 'Stop'

$gateRules = @(
    'PSAvoidAssignmentToAutomaticVariable',
    'PSPossibleIncorrectComparisonWithNull',
    'PSUseBOMForUnicodeEncodedFile'
)
if ($ListRules) { foreach ($g in $gateRules) { Write-Output $g }; exit 0 }
if (-not $Target -or $Target.Count -eq 0) {
    Write-Output 'PSA-ADVISOR: no target given (pass -Target <files/dirs>, or -ListRules to print the gate)'
    exit 1
}

if (-not (Get-Module -ListAvailable -Name PSScriptAnalyzer)) {
    Write-Output 'PSA-ADVISOR: module missing (Install-Module PSScriptAnalyzer -Scope CurrentUser)'
    exit 3
}

$fileList = New-Object System.Collections.ArrayList
foreach ($t in $Target) {
    if (-not (Test-Path -LiteralPath $t)) {
        Write-Output ('PSA-ADVISOR: target missing - ' + $t)
        exit 1
    }
    if (Test-Path -LiteralPath $t -PathType Container) {
        $found = Get-ChildItem -LiteralPath $t -Recurse -Filter '*.ps1' -File
        foreach ($f in $found) { [void]$fileList.Add($f.FullName) }
    } else {
        [void]$fileList.Add((Resolve-Path -LiteralPath $t).Path)
    }
}
if ($fileList.Count -eq 0) {
    Write-Output 'PSA-ADVISOR: no .ps1 files under target(s)'
    exit 1
}
$fileList.Sort()

$hits = New-Object System.Collections.ArrayList
foreach ($f in $fileList) {
    $r = Invoke-ScriptAnalyzer -Path $f -IncludeRule $gateRules -ErrorAction SilentlyContinue
    foreach ($x in @($r)) { [void]$hits.Add($x) }
}

Write-Output ('PSA-ADVISOR: ' + $fileList.Count + ' file(s) x ' + $gateRules.Count + ' gate rule(s)')
foreach ($h in $hits) {
    Write-Output ('PSA-ADVISOR: ' + $h.RuleName + ' ' + $h.ScriptName + ':' + $h.Line + ' - ' + $h.Message)
}
if ($hits.Count -gt 0) {
    Write-Output ('PSA-ADVISOR: RED ' + $hits.Count + ' finding(s)')
    exit 2
}
Write-Output 'PSA-ADVISOR: GREEN 0 findings'
exit 0
