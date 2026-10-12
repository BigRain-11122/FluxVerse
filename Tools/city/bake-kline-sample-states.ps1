# bake-kline-sample-states.ps1 - M2 K-line giant-screen FOUR-STATE review board (r411)
# Companion to bake-kline-sample.ps1 (explore#102 / r410 single-state sample).
# Reuses its frozen visual language (R-20261012-kline-quant-screen-m2-mapping.md
# v1.0 sections 2.2/2.3/2.4/2.5 + section 3 degradation chain) and renders the
# complete state machine as ONE review board: AFTER_CLOSE (r410 sample state,
# last-bar gold highlight), LIVE (in-session, pending-close outline candle),
# CLOSED (market shut, half-dim + next trading day), STALE (feed stale,
# maintenance line + half-dim). States are FORCED per panel for review;
# trigger conditions are printed on each strip (honesty: board is a design
# review artifact, not a live feed claim).
# Data: world/world-state.json reality.market (READ-ONLY, perceptor single-writer).
# Zero engine, zero GPU, zero LLM touchpoints (Token gate L1). Meta stamps are
# data-derived (no wall clock baked into pixels) so double-run SHA idempotence
# is exact. ASCII-only body (PS5.1 GBK law); CJK built from code points.

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root       = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)   # Tools\city -> Tools -> repo root
$statePath  = Join-Path $root 'world\world-state.json'
$outPath    = Join-Path $root 'docs\design\m2-kline-giant-screen-sample-states.png'
$reportPath = Join-Path $root 'logs\r411-kline-states-bake.txt'

# ---------- data ----------
$raw = [IO.File]::ReadAllText($statePath)
$world = $raw | ConvertFrom-Json
$m = $world.reality.market
$bars = @($m.bars)
if ($bars.Count -ne 30) { throw "bars count $($bars.Count) -ne 30" }

# ---------- CJK via code points ----------
function CJK([int[]]$codes) { -join ($codes | ForEach-Object { [char]$_ }) }
$dot     = CJK @(0x00B7)
$tInTra  = CJK @(0x4EA4,0x6613,0x4E2D)                        # trading in progress
$tPend   = CJK @(0x4ECA,0x65E5,0x70DB,0x5F85,0x6536,0x76D8)   # today candle pending close
$tClosed = CJK @(0x5DF2,0x6536,0x76D8)                        # already closed
$tOff    = CJK @(0x4F11,0x5E02)                                # market shut
$tNext   = CJK @(0x4E0B,0x4E00,0x4EA4,0x6613,0x65E5)          # next trading day
$tMaint  = CJK @(0x884C,0x60C5,0x901A,0x9053,0x7EF4,0x62A4,0x4E2D)  # feed under maintenance
$tPendS  = CJK @(0x5F85,0x6536,0x76D8)                        # pending close
$sAft    = CJK @(0x6536,0x76D8,0x540E)                        # after close
$sLive   = CJK @(0x76D8,0x4E2D)                                # in session
$sShut   = CJK @(0x4F11,0x5E02)                                # market shut
$sMaint  = CJK @(0x7EF4,0x62A4)                                # maintenance

# ---------- canonical colors (five-color law anchors, same as r410 sample) ----------
$cRed   = [System.Drawing.Color]::FromArgb(255, 56, 41)    # up candle (alert-red family)
$cCyan  = [System.Drawing.Color]::FromArgb(77, 242, 255)   # down candle (data-cyan family)
$cGold  = [System.Drawing.Color]::FromArgb(255, 204, 77)   # accents (capital-gold family)
$cWhite = [System.Drawing.Color]::FromArgb(255, 255, 255)

# ---------- geometry ----------
$W = 1920; $PH = 520
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

