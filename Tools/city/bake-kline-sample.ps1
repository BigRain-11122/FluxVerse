# bake-kline-sample.ps1 - M2 K-line giant-screen GDI+ design sample (explore#102)
# Renders R-20261012-kline-quant-screen-m2-mapping.md v1.0 section 2 visual language.
# Five-color law (canonical, EventRouter.cs anchors): up-candle red RGB(255,56,41)
# (alert-red family), down-candle cyan RGB(77,242,255) (data-cyan family),
# gold accents RGB(255,204,77) (QUANT capital-gold family). Zero volume bars.
# Data source: world/world-state.json reality.market (READ-ONLY, perceptor single-writer).
# ASCII-only body (PS5.1 GBK law); all CJK built from code points.

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root      = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)   # Tools\city -> Tools -> repo root
$statePath = Join-Path $root 'world\world-state.json'
$outPath   = Join-Path $root 'docs\design\m2-kline-giant-screen-sample.png'
$reportPath= Join-Path $root 'logs\r410-kline-bake.txt'

# ---------- data ----------
$raw = [IO.File]::ReadAllText($statePath)
$world = $raw | ConvertFrom-Json
$m = $world.reality.market
$bars = @($m.bars)
if ($bars.Count -ne 30) { throw "bars count $($bars.Count) -ne 30" }

# PS5.1 'Z' trap law: strip trailing Z, ParseExact without timezone conversion.
$fetchedUtc = [DateTime]::ParseExact($m.etf_fetched_utc.TrimEnd('Z'), 'yyyy-MM-ddTHH:mm:ss', [Globalization.CultureInfo]::InvariantCulture)
$utcNow = [DateTime]::UtcNow
$staleHours = ($utcNow - $fetchedUtc).TotalHours
$bj = $utcNow.AddHours(8)
$bjMinutes = $bj.Hour * 60 + $bj.Minute
$inWindow = ($bjMinutes -ge 570) -and ($bjMinutes -lt 900)   # 09:30..15:00 exclusive

$state = 'AFTER_CLOSE'
if ($staleHours -gt 24) { $state = 'STALE' }
elseif (-not $m.is_trading_day) { $state = 'CLOSED' }
elseif ($inWindow) { $state = 'LIVE' }

# ---------- CJK via code points ----------
function CJK([int[]]$codes) { -join ($codes | ForEach-Object { [char]$_ }) }
$dot     = CJK @(0x00B7)
$tInTra  = CJK @(0x4EA4,0x6613,0x4E2D)                        # trading-in-progress
$tPend   = CJK @(0x4ECA,0x65E5,0x70DB,0x5F85,0x6536,0x76D8)   # today's-candle-pending-close
$tClosed = CJK @(0x5DF2,0x6536,0x76D8)                        # already-closed
$tOff    = CJK @(0x4F11,0x5E02)                                # market-closed
$tNext   = CJK @(0x4E0B,0x4E00,0x4EA4,0x6613,0x65E5)          # next-trading-day
$tMaint  = CJK @(0x884C,0x60C5,0x901A,0x9053,0x7EF4,0x62A4,0x4E2D)  # market-feed-under-maintenance
$tPendS  = CJK @(0x5F85,0x6536,0x76D8)                        # pending-close

# ---------- canonical colors ----------
$cRed   = [System.Drawing.Color]::FromArgb(255, 56, 41)    # up candle (alert-red family)
$cCyan  = [System.Drawing.Color]::FromArgb(77, 242, 255)   # down candle (data-cyan family)
$cGold  = [System.Drawing.Color]::FromArgb(255, 204, 77)   # accents (capital-gold family)
$cWhite = [System.Drawing.Color]::FromArgb(255, 255, 255)

# ---------- canvas ----------
$W = 1920; $H = 520
$chX0 = 80; $chX1 = 1840; $chY0 = 100; $chY1 = 420
$chW = $chX1 - $chX0; $chH = $chY1 - $chY0

$hi = 0.0; $lo = 0.0
foreach ($b in $bars) {
    if ([double]$b[2] -gt $hi) { $hi = [double]$b[2] }
    if ($lo -eq 0.0 -or [double]$b[3] -lt $lo) { $lo = [double]$b[3] }
}
$pad = ($hi - $lo) * 0.08
$script:top = $hi + $pad; $script:bot = $lo - $pad

