# devloop-r197-writer-test.ps1 - sandbox for write-fastpath-state.ps1 v1.1 (T-FV-117)
# Supersedes the r196 harness (its 3-line asserts are historical, not re-run).
# ASCII-only body. Chk cond-first (sandbox family law, r192). Child exit codes
# via powershell.exe -File + $LASTEXITCODE (r66 native exit law). State seeds
# live in $env:TEMP - production state file is never touched here.

$ErrorActionPreference = 'Stop'

$repoDir = Split-Path -Parent $PSScriptRoot
$writer  = Join-Path $repoDir 'Tools\devloop\write-fastpath-state.ps1'
$sbDir   = Join-Path $env:TEMP 'fv-r197-writer-sandbox'

if (Test-Path -LiteralPath $sbDir) { Remove-Item -LiteralPath $sbDir -Recurse -Force }
New-Item -ItemType Directory -Path $sbDir | Out-Null

$script:pass = 0
$script:fail = 0
function Chk
{
    param([bool]$Cond, [string]$Name)
    if ($Cond) { $script:pass++ } else { $script:fail++; Write-Output ('  FAIL: ' + $Name) }
}

function Invoke-Writer
{
    param([string[]]$ArgList)
    $out = & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $writer @ArgList
    return @{ Exit = $LASTEXITCODE; Out = ($out -join ' | ') }
}

function Get-Hash12 { param([string]$P) (Get-FileHash -LiteralPath $P -Algorithm SHA256).Hash.Substring(0,12) }
function Seed-State { param([string]$P, [string[]]$SeedLines) [IO.File]::WriteAllLines($P, $SeedLines) }
function Read-Lines { param([string]$P) [IO.File]::ReadAllLines($P) }
function Read-Bytes { param([string]$P) [IO.File]::ReadAllBytes($P) }

$seed4 = @(
    'tech_sha12=111111111111',
    'ledger_sha12=222222222222',
    'dec_sha12=333333333333',
    'orders_sha12=444444444444'
)
$seed3 = @(
    'tech_sha12=AAAAAAAAAAAA',
    'ledger_sha12=BBBBBBBBBBBB',
    'dec_sha12=CCCCCCCCCCCC'
)
$garbage = @('junk line one', 'broken ### key=value', '')

# ---------------- A0 static ----------------
Write-Output 'A0 static'
Chk (Test-Path -LiteralPath $writer) 'A0.1 writer exists'
$src = [IO.File]::ReadAllText($writer)
$bytes = [IO.File]::ReadAllBytes($writer)
$nonAscii = @($bytes | Where-Object { $_ -gt 127 }).Count
Chk ($nonAscii -eq 0) ('A0.2 writer pure ASCII (non-ascii bytes=' + $nonAscii + ')')
Chk (($src -match 'OrdersSha12') -and ($src -match 'orders_sha12')) 'A0.3 orders param + orders key present'
Chk ($src -match 'lines=4') 'A0.4 output reports lines=4'
$autoHit = @('pid','args','input','host','error') | Where-Object { $src -match ('\$' + $_ + '\s*=') }
Chk (@($autoHit).Count -eq 0) ('A0.5 no auto-variable assignment (hits=' + @($autoHit).Count + ')')

# ---------------- A1 good params (garbage seed fully overwritten, 4 lines) ----------------
Write-Output 'A1 good params'
$st = Join-Path $sbDir 'a1-state.txt'
Seed-State -P $st -SeedLines $garbage
$r = Invoke-Writer -ArgList @('-TechSha12','abcdef012345','-LedgerSha12','ABCDEF012345','-DecSha12','0123456789ab','-OrdersSha12','FedCba987654','-StatePath',$st)
Chk ($r.Exit -eq 0) ('A1.1 exit 0 (exit=' + $r.Exit + ' out=' + $r.Out + ')')
Chk (($r.Out -match 'STATE OK') -and ($r.Out -match 'lines=4')) 'A1.2 STATE OK lines=4 reported'
$L = Read-Lines -P $st
Chk (@($L).Count -eq 4) ('A1.3 line count 4 (count=' + @($L).Count + ')')
Chk ($L[0] -eq 'tech_sha12=ABCDEF012345') ('A1.4 tech line uppercased [' + $L[0] + ']')
Chk ($L[1] -eq 'ledger_sha12=ABCDEF012345') 'A1.5 ledger line'
Chk ($L[2] -eq 'dec_sha12=0123456789AB') ('A1.6 dec line uppercased [' + $L[2] + ']')
Chk ($L[3] -eq 'orders_sha12=FEDCBA987654') ('A1.7 orders line uppercased [' + $L[3] + ']')
Chk (-not (Test-Path -LiteralPath ($st + '.new'))) 'A1.8 no .new residue'

