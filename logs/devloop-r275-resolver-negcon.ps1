# r275 negative-control sandbox for resolve-repo.ps1 (tech#10, wrapper repo self-location common piece)
# ------------------------------------------------------------------------------------------------
# Captures the three live incident paths (r247/r273/r274, hand $PSScriptRoot level arithmetic):
#   - depth1/depth2/depth3 caller dirs = the old arithmetic's correct-level / under-jump /
#     over-jump paths -> the .git-anchored walk must return the SAME root from all three
#   - contrast asserts show the old arithmetic actually escaping (over-jump -> outside repo)
#     and stalling inside (under-jump) - the silent-success disease the piece kills
#   - no-git tree -> fail-LOUD (throw in-process, exit 1 + stderr in direct mode)
#   - -Marker repo-identity tripwire (missing marker -> refuse, wrong-repo guard)
#   - .git as FILE (worktree form) still resolves
#   - direct-mode subprocess contract (exit 0 + stdout root / exit 1 + stderr reason)
#   - dot-source contract (defines function, harness itself anchored via the piece = dogfood)
#   - real-repo integration from three depths (Tools\devloop / logs\ / repo root / TECH.md file)
#   - determinism double-run byte-identical stdout; TEMP fixture hygiene (zero repo writes)
# ASCII-only (mandate hard-constraint 3). TEMP isolation prefix r275-rslv-.
# Verdict line 'harness: pass=N fail=M', exit 0 iff fail=0.

$ErrorActionPreference = 'Stop'

# harness anchor = the piece under test itself (wrong hop = file-not-found, not a silent wrong
# domain - r274 case-3 fix shape; note $PSCommandPath is the FILE path, one hop deeper than
# $PSScriptRoot - the case-4 under-jump this anchor committed on first run, caught fail-loud)
$toolPath = Join-Path (Split-Path -Parent (Split-Path -Parent $PSCommandPath)) 'Tools\devloop\resolve-repo.ps1'
if (-not (Test-Path -LiteralPath $toolPath)) {
    Write-Output ('FATAL harness anchor: tool not found: ' + $toolPath)
    exit 1
}
. $toolPath   # dot-source mode: defines Resolve-RepoRoot in this scope

$script:pass = 0
$script:fail = 0
$script:results = New-Object System.Collections.ArrayList
function Assert([bool]$Cond, [string]$Name) {
    if ($Cond) { $script:pass++; [void]$script:results.Add(('PASS ' + $Name)) }
    else { $script:fail++; [void]$script:results.Add(('FAIL ' + $Name)) }
}