function YOf([double]$p) { $script:chY0 + (($script:top - $p) / ($script:top - $script:bot)) * $script:chH }

$slots = 30
if ($state -eq 'LIVE') { $slots = 31 }
$slotW = $chW / $slots
$bodyW = [Math]::Max(14, [Math]::Floor($slotW * 0.5))

function SlotCenter([int]$i) { $script:chX0 + $script:slotW * ($i + 0.5) }

# ---------- render ----------
function Render {
    $bmp = New-Object System.Drawing.Bitmap($W, $H, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::Default
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias

    # background: deep night vertical gradient (night sky family)
    $rect = New-Object System.Drawing.Rectangle(0, 0, $W, $H)
    $bg1 = [System.Drawing.Color]::FromArgb(6, 8, 18)
    $bg2 = [System.Drawing.Color]::FromArgb(14, 18, 34)
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $bg1, $bg2, [System.Drawing.Drawing2D.LinearGradientMode]::Vertical)
    $g.FillRectangle($brush, $rect)

    # holographic scanlines
    $scan = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(16, 0, 0, 0))
    for ($y = 0; $y -lt $H; $y += 4) { $g.FillRectangle($scan, 0, $y, $W, 1) }

    # gold bezel frame + edge band (amplitude gate: |pct| >= 2.0 shows edge glow, R- section 2.5)
    $edgeOn = ([Math]::Abs([double]$m.etf_change_pct) -ge 2.0)
    $penBezel = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(140, $cGold), 3)
    $g.DrawRectangle($penBezel, 4, 4, $W - 9, $H - 9)
    if ($edgeOn) {
        $penEdge = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(200, $cGold), 12)
        $g.DrawRectangle($penEdge, 12, 12, $W - 25, $H - 25)
    }

    # grid: 3 horizontal reference lines, gold 20% (R- section 2.5)
    $penGrid = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(51, $cGold), 1)
    $fGridPrice = New-Object System.Drawing.Font('Consolas', 16, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $brGridTxt = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(120, $cGold))
    $gridYs = @( ($chY0 + $chH * 0.25), ($chY0 + $chH * 0.5), ($chY0 + $chH * 0.75) )
    foreach ($gy in $gridYs) {
        $g.DrawLine($penGrid, $chX0, $gy, $chX1, $gy)
        $pv = $script:top - (($gy - $chY0) / $chH) * ($script:top - $script:bot)
        $g.DrawString(('{0:F2}' -f $pv), $fGridPrice, $brGridTxt, $chX0 + 4, $gy - 20)
    }

    # candles: 30 bars, old -> new, left -> right
    for ($i = 0; $i -lt 30; $i++) {
        $b = $bars[$i]
        $o = [double]$b[1]; $h = [double]$b[2]; $l = [double]$b[3]; $c = [double]$b[4]
        $up = $c -ge $o
        $bodyColor = $cCyan; if ($up) { $bodyColor = $cRed }
        $cx = SlotCenter $i
        # wick: same hue at 60% opacity (R- section 2.2)
        $penWick = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(153, $bodyColor), 3)
        $g.DrawLine($penWick, $cx, (YOf $h), $cx, (YOf $l))
        # body: full saturation, min height 3px
        $yTop = YOf ([Math]::Max($o, $c)); $yBot = YOf ([Math]::Min($o, $c))
        $bh = $yBot - $yTop; if ($bh -lt 3) { $bh = 3 }
        $brBody = New-Object System.Drawing.SolidBrush($bodyColor)
        $g.FillRectangle($brBody, [int]($cx - $bodyW / 2), [int]$yTop, $bodyW, [int]$bh)
    }

    # state-specific layer
    if ($state -eq 'LIVE') {
        # pending-close candle: semi-transparent outline only, no OHLC (honesty, R- section 2.4)
        $cx = SlotCenter 30
        $pX = [int]($cx - $bodyW / 2); $pW = $bodyW
        $pY = [int]($chY0 + $chH * 0.30); $pH = [int]($chH * 0.40)
        $penPend = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(95, $cWhite), 2)
        $penPend.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
        $g.DrawRectangle($penPend, $pX, $pY, $pW, $pH)
        $fPend = New-Object System.Drawing.Font('Microsoft YaHei', 17, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
        $brPend = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(205, 210, 220, 235))
        $szPend = $g.MeasureString($tPendS, $fPend)
        $g.DrawString($tPendS, $fPend, $brPend, [float]($cx - $szPend.Width / 2), [float]($pY + $pH + 8))
    }
    if ($state -eq 'AFTER_CLOSE') {
        # last bar highlight (R- section 2.3 closing state)
        $b = $bars[29]
        $h = [double]$b[2]; $l = [double]$b[3]
        $cx = SlotCenter 29
        $x0 = [int]($cx - $bodyW / 2) - 5; $x1 = [int]($cx + $bodyW / 2) + 5
        $y0 = [int](YOf $h) - 5; $y1 = [int](YOf $l) + 5
        $penHi = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(220, $cGold), 2)
        $g.DrawRectangle($penHi, $x0, $y0, $x1 - $x0, $y1 - $y0)
    }

    # corner block (R- section 2.5): name + close + change_pct, gold accents
    $fName = New-Object System.Drawing.Font('Microsoft YaHei', 40, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $fBig  = New-Object System.Drawing.Font('Microsoft YaHei', 34, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $brGold = New-Object System.Drawing.SolidBrush($cGold)
    $g.DrawString(('CSI300ETF {0}' -f $m.etf_symbol), $fName, $brGold, 40, 22)
    $brWhite = New-Object System.Drawing.SolidBrush($cWhite)
    $closeTxt = '{0:F3}' -f [double]$m.etf_last_close
    $g.DrawString($closeTxt, $fBig, $brWhite, 42, 74)
    $szClose = $g.MeasureString($closeTxt, $fBig)
    $pct = [double]$m.etf_change_pct
    $pctColor = $cCyan; if ($pct -ge 0) { $pctColor = $cRed }
    $pctTxt = ('{0:+0.00;-0.00}%' -f $pct)
    $brPct = New-Object System.Drawing.SolidBrush($pctColor)
    $g.DrawString($pctTxt, $fBig, $brPct, [float](48 + $szClose.Width + 14), 74)

    # meta stamp top-right (sample provenance, ASCII)
    $fMeta = New-Object System.Drawing.Font('Consolas', 16, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $brMeta = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(150, 160, 175, 195))
    $metaTxt = 'sample {0:yyyy-MM-ddTHH:mm}Z state={1} bars=30' -f $utcNow, $state
    $szMeta = $g.MeasureString($metaTxt, $fMeta)
    $g.DrawString($metaTxt, $fMeta, $brMeta, [float]($W - $szMeta.Width - 36), 26)

    # bottom status band: one line (R- section 2.5)
    $penSep = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(38, $cGold), 1)
    $g.DrawLine($penSep, 40, 442, $W - 40, 442)
    $fStat = New-Object System.Drawing.Font('Microsoft YaHei', 22, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $brStat = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 226, 232, 242))
    $statusTxt = ''
    if ($state -eq 'LIVE')             { $statusTxt = '{0} {1} {2} {3} {4} 30D' -f $tInTra, $dot, $tPend, $dot, $m.etf_symbol }
    elseif ($state -eq 'AFTER_CLOSE')  { $statusTxt = '{0} {1} {2} {3} {4}' -f $tClosed, $dot, $m.etf_symbol, $dot, $m.etf_last_date }
    elseif ($state -eq 'CLOSED')       { $statusTxt = '{0} {1} {2} {3} {4}' -f $tOff, $dot, $tNext, $dot, $m.cal_next_trade_date }
    else                               { $statusTxt = $tMaint }
    $g.DrawString($statusTxt, $fStat, $brStat, 48, 458)

    # half-dim overlay for closed / maintenance states (R- section 2.3)
    if ($state -eq 'CLOSED' -or $state -eq 'STALE') {
        $dim = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(110, 2, 3, 8))
        $g.FillRectangle($dim, 0, 0, $W, $H)
        # re-draw status line above the dim for readability (status text stays legible per spec)
        $g.DrawString($statusTxt, $fStat, $brStat, 48, 458)
    }

    $g.Dispose()
    return $bmp
}

