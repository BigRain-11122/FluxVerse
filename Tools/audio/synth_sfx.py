#!/usr/bin/env python3
"""FluxVerse brand signature SFX synthesizer (self-produced track).

Rationale (why self-production for these):
  - Signature faces of the city (CEO_ORDER pulse, gate tones, market bells,
    alerts, welcome chime, motif) must be brand-owned with zero license
    obligations (AA library rule: signature faces never come from pools).
  - Fully deterministic synthesis -> L1 local-first (zero token, zero API).

Usage:
  python synth_sfx.py --out <output_dir>

Outputs 10 mono->stereo 44.1kHz 16-bit WAV files, ~-3 dBFS peak, click-free.
Script body is ASCII-only (encoding law: Chinese lives in data files only).
"""

import argparse
import math
import os
import struct
import wave

SR = 44100
TWO_PI = 2.0 * math.pi


def _env_exp(n, decay):
    return [math.exp(-decay * i / SR) for i in range(n)]


def _silence(dur):
    return [0.0] * int(dur * SR)


def _mix(dst, src, at):
    """Add src into dst starting at sample index `at`, growing dst if needed."""
    need = at + len(src)
    if need > len(dst):
        dst.extend([0.0] * (need - len(dst)))
    for i, v in enumerate(src):
        dst[at + i] += v


def _bell(f0, dur, partials, soft=0.004):
    """Additive inharmonic bell: partials = list of (ratio, amp, decay)."""
    n = int(dur * SR)
    out = [0.0] * n
    for ratio, amp, decay in partials:
        ph = 0.0
        for i in range(n):
            out[i] += amp * math.sin(TWO_PI * f0 * ratio * i / SR) * math.exp(-decay * i / SR)
    # soften attack
    a = int(soft * SR)
    for i in range(min(a, n)):
        out[i] *= i / max(a, 1)
    return out


def _note(freq, dur, amp=0.5, attack=0.008, release=None):
    n = int(dur * SR)
    a = int(attack * SR)
    r = int((release if release is not None else dur * 0.7) * SR)
    out = []
    ph = 0.0
    inc = TWO_PI * freq / SR
    for i in range(n):
        g = 1.0
        if i < a:
            g = i / max(a, 1)
        elif i > n - r:
            g = max(0.0, (n - i) / max(r, 1))
        out.append(amp * g * math.sin(ph))
        ph += inc
    return out


def _sweep(f1, f2, dur, amp=0.5, attack=0.02):
    """Linear pitch sweep, sine."""
    n = int(dur * SR)
    a = int(attack * SR)
    out = []
    ph = 0.0
    for i in range(n):
        g = i / max(a, 1) if i < a else 1.0
        f = f1 + (f2 - f1) * (i / n)
        ph += TWO_PI * f / SR
        out.append(amp * g * math.sin(ph))
    return out


def _hum(freq, dur, amp=0.4, blend=0.15):
    """Sine + a touch of octave, gentle."""
    n = int(dur * SR)
    out = []
    for i in range(n):
        t = i / SR
        g = min(1.0, t / 0.05) * min(1.0, (dur - t) / 0.12)
        out.append(amp * g * (math.sin(TWO_PI * freq * t) + blend * math.sin(TWO_PI * freq * 2 * t)))
    return out


def _siren(f_lo, f_hi, cycle, dur, amp=0.45):
    """Two-phase siren sweep (triangle-shaped pitch curve), sine core."""
    n = int(dur * SR)
    out = []
    ph = 0.0
    half = int(cycle * SR)
    for i in range(n):
        p = (i % (2 * half)) / (2 * half)
        frac = p if p < 0.5 else 1.0 - p
        frac *= 2.0
        f = f_lo + (f_hi - f_lo) * frac
        ph += TWO_PI * f / SR
        g = min(1.0, i / (0.02 * SR)) * min(1.0, (n - i) / (0.15 * SR))
        out.append(amp * g * math.sin(ph))
    return out


def _shimmer(freqs, dur, amp=0.10, decay=3.0):
    """High sparkle partials fading fast."""
    n = int(dur * SR)
    out = [0.0] * n
    for f in freqs:
        for i in range(n):
            out[i] += amp * math.sin(TWO_PI * f * i / SR) * math.exp(-decay * i / SR)
    return out


def _normalize_stereo(mono, width=0.0006, gain=0.71):
    """Mono -> stereo with 1-2 sample Haes slight widening, normalize to gain."""
    peak = max(abs(v) for v in mono) or 1.0
    mono = [v / peak * gain for v in mono]
    d = int(width * SR)
    left = mono[:]
    right = [0.0] * len(mono)
    for i, v in enumerate(mono):
        right[i] += v * 0.96
        if i + d < len(mono):
            right[i + d] += v * 0.04
    return left, right


def _write_wav(path, mono):
    left, right = _normalize_stereo(mono)
    data = bytearray()
    for l, r in zip(left, right):
        data += struct.pack('<hh', int(max(-1.0, min(1.0, l)) * 32767),
                            int(max(-1.0, min(1.0, r)) * 32767))
    with wave.open(path, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(bytes(data))
    return os.path.getsize(path), len(mono) / SR


def build(out_dir):
    os.makedirs(out_dir, exist_ok=True)
    made = {}

    # 1. ceo_order_pulse -- "pure white light" burst: clean major stack, no grit.
    m = _silence(2.2)
    for f, a in [(523.25, 0.34), (659.25, 0.30), (783.99, 0.26), (1046.5, 0.22)]:
        _mix(m, _note(f, 1.8, amp=a, release=1.7), 0)
    _mix(m, _note(130.81, 1.2, amp=0.22, release=1.0), 0)  # sub body
    _mix(m, _shimmer([2093.0, 2637.0, 3136.0], 1.2, amp=0.08, decay=4.0), 0)
    made['ceo_order_pulse.wav'] = _write_wav(os.path.join(out_dir, 'ceo_order_pulse.wav'), m)

    # 2. fluxverse_motif -- hummable 4-note rising arpeggio over open-fifth pad.
    m = _silence(3.2)
    _mix(m, _hum(110.0, 3.0, amp=0.16), 0)
    _mix(m, _hum(164.81, 3.0, amp=0.13), 0)
    for i, f in enumerate([659.25, 880.0, 1108.73, 1318.51]):
        _mix(m, _note(f, 0.9, amp=0.42, release=0.8), int(i * 0.55 * SR))
    _mix(m, _shimmer([2093.0, 2637.0], 1.0, amp=0.06, decay=3.5), int(3 * 0.55 * SR))
    made['fluxverse_motif.wav'] = _write_wav(os.path.join(out_dir, 'fluxverse_motif.wav'), m)

    # 3. gate_pass -- rising perfect fifth sweep + sparkle (G1'/G2 light gate open).
    m = _silence(0.75)
    _mix(m, _sweep(523.25, 783.99, 0.42, amp=0.5), 0)
    _mix(m, _note(783.99, 0.45, amp=0.30, release=0.4), int(0.42 * SR))
    _mix(m, _shimmer([2093.0, 2637.0], 0.35, amp=0.10, decay=6.0), int(0.42 * SR))
    made['gate_pass.wav'] = _write_wav(os.path.join(out_dir, 'gate_pass.wav'), m)

    # 4. gate_block -- low double pulse, red intercept.
    m = _silence(0.6)
    for k in range(2):
        at = int(k * 0.22 * SR)
        _mix(m, _hum(110.0, 0.18, amp=0.55, blend=0.35), at)
        _mix(m, _note(220.0, 0.16, amp=0.30, release=0.1), at)
    made['gate_block.wav'] = _write_wav(os.path.join(out_dir, 'gate_block.wav'), m)

    # 5. citywatch_welcome -- warm rising C-major arpeggio (city lord enters).
    m = _silence(1.7)
    for i, f in enumerate([523.25, 659.25, 783.99, 1046.5]):
        _mix(m, _note(f, 0.7, amp=0.36, release=0.6), int(i * 0.16 * SR))
    _mix(m, _hum(130.81, 1.5, amp=0.15), 0)
    made['citywatch_welcome.wav'] = _write_wav(os.path.join(out_dir, 'citywatch_welcome.wav'), m)

    # 6. market_bell_open -- double bell strike (MARKET_OPEN, Shanghai bell canon).
    partials = [(1.0, 0.5, 2.2), (2.0, 0.28, 3.5), (2.4, 0.18, 5.0), (3.0, 0.14, 6.0), (4.5, 0.08, 8.0)]
    m = _silence(2.4)
    _mix(m, _bell(880.0, 1.6, partials), 0)
    _mix(m, _bell(880.0, 1.6, partials), int(0.9 * SR))
    made['market_bell_open.wav'] = _write_wav(os.path.join(out_dir, 'market_bell_open.wav'), m)

    # 7. market_bell_close -- single lower bell (MARKET_CLOSE, half-dim mode).
    partials2 = [(1.0, 0.5, 2.6), (2.0, 0.24, 4.0), (2.4, 0.14, 5.5), (3.0, 0.10, 7.0)]
    m = _silence(1.9)
    _mix(m, _bell(659.25, 1.8, partials2), 0)
    made['market_bell_close.wav'] = _write_wav(os.path.join(out_dir, 'market_bell_close.wav'), m)

    # 8. s0_red_alert -- two-cycle siren, urgent but clean (no saw grit).
    m = _silence(2.8)
    _mix(m, _siren(660.0, 990.0, 1.1, 2.8, amp=0.5), 0)
    _mix(m, _hum(165.0, 2.8, amp=0.10), 0)
    made['s0_red_alert.wav'] = _write_wav(os.path.join(out_dir, 's0_red_alert.wav'), m)

    # 9. s1_zone_warning -- gentle two-tone hum x2 (zone anomaly, yellow glow).
    m = _silence(1.6)
    for k in range(2):
        _mix(m, _hum(293.66, 0.55, amp=0.32), int(k * 0.8 * SR))
        _mix(m, _hum(440.0, 0.55, amp=0.22), int((k * 0.8 + 0.28) * SR))
    made['s1_zone_warning.wav'] = _write_wav(os.path.join(out_dir, 's1_zone_warning.wav'), m)

    # 10. os_breath -- one soft low pulse (10-min OS cycle breath light).
    m = _silence(1.3)
    n = int(1.3 * SR)
    body = []
    for i in range(n):
        t = i / SR
        g = math.sin(math.pi * min(1.0, t / 1.3)) ** 2.0
        body.append(g * 0.5 * (math.sin(TWO_PI * 220.0 * t) + 0.4 * math.sin(TWO_PI * 110.0 * t)))
    _mix(m, body, 0)
    made['os_breath.wav'] = _write_wav(os.path.join(out_dir, 'os_breath.wav'), m)

    return made


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', required=True, help='output directory for WAV files')
    args = ap.parse_args()
    made = build(args.out)
    total = 0
    for name, (size, dur) in made.items():
        print('%-26s %7.2fs %8d bytes' % (name, dur, size))
        total += size
    print('TOTAL: %d files, %d bytes (%.1f KB)' % (len(made), total, total / 1024.0))


if __name__ == '__main__':
    main()