# board layout: title strip + 4 panels, each with its own label strip
$titleH = 66; $stripH = 34; $gap = 26
$script:panels = @(
    @{ st = 'AFTER_CLOSE'; cjk = $sAft;  yStrip = $titleH },
    @{ st = 'LIVE';        cjk = $sLive; yStrip = 0 },
    @{ st = 'CLOSED';      cjk = $sShut; yStrip = 0 },
    @{ st = 'STALE';       cjk = $sMaint; yStrip = 0 }
)
$y = $titleH
for ($k = 0; $k -lt 4; $k++) {
    $script:panels[$k].yStrip = $y
    $script:panels[$k].yPanel = $y + $stripH
    $y = $y + $stripH + $PH + $gap
}
$y = $y - $gap + 12
$footH = 34
$H = $y + $footH

# fonts (script scope, reused across panels)
$fName  = New-Object System.Drawing.Font('Microsoft YaHei', 40, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$fBig   = New-Object System.Drawing.Font('Microsoft YaHei', 34, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$fStat  = New-Object System.Drawing.Font('Microsoft YaHei', 22, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$fPendF = New-Object System.Drawing.Font('Microsoft YaHei', 17, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$fMeta  = New-Object System.Drawing.Font('Consolas', 16, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$fGrid  = New-Object System.Drawing.Font('Consolas', 16, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$fTitle = New-Object System.Drawing.Font('Microsoft YaHei', 30, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$fStrip = New-Object System.Drawing.Font('Microsoft YaHei', 20, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$fSub   = New-Object System.Drawing.Font('Consolas', 16, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$fTick  = New-Object System.Drawing.Font('Consolas', 13, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$fFoot  = New-Object System.Drawing.Font('Consolas', 14, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)

# ---------- panel renderer (frozen visual language of r410 sample, state forced) ----------
function RenderPanel([string]$st) {
    $bmp = New-Object System.Drawing.Bitmap($W, $PH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::Default
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias

    $rect = New-Object System.Drawing.Rectangle(0, 0, $W, $PH)
    $bg1 = [System.Drawing.Color]::FromArgb(6, 8, 18)
    $bg2 = [System.Drawing.Color]::FromArgb(14, 18, 34)
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $bg1, $bg2, [System.Drawing.Drawing2D.LinearGradientMode]::Vertical)
    $g.FillRectangle($brush, $rect)

    $scan = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(16, 0, 0, 0))
    for ($yy = 0; $yy -lt $PH; $yy += 4) { $g.FillRectangle($scan, 0, $yy, $W, 1) }

    # gold bezel + amplitude edge band (R- 2.5, honest: only when |pct| >= 2)
    $edgeOn = ([Math]::Abs([double]$m.etf_change_pct) -ge 2.0)
    $penBezel = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(140, $cGold), 3)
    $g.DrawRectangle($penBezel, 4, 4, $W - 9, $PH - 9)
    if ($edgeOn) {
        $penEdge = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(200, $cGold), 12)
        $g.DrawRectangle($penEdge, 12, 12, $W - 25, $PH - 25)
    }

    # grid: 3 horizontal gold 20% reference lines (R- 2.5)
    $penGrid = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(51, $cGold), 1)
    $brGridTxt = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(120, $cGold))
    $gridYs = @( ($chY0 + $chH * 0.25), ($chY0 + $chH * 0.5), ($chY0 + $chH * 0.75) )
    foreach ($gy in $gridYs) {
        $g.DrawLine($penGrid, $chX0, $gy, $chX1, $gy)
        $pv = $script:top - (($gy - $chY0) / $chH) * ($script:top - $script:bot)
        $g.DrawString(('{0:F2}' -f $pv), $fGrid, $brGridTxt, $chX0 + 4, $gy - 20)
    }

    # slots: 31 in LIVE (pending outline candle), else 30
    $slots = 30
    if ($st -eq 'LIVE') { $slots = 31 }
    $slotW = $chW / $slots
    $bodyW = [Math]::Max(14, [Math]::Floor($slotW * 0.5))
    $script:geoSlotW = $slotW; $script:geoBodyW = $bodyW; $script:geoSlots = $slots

    # date ticks: first / mid / last bar (time reference; data-derived -> idempotence-safe)
    $brTick = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(150, $cGold))
    foreach ($ti in @(0, 14, 29)) {
        $tx = $chX0 + $slotW * ($ti + 0.5)
        $ts = [string]$bars[$ti][0]
        $szT = $g.MeasureString($ts, $fTick)
        $g.DrawString($ts, $fTick, $brTick, [float]($tx - $szT.Width / 2), [float]($chY1 + 6))
    }

    # candles: 30 bars, old -> new, left -> right (R- 2.2 red-up / cyan-down, wick 60%)
    for ($i = 0; $i -lt 30; $i++) {
        $b = $bars[$i]
        $o = [double]$b[1]; $h = [double]$b[2]; $l = [double]$b[3]; $c = [double]$b[4]
        $up = $c -ge $o
        $bodyColor = $cCyan; if ($up) { $bodyColor = $cRed }
        $cx = $chX0 + $slotW * ($i + 0.5)
        $penWick = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(153, $bodyColor), 3)
        $g.DrawLine($penWick, $cx, (YOf $h), $cx, (YOf $l))
        $yTop = YOf ([Math]::Max($o, $c)); $yBot = YOf ([Math]::Min($o, $c))
        $bh = $yBot - $yTop; if ($bh -lt 3) { $bh = 3 }
        $brBody = New-Object System.Drawing.SolidBrush($bodyColor)
        $g.FillRectangle($brBody, [int]($cx - $bodyW / 2), [int]$yTop, $bodyW, [int]$bh)
    }

    # state layer (R- 2.3 / 2.4)
    if ($st -eq 'LIVE') {
        $cx = $chX0 + $slotW * 30.5
        $pX = [int]($cx - $bodyW / 2); $pW = $bodyW
        # modest fixed-height outline (visual honesty: not readable as a huge-swing day)
        $pY = [int]($chY0 + $chH * 0.40); $pH = [int]($chH * 0.22)
        $penPend = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(95, $cWhite), 2)
        $penPend.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
        $g.DrawRectangle($penPend, $pX, $pY, $pW, $pH)
        $brPend = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(205, 210, 220, 235))
        $szPend = $g.MeasureString($tPendS, $fPendF)
        $g.DrawString($tPendS, $fPendF, $brPend, [float]($cx - $szPend.Width / 2), [float]($pY + $pH + 8))
    }
    if ($st -eq 'AFTER_CLOSE') {
        $b = $bars[29]
        $h29 = [double]$b[2]; $l29 = [double]$b[3]
        $cx = $chX0 + $slotW * 29.5
        $x0 = [int]($cx - $bodyW / 2) - 5; $x1 = [int]($cx + $bodyW / 2) + 5
        $y0 = [int](YOf $h29) - 5; $y1 = [int](YOf $l29) + 5
        $penHi = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(220, $cGold), 2)
        $g.DrawRectangle($penHi, $x0, $y0, $x1 - $x0, $y1 - $y0)
    }

    # corner block (R- 2.5): name + close + change_pct
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

    # meta stamp: data-derived only (idempotence-safe, no wall clock)
    $brMeta = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(150, 160, 175, 195))
    $metaTxt = 'review state={0} bars=30 data={1}' -f $st, $m.etf_last_date
    $szMeta = $g.MeasureString($metaTxt, $fMeta)
    $g.DrawString($metaTxt, $fMeta, $brMeta, [float]($W - $szMeta.Width - 36), 26)

    # bottom status band (R- 2.5, one line)
    $penSep = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(38, $cGold), 1)
    $g.DrawLine($penSep, 40, 442, $W - 40, 442)
    $brStat = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 226, 232, 242))
    $statusTxt = ''
    if ($st -eq 'LIVE')            { $statusTxt = '{0} {1} {2} {3} {4} 30D' -f $tInTra, $dot, $tPend, $dot, $m.etf_symbol }
    elseif ($st -eq 'AFTER_CLOSE') { $statusTxt = '{0} {1} {2} {3} {4}' -f $tClosed, $dot, $m.etf_symbol, $dot, $m.etf_last_date }
    elseif ($st -eq 'CLOSED')      { $statusTxt = '{0} {1} {2} {3} {4}' -f $tOff, $dot, $tNext, $dot, $m.cal_next_trade_date }
    else                           { $statusTxt = $tMaint }
    $g.DrawString($statusTxt, $fStat, $brStat, 48, 458)

    # half-dim overlay: CLOSED 110 / STALE 140 (one step darker) + maintenance scan line
    if ($st -eq 'CLOSED' -or $st -eq 'STALE') {
        $dimA = 110
        if ($st -eq 'STALE') { $dimA = 140 }
        $dim = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb($dimA, 2, 3, 8))
        $g.FillRectangle($dim, 0, 0, $W, $PH)
        $g.DrawString($statusTxt, $fStat, $brStat, 48, 458)
    }
    if ($st -eq 'STALE') {
        # maintenance differentiator: dashed gold scan line (drawn after dim so it stays lit;
        # starts x=150 to clear the left price label it would otherwise strike through)
        $penScan = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(130, $cGold), 2)
        $penScan.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
        $g.DrawLine($penScan, 150, 248, $W - 150, 248)
    }

    $g.Dispose()
    return $bmp
}