# ---------- structural gates ----------
$redN = 0; $cynN = 0
$prevDate = ''
foreach ($b in $bars) {
    if ($prevDate -ne '' -and [string]$b[0] -le $prevDate) { throw ('bar dates not increasing at ' + $b[0]) }
    $prevDate = [string]$b[0]
    if ([double]$b[4] -ge [double]$b[1]) { $redN++ } else { $cynN++ }
}
if ($redN -lt 1 -or $cynN -lt 1) { throw "red/cyan split $redN/$cynN" }
$bar0 = $null; $bar1 = $null
foreach ($b in $bars) {
    if ([string]$b[0] -eq '2026-08-21') { $bar0 = $b }
    if ([string]$b[0] -eq '2026-08-24') { $bar1 = $b }
}
if ($null -eq $bar0 -or $null -eq $bar1) { throw 'anchor bars 2026-08-21/24 missing' }
if (-not ([double]$bar0[4] -ge [double]$bar0[1])) { throw 'anchor 08-21 must be red (up)' }
if (-not ([double]$bar1[4] -lt [double]$bar1[1])) { throw 'anchor 08-24 must be cyan (down)' }

# ---------- render + pixel gates ----------
$bmp = Render
$bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

$gateFail = 0
$report = New-Object System.Collections.ArrayList
[void]$report.Add(('BAKE-KLINE-SAMPLE state={0} bj={1:HH:mm} stale_h={2:F1} bars=30 red={3} cyan={4}' -f $state, $bj, $staleHours, $redN, $cynN))

