# FluxVerse DevLoop - runbook vs TECH section-9 round-number sync check (tech#11 / r272)
# Contract judged: state/runbook.md r238 - update runbook when next-steps change; this tool is its
# mechanical judge position (manual round-tail run, zero daemon, zero write).
# Verdict = one line, no timestamp (double-run byte-comparable). Exit codes follow the fleet
# convention of check-fastpath / tasks-board-check: 0=SYNC, 2=DRIFT, 1=FAIL (missing/parse).
# ASCII-only per mandate hard-constraint 3: CJK anchors built from code points.
# Read path: [IO.File]::ReadAllText = UTF-8 normalization direct-read law (r163).

param(
    [string]$RunbookPath = '',
    [string]$TechPath = ''
)

$ErrorActionPreference = 'Stop'

$toolDir = Split-Path -Parent $PSCommandPath          # <repo>\Tools\devloop
$repoRoot = Split-Path -Parent (Split-Path -Parent $toolDir)   # <repo>
if ($RunbookPath -eq '') { $RunbookPath = Join-Path $repoRoot 'state\runbook.md' }
if ($TechPath -eq '') { $TechPath = Join-Path $repoRoot 'TECH.md' }

function Fail([string]$Reason) {
    Write-Output ('runbook-sync: FAIL ' + $Reason)
    exit 1
}

if (-not (Test-Path -LiteralPath $RunbookPath)) { Fail 'runbook-missing' }
if (-not (Test-Path -LiteralPath $TechPath)) { Fail 'tech-missing' }

$runbookText = [System.IO.File]::ReadAllText($RunbookPath)
$techText = [System.IO.File]::ReadAllText($TechPath)

# Runbook current-round marker: 'r<N> <bi>' (U+6BD5). The runbook keeps its
# history newest-first, one block per round, so the LAST match is the OLDEST
# block - r777 measured exactly that: a correct file (current block r777, then
# history r776/r775) came out as 'runbook=r775' DRIFT against tech_tail=r777.
# Take the maximum round number instead: independent of block order, and a
# stale current block still drifts because TECH's tail keeps moving.
$bi = [char]0x6BD5
$rbMatches = [regex]::Matches($runbookText, ('r(\d+)\s*' + $bi))
if ($rbMatches.Count -eq 0) { Fail 'runbook-no-current-round-marker' }
# keep the captured digits as strings for display (leading zeros preserved); compare numerically
$runbookR = '0'
foreach ($m in $rbMatches) {
    if ([int]$m.Groups[1].Value -gt [int]$runbookR) { $runbookR = $m.Groups[1].Value }
}

# TECH section-9 span: heading '## <jiu><dun>' (U+4E5D U+3001) up to next '## ' heading or EOF.
$jiu = [char]0x4E5D
$dun = [char]0x3001
$s9 = [regex]::Match($techText, ('(?s)##\s*' + $jiu + $dun + '.*?(?=\r?\n##\s|\z)'))
if (-not $s9.Success) { Fail 'tech-no-section9' }

# Tail round-row number: last '- [DATE<middot>rN' row inside section 9 (U+00B7; U+2705 prefix rows tolerated).
$mid = [char]0x00B7
$rowMatches = [regex]::Matches($s9.Value, ('(?m)^-\s*\[(?:' + [char]0x2705 + '\s*)?\d{4}-\d{2}-\d{2}' + $mid + 'r(\d+)'))
if ($rowMatches.Count -eq 0) { Fail 'tech-section9-no-rows' }
$techR = $rowMatches[$rowMatches.Count - 1].Groups[1].Value

if ([int]$runbookR -eq [int]$techR) {
    Write-Output ('runbook-sync: SYNC runbook=r' + $runbookR + ' tech_tail=r' + $techR)
    exit 0
}
Write-Output ('runbook-sync: DRIFT runbook=r' + $runbookR + ' tech_tail=r' + $techR)
exit 2