# ---------- board renderer ----------
function RenderBoard {
    $board = New-Object System.Drawing.Bitmap($W, $H, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($board)
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias

    $rect = New-Object System.Drawing.Rectangle(0, 0, $W, $H)
    $bg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(10, 12, 22))
    $g.FillRectangle($bg, $rect)

    # board title (ASCII) + data provenance right side
    $brGold = New-Object System.Drawing.SolidBrush($cGold)
    $g.DrawString('M2 K-LINE GIANT SCREEN - FOUR-STATE REVIEW BOARD', $fTitle, $brGold, 40, 16)

    # panel strips: index + state (ASCII + CJK) + trigger condition
    $cond = @{
        'AFTER_CLOSE' = 'trading day 15:00+ last bar gold highlight = r410 sample state'
        'LIVE'         = 'is_trading_day=true 09:30-15:00 + pending-close outline candle (no OHLC, honesty)'
        'CLOSED'       = 'is_trading_day=false half-dim + next trading day'
        'STALE'        = 'etf_fetched_utc stale >24h maintenance line + half-dim (degradation chain)'
    }
    for ($k = 0; $k -lt 4; $k++) {
        $p = $script:panels[$k]
        $stripTxt = '[{0}] {1} {2}  {3}' -f ($k + 1), $p.st, $p.cjk, $cond[$p.st]
        $g.DrawString($stripTxt, $fStrip, $brGold, 40, $p.yStrip + 4)
        $penSep = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(90, $cGold), 1)
        $g.DrawLine($penSep, 0, $p.yPanel - 2, $W, $p.yPanel - 2)
        $pnl = RenderPanel $p.st
        $g.DrawImage($pnl, 0, $p.yPanel)
        $pnl.Dispose()
    }

    # footer: dual-anchor legend + provenance (kept out of the prime reading area)
    $brFoot = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(140, 150, 165, 185))
    $foot = 'sample bars=30 data={0} close={1:F3} pct={2:+0.00;-0.00}% | states forced per panel | candle red/cyan = close vs open (same day) | corner pct = close vs prev close | source: world-state reality.market read-only' -f $m.etf_last_date, [double]$m.etf_last_close, [double]$m.etf_change_pct
    $g.DrawString($foot, $fFoot, $brFoot, 40, $H - 26)

    $g.Dispose()
    return $board
}

