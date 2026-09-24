# FluxVerse DevLoop r93: P-69 slice-1 vehicle systematization proof runner.
# Faces: VehicleRules table swap (3 strip-tier sedans 78x36 + animated bus
# 115x62, two avenue placeholder blocks retired, Count 10->8) + VehicleProof
# r93 gates (frame pins / aspect / height-over-residents / retired-path ban)
# -> main pass (scene rebuild + dusk/night shots) + fresh-session reload.
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

Invoke-ProofPass "vehicle.run" "vehicle.done" "FluxVerse.VehicleProof.BatchRun" "batch-r93-vehicle.log"
Invoke-ProofPass "vehicle-reload.run" "vehicle-reload.done" "FluxVerse.VehicleProof.ReloadGate" "batch-r93-vehiclereload.log"
Write-Output "R93 PROOFS GREEN (P-69 vehicle face: main + reload)"
