# FluxVerse DevLoop r115: P-12 slice 4 engine faces pipeline (five city-core
# event types get city faces: OS round breath, city verify gate release/
# intercept, fleet transport band). Passes: EventRouterProof main (sandbox
# CEO + five-type state machine + CEO gold pulse regression + 4 face render
# metric gates + leak sweep) -> EventRouterProof reload gate (cross-session
# persistence, r14 stub disease law) -> AudioProof regression (adjacent face
# consumes the same router: r30/r51 drift law - gate widening must not move
# the 7-row audio map). Heartbeat prints every 15s: the outer tool has a
# 5-min no-output watchdog. ASCII-only per PS5.1 encoding law.
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

Write-Output "R115 PIPELINE START (eventrouter main -> reload gate -> audio regression)"
Invoke-ProofPass "eventrouter.run" "eventrouter.done" "FluxVerse.EventRouterProof.BatchRun" "batch-r115-eventrouter.log"
Invoke-ProofPass "eventrouter-reload.run" "eventrouter-reload.done" "FluxVerse.EventRouterProof.ReloadGate" "batch-r115-reload.log"
Invoke-ProofPass "audio.run" "audio.done" "FluxVerse.AudioProof.BatchRun" "batch-r115-audio.log"
Write-Output "R115 PIPELINE GREEN (five city-core faces landed: breath/gate x2/transport + CEO regression + reload + audio)"
