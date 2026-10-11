# devloop-r293-checkfast-exit-probe.ps1 - r293 display-face exit-code law probe
# ---------------------------------------------------------------------------
# TECH section-9 r293 row. WHY: check-fastpath.ps1 real exit code had to be
# proven byte-level after the codely shell wrapper displayed Exit Code 1
# (and 0 in another form) for a script that truly exits 2 with zero stderr.
# This probe starts check-fastpath.ps1 via System.Diagnostics.Process and
# reads the REAL exit code + stderr face directly.
# Findings (r293, reproducible):
#   REAL_EXIT=2  STDERR_LEN=0  stdout VERDICT line correct  -> script healthy
#   wrapper display face: -File direct -> "Exit Code: 1" (x2) ;
#   -Command + 'exit $LASTEXITCODE' -> "Exit Code: 0" ; bare -Command
#   "exit 2" -> "Exit Code: 2". Three forms, none equals real 2 for the
#   script-call forms => judge by VERDICT line bytes only (script head v1.4).
# Side-trap also proven here (kept for the fleet PS tool family):
#   PS5.1 Start-Process -PassThru + -NoNewWindow + -RedirectStandard*
#   returned $null .ExitCode (probe v1, deleted; verdict noted in section-9);
#   the .NET Process class is the reliable exit-code read path.
# Re-run: powershell -NoProfile -ExecutionPolicy Bypass -File <this file>
# ASCII-only (PS5.1 GBK law). Read-only vs the repo (child is read-only).
# ---------------------------------------------------------------------------
$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = 'powershell.exe'
$psi.Arguments = '-NoProfile -ExecutionPolicy Bypass -File "' + (Join-Path $PSScriptRoot '..\Tools\devloop\check-fastpath.ps1') + '"'
$psi.WorkingDirectory = (Join-Path $PSScriptRoot '..\Tools\devloop')
$psi.UseShellExecute = $false
$psi.RedirectStandardOutput = $true
$psi.RedirectStandardError = $true
$p = [System.Diagnostics.Process]::Start($psi)
$so = $p.StandardOutput.ReadToEnd()
$se = $p.StandardError.ReadToEnd()
$p.WaitForExit()
Write-Output ('REAL_EXIT=' + $p.ExitCode)
Write-Output ('STDERR_LEN=' + $se.Length)
if ($se.Length -gt 0) {
    Write-Output 'STDERR_HEAD:'
    $lines = ($se -split "`r?`n") | Where-Object { $_ -ne '' } | Select-Object -First 5
    foreach ($l in $lines) { Write-Output ('  ' + $l) }
}
Write-Output 'STDOUT_TAIL:'
foreach ($l in (($so -split "`r?`n") | Select-Object -Last 2)) { Write-Output ('  ' + $l) }