# ---------- structural gates (data sanity, same anchors as r410 bake) ----------
$gateFail = 0
$report = New-Object System.Collections.ArrayList
$redN = 0; $cynN = 0
$prevDate = ''
foreach ($b in $bars) {
    if ($prevDate -ne '' -and [string]$b[0] -le $prevDate) { throw ('bar dates not increasing at ' + $b[0]) }
    $prevDate = [string]$b[0]
    if ([double]$b[4] -ge [double]$b[1]) { $redN++ } else { $cynN++ }
}
if ($redN -lt 1 -or $cynN -lt 1) { throw "red/cyan split $redN/$cynN" }
$i0 = 0; $i1 = 1
for ($k = 0; $k -lt 30; $k++) {
    if ([string]$bars[$k][0] -eq '2026-08-21') { $i0 = $k }
    if ([string]$bars[$k][0] -eq '2026-08-24') { $i1 = $k }
}
$bar0 = $bars[$i0]; $bar1 = $bars[$i1]
if (-not ([double]$bar0[4] -ge [double]$bar0[1])) { throw 'anchor 08-21 must be red (up)' }
if (-not ([double]$bar1[4] -lt [double]$bar1[1])) { throw 'anchor 08-24 must be cyan (down)' }
[void]$report.Add(('BAKE-KLINE-STATES board=4-state bars=30 red={0} cyan={1} anchors=08-21red/08-24cyan' -f $redN, $cynN))