# gate P1: anchor bar 0 (2026-08-21) body center is red family
$i0 = 0; $i1 = 1
for ($k = 0; $k -lt 30; $k++) {
    if ([string]$bars[$k][0] -eq '2026-08-21') { $i0 = $k }
    if ([string]$bars[$k][0] -eq '2026-08-24') { $i1 = $k }
}
$cx0 = [int](SlotCenter $i0)
$yMid0 = [int](((YOf ([double]$bar0[2])) + (YOf ([double]$bar0[3]))) / 2)
$p = $bmp.GetPixel($cx0, $yMid0)
if ($p.R -gt 200 -and ($p.R - $p.G) -gt 120) { [void]$report.Add('P1 anchor-red-body OK') } else { $gateFail++; [void]$report.Add(('P1 FAIL r={0} g={1} b={2}' -f $p.R, $p.G, $p.B)) }

# gate P2: anchor bar 1 (2026-08-24) body center is cyan family
$cx1 = [int](SlotCenter $i1)
$yMid1 = [int](((YOf ([double]$bar1[2])) + (YOf ([double]$bar1[3]))) / 2)
$p = $bmp.GetPixel($cx1, $yMid1)
if ($p.B -gt 200 -and ($p.B - $p.R) -gt 120) { [void]$report.Add('P2 anchor-cyan-body OK') } else { $gateFail++; [void]$report.Add(('P2 FAIL r={0} g={1} b={2}' -f $p.R, $p.G, $p.B)) }

# gate P3: wick of anchor bar 1 is same hue at 60% (dimmer than body)
$p = $bmp.GetPixel($cx1, [int](YOf ([double]$bar1[2])) + 2)
if (($p.B - $p.R) -gt 60 -and $p.B -gt 110 -and $p.B -lt 230) { [void]$report.Add('P3 wick-60pct-cyan OK') } else { $gateFail++; [void]$report.Add(('P3 FAIL r={0} g={1} b={2}' -f $p.R, $p.G, $p.B)) }

# gate P4: grid rows carry gold-dim signature (>= 150 px on middle grid line)
$gy = [int]($chY0 + $chH * 0.5)
$hit = 0
for ($x = $chX0; $x -lt $chX1; $x++) {
    $p = $bmp.GetPixel($x, $gy)
    if ($p.R -gt 40 -and $p.R -lt 100 -and ($p.R - $p.B) -ge 10) { $hit++ }
}
if ($hit -ge 150) { [void]$report.Add("P4 grid-gold-20pct OK hit=$hit") } else { $gateFail++; [void]$report.Add("P4 FAIL hit=$hit") }

