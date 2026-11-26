import type { CityData, CityEvent } from "../types";
import { isLive } from "../data";
import { formatClock, fmtHM } from "../util";

// HUD mirrors the 硅基生命元宇宙.html visual language (dark #060a13,
// teal #5eead4 accents). Entirely JS-built so dev and dist entries stay
// byte-identical.

const CSS = `
#cw-hud{position:fixed;inset:0;z-index:10;pointer-events:none;font-family:'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif;color:#c3cfe2;font-variant-numeric:tabular-nums}
#cw-hud .panel{position:absolute;background:linear-gradient(135deg,rgba(11,17,32,.88),rgba(9,14,26,.82));border:1px solid #22304a;border-radius:12px;padding:12px 14px;backdrop-filter:blur(4px)}
#cw-tl{top:14px;left:14px;width:284px}
#cw-h1{font-size:17px;color:#fff;letter-spacing:1px;font-weight:700}
#cw-h1 b{color:#5eead4}
#cw-sub{font-size:10.5px;color:#93a4ba;margin-top:2px}
#cw-clock{font-size:21px;color:#5eead4;font-weight:700;margin-top:8px;letter-spacing:2px}
#cw-phase{font-size:11px;color:#93a4ba;margin-left:8px}
#cw-weather{font-size:11.5px;color:#93a4ba;margin-top:3px}
#cw-stats{display:grid;grid-template-columns:1fr 1fr;gap:6px 10px;margin-top:10px}
#cw-stats .st .n{font-size:15px;color:#e8f4ff;font-weight:700}
#cw-stats .st .l{font-size:9.5px;color:#71829b;margin-top:1px}
#cw-zones{margin-top:10px}
#cw-zones .z{margin-top:6px}
#cw-zones .zl{display:flex;justify-content:space-between;font-size:10.5px;color:#9fb8d0}
#cw-zones .zb{height:4px;background:#0a1120;border:1px solid #1a2538;border-radius:3px;margin-top:2px;overflow:hidden}
#cw-zones .zf{height:100%;border-radius:2px;transition:width .8s}
#cw-fleet{margin-top:10px;font-size:10px;color:#71829b;line-height:1.7}
#cw-fleet .m{display:flex;gap:6px;align-items:baseline}
#cw-fleet .dot{width:7px;height:7px;border-radius:50%;flex:none;align-self:center}
#cw-tr{top:14px;right:14px;width:300px}
#cw-tr h3{font-size:11px;color:#5eead4;margin:0 0 6px;letter-spacing:1px}
#cw-events{font-size:10.5px;line-height:1.8;color:#9fb8d0}
#cw-events .ev{display:flex;gap:7px}
#cw-events .ts{color:#5a6c84;flex:none}
#cw-events .ty{color:#dbe6f5;flex:none;font-weight:600}
#cw-bb{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);background:rgba(9,14,26,.85);border:1px solid #1a2538;border-radius:20px;padding:5px 16px;font-size:10.5px;color:#93a4ba;white-space:nowrap}
#cw-bb b{color:#93a4ba}
#cw-cam{position:absolute;bottom:12px;left:14px;font-size:10.5px;color:#5eead4;background:rgba(9,14,26,.8);border:1px solid #1a2538;border-radius:8px;padding:4px 10px}
#cw-perf{position:absolute;top:14px;right:330px;font-size:10px;color:#93a4ba;background:rgba(9,14,26,.7);border:1px solid #1a2538;border-radius:6px;padding:3px 8px;font-variant-numeric:tabular-nums}
#cw-demo{position:absolute;top:14px;left:50%;transform:translateX(-50%);background:#4a1d1d;border:1px solid #f87171;color:#fecaca;font-size:10.5px;border-radius:8px;padding:4px 12px}
.cwf-data{color:#fbbf24}.cwf-quant{color:#fbbf24}.cwf-gaming{color:#5eead4}.cwf-media{color:#f472b6}.cwf-governance{color:#60a5fa}
`;

export interface Hud {
  root: HTMLElement;
  setClock: (d: Date, phase: string) => void;
  ticker: (e: CityEvent) => void;
  setCam: (label: string) => void;
  setPerf: (calls: number, tris: number, fps: number) => void;
}