function Run-ResolverDirect([string]$From, [int]$MaxDepth, [string]$Marker) {
    # .NET Process child: CreateNoWindow + double redirect (window-law / handle-inheritance 29)
    $fromArg = $From.TrimEnd('\')
    $argLine = '-NoProfile -ExecutionPolicy Bypass -File "' + $toolPath + '" -From "' + $fromArg + '" -MaxDepth ' + $MaxDepth
    if ($Marker -ne '') { $argLine = $argLine + ' -Marker "' + $Marker + '"' }
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = 'powershell.exe'
    $psi.Arguments = $argLine
    $psi.UseShellExecute = $false
    $psi.CreateNoWindow = $true
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    $p = [System.Diagnostics.Process]::Start($psi)
    $out = $p.StandardOutput.ReadToEnd()
    $err = $p.StandardError.ReadToEnd()
    $p.WaitForExit()
    return @{ out = $out.Trim(); err = $err.Trim(); code = $p.ExitCode }
}

$utf8 = New-Object System.Text.UTF8Encoding($false)
$tmp = Join-Path ([System.IO.Path]::GetTempPath()) ('r275-rslv-' + [guid]::NewGuid().ToString('N'))
[void](New-Item -ItemType Directory -Path $tmp -Force)

try {
    # ---------- A0 static ----------
    $bytes = [System.IO.File]::ReadAllBytes($toolPath)
    $nonAscii = 0
    foreach ($b in $bytes) { if ($b -gt 0x7F) { $nonAscii++ } }
    Assert ($nonAscii -eq 0) 'A0.1 tool file is pure ASCII'
    Assert (-not ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF)) 'A0.2 tool file has no BOM'

    # ---------- fixtures (all under TEMP, nothing touches the repo) ----------
    $fxRoot = Join-Path $tmp 'repo'
    foreach ($d in @($fxRoot, (Join-Path $fxRoot 'a'), (Join-Path $fxRoot 'a\b'), (Join-Path $fxRoot 'a\b\c'))) {
        [void](New-Item -ItemType Directory -Path $d -Force)
    }
    [void](New-Item -ItemType Directory -Path (Join-Path $fxRoot '.git') -Force)
    [System.IO.File]::WriteAllText((Join-Path $fxRoot 'MARK.txt'), 'fixture-marker', $utf8)
    $noteFile = Join-Path $fxRoot 'a\b\note.txt'
    [System.IO.File]::WriteAllText($noteFile, 'note', $utf8)

    # ---------- A1 three-path depth capture (the r247/r273/r274 disease family) ----------
    Assert ((Resolve-RepoRoot -From (Join-Path $fxRoot 'a')) -eq $fxRoot) 'A1.1 depth1 caller (old-art correct-level path) -> root'
    Assert ((Resolve-RepoRoot -From (Join-Path $fxRoot 'a\b')) -eq $fxRoot) 'A1.2 depth2 caller (old-art under-jump path) -> same root'
    Assert ((Resolve-RepoRoot -From (Join-Path $fxRoot 'a\b\c')) -eq $fxRoot) 'A1.3 depth3 caller (old-art over-jump exit path) -> same root'
    Assert ((Resolve-RepoRoot -From $noteFile) -eq $fxRoot) 'A1.4 file-path input normalized to its directory -> root'

    # contrast: the OLD arithmetic (what the three incidents actually did)
    Assert ((Split-Path -Parent (Split-Path -Parent (Join-Path $fxRoot 'a'))) -ne $fxRoot) 'A1.5 contrast: old two-hop from depth1 escapes the repo (over-jump)'
    Assert ((Split-Path -Parent (Join-Path $fxRoot 'a\b\c')) -ne $fxRoot) 'A1.6 contrast: old one-hop from depth3 stalls inside the repo (under-jump)'

    # ---------- A2 no-git fail-loud ----------
    $fxNoGit = Join-Path $tmp 'nogit\x'
    [void](New-Item -ItemType Directory -Path $fxNoGit -Force)
    $threw = $false; $msg = ''
    try { [void](Resolve-RepoRoot -From $fxNoGit -MaxDepth 2) } catch { $threw = $true; $msg = $_.Exception.Message }
    Assert $threw 'A2.1 no-git tree throws (in-process fail-loud)'
    Assert ($msg -like '*no .git within*') 'A2.2 throw message names the walk cap'

    # ---------- A3 marker tripwire ----------
    $threwM = $false; $msgM = ''
    try { [void](Resolve-RepoRoot -From (Join-Path $fxRoot 'a') -Marker 'MISSING.txt') } catch { $threwM = $true; $msgM = $_.Exception.Message }
    Assert $threwM 'A3.1 missing marker refuses the resolve (wrong-repo guard)'
    Assert ($msgM -like '*wrong repo?*') 'A3.2 marker refusal names the wrong-repo hint'
    Assert ((Resolve-RepoRoot -From (Join-Path $fxRoot 'a') -Marker 'MARK.txt') -eq $fxRoot) 'A3.3 present marker passes'

    # ---------- A4 .git as FILE (worktree form) ----------
    $fxRoot2 = Join-Path $tmp 'repo2\sub'
    [void](New-Item -ItemType Directory -Path $fxRoot2 -Force)
    [System.IO.File]::WriteAllText((Join-Path (Split-Path -Parent $fxRoot2) '.git'), 'gitdir: elsewhere', $utf8)
    Assert ((Resolve-RepoRoot -From $fxRoot2) -eq (Split-Path -Parent $fxRoot2)) 'A4.1 .git-as-file root (worktree form) resolves'

    # ---------- A5 direct-mode subprocess contract ----------
    $r1 = Run-ResolverDirect -From (Join-Path $fxRoot 'a') -MaxDepth 10 -Marker ''
    Assert ($r1.code -eq 0 -and $r1.out -eq $fxRoot -and $r1.err -eq '') 'A5.1 direct happy: exit 0 + stdout root + clean stderr'
    $r2 = Run-ResolverDirect -From $fxNoGit -MaxDepth 2 -Marker ''
    Assert ($r2.code -eq 1 -and $r2.out -eq '' -and $r2.err -like '*resolve-repo:*') 'A5.2 direct fail: exit 1 + empty stdout + stderr reason'
    $r3 = Run-ResolverDirect -From (Join-Path $fxRoot 'a') -MaxDepth 10 -Marker ''
    Assert ($r3.out -ceq $r1.out) 'A5.3 determinism: double-run stdout byte-identical'

    # ---------- A6 dot-source contract (dogfood: this harness is anchored by the piece) ----------
    Assert ($null -ne (Get-Command Resolve-RepoRoot -ErrorAction SilentlyContinue)) 'A6.1 dot-source defines Resolve-RepoRoot in caller scope'

    # ---------- A7 real-repo integration (read-only) ----------
    $truth = Resolve-RepoRoot -From $toolPath        # file -> Tools\devloop -> repo root
    Assert ((Test-Path -LiteralPath (Join-Path $truth 'TECH.md')) -and (Test-Path -LiteralPath (Join-Path $truth '.git'))) 'A7.1 real root carries TECH.md + .git'
    Assert (Test-Path -LiteralPath (Join-Path $truth 'Tools\devloop\resolve-repo.ps1')) 'A7.2 real root carries the tool at its canonical path'
    Assert ((Resolve-RepoRoot -From (Split-Path -Parent $toolPath)) -eq $truth) 'A7.3 from Tools\devloop -> same root'
    Assert ((Resolve-RepoRoot -From (Split-Path -Parent $PSCommandPath)) -eq $truth) 'A7.4 from logs\ -> same root (r247/r274 incident locus)'
    Assert ((Resolve-RepoRoot -From $truth) -eq $truth) 'A7.5 from repo root itself -> same root'
    Assert ((Resolve-RepoRoot -From (Join-Path $truth 'TECH.md')) -eq $truth) 'A7.6 from a repo-root file -> same root'

    # ---------- A8 hygiene ----------
    Remove-Item -LiteralPath $tmp -Recurse -Force
    Assert (-not (Test-Path -LiteralPath $tmp)) 'A8.1 TEMP fixture family fully removed'
}
catch {
    $script:fail++
    [void]$script:results.Add(('FAIL harness-exception: ' + $_.Exception.Message))
    if (Test-Path -LiteralPath $tmp) { Remove-Item -LiteralPath $tmp -Recurse -Force -ErrorAction SilentlyContinue }
}

foreach ($line in $script:results) { Write-Output $line }
Write-Output ('harness: pass=' + $script:pass + ' fail=' + $script:fail)
if ($script:fail -eq 0) { exit 0 } else { exit 1 }
