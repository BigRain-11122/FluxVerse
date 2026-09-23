# FluxVerse market probe fetcher - trading calendar + CSI300 ETF daily bars.
# Called by probes/market.ps1 under a hard 45s process cap (caller enforces).
# Usage: python market_fetch.py <world_dir> <bj_today YYYY-MM-DD>
# Caches (world/, atomic replace - a killed run never corrupts a cache):
#   market-cal.json : as_of / is_trading_day / next_trade_date   (refresh: daily)
#   market-etf.json : last 30 bars [date,o,h,l,c] + summary      (refresh: 30min TTL)
# Source chain (BigMoney same-source law, live-proven 2026-09-23 on this box):
#   calendar: akshare tool_trade_date_hist_sina (live OK, spans to 2026-12-31)
#   kline   : 1. TX stock_zh_a_hist_tx  (live OK, has intraday today bar;
#                BigMoney 09-21 test: values match Sina bar-for-bar)
#             2. Sina stock_zh_a_daily  (BigMoney primary; ETF parse dead
#                today - demjson "No value to decode"; kept for recovery)
#             3. EM fund_etf_hist_em   (RemoteDisconnected today, same as
#                BigMoney 09-21 finding; last resort)
# On any failure: keep stale caches, never raise (caller degrades silently).
# ASCII-only (group PS5.1 GBK encoding law). Chinese names stay in docs.

import json
import os
import socket
import sys
from datetime import datetime, timedelta, timezone

ETF_CODE = '510300'
ETF_SINA = 'sh510300'
ETF_NAME = 'CSI300ETF'          # ascii state label; CN name lives in TECH/DESIGN
ETF_TTL_SEC = 1800              # kline cache TTL (cal cache TTL = as_of day)
BARS_KEEP = 30                  # bars shipped to state (K-line giant screen)
BARS_DAYS_BACK = 70             # ~48 trade bars fetched, keep last BARS_KEEP

os.environ['TQDM_DISABLE'] = '1'  # akshare TX endpoint wraps calls in tqdm

COL_KEYS = {'d': ('date', '\u65e5\u671f'),            # date / CN: ri-qi
            'o': ('open', '\u5f00\u76d8'),            # open / CN: kai-pan
            'h': ('high', '\u6700\u9ad8'),            # high / CN: zui-gao
            'l': ('low', '\u6700\u4f4e'),             # low  / CN: zui-di
            'c': ('close', '\u6536\u76d8')}           # close/ CN: shou-pan
# CN column names enter via \u escapes so this file stays pure ASCII on disk.


def now_utc_iso():
    return datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')


def load_json(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return None


def save_json(path, obj):
    tmp = path + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(obj, f, ensure_ascii=True, separators=(',', ':'))
        f.write('\n')
    os.replace(tmp, path)          # atomic: readers never see a torn cache


def parse_utc(s):
    try:
        return datetime.strptime(str(s), '%Y-%m-%dT%H:%M:%SZ').replace(tzinfo=timezone.utc)
    except Exception:
        return None


def bars_from(df):
    cols = {}
    for tgt, cand in COL_KEYS.items():
        hit = None
        for c in cand:
            if c in df.columns:
                hit = c
                break
        if hit is None:
            return None
        cols[tgt] = hit
    out = []
    for _, r in df.iterrows():
        try:
            out.append([str(r[cols['d']])[0:10],
                        round(float(r[cols['o']]), 3),
                        round(float(r[cols['h']]), 3),
                        round(float(r[cols['l']]), 3),
                        round(float(r[cols['c']]), 3)])
        except Exception:
            continue
    return out or None


def fetch_bars(end_day):
    import akshare as ak
    socket.setdefaulttimeout(20)   # BigMoney law: akshare has no built-in timeout
    start = (datetime.strptime(end_day, '%Y-%m-%d') - timedelta(days=BARS_DAYS_BACK)).strftime('%Y%m%d')
    end = end_day.replace('-', '')
    # 1) Tencent - live-proven, carries the in-flight today bar intraday
    try:
        df = ak.stock_zh_a_hist_tx(symbol=ETF_SINA, start_date=start, end_date=end)
        b = bars_from(df)
        if b:
            return b, 'tx'
    except Exception:
        pass
    # 2) Sina stock endpoint - BigMoney primary, ETF parse dead today
    try:
        df = ak.stock_zh_a_daily(symbol=ETF_SINA, start_date=start, end_date=end)
        b = bars_from(df)
        if b:
            return b, 'sina'
    except Exception:
        pass
    # 3) EastMoney qfq - RemoteDisconnected on this net, last resort
    try:
        df = ak.fund_etf_hist_em(symbol=ETF_CODE, period='daily',
                                 start_date=start, end_date=end, adjust='qfq')
        b = bars_from(df)
        if b:
            return b, 'em'
    except Exception:
        pass
    return None, ''


def refresh_calendar(cal_path, today):
    import akshare as ak
    socket.setdefaulttimeout(15)
    df = ak.tool_trade_date_hist_sina()
    dates = [str(d)[0:10] for d in df['trade_date']]
    nxt = ''
    for d in dates:
        if d > today:
            nxt = d
            break
    save_json(cal_path, {'as_of': today,
                         'is_trading_day': today in dates,
                         'next_trade_date': nxt,
                         'fetched_utc': now_utc_iso(),
                         'source': 'akshare-sina'})
    return True


def refresh_etf(etf_path, today):
    bars, src = fetch_bars(today)
    if not bars:
        return False
    keep = bars[-BARS_KEEP:]
    last = keep[-1]
    prev = keep[-2] if len(keep) > 1 else None
    chg = 0.0
    if prev and prev[4]:
        chg = round((last[4] - prev[4]) / prev[4] * 100, 2)
    save_json(etf_path, {'symbol': ETF_CODE, 'name': ETF_NAME, 'source': src,
                         'fetched_utc': now_utc_iso(),
                         'last_date': last[0], 'last_close': last[4],
                         'change_pct': chg, 'bars': keep})
    return True


def main():
    world = sys.argv[1] if len(sys.argv) > 1 else 'world'
    today = sys.argv[2] if len(sys.argv) > 2 else ''
    cal_path = os.path.join(world, 'market-cal.json')
    etf_path = os.path.join(world, 'market-etf.json')
    status = {'ok_cal': False, 'ok_etf': False}

    cal = load_json(cal_path)
    if (not cal) or cal.get('as_of') != today:
        try:
            status['ok_cal'] = refresh_calendar(cal_path, today)
        except Exception:
            pass
    else:
        status['ok_cal'] = True

    etf = load_json(etf_path)
    ft = parse_utc(etf.get('fetched_utc')) if etf else None
    age = (datetime.now(timezone.utc) - ft).total_seconds() if ft else 1e9
    if age > ETF_TTL_SEC:
        try:
            status['ok_etf'] = refresh_etf(etf_path, today)
        except Exception:
            pass
    else:
        status['ok_etf'] = True

    print(json.dumps(status))


if __name__ == '__main__':
    main()
