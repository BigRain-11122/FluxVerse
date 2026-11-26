import * as THREE from "three";

// 玩家交互泳道 P3 · E 键交互注册表 + 居民对话面板（2026-11-26）
//
// 设计层移植（A-Frame raycaster 交互范式）：A-Frame 的
// raycaster-intersection / cursor 事件模型，可移植的骨架是三点——
//   ① 注册表（entity 自己声明可交互 + 半径）
//   ② 每帧求「最近候选」而不是每帧对所有物体做 raycast
//   ③ 显式触发（E 键）与视觉提示分离
// 本项目零第三方依赖，且居民是 BatchedMesh 合批实例（没有可 raycast 的
// 独立 Mesh），所以命中判定用「相机到锚点距离 ≤ radius」——这是当前
// 渲染结构下唯一诚实的做法；3D 光标换成 DOM 提示条（HUD 同语系）。
//
// 分层纪律：
//   · 只读相机位姿、只读居民锚点，不写相机、不改 rig；
//   · 全部样式内联注入，与 ui/hud.ts 同一视觉语系（深底 #060a13 / 青 #5eead4）；
//   · 面板 z-index 20 > HUD 10；提示条 12；两者都不吃指针（面板除外）。

export interface Interactable {
  id: string;
  label: string;
  position: THREE.Vector3;
  radius: number;
  onInteract: () => void;
}

export interface InteractionRig {
  update: (dt: number, elapsed: number) => void;
  register: (item: Interactable) => void;
  dispose: () => void;
}

// ---- 视觉（与 hud.ts 同源：深底玻璃 + 青色强调） ----
const CSS = `
#cw-interact-prompt{position:fixed;left:50%;bottom:58px;transform:translateX(-50%);z-index:12;pointer-events:none;
  display:flex;align-items:center;gap:9px;padding:7px 16px 7px 8px;border-radius:999px;
  background:linear-gradient(135deg,rgba(11,17,32,.92),rgba(9,14,26,.86));border:1px solid #2a3f63;
  box-shadow:0 8px 26px rgba(0,0,0,.45);backdrop-filter:blur(6px);
  font-family:'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif;font-size:13px;color:#dbe7f7;
  letter-spacing:.5px;white-space:nowrap;opacity:0;transition:opacity .16s ease}
#cw-interact-prompt.on{opacity:1}
#cw-interact-prompt .k{display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:22px;
  padding:0 6px;border-radius:6px;background:#5eead4;color:#04211c;font-weight:700;font-size:12px;
  box-shadow:0 0 12px rgba(94,234,212,.45)}
#cw-interact-prompt .tx{color:#e8f4ff}
#cw-dialog{position:fixed;left:50%;bottom:86px;transform:translateX(-50%);z-index:20;
  display:none;flex-direction:column;width:min(560px,calc(100vw - 40px));
  padding:16px 18px 12px;border-radius:14px;border:1px solid #2a3f63;
  background:linear-gradient(135deg,rgba(10,16,30,.95),rgba(7,11,22,.92));
  box-shadow:0 18px 48px rgba(0,0,0,.6);backdrop-filter:blur(10px);
  font-family:'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif;color:#c3cfe2;line-height:1.7}
#cw-dialog.show{display:flex}
#cw-dialog-x{position:absolute;top:8px;right:10px;width:26px;height:26px;border-radius:8px;cursor:pointer;
  background:transparent;border:1px solid #22304a;color:#93a4ba;font-size:15px;line-height:1;padding:0}
#cw-dialog-x:hover{border-color:#5eead4;color:#5eead4}
#cw-dialog-head{display:flex;align-items:center;gap:9px;margin:0 30px 8px 0}
#cw-dialog-name{font-size:16px;color:#fff;font-weight:700;letter-spacing:.5px}
#cw-dialog-badge{font-size:10.5px;color:#5eead4;border:1px solid #1f6b60;background:rgba(94,234,212,.09);
  border-radius:999px;padding:2px 9px;white-space:nowrap}
#cw-dialog-body{font-size:13px;color:#dbe7f7}
#cw-dialog-body p{margin:0 0 6px}
#cw-dialog-body p.q{color:#9fb8d0;font-size:12px}
#cw-dialog-opts{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
#cw-dialog-opts .cw-opt{cursor:pointer;background:rgba(94,234,212,.08);border:1px solid #1f6b60;color:#9ff3e2;
  border-radius:9px;padding:6px 13px;font-size:12.5px;font-family:inherit;transition:background .15s,color .15s}
#cw-dialog-opts .cw-opt:hover:not(:disabled){background:rgba(94,234,212,.2);color:#e8fffb}
#cw-dialog-opts .cw-opt:disabled{opacity:.45;cursor:default}
#cw-dialog-hint{margin-top:9px;font-size:10px;color:#5a6c84;letter-spacing:.3px}
`;