export function buildHud(data: CityData): Hud {
  const style = document.createElement("style");
  style.textContent = CSS;
  document.head.appendChild(style);

  const root = document.createElement("div");
  root.id = "cw-hud";

  const zoneColor = (id: string): string =>
    id === "gaming" ? "#5eead4" : id === "quant" ? "#fbbf24" : id === "media" ? "#f472b6" : "#60a5fa";

  // ---- top left ----
  const tl = document.createElement("div");
  tl.className = "panel";
  tl.id = "cw-tl";
  const st = data.city ?? {};
  tl.innerHTML = `
<div id="cw-h1">硅基城市 <b>FLUX VERSE</b></div>
<div id="cw-sub">城即超体 · 集团实时镜像 · three.js</div>
<div><span id="cw-clock">--:--:--</span><span id="cw-phase"></span></div>
<div id="cw-weather"></div>
<div id="cw-stats">
  <div class="st"><div class="n" id="cw-res">${(data.census_total ?? 0).toLocaleString()}</div><div class="l">硅基居民</div></div>
  <div class="st"><div class="n" id="cw-games">${st.games_total ?? "-"}<span style="font-size:10px;color:#5eead4"> · ${st.games_active ?? "-"} 活</span></div><div class="l">游戏 / 在产</div></div>
  <div class="st"><div class="n" id="cw-commits">${(st.commits_total ?? 0).toLocaleString()}</div><div class="l">累计提交</div></div>
  <div class="st"><div class="n" id="cw-fleetn">${st.fleet_online ?? 0}/${data.fleet.length}</div><div class="l">机队在线</div></div>
</div>
<div id="cw-zones"></div>
<div id="cw-fleet"></div>`;
  root.appendChild(tl);

  const weather = data.reality;
  const weatherEl = tl.querySelector("#cw-weather") as HTMLElement;
  const kindMap: Record<string, string> = { clear: "晴", cloud: "多云", rain: "雨", snow: "雪", wind: "风" };
  weatherEl.textContent = `上海 ${kindMap[weather.weather_kind] ?? weather.weather_kind} ${weather.weather_temp_c}°C · ${weather.season === "autumn" ? "秋" : weather.season === "winter" ? "冬" : weather.season === "spring" ? "春" : "夏"}`;

  const zonesEl = tl.querySelector("#cw-zones") as HTMLElement;
  const statusMap: Record<string, string> = { active: "活跃", dormant: "休眠" };
  for (const z of data.zones) {
    const row = document.createElement("div");
    row.className = "z";
    const act = Math.max(0, Math.min(1, z.activity));
    row.innerHTML = `<div class="zl"><span>${z.name} · ${statusMap[z.status] ?? z.status}</span><span>${(act * 100).toFixed(0)}%</span></div>
<div class="zb"><div class="zf" style="width:${(act * 100).toFixed(0)}%;background:${zoneColor(z.id)}"></div></div>`;
    zonesEl.appendChild(row);
  }

  const fleetEl = tl.querySelector("#cw-fleet") as HTMLElement;
  for (const m of data.fleet) {
    if (m.cores <= 0) continue;
    const row = document.createElement("div");
    row.className = "m";
    const task = (m.current_task ?? "").substring(0, 26);
    row.innerHTML = `<span class="dot" style="background:${m.online ? "#4ade80" : "#39485e"}"></span>
<span style="color:#93a4ba">${m.id}</span><span style="color:#5a6c84;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${task}</span>`;
    fleetEl.appendChild(row);
  }

  // ---- top right: event ticker ----
  const tr = document.createElement("div");
  tr.className = "panel";
  tr.id = "cw-tr";
  tr.innerHTML = `<h3>事件流 · 真实事件回放</h3><div id="cw-events"></div>`;
  root.appendChild(tr);
  const evEl = tr.querySelector("#cw-events") as HTMLElement;
  const evRows: HTMLElement[] = [];

  // ---- bottom ----
  const bb = document.createElement("div");
  bb.id = "cw-bb";
  bb.innerHTML = `拖拽旋转 · 滚轮缩放 · <b>0</b> 总览 · <b>1/2/3</b> 三城 · 点击城区聚焦 · 数据时点 <b>${fmtHM((data.reality.beijing_hhmm ?? ""))}</b>${isLive() ? "" : " · <span style='color:#f87171'>演示数据</span>"}`;
  root.appendChild(bb);

  const cam = document.createElement("div");
  cam.id = "cw-cam";
  cam.textContent = "L0 总览";
  root.appendChild(cam);

  // Performance telemetry (perf-audit lane): draw calls / triangles / fps.
  const perf = document.createElement("div");
  perf.id = "cw-perf";
  root.appendChild(perf);

  // 2026-11-26 CEO「居民形象精细化可视化」：街景巡览时显示的居民卡
  // （姓名/职业/今日年轮首句）。按 R 依次切到下一位居民。
  const resCard = document.createElement("div");
  resCard.id = "cw-resident";
  resCard.style.cssText = "position:absolute;left:14px;bottom:46px;max-width:420px;"
    + "display:none;background:rgba(9,14,26,.9);border:1px solid #2a3f63;border-radius:10px;"
    + "padding:10px 13px;font-size:12.5px;line-height:1.6;color:#dbe7f7";
  root.appendChild(resCard);
  // 底部提示补上 R 键（不覆盖原有说明，接在后面）
  bb.innerHTML += " · <b>R</b> 居民街景";

  if (!isLive()) {
    const demo = document.createElement("div");
    demo.id = "cw-demo";
    demo.textContent = "DEMO DATA · 未经数据导出";
    root.appendChild(demo);
  }

  document.body.appendChild(root);

  const clockEl = tl.querySelector("#cw-clock") as HTMLElement;
  const phaseEl = tl.querySelector("#cw-phase") as HTMLElement;

  return {
    root,
    setClock(d: Date, phase: string): void {
      clockEl.textContent = formatClock(d);
      phaseEl.textContent = `${phase} · 北京时间`;
    },
    ticker(e: CityEvent): void {
      const row = document.createElement("div");
      row.className = "ev";
      const ts = e.ts_utc ? e.ts_utc.substring(11, 16) : "--:--";
      row.innerHTML = `<span class="ts">${ts}</span><span class="ty cwf-${e.zone ?? "governance"}">${e.type}</span><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#71829b">${(e.summary ?? "").substring(0, 40)}</span>`;
      evEl.insertBefore(row, evEl.firstChild);
      evRows.push(row);
      while (evRows.length > 7) {
        const old = evRows.shift();
        old?.remove();
      }
    },
    setCam(label: string): void {
      cam.textContent = label;
    },
    setPerf(calls: number, tris: number, fps: number): void {
      perf.textContent = `draw ${calls} · tri ${(tris / 1000).toFixed(0)}k · ${fps.toFixed(0)} fps`;
    },
  };
}
