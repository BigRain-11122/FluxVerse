# run-panel-suites.ps1 - run every panel sandbox suite and print one line each.
# The runbook's one-liner (Get-ChildItem ... | %{ node $_.FullName }) breaks in
# shells that eat "$_"; this wrapper is the stable entry point.
# ASCII-only (PS 5.1 GBK trap).
param(
    [string]$Pattern = 'devloop-*panel*test*.js',
    [string]$LogDir = ''
)

$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoDir = Split-Path -Parent (Split-Path -Parent $here)
if ([string]::IsNullOrEmpty($LogDir)) { $LogDir = Join-Path $repoDir 'logs' }

$files = Get-ChildItem -Path (Join-Path $LogDir $Pattern) | Sort-Object Name
if ($files.Count -eq 0) {
    Write-Output ('SUITES ERROR: no files match ' + $Pattern + ' in ' + $LogDir)
    exit 3
}

$failSuites = 0
$totalAssert = 0
foreach ($f in $files) {
    $out = ''
    $code = 0
    $prevEap = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        $out = & node $f.FullName 2>&1 | Out-String
        $code = $LASTEXITCODE
    } finally { $ErrorActionPreference = $prevEap }

    $last = ($out -split "`r?`n" | Where-Object { $_.Trim() -ne '' } | Select-Object -Last 1)
    $failCount = -1
    $m = [regex]::Match($out, 'fail(?:s|ed)?\s*[=:]\s*(\d+)', 'IgnoreCase')
    if ($m.Success) { $failCount = [int]$m.Groups[1].Value }
    if ($code -ne 0 -or ($failCount -gt 0)) { $failSuites++ }

    $verdict = if ($code -eq 0 -and $failCount -le 0) { 'PASS' } else { 'FAIL' }
    Write-Output ($verdict + '  ' + $f.Name + '  exit=' + $code + '  ' + $last)
}

Write-Output ('SUITES total=' + $files.Count + ' failing=' + $failSuites)
if ($failSuites -gt 0) { exit 2 }
Write-Output 'SUITES VERDICT: ALL PASS'
exit 0