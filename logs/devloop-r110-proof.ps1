# FluxVerse DevLoop r110: barks/bubble/card proof regression pipeline (the
# r106 C slice - stale gate migration for the 32-seat street canon).
# Passes: barks (r107-migrated, first live run) -> bubbles (576/12 stale gates
# -> pool-derived 1080 + root-Transform neighbor law) -> cards (12 -> 32 with
# the P-58 anchor-card layer law) -> three reload gates. Screenshots renamed
# m1-r110-*. Idempotent per proof (sentinel .run single-shot law).
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

Write-Output "R110 PIPELINE START (barks first-run -> bubble 1080 -> cards 32 -> 3 reloads)"
Invoke-ProofPass "barks.run" "barks.done" "FluxVerse.ResidentBarksProof.BatchRun" "batch-r110-barks.log"
Invoke-ProofPass "bubbles.run" "bubbles.done" "FluxVerse.ResidentBubbleProof.BatchRun" "batch-r110-bubbles.log"
Invoke-ProofPass "cards.run" "cards.done" "FluxVerse.ResidentCardProof.BatchRun" "batch-r110-cards.log"
Invoke-ProofPass "barks-reload.run" "barks-reload.done" "FluxVerse.ResidentBarksProof.ReloadGate" "batch-r110-barksreload.log"
Invoke-ProofPass "bubbles-reload.run" "bubbles-reload.done" "FluxVerse.ResidentBubbleProof.ReloadGate" "batch-r110-bubblesreload.log"
Invoke-ProofPass "cards-reload.run" "cards-reload.done" "FluxVerse.ResidentCardProof.ReloadGate" "batch-r110-cardsreload.log"
Write-Output "R110 PIPELINE GREEN (barks live + bubbles 1080-derived + cards 32 + 3 reload gates)"