# ---------------- A2 bad params (fail loud, zero half-write) ----------------
Write-Output 'A2 bad params'
$st = Join-Path $sbDir 'a2-state.txt'
Seed-State -P $st -SeedLines $seed4
$h0 = Get-Hash12 -P $st
$r = Invoke-Writer -ArgList @('-TechSha12','111111111111','-LedgerSha12','AAAAAAAAAAAA','-DecSha12','BBBBBBBBBBBB','-StatePath',$st)
Chk ($r.Exit -ne 0) ('A2.1 missing -OrdersSha12 fails loud (exit=' + $r.Exit + ')')
Chk ((Get-Hash12 -P $st) -eq $h0) 'A2.2 target untouched after missing-orders call'
$badVals = @('ABCDEF01234','ABCDEF0123456','ZZZZZZZZZZZZ')
foreach ($bv in $badVals) {
    $r = Invoke-Writer -ArgList @('-TechSha12','111111111111','-LedgerSha12','AAAAAAAAAAAA','-DecSha12','BBBBBBBBBBBB','-OrdersSha12',$bv,'-StatePath',$st)
    Chk ($r.Exit -ne 0) ('A2 bad orders value [' + $bv + '] fails loud (exit=' + $r.Exit + ')')
    Chk ((Get-Hash12 -P $st) -eq $h0) ('A2 target untouched after bad value [' + $bv + ']')
}
$r = Invoke-Writer -ArgList @('-TechSha12','111111111111','-LedgerSha12','XX','-DecSha12','BBBBBBBBBBBB','-OrdersSha12','FEDCBA987654','-StatePath',$st)
Chk ($r.Exit -ne 0) 'A2 bad ledger with good orders (regression) fails loud'
Chk ((Get-Hash12 -P $st) -eq $h0) 'A2 target untouched after bad ledger'

# ---------------- A3 KEEP semantics (tech + orders both preserved) ----------------
Write-Output 'A3 KEEP semantics'
$st = Join-Path $sbDir 'a3-state.txt'
Seed-State -P $st -SeedLines $seed4
$r = Invoke-Writer -ArgList @('-TechSha12','KEEP','-LedgerSha12','AAAAAAAAAAAA','-DecSha12','BBBBBBBBBBBB','-OrdersSha12','KEEP','-StatePath',$st)
Chk ($r.Exit -eq 0) ('A3.1 exit 0 (exit=' + $r.Exit + ' out=' + $r.Out + ')')
$L = Read-Lines -P $st
Chk ($L[0] -eq 'tech_sha12=111111111111') ('A3.2 tech KEEP preserved [' + $L[0] + ']')
Chk ($L[1] -eq 'ledger_sha12=AAAAAAAAAAAA') 'A3.3 ledger updated'
Chk ($L[2] -eq 'dec_sha12=BBBBBBBBBBBB') 'A3.4 dec updated'
Chk ($L[3] -eq 'orders_sha12=444444444444') ('A3.5 orders KEEP preserved [' + $L[3] + ']')

# ---------------- A4 KEEP on bad/legacy state (fail loud) ----------------
Write-Output 'A4 KEEP bad-state'
$st = Join-Path $sbDir 'a4-missing.txt'
if (Test-Path -LiteralPath $st) { Remove-Item -LiteralPath $st -Force }
$r = Invoke-Writer -ArgList @('-TechSha12','111111111111','-LedgerSha12','AAAAAAAAAAAA','-DecSha12','BBBBBBBBBBBB','-OrdersSha12','KEEP','-StatePath',$st)
Chk ($r.Exit -ne 0) ('A4.1 orders KEEP on missing file fails (exit=' + $r.Exit + ')')

$st = Join-Path $sbDir 'a4-legacy3.txt'
Seed-State -P $st -SeedLines $seed3
$h3 = Get-Hash12 -P $st
$r = Invoke-Writer -ArgList @('-TechSha12','111111111111','-LedgerSha12','AAAAAAAAAAAA','-DecSha12','BBBBBBBBBBBB','-OrdersSha12','KEEP','-StatePath',$st)
Chk ($r.Exit -ne 0) ('A4.2 orders KEEP on 3-line legacy (no orders key) fails (exit=' + $r.Exit + ')')
Chk ((Get-Hash12 -P $st) -eq $h3) 'A4.3 legacy target untouched'