function ensureStyle(): void {
  if (document.getElementById("cw-interact-style")) return;
  const style = document.createElement("style");
  style.id = "cw-interact-style";
  style.textContent = CSS;
  document.head.appendChild(style);
}

// ---- 对话面板内部句柄（不进契约：契约只给 update/register/dispose） ----
interface DialogOption {
  label: string;
  once?: boolean;
  run: () => void;
}
interface Core {
  open: (title: string, badge: string, lines: string[], options: DialogOption[]) => void;
  addLine: (text: string) => void;
  isOpen: () => boolean;
  close: () => void;
}
const CORES = new WeakMap<InteractionRig, Core>();

/** 面板开着时必须拦住移动键：capture 阶段先于 walkController 的冒泡监听。 */
const MOVE_CODES: ReadonlySet<string> = new Set([
  "KeyW", "KeyA", "KeyS", "KeyD",
  "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
  "ShiftLeft", "ShiftRight",
]);

/** 输入框焦点保护：不抢用户正在打的字。 */
function isTyping(): boolean {
  const el = document.activeElement as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
}

export function buildInteraction(
  camera: THREE.PerspectiveCamera,
  dom: HTMLElement,
  opts?: { enabled?: () => boolean },
): InteractionRig {
  ensureStyle();

  // ---- 邻近提示条 ----
  const prompt = document.createElement("div");
  prompt.id = "cw-interact-prompt";
  prompt.setAttribute("aria-live", "polite");
  prompt.innerHTML = `<span class="k">E</span><span class="tx"></span>`;
  document.body.appendChild(prompt);
  const promptKey = prompt.querySelector(".k") as HTMLElement;
  const promptTx = prompt.querySelector(".tx") as HTMLElement;

  // ---- 对话面板 ----
  const panel = document.createElement("div");
  panel.id = "cw-dialog";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.innerHTML = `
<button id="cw-dialog-x" aria-label="关闭">×</button>
<div id="cw-dialog-head"><span id="cw-dialog-name"></span><span id="cw-dialog-badge"></span></div>
<div id="cw-dialog-body"></div>
<div id="cw-dialog-opts"></div>
<div id="cw-dialog-hint">ESC 或点 × 关闭 · 对话中不移动</div>`;
  document.body.appendChild(panel);
  const nameEl = panel.querySelector("#cw-dialog-name") as HTMLElement;
  const badgeEl = panel.querySelector("#cw-dialog-badge") as HTMLElement;
  const bodyEl = panel.querySelector("#cw-dialog-body") as HTMLElement;
  const optsEl = panel.querySelector("#cw-dialog-opts") as HTMLElement;
  const closeBtn = panel.querySelector("#cw-dialog-x") as HTMLButtonElement;

  const items: Interactable[] = [];
  let current: Interactable | null = null;
  let open = false;

  const close = (): void => {
    if (!open) return;
    open = false;
    panel.classList.remove("show");
    prompt.classList.remove("on");
    // 把焦点还给画布，键盘移动立刻恢复
    dom.focus?.();
  };

  const addLine = (text: string): void => {
    const p = document.createElement("p");
    p.textContent = text;
    bodyEl.appendChild(p);
  };

  const setOptions = (list: DialogOption[]): void => {
    while (optsEl.firstChild) optsEl.removeChild(optsEl.firstChild);
    for (const o of list) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "cw-opt";
      b.textContent = o.label;
      b.addEventListener("click", () => {
        if (b.disabled) return;
        o.run();
        if (o.once) {
          b.disabled = true;
          b.textContent = `${o.label}（已问）`;
        }
      });
      optsEl.appendChild(b);
    }
  };

  const core: Core = {
    open(title: string, badge: string, lines: string[], options: DialogOption[]): void {
      nameEl.textContent = title;
      badgeEl.textContent = badge;
      badgeEl.style.display = badge ? "" : "none";
      while (bodyEl.firstChild) bodyEl.removeChild(bodyEl.firstChild);
      for (const l of lines) addLine(l);
      setOptions(options);
      panel.classList.add("show");
      prompt.classList.remove("on");
      open = true;
      // walkController 在自己表里存着按住的键：开面板即清空，避免 W 穿透。
      window.dispatchEvent(new Event("blur"));
      closeBtn.focus({ preventScroll: true });
    },
    addLine,
    isOpen: () => open,
    close,
  };

  const rig: InteractionRig = {
    update(_dt: number, elapsed: number): void {
      // 面板开着 / 非步行模式 / 元素已从文档摘掉 → 一律不提示（禁用态）
      if (open || !dom.isConnected) {
        current = null;
        prompt.classList.remove("on");
        return;
      }
      if (opts?.enabled && opts.enabled() === false) {
        current = null;
        prompt.classList.remove("on");
        return;
      }
      if (!items.length) {
        current = null;
        prompt.classList.remove("on");
        return;
      }

      const camPos = new THREE.Vector3();
      camera.getWorldPosition(camPos);
      let best: Interactable | null = null;
      let bestD = Infinity;
      for (const it of items) {
        const d = camPos.distanceTo(it.position);
        if (d <= it.radius && d < bestD) {
          best = it;
          bestD = d;
        }
      }

      current = best;
      if (best) {
        if (promptTx.textContent !== best.label) promptTx.textContent = best.label;
        prompt.classList.add("on");
        // 轻微呼吸：让提示条在静止画面里也被注意到（成本：一次 style 写）
        promptKey.style.opacity = String(0.78 + 0.22 * Math.sin(elapsed * 3.4));
      } else {
        prompt.classList.remove("on");
      }
    },

    register(item: Interactable): void {
      const i = items.findIndex((x) => x.id === item.id);
      if (i >= 0) items[i] = item;
      else items.push(item);
    },

    dispose(): void {
      close();
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("click", onAnyClick, true);
      prompt.remove();
      panel.remove();
      items.length = 0;
      current = null;
      CORES.delete(rig);
    },
  };

  const onKeyDown = (ev: KeyboardEvent): void => {
    if (open) {
      if (ev.key === "Escape") {
        ev.preventDefault();
        ev.stopPropagation();
        close();
        return;
      }
      // 面板开着 → 移动键在 capture 阶段被吃掉（walkController 收不到）
      if (MOVE_CODES.has(ev.code)) ev.stopPropagation();
      return;
    }
    if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
    if (ev.repeat) return;
    if (ev.key !== "e" && ev.key !== "E") return;
    if (isTyping()) return;
    if (!current) return;
    ev.preventDefault();
    ev.stopPropagation();
    current.onInteract();
  };

  /** 面板外的点击不关闭面板（需求只给 ESC / ×），但让画布拿回焦点。 */
  const onAnyClick = (ev: MouseEvent): void => {
    if (!open) return;
    if (panel.contains(ev.target as Node)) return;
    dom.focus?.();
  };

  window.addEventListener("keydown", onKeyDown, true);
  window.addEventListener("click", onAnyClick, true);
  closeBtn.addEventListener("click", () => close());

  CORES.set(rig, core);
  return rig;
}