# ---------- per-panel pixel gates ----------
function CheckPanel([System.Drawing.Bitmap]$pnl, [string]$st) {
    $f = 0
    $slotW = $script:geoSlotW; $bodyW = $script:geoBodyW
    # anchor candle geometry (panel-local coordinates)
    $cx0 = [int]($chX0 + $slotW * ($i0 + 0.5))
    $cx1 = [int]($chX0 + $slotW * ($i1 + 0.5))
    $yMid0 = [int](((YOf ([double]$bar0[2])) + (YOf ([double]$bar0[3]))) / 2)
    $yMid1 = [int](((YOf ([double]$bar1[2])) + (YOf ([double]$bar1[3]))) / 2)
    $dimmed = ($st -eq 'CLOSED' -or $st -eq 'STALE')

    # G1: anchor bar 0 body red family (full sat when lit, dimmed below 200 when half-dim)
    $p = $pnl.GetPixel($cx0, $yMid0)
    if ($dimmed) {
        if ($p.R -lt 200 -and $p.R -gt 25) { [void]$report.Add("G1 $st dim-red OK") } else { $f++; [void]$report.Add(('G1 {0} FAIL r={1}' -f $st, $p.R)) }
    } else {
        if ($p.R -gt 200 -and ($p.R - $p.G) -gt 120) { [void]$report.Add("G1 $st anchor-red-body OK") } else { $f++; [void]$report.Add(('G1 {0} FAIL r={1} g={2}' -f $st, $p.R, $p.G)) }
    }

    # G2: anchor bar 1 cyan family
    $p = $pnl.GetPixel($cx1, $yMid1)
    if ($dimmed) {
        if ($p.B -lt 230) { [void]$report.Add("G2 $st dim-cyan OK") } else { $f++; [void]$report.Add(('G2 {0} FAIL b={1}' -f $st, $p.B)) }
    } else {
        if ($p.B -gt 200 -and ($p.B - $p.R) -gt 120) { [void]$report.Add("G2 $st anchor-cyan-body OK") } else { $f++; [void]$report.Add(('G2 {0} FAIL r={1} b={2}' -f $st, $p.R, $p.B)) }
    }

    # G3: state layer evidence
    if ($st -eq 'LIVE') {
        # dashed pen: single-pixel probe can land in a dash gap -> scan 20px window along left edge
        $cxP = [int]($chX0 + $slotW * 30.5)
        $xP = [int]($cxP - $bodyW / 2)
        $yP = [int]($chY0 + $chH * 0.41)
        $found = $false
        for ($dy = 0; $dy -lt 20; $dy++) {
            $p = $pnl.GetPixel($xP, $yP + $dy)
            if ($p.R -gt 40) { $found = $true; break }
        }
        if ($found) { [void]$report.Add('G3 LIVE pending-outline OK') } else { $f++; [void]$report.Add('G3 LIVE FAIL outline not found in 20px window') }
    } elseif ($st -eq 'AFTER_CLOSE') {
        $cx29 = [int]($chX0 + $slotW * 29.5)
        $y = [int](YOf ([double]$bars[29][2])) - 5
        $p = $pnl.GetPixel([int]($cx29 - $bodyW / 2) - 5, $y)
        if ($p.R -gt 120 -and ($p.R - $p.B) -gt 60) { [void]$report.Add('G3 AFTER_CLOSE lastbar-gold-highlight OK') } else { $f++; [void]$report.Add(('G3 AFTER_CLOSE FAIL r={0} b={1}' -f $p.R, $p.B)) }
    } else {
        # CLOSED / STALE: dim overlay proven by anchor body darkened (covered by G1 dim branch); check status redraw lit below
    }

    # G4: status band CJK lit (tofu gate)
    $lit = 0
    for ($x = 44; $x -lt 900; $x++) {
        for ($y = 452; $y -lt 500; $y++) {
            $p = $pnl.GetPixel($x, $y)
            if (($p.R + $p.G + $p.B) -gt 240) { $lit++ }
        }
    }
    if ($lit -ge 300) { [void]$report.Add("G4 $st status-cjk-lit OK lit=$lit") } else { $f++; [void]$report.Add("G4 $st FAIL lit=$lit") }

    return $f
}

