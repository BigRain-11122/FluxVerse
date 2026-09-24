# FluxVerse DevLoop r112: office-band v1 engine landing pipeline (P-69 slice:
# street office band, r111 officeband-manifest law). Passes: PS sandbox
# re-gate (manifest vs live tables, r111) -> OfficeProof main (sweep+build+
# idempotent+save+render gates+5 screenshots) -> CameraProof (L1-north baseline
# re-derivation with the new masses in frame, r111 proof_window_rederivations)
# -> ResidentProof main (M07/M03 stand in front of E1: render baselines
# re-derive, r51 drift law) -> NeonProof main (NeonNEScroll/NeonBigstream sit
# 0.19u off the N4 west face) -> OfficeProof reload gate (cross-session
# persistence, LAST so every earlier save is covered). Every proof is an
# idempotent sweep-rebuild from the rules tables, safe to re-run.
# Heartbeat prints every 15s: the outer tool has a 5-min no-output watchdog.
# ASCII-only per PS5.1 encoding law.
$ErrorActionPreference = "Stop"
$repo = "C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse"
$city = Join-Path $repo "City"
$ed = "C:\Program Files\Tuanjie\Hub\Editor\2022.3.62t15\Editor\Tuanjie.exe"

function Invoke-ProofPass($runName, $doneName, $method, $logName) {
    $run = Join-Path $repo ("logs\" + $runName)
    $done = Join-Path $repo ("logs\" + $doneName)
    if (Test-Path $done) { Remove-Item $done -Force }
    Set-Content -Path $run -Value "go" -Encoding ASCII
    $p = Start-Process -FilePath $ed -ArgumentList @(
        "-batchmode", "-quit", "-projectPath", $city,
        "-logFile", (Join-Path $repo ("logs\" + $logName)),
        "-executeMethod", $method) -PassThru
    $sw = [Diagnostics.Stopwatch]::StartNew()
    while (-not $p.HasExited) {
        if ($sw.ElapsedMilliseconds -gt 600000) {
            $p.Kill(); Write-Output ("TIMEOUT " + $method + ": editor killed after 600s"); exit 1
        }
        Write-Output ("  wait " + [int]$sw.Elapsed.TotalSeconds + "s " + $method)
        Start-Sleep -Milliseconds 15000
    }
    Write-Output ("editor exited " + $method + " elapsed_s=" + [int]$sw.Elapsed.TotalSeconds)
    if (Test-Path $done) {
        $txt = Get-Content $done -Raw -Encoding UTF8
        Write-Output $txt
        if (-not $txt.StartsWith("OK")) { Write-Output ("PROOF FAILED " + $method); exit 1 }
    } else { Write-Output ("NO DONE " + $method); exit 1 }
}

Write-Output "R112 PIPELINE START (sandbox -> office -> camera/resident/neon rederive -> office reload)"
# the sandbox script itself calls exit -> must run in a CHILD powershell.exe
# (in-process & would tunnel its exit into this pipeline; $LASTEXITCODE from a
# real child exe is trustworthy per the r97/r65 measurement laws)
$global:LASTEXITCODE = 0
& powershell.exe -NoProfile -ExecutionPolicy Bypass -File (Join-Path $repo "logs\devloop-r111-officeband-test.ps1")
if ($LASTEXITCODE -ne 0) { Write-Output "SANDBOX FAILED"; exit 1 }
Write-Output "R112 SANDBOX GREEN (r111 manifest census re-gate)"
Invoke-ProofPass "office.run" "office.done" "FluxVerse.OfficeProof.BatchRun" "batch-r112-office.log"
Invoke-ProofPass "camera.run" "camera.done" "FluxVerse.CameraProof.BatchRun" "batch-r112-camera.log"
Invoke-ProofPass "resident.run" "resident.done" "FluxVerse.ResidentProof.BatchRun" "batch-r112-resident.log"
Invoke-ProofPass "neon.run" "neon.done" "FluxVerse.NeonProof.BatchRun" "batch-r112-neon.log"
Invoke-ProofPass "office-reload.run" "office-reload.done" "FluxVerse.OfficeProof.ReloadGate" "batch-r112-officereload.log"
Write-Output "R112 PIPELINE GREEN (office band v1 landed: 5 condos, sprite family, census clean, 5 shots, reload pass)"