$st = Join-Path $sbDir 'a4-corrupt.txt'
Seed-State -P $st -SeedLines $garbage
$hg = Get-Hash12 -P $st
$r = Invoke-Writer -ArgList @('-TechSha12','KEEP','-LedgerSha12','AAAAAAAAAAAA','-DecSha12','BBBBBBBBBBBB','-OrdersSha12','FEDCBA987654','-StatePath',$st)
Chk ($r.Exit -ne 0) ('A4.4 tech KEEP on corrupt file fails (exit=' + $r.Exit + ')')
Chk ((Get-Hash12 -P $st) -eq $hg) 'A4.5 corrupt target untouched'

# ---------------- A5 idempotent double-run (byte-identical) ----------------
Write-Output 'A5 idempotent'
$st = Join-Path $sbDir 'a5-state.txt'
Seed-State -P $st -SeedLines $garbage
$null = Invoke-Writer -ArgList @('-TechSha12','ABCDEF012345','-LedgerSha12','111111111111','-DecSha12','222222222222','-OrdersSha12','333333333333','-StatePath',$st)
$b1 = Read-Bytes -P $st
$null = Invoke-Writer -ArgList @('-TechSha12','abcdef012345','-LedgerSha12','111111111111','-DecSha12','222222222222','-OrdersSha12','333333333333','-StatePath',$st)
$b2 = Read-Bytes -P $st
Chk ($null -eq (Compare-Object -ReferenceObject $b1 -DifferenceObject $b2)) 'A5.1 double-run bytes identical (lowercase input normalized)'

# ---------------- A6 garbage seed + bad call = zero touch ----------------
Write-Output 'A6 garbage zero-touch'
$st = Join-Path $sbDir 'a6-state.txt'
Seed-State -P $st -SeedLines $garbage
$before = Read-Bytes -P $st
$r = Invoke-Writer -ArgList @('-TechSha12','KEEP','-LedgerSha12','NOTHEXNOTHEX','-DecSha12','BBBBBBBBBBBB','-OrdersSha12','KEEP','-StatePath',$st)
Chk ($r.Exit -ne 0) ('A6.1 bad call on garbage seed fails loud (exit=' + $r.Exit + ')')
$after = Read-Bytes -P $st
Chk ($null -eq (Compare-Object -ReferenceObject $before -DifferenceObject $after)) 'A6.2 garbage seed bytes untouched'

# ---------------- A7 legacy 3-line migration (all 4 explicit / mixed KEEP) ----------------
Write-Output 'A7 legacy migration'
$st = Join-Path $sbDir 'a7-state.txt'
Seed-State -P $st -SeedLines $seed3
$r = Invoke-Writer -ArgList @('-TechSha12','ABCDEF012345','-LedgerSha12','FEDCBA987654','-DecSha12','0123456789AB','-OrdersSha12','ABCDEFABCDEF','-StatePath',$st)
Chk ($r.Exit -eq 0) ('A7.1 migration exit 0 (exit=' + $r.Exit + ')')
$L = Read-Lines -P $st
Chk (@($L).Count -eq 4) ('A7.2 migrated to 4 lines (count=' + @($L).Count + ')')
Chk ($L[3] -eq 'orders_sha12=ABCDEFABCDEF') ('A7.3 orders line at append position [' + $L[3] + ']')
Seed-State -P $st -SeedLines $seed3
$r = Invoke-Writer -ArgList @('-TechSha12','KEEP','-LedgerSha12','FEDCBA987654','-DecSha12','0123456789AB','-OrdersSha12','ABCDEFABCDEF','-StatePath',$st)
Chk ($r.Exit -eq 0) ('A7.4 tech KEEP + explicit orders on legacy works (exit=' + $r.Exit + ')')
$L = Read-Lines -P $st
Chk ($L[0] -eq 'tech_sha12=AAAAAAAAAAAA') ('A7.5 legacy tech preserved via KEEP [' + $L[0] + ']')

Write-Output ('PASS=' + $script:pass + ' FAIL=' + $script:fail)
if ($script:fail -eq 0) { Write-Output 'ALL GREEN'; exit 0 } else { Write-Output 'HAS RED'; exit 1 }