# render panels individually for pixel gates (geometry vars set per render)
$pnlA = RenderPanel 'AFTER_CLOSE'; $gateFail += CheckPanel $pnlA 'AFTER_CLOSE'
$pnlL = RenderPanel 'LIVE';        $gateFail += CheckPanel $pnlL 'LIVE'
$pnlC = RenderPanel 'CLOSED';      $gateFail += CheckPanel $pnlC 'CLOSED'
$pnlS = RenderPanel 'STALE';       $gateFail += CheckPanel $pnlS 'STALE'

# extra LIVE-only gates: grid gold hit + honest edge band
$gyMid = [int]($chY0 + $chH * 0.5)
$hit = 0
for ($x = $chX0; $x -lt $chX1; $x++) {
    $p = $pnlL.GetPixel($x, $gyMid)
    if ($p.R -gt 40 -and $p.R -lt 100 -and ($p.R - $p.B) -ge 10) { $hit++ }
}
if ($hit -ge 150) { [void]$report.Add("G5 grid-gold-20pct OK hit=$hit") } else { $gateFail++; [void]$report.Add("G5 FAIL hit=$hit") }

$p = $pnlL.GetPixel(20, 260)
if ($p.R -lt 100) { [void]$report.Add('G6 edge-band-off OK (honesty: |pct|<2 on all panels)') } else { $gateFail++; [void]$report.Add(('G6 FAIL band shown despite |pct|<2 r={0}' -f $p.R)) }

# G10: STALE maintenance scan line lit (dash-gap robust window in a candle gap) + CLOSED same spot NOT lit
$lineLit = 0
for ($dx = 0; $dx -lt 28; $dx++) {
    $p = $pnlS.GetPixel(941 + $dx, 248)
    if ($p.R -gt 90) { $lineLit++ }
}
if ($lineLit -ge 5) { [void]$report.Add("G10 stale-scanline OK litpx=$lineLit") } else { $gateFail++; [void]$report.Add("G10 FAIL litpx=$lineLit") }
$p = $pnlC.GetPixel(955, 248)
if ($p.R -lt 100) { [void]$report.Add('G10 closed-no-scanline OK (visual split proven)') } else { $gateFail++; [void]$report.Add(('G10 closed FAIL r={0}' -f $p.R)) }