# gate P5: state layer evidence
if ($state -eq 'LIVE') {
    $cx = [int](SlotCenter 30)
    $p = $bmp.GetPixel([int]($cx - $bodyW / 2), [int]($chY0 + $chH * 0.31))
    if ($p.R -gt 40) { [void]$report.Add('P5 pending-outline OK') } else { $gateFail++; [void]$report.Add(('P5 FAIL r={0}' -f $p.R)) }
} elseif ($state -eq 'AFTER_CLOSE') {
    $b = $bars[29]
    $cx = [int](SlotCenter 29)
    $y = [int](YOf ([double]$b[2])) - 5
    $p = $bmp.GetPixel([int]($cx - $bodyW / 2) - 5, $y)
    if ($p.R -gt 120 -and ($p.R - $p.B) -gt 60) { [void]$report.Add('P5 lastbar-gold-highlight OK') } else { $gateFail++; [void]$report.Add(('P5 FAIL r={0} b={1}' -f $p.R, $p.B)) }
} else {
    # CLOSED / STALE: dim overlay means mid-chart candle pixel darkened below full-sat body
    $p = $bmp.GetPixel([int](SlotCenter $i0), $yMid0)
    if ($p.R -lt 200) { [void]$report.Add('P5 dim-overlay OK') } else { $gateFail++; [void]$report.Add(('P5 FAIL r={0}' -f $p.R)) }
}

# gate P6: CJK status text lit pixels (tofu gate)
$lit = 0
for ($x = 44; $x -lt 900; $x++) {
    for ($y = 452; $y -lt 500; $y++) {
        $p = $bmp.GetPixel($x, $y)
        if (($p.R + $p.G + $p.B) -gt 240) { $lit++ }
    }
}
if ($lit -ge 300) { [void]$report.Add("P6 status-cjk-lit OK lit=$lit") } else { $gateFail++; [void]$report.Add("P6 FAIL lit=$lit") }

# gate P7: edge band honesty (|pct| >= 2 required to show)
$edgeOn = ([Math]::Abs([double]$m.etf_change_pct) -ge 2.0)
if ($edgeOn) {
    $p = $bmp.GetPixel(20, 260)
    if ($p.R -gt 150) { [void]$report.Add('P7 edge-band-on OK') } else { $gateFail++; [void]$report.Add(('P7 FAIL band missing r={0}' -f $p.R)) }
} else {
    $p = $bmp.GetPixel(20, 260)
    if ($p.R -lt 100) { [void]$report.Add('P7 edge-band-off OK (honesty: |pct|<2)') } else { $gateFail++; [void]$report.Add('P7 FAIL band shown despite |pct|<2') }
}

$bmp.Dispose()

# gate P8: double-run SHA256 idempotence (pixel-diff diagnosis on mismatch)
$sha1 = (Get-FileHash $outPath -Algorithm SHA256).Hash
$bmp2 = Render
$out2 = Join-Path $env:TEMP 'kline-sample-run2.png'
$bmp2.Save($out2, [System.Drawing.Imaging.ImageFormat]::Png)
$sha2 = (Get-FileHash $out2 -Algorithm SHA256).Hash
if ($sha1 -eq $sha2) {
    [void]$report.Add("P8 idempotence OK sha12=$($sha1.Substring(0,12))")
    Remove-Item $out2 -Force
} else {
    $gateFail++
    $re1 = New-Object System.Drawing.Bitmap($outPath)
    $diffN = 0; $dx = -1; $dy = -1
    for ($x = 0; $x -lt $W; $x++) {
        for ($y = 0; $y -lt $H; $y++) {
            $a = $re1.GetPixel($x, $y); $b = $bmp2.GetPixel($x, $y)
            if ($a -ne $b) { $diffN++; if ($dx -lt 0) { $dx = $x; $dy = $y } }
        }
    }
    [void]$report.Add("P8 FAIL sha mismatch diff_px=$diffN first=($dx,$dy) r1=$(if($dx -ge 0){$re1.GetPixel($dx,$dy).ToString()}) r2=$(if($dx -ge 0){$bmp2.GetPixel($dx,$dy).ToString()})")
    $re1.Dispose()
    Remove-Item $out2 -Force
}

# gate P9: ASCII audit of this script body
$bytes = [IO.File]::ReadAllBytes($PSCommandPath)
$nonAscii = 0
foreach ($bt in $bytes) { if ($bt -gt 127) { $nonAscii++ } }
if ($nonAscii -eq 0) { [void]$report.Add('P9 ascii-audit OK') } else { $gateFail++; [void]$report.Add("P9 FAIL nonAscii=$nonAscii") }

[void]$report.Add(('RESULT gates_fail={0} out={1}' -f $gateFail, $outPath))
[IO.File]::WriteAllText($reportPath, ($report -join "`r`n"), (New-Object System.Text.UTF8Encoding($false)))
$report | ForEach-Object { Write-Host $_ }
if ($gateFail -gt 0) { exit 1 }
Write-Host 'BAKE OK'
exit 0