// ---------------------------------------------------------------------------
// 居民对话（诚实律）
// ---------------------------------------------------------------------------

export interface ResidentLike {
  id: string;
  name: string;
  profession: string;
  pos: THREE.Vector3;
  ring: string;
}

// 城区代码 → 区域 → 中文名。与 city/residentsBatched.ts 的 ZONE_OF_DISTRICT
// 逐字同源（同一份数据语义，不另立一套说法）。
const ZONE_OF_DISTRICT: Record<string, string> = {
  GM: "gaming", MD: "gaming", QT: "quant", OR: "quant",
  NS: "media", RV: "media", anchors: "media",
};
const ZONE_CN: Record<string, string> = {
  gaming: "游戏城区", quant: "量化城区", media: "传媒城区",
};

/** 与 residentsBatched 同源 FNV-1a：同 id 永远得到同一条开场。 */
function h32(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** ring 首句：只取第一句/第一小句（数据是短标签还是长句都不裁剪语义）。 */
function firstClause(s: string): string {
  if (!s) return "";
  const cut = s.split(/[。；;!！?\n]/)[0].trim();
  return cut.length > 24 ? cut.slice(0, 24) : cut;
}

type Fact = {
  name: string;
  role: string;   // profession（可能为空）
  ring: string;   // ring 首句（可能为空）
  place: string;  // 城区中文名，缺数据时用「城里」
};

/** 8 条模板，只用 name / profession / ring / 城区 四个真实字段拼装。 */
const TEMPLATES: ReadonlyArray<(f: Fact) => string> = [
  (f) => `我是${f.name}${f.role ? `，在城里做${f.role}` : ""}。${f.ring ? `我这一环叫「${f.ring}」。` : ""}`,
  (f) => `${f.name}，${f.role || "居民"}，常在${f.place}。`,
  (f) => `在${f.place}这边${f.role ? `做${f.role}` : "过活"}。${f.ring ? `环上是「${f.ring}」。` : ""}`,
  (f) => `${f.role ? `${f.role}这一行干久了，人就不爱多话。` : ""}我是${f.name}。`,
  (f) => `${f.name}。${f.place}的${f.role || "居民"}。${f.ring ? `「${f.ring}」这一环。` : ""}`,
  (f) => `今天也在${f.place}。我叫${f.name}${f.role ? `，做${f.role}` : ""}。`,
  (f) => `${f.place}，${f.role || "居民"}，${f.name}。`,
  (f) => `叫我${f.name}就行${f.role ? `，${f.role}` : ""}。${f.ring ? `我这一环是「${f.ring}」。` : `我在${f.place}。`}`,
];

/** 每居民的进入次数 → 开场轮换（同 id 哈希 + 次数决定，禁随机）。 */
const VISITS = new Map<string, number>();

export function registerResidentDialog(
  rig: InteractionRig,
  residents: ResidentLike[],
  bus?: { emit: (type: string, payload: unknown) => void },
): void {
  const core = CORES.get(rig);
  for (const r of residents) {
    // district 是上游卡面真实字段（ResidentEntry.district），但契约把
    // ResidentLike 钉死为 5 字段，故按结构读、不做声明层扩写：
    // 有就用于「待在哪个城区」，没有就退回「城里」，绝不编造地名。
    const code = (r as ResidentLike & { district?: string }).district ?? "";
    const zone = ZONE_OF_DISTRICT[code];
    const place = (zone && ZONE_CN[zone]) || "城里";
    const ring = firstClause(r.ring);
    const fact: Fact = { name: r.name || r.id, role: r.profession || "", ring, place };

    const id = `talk:${r.id}`;
    rig.register({
      id,
      label: `对话 · ${fact.name}`,
      position: r.pos.clone(),
      radius: 10, // 街道尺度 + 街景巡览档（R 键机位距居民 6.5m，4.5m 够不着——实测判据）
      onInteract: () => {
        if (!core) {
          console.warn("[interact] rig 未由 buildInteraction 创建，忽略交互");
          return;
        }
        const n = VISITS.get(r.id) ?? 0;
        VISITS.set(r.id, n + 1);
        const line = TEMPLATES[(h32(r.id) + n) % TEMPLATES.length](fact);

        const emit = (opt: string): void => {
          console.log(`[interact] PLAYER_TALK ${r.id} · ${opt}`);
          bus?.emit("PLAYER_TALK", { residentId: r.id });
        };

        const options: DialogOption[] = [
          {
            label: "询问近况",
            once: true,
            run: () => {
              emit("近况");
              core.addLine(
                `${place} · ${fact.role || "居民"}${ring ? ` · 这一环「${ring}」` : ""}。`,
              );
              core.addLine("记录里就这些，没有更多。");
            },
          },
        ];
        if (ring) {
          options.push({
            label: "问这一环",
            once: true,
            run: () => {
              emit("环");
              core.addLine(`这一环叫「${ring}」，卡面上只写了这一句。`);
            },
          });
        }
        options.push({
          label: "告别",
          run: () => {
            emit("告别");
            core.close();
          },
        });

        core.open(fact.name, fact.role || "居民", [line], options);
      },
    });
  }

  (window as unknown as Record<string, unknown>).__CITY_TALK__ = {
    interactables: residents.length,
    templates: TEMPLATES.length,
  };
}