# G11: date tick lit on AFTER_CLOSE panel (last bar date in tick band)
$tickX = [int]($chX0 + $script:geoSlotW * 29.5)
$tLit = 0
for ($dx = -40; $dx -lt 40; $dx++) {
    for ($dy = 0; $dy -lt 14; $dy++) {
        $p = $pnlA.GetPixel($tickX + $dx, 426 + $dy)
        if (($p.R + $p.G + $p.B) -gt 250) { $tLit++ }
    }
}
if ($tLit -ge 20) { [void]$report.Add("G11 date-tick OK lit=$tLit") } else { $gateFail++; [void]$report.Add("G11 FAIL lit=$tLit") }

$pnlA.Dispose(); $pnlL.Dispose(); $pnlC.Dispose(); $pnlS.Dispose()

# ---------- board composite + save ----------
$board = RenderBoard
$board.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

# ---------- board strip gates (CJK labels lit on all four strips) ----------
for ($k = 0; $k -lt 4; $k++) {
    $ys = $script:panels[$k].yStrip
    $lit = 0
    for ($x = 36; $x -lt 1400; $x++) {
        for ($y = $ys; $y -lt ($ys + $stripH); $y++) {
            $p = $board.GetPixel($x, $y)
            if (($p.R + $p.G + $p.B) -gt 300) { $lit++ }
        }
    }
    if ($lit -ge 120) { [void]$report.Add("G7 strip$($k + 1)-lit OK lit=$lit") } else { $gateFail++; [void]$report.Add("G7 strip$($k + 1) FAIL lit=$lit") }
}

# G12: footer legend lit (dual-anchor note readable)
$flit = 0
for ($x = 36; $x -lt 1500; $x++) {
    for ($yy = $H - 26; $yy -lt $H - 4; $yy++) {
        $p = $board.GetPixel($x, $yy)
        if (($p.R + $p.G + $p.B) -gt 240) { $flit++ }
    }
}
if ($flit -ge 80) { [void]$report.Add("G12 footer-lit OK lit=$flit") } else { $gateFail++; [void]$report.Add("G12 FAIL lit=$flit") }

# ---------- idempotence (double render, data-derived stamps -> exact SHA) ----------
$sha1 = (Get-FileHash $outPath -Algorithm SHA256).Hash
$board2 = RenderBoard
$out2 = Join-Path $env:TEMP 'kline-states-run2.png'
$board2.Save($out2, [System.Drawing.Imaging.ImageFormat]::Png)
$board2.Dispose()
$sha2 = (Get-FileHash $out2 -Algorithm SHA256).Hash
if ($sha1 -eq $sha2) {
    [void]$report.Add("G8 idempotence OK sha12=$($sha1.Substring(0,12))")
    Remove-Item $out2 -Force
} else {
    $gateFail++
    [void]$report.Add('G8 FAIL sha mismatch (pixel-diff diagnosis skipped: stamps data-derived)')
    Remove-Item $out2 -Force
}
$board.Dispose()

# ---------- ASCII audit ----------
$bytes = [IO.File]::ReadAllBytes($PSCommandPath)
$nonAscii = 0
foreach ($bt in $bytes) { if ($bt -gt 127) { $nonAscii++ } }
if ($nonAscii -eq 0) { [void]$report.Add('G9 ascii-audit OK') } else { $gateFail++; [void]$report.Add("G9 FAIL nonAscii=$nonAscii") }

[void]$report.Add(('RESULT gates_fail={0} out={1}' -f $gateFail, $outPath))
[IO.File]::WriteAllText($reportPath, ($report -join "`r`n"), (New-Object System.Text.UTF8Encoding($false)))
$report | ForEach-Object { Write-Host $_ }
if ($gateFail -gt 0) { exit 1 }
Write-Host 'BAKE OK'
exit 0
