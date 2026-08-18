/** SAGE UI Fixes v2 — fleet action bar. MAIN world. LEEKS / Produce Bandit ltd
 *
 * Live 0.0.371: hide stock 3-row `_statusActions`+`_fleetActionBar`, click those
 * buttons from our one-row `#sa-action-bar`. Tiles reuse live stock classes
 * (icon / Orbitron label / keybind sublabel). Chords live in official
 * `fc-app-keybindings` once we append Fleet actions to BINDABLE_ACTIONS.
 * Second row: 8 fleet slots (`saFleetSlots.v1`) — click empty → list, drag to assign.
 */
const POS_KEY = "saActionBarPos.v1";
const HIDE_KEY = "saHideActionBar";
const LOOK_KEY = "saActionBarLook.v1";
const BIND_KEY = "fc-app-keybindings";
const BTN = "sa-act";
const BTN_DANGER = "sa-act-danger";
const LOOK_DEF = { icon: 30, text: true, gap: 8 };

function clampNum(n, lo, hi, fb) {
  const v = Number(n);
  if (!Number.isFinite(v)) return fb;
  return Math.min(hi, Math.max(lo, v));
}

function loadLook() {
  try {
    const p = JSON.parse(localStorage.getItem(LOOK_KEY) || "null");
    if (!p || typeof p !== "object") return { ...LOOK_DEF };
    return {
      icon: clampNum(p.icon, 16, 56, LOOK_DEF.icon),
      text: p.text !== false,
      gap: clampNum(p.gap, 0, 24, LOOK_DEF.gap),
    };
  } catch {
    return { ...LOOK_DEF };
  }
}

let look = loadLook();

function saveLook() {
  try {
    localStorage.setItem(LOOK_KEY, JSON.stringify(look));
  } catch {
    /* ignore */
  }
}

function applyLook() {
  if (!root) return;
  const tile = Math.max(44, look.icon + (look.text ? 30 : 14));
  root.style.setProperty("--sa-ico", look.icon + "px");
  root.style.setProperty("--sa-gap", look.gap + "px");
  root.style.setProperty("--sa-tile", tile + "px");
  root.classList.toggle("sa-no-text", !look.text);
  const icon = root.querySelector('[data-opt="icon"]');
  const text = root.querySelector('[data-opt="text"]');
  const gap = root.querySelector('[data-opt="gap"]');
  const iconN = root.querySelector("[data-opt-icon-n]");
  const gapN = root.querySelector("[data-opt-gap-n]");
  if (icon) icon.value = String(look.icon);
  if (text) text.checked = !!look.text;
  if (gap) gap.value = String(look.gap);
  if (iconN) iconN.textContent = look.icon + "px";
  if (gapN) gapN.textContent = look.gap + "px";
}

const OFFICIAL_DEFAULTS = {
  cycleFleetNext: "]",
  cycleFleetPrev: "[",
  focusSelectedFleet: "f",
  openMovementPlanner: "m",
  toggleFleetList: "l",
  openCommandSettings: "o",
};
const RESERVED_BASE = new Set(["escape", "`", "~", "g"]);

const ICO = {
  dock: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M8 26 H24"/><path d="M10 26 V14 H22 V26"/><path d="M16 4 V12"/><path d="M12 9 L16 13 L20 9"/></svg>',
  warp: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 4 L20 12 L16 10 L12 12 Z"/><path d="M8 16 L16 14 L24 16 L16 28 Z"/></svg>',
  subwarp: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 16 H22"/><path d="M18 10 L26 16 L18 22"/></svg>',
  gate: '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="10"/><path d="M6 16 H26"/><path d="M16 6 C11 12 11 20 16 26 C21 20 21 12 16 6"/></svg>',
  scan: '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="4"/><circle cx="16" cy="16" r="9"/><path d="M16 2 V6 M16 26 V30 M2 16 H6 M26 16 H30"/></svg>',
  attack: '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="8"/><path d="M16 4 V10 M16 22 V28 M4 16 H10 M22 16 H28"/><circle cx="16" cy="16" r="2"/></svg>',
  repair: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M20 6 L26 12 L14 24 L8 24 L8 18 Z"/><path d="M12 20 L20 12"/></svg>',
  mine: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M8 26 L20 14"/><path d="M14 8 C20 6 26 10 26 16"/><path d="M14 8 L20 14"/></svg>',
  stop: '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="8" y="8" width="16" height="16" rx="1"/></svg>',
  stims: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M18 6 L26 14"/><path d="M22 10 L10 22 L6 26 L10 26 L22 14"/><path d="M14 18 L18 22"/></svg>',
  loot: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 14 H26 V26 H6 Z"/><path d="M11 14 V10 H21 V14"/></svg>',
  destruct: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 6 L28 26 H4 Z"/><path d="M16 14 V20"/><path d="M16 23 V24"/></svg>',
};

const ACTIONS = [
  { id: "dock", label: "Dock", short: "DOCK", match: /^(dock|undock)$/i, hk: "d" },
  { id: "warp", label: "Warp", short: "WARP", match: /^warp$/i, hk: "w" },
  { id: "subwarp", label: "Subwarp", short: "SUB", match: /^subwarp$/i, hk: "s" },
  { id: "gate", label: "Warp Gate", short: "GATE", match: /warp\s*(gate|lane)/i, hk: "t" },
  { id: "scan", label: "Scan", short: "SCAN", match: /^scan$/i, hk: "c" },
  { id: "attack", label: "Attack", short: "ATK", match: /^attack$/i, hk: "a" },
  { id: "repair", label: "Repair", short: "FIX", match: /^repair/i, hk: "r" },
  { id: "mine", label: "Mine", short: "MINE", match: /^mine$/i, hk: "n" },
  { id: "stop", label: "Stop", short: "STOP", match: /^stop\b/i, hk: "x" },
  { id: "stims", label: "Stims", short: "STIM", match: /^(stims|stimulant|apply stimulant)$/i, hk: "v" },
  { id: "loot", label: "Loot", short: "LOOT", match: /loot/i, hk: null },
  { id: "destruct", label: "Self-destruct", short: "KILL", match: /destruct/i, hk: null, danger: true },
];

const CLASS_FALLBACK = {
  btn: "_statusActionButton_nsg6t_336 _fleetActionButton_1040r_21",
  inner: "_statusActionButtonInner_nsg6t_361 _fleetActionButtonInner_1040r_33",
  ico: "_statusActionIcon_nsg6t_418",
  text: "_statusActionText_nsg6t_368 _fleetActionButtonText_1040r_39",
  label: "_statusActionLabel_nsg6t_401",
  sub: "_statusActionSubLabel_nsg6t_409 _fleetActionButtonSubLabel_1040r_46",
};

function pickClasses(el, re, fb) {
  if (!el || !el.classList) return fb;
  const hit = [...el.classList].filter((c) => re.test(c)).join(" ");
  return hit || fb;
}

function liveClasses() {
  const b = stockRootButtons()[0];
  if (!b) return CLASS_FALLBACK;
  const inner =
    b.querySelector('[class*="ActionButtonInner"], [class*="actionButtonInner"]') || b.firstElementChild;
  const ico = b.querySelector('[class*="ActionIcon"], [class*="actionIcon"]');
  const text = b.querySelector('[class*="ActionText"], [class*="actionText"]');
  const label = b.querySelector(
    '[class*="ActionLabel"]:not([class*="Sub"]):not([class*="sub"]), [class*="actionLabel"]:not([class*="Sub"]):not([class*="sub"])',
  );
  const sub = b.querySelector('[class*="SubLabel"], [class*="subLabel"]');
  return {
    btn: pickClasses(b, /(?:^|_)(?:status|fleet)ActionButton(?:_|$)/, CLASS_FALLBACK.btn),
    inner: pickClasses(inner, /Inner/, CLASS_FALLBACK.inner),
    ico: pickClasses(ico, /Icon/, CLASS_FALLBACK.ico),
    text: pickClasses(text, /Text/, CLASS_FALLBACK.text),
    label: pickClasses(label, /Label/, CLASS_FALLBACK.label),
    sub: pickClasses(sub, /SubLabel|subLabel/, CLASS_FALLBACK.sub),
  };
}

function loadOfficialBindings() {
  try {
    const raw = JSON.parse(localStorage.getItem(BIND_KEY) || "null");
    return raw && typeof raw === "object" ? raw : {};
  } catch {
    return {};
  }
}

function normalizeBaseKey(key) {
  if (key === " " || key === "Spacebar") return "space";
  return String(key || "").toLowerCase();
}

function chordFromEvent(e) {
  const key = e.key;
  if (!key || key === "Unidentified" || key === "Dead") return null;
  const low = key.toLowerCase();
  if (low === "control" || low === "ctrl" || low === "alt" || low === "altgraph" || low === "shift" || low === "meta") {
    return null;
  }
  const parts = [];
  if (e.ctrlKey) parts.push("ctrl");
  if (e.altKey) parts.push("alt");
  if (e.shiftKey) parts.push("shift");
  if (e.metaKey) parts.push("meta");
  parts.push(normalizeBaseKey(key));
  return parts.join("+");
}

function formatChord(chord) {
  if (!chord) return "";
  const bits = String(chord).split("+");
  const base = bits.pop() || "";
  const labels = { ctrl: "Ctrl", alt: "Alt", shift: "Shift", meta: "Meta", space: "Space", escape: "Esc" };
  const out = bits.map((m) => labels[m] || m);
  if (base.length === 1) out.push(base.toUpperCase());
  else out.push(labels[base] || base.charAt(0).toUpperCase() + base.slice(1));
  return out.join("+");
}

function chordFor(action) {
  if (!action || action.hk == null) return null;
  const off = loadOfficialBindings();
  const raw = off[action.id];
  if (typeof raw === "string" && raw) return raw;
  return action.hk;
}

function officialTaken() {
  const off = loadOfficialBindings();
  const taken = new Set(RESERVED_BASE);
  for (const [id, def] of Object.entries(OFFICIAL_DEFAULTS)) {
    const c = typeof off[id] === "string" && off[id] ? off[id] : def;
    if (c) taken.add(c);
  }
  return taken;
}

function hideCss() {
  let st = document.getElementById("sa-fleet-bar-hide");
  if (!st) {
    st = document.createElement("style");
    st.id = "sa-fleet-bar-hide";
    (document.documentElement || document.head).appendChild(st);
  }
  st.textContent = [
    /* exact 355 + hash-stem fallback — hide stock 3-row fleet action grid only while our bar is on */
    'html.sa-our-fleet-bar [class~="_statusActions_nsg6t_313"][class~="_fleetActionBar_1040r_863"],',
    'html.sa-our-fleet-bar [class*="statusActions"][class*="fleetActionBar"]{display:none!important}',
    "#sa-action-bar{--panel-accent:rgb(255 190 77 / 90%);position:fixed;left:50%;bottom:18px;",
    "transform:translateX(-50%);z-index:999990;display:flex;flex-direction:column;align-items:center;",
    "gap:6px;pointer-events:none;font-family:var(--font-family-display,Orbitron,sans-serif)}",
    "#sa-action-bar.sa-bar-pos{left:auto;bottom:auto;transform:none}",
    "#sa-action-bar .sa-bar-grip{pointer-events:auto;cursor:grab;user-select:none;touch-action:none;",
    "padding:2px 14px;opacity:.35;color:color-mix(in srgb,var(--panel-accent) 80%,white);",
    "font:600 9px var(--font-family-display,Orbitron,sans-serif);letter-spacing:.28em}",
    "#sa-action-bar .sa-bar-grip:hover,#sa-action-bar.sa-bar-dragging .sa-bar-grip{opacity:.9;cursor:grabbing}",
    "#sa-action-bar .sa-bar-tools{pointer-events:auto;display:flex;align-items:center;gap:4px}",
    "#sa-action-bar .sa-bar-optbtn{appearance:none;border:0;background:transparent;color:#ffbe4d;",
    "opacity:.45;cursor:pointer;font:700 12px Orbitron,sans-serif;padding:2px 6px}",
    "#sa-action-bar .sa-bar-optbtn:hover,#sa-action-bar .sa-bar-optbtn.on{opacity:1}",
    "#sa-action-bar .sa-zoom{pointer-events:none;opacity:.7;color:#ffbe4d;",
    "font:700 9px Orbitron,sans-serif;letter-spacing:.08em;padding:0 6px}",
    "#sa-action-bar .sa-bar-opts{pointer-events:auto;position:absolute;left:50%;z-index:6;",
    "display:none;flex-direction:column;gap:8px;min-width:220px;padding:10px 12px;",
    "background:#0a0e1a;border:1px solid #ffbe4d;color:#e8d9a8;",
    "font:600 10px Orbitron,sans-serif;letter-spacing:.06em;transform:translateX(-50%)}",
    "#sa-action-bar .sa-bar-opts.on{display:flex}",
    "#sa-action-bar .sa-bar-opts.above{bottom:calc(100% + 8px);top:auto}",
    "#sa-action-bar .sa-bar-opts.below{top:calc(100% + 8px);bottom:auto}",
    "#sa-action-bar .sa-bar-opts label{display:flex;align-items:center;justify-content:space-between;gap:10px}",
    "#sa-action-bar .sa-bar-opts input[type=range]{width:110px;accent-color:#ffbe4d}",
    "#sa-action-bar .sa-bar-opts .n{min-width:2.4rem;text-align:right;color:#ffbe4d}",
    "#sa-action-bar .sa-acts{pointer-events:auto;position:relative;display:flex;flex-wrap:wrap;",
    "align-items:stretch;gap:var(--sa-gap,8px);padding:8px;isolation:isolate;",
    "background:linear-gradient(180deg,color-mix(in srgb,var(--panel-accent) 4%,transparent),",
    "color-mix(in srgb,var(--panel-accent) 1.5%,transparent));",
    "box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--panel-accent) 18%,transparent),",
    "inset 0 -1px color-mix(in srgb,var(--panel-accent) 12%,transparent),0 5px 16px #00000024}",
    "#sa-action-bar .sa-acts:before,#sa-action-bar .sa-acts:after{position:absolute;width:.38rem;height:.38rem;",
    "pointer-events:none;background:color-mix(in srgb,var(--panel-accent) 58%,white);content:\"\";opacity:.72}",
    "#sa-action-bar .sa-acts:before{top:0;left:0;clip-path:polygon(0 0,100% 0,0 100%)}",
    "#sa-action-bar .sa-acts:after{right:0;bottom:0;clip-path:polygon(100% 0,100% 100%,0 100%)}",
    "#sa-action-bar .sa-acts>button{box-sizing:border-box;position:relative;flex:0 0 auto;",
    "width:var(--sa-tile,4.35rem)!important;min-width:var(--sa-tile,4.35rem)!important;",
    "max-width:var(--sa-tile,4.35rem)!important;min-height:var(--sa-tile,4.35rem)!important;",
    "height:var(--sa-tile,4.35rem)!important;aspect-ratio:1/1;padding:.32rem .16rem .26rem!important;",
    "opacity:1!important;background:#3a3014!important;",
    "background-image:linear-gradient(165deg,#6b5420,#3a3014)!important;",
    "color:#fff6d8!important;border:1px solid #ffbe4d!important;",
    "backdrop-filter:none!important;-webkit-backdrop-filter:none!important;filter:none!important;",
    "box-shadow:none!important;",
    "cursor:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M12 2v6M12 16v6M2 12h6M16 12h6' stroke='%23C5D0DE' stroke-width='1.25' fill='none' stroke-linecap='square'/%3E%3Ccircle cx='12' cy='12' r='1.25' fill='%235CE1B5'/%3E%3C/svg%3E\") 12 12,crosshair;",
    "overflow:hidden}",
    "#sa-action-bar .sa-acts>button:hover:not(.sa-dim):not(.sa-busy){background:#4a3c18!important;",
    "background-image:linear-gradient(165deg,#7d6326,#4a3c18)!important;color:#fff8e0!important}",
    "#sa-action-bar .sa-acts>button [class*=ActionButtonInner],#sa-action-bar .sa-acts>button .sa-act-inner{",
    "display:flex!important;flex-direction:column!important;align-items:center!important;",
    "justify-content:center!important;gap:.22rem!important;width:100%!important;height:100%!important}",
    "#sa-action-bar .sa-acts>button [class*=ActionIcon],#sa-action-bar .sa-acts>button .sa-act-ico,",
    "#sa-action-bar .sa-acts>button>span>span:first-child{display:flex!important;align-items:center!important;",
    "justify-content:center!important;width:var(--sa-ico,1.85rem)!important;height:var(--sa-ico,1.85rem)!important;flex:0 0 auto!important}",
    "#sa-action-bar.sa-no-text .sa-act-lab,#sa-action-bar.sa-no-text [class*=ActionLabel],",
    "#sa-action-bar.sa-no-text .sa-hk,#sa-action-bar.sa-no-text [class*=SubLabel]{display:none!important}",
    "#sa-action-bar .sa-acts>button svg{display:block!important;width:100%!important;height:100%!important;",
    "stroke:currentColor!important;fill:none!important;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}",
    "#sa-action-bar .sa-acts>button [class*=ActionLabel],#sa-action-bar .sa-acts>button .sa-act-lab,",
    "#sa-action-bar .sa-acts>button [class*=SubLabel],#sa-action-bar .sa-acts>button .sa-hk{",
    "pointer-events:none;user-select:none;-webkit-user-select:none}",
    "#sa-action-bar .sa-acts>button [class*=ActionLabel],#sa-action-bar .sa-acts>button .sa-act-lab{",
    "display:block;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;",
    "font-size:.42rem!important;font-weight:800;letter-spacing:.1em;line-height:1.05;text-transform:uppercase}",
    "#sa-action-bar .sa-acts>button [class*=SubLabel],#sa-action-bar .sa-acts>button .sa-hk{",
    "display:block;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;",
    "font-size:.46rem!important;font-weight:700;letter-spacing:.04em;line-height:1;opacity:.85}",
    "#sa-action-bar .sa-acts>button .sa-hk:empty{display:none}",
    "#sa-action-bar .sa-acts>button.sa-dim{opacity:1!important;background:#16120a!important;",
    "background-image:none!important;border-color:#4a3f22!important;color:#8a7840!important}",
    "#sa-action-bar .sa-acts>button.sa-on{background:#2a2010!important;",
    "background-image:none!important;box-shadow:inset 0 2px 8px #000000b3,inset 0 0 0 1px #ffbe4d!important}",
    "#sa-action-bar .sa-acts>button[data-act=destruct]:not(.sa-dim){margin-left:1.6rem;--panel-accent:#ff4960;",
    "background:#3a1418!important;background-image:linear-gradient(165deg,#6a2028,#3a1418)!important;",
    "border-color:#ff4960!important;color:#ffc4ca!important}",
    "#sa-action-bar .sa-acts>button[data-act=destruct].sa-dim{margin-left:1.6rem;background:#14090a!important;",
    "background-image:none!important;border-color:#4a2226!important;color:#8a5056!important}",
    "#sa-action-bar .sa-acts>button.sa-busy{pointer-events:none;cursor:wait}",
    "#sa-action-bar .sa-acts>button.sa-busy .sa-act-ico,#sa-action-bar .sa-acts>button.sa-busy [class*=ActionIcon]{opacity:.25}",
    "#sa-action-bar .sa-acts>button .sa-hg{display:none;position:absolute;inset:0;align-items:center;justify-content:center;z-index:3;pointer-events:none}",
    "#sa-action-bar .sa-acts>button.sa-busy .sa-hg{display:flex}",
    "#sa-action-bar .sa-acts>button .sa-hg .clk{position:relative;width:22px;height:22px;border-radius:50%;",
    "border:1.5px solid color-mix(in srgb,var(--panel-accent) 80%,white);box-shadow:0 0 8px color-mix(in srgb,var(--panel-accent) 35%,transparent);background:rgba(0,0,0,.4)}",
    "#sa-action-bar .sa-acts>button .sa-hg .clk::before{content:'';position:absolute;left:50%;top:50%;width:1.5px;height:9px;",
    "background:var(--panel-accent);transform-origin:50% 0;animation:saClock 2.4s linear infinite}",
    "#sa-action-bar .sa-acts>button .sa-hg .clk::after{content:'';position:absolute;left:50%;top:50%;width:3px;height:3px;",
    "margin:-1.5px;border-radius:50%;background:var(--panel-accent)}",
    "@keyframes saClock{from{transform:translateX(-50%) rotate(0deg)}to{transform:translateX(-50%) rotate(360deg)}}",
    "#sa-action-bar .sa-acts>button[data-tip]:hover::after{content:attr(data-tip);position:absolute;",
    "left:50%;bottom:calc(100% + 7px);transform:translateX(-50%);white-space:nowrap;z-index:2;",
    "padding:4px 8px;background:#0a0e1af2;border:1px solid color-mix(in srgb,var(--panel-accent) 45%,transparent);",
    "color:var(--panel-accent);font:700 9px var(--font-family-display,Orbitron,sans-serif);letter-spacing:.08em;",
    "text-transform:uppercase;pointer-events:none}",
    "#sa-action-bar .sa-slots{pointer-events:auto;display:flex;flex-wrap:nowrap;align-items:stretch;",
    "gap:6px;padding:4px 8px 6px;background:#0a0e1a;",
    "box-shadow:inset 0 0 0 1px #2a2618}",
    "#sa-action-bar .sa-slots>button{all:unset;box-sizing:border-box;position:relative;display:flex;",
    "flex-direction:column;align-items:center;justify-content:center;width:3.15rem!important;",
    "min-width:3.15rem!important;height:2.35rem!important;min-height:2.35rem!important;",
    "padding:4px 2px 2px!important;flex:0 0 auto;cursor:pointer;user-select:none;-webkit-user-select:none;",
    "background:#14110c!important;border:1px solid #3a3420!important;",
    "color:#c8b88a!important;overflow:hidden;text-align:center;",
    "font-family:var(--font-family-display,Orbitron,sans-serif)}",
    "#sa-action-bar .sa-slots>button:hover{background:#1c180f!important}",
    "#sa-action-bar .sa-slots>button.sa-slot-on{border-color:#ffbe4d!important;",
    "color:#ffbe4d!important;background:#1c160c!important}",
    "#sa-action-bar .sa-slots>button.sa-slot-sel{box-shadow:inset 0 0 0 1px #ffbe4d;background:#2a2010!important}",
    "#sa-action-bar .sa-slots>button.sa-slot-drop{border-color:#ffe08a!important;background:#2a2010!important}",
    "#sa-action-bar .sa-slots>button .sa-slot-ix{position:absolute;top:1px;left:3px;",
    "font:700 7px var(--font-family-display,Orbitron,sans-serif);letter-spacing:.04em;opacity:.28;line-height:1;pointer-events:none}",
    "#sa-action-bar .sa-slots>button .sa-slot-name,#sa-action-bar .sa-slots>button .sa-slot-plus{",
    "display:block;width:100%;max-height:2.2em;overflow:hidden;pointer-events:none;",
    "font:700 8px/1.1 var(--font-family-display,Orbitron,sans-serif);letter-spacing:.02em;word-break:break-all}",
    "#sa-action-bar .sa-slots>button .sa-slot-plus{font:600 14px/1 var(--font-family-display,Orbitron,sans-serif);opacity:.45}",
    "#sa-action-bar .sa-slots>button .sa-slot-x{position:absolute;top:0;right:1px;width:12px;height:12px;",
    "border:0;background:transparent;color:var(--panel-accent);font:700 10px/12px Orbitron,sans-serif;cursor:pointer;",
    "opacity:0;padding:0}",
    "#sa-action-bar .sa-slots>button.sa-slot-on:hover .sa-slot-x{opacity:.85}",
    "#sa-action-bar .sa-slots>button[data-tip]:hover::after{content:attr(data-tip);position:absolute;",
    "left:50%;bottom:calc(100% + 7px);transform:translateX(-50%);white-space:nowrap;z-index:2;",
    "padding:4px 8px;background:#0a0e1af2;border:1px solid color-mix(in srgb,var(--panel-accent) 45%,transparent);",
    "color:var(--panel-accent);font:700 9px var(--font-family-display,Orbitron,sans-serif);letter-spacing:.08em;",
    "text-transform:uppercase;pointer-events:none}",
    "#sa-fleet-pick{position:fixed;z-index:999999;min-width:240px;max-width:320px;max-height:min(320px,46vh);",
    "display:flex;flex-direction:column;background:#0a0e1a;border:1px solid #ffbe4d;color:#ffbe4d;",
    "font-family:var(--font-family-display,Orbitron,sans-serif);pointer-events:auto}",
    "#sa-fleet-pick .sa-fp-h{padding:6px 10px;font:700 9px Orbitron,sans-serif;letter-spacing:.14em;",
    "text-transform:uppercase;border-bottom:1px solid #5c4d22;flex:0 0 auto}",
    "#sa-fleet-pick .sa-fp-list{overflow:auto;flex:1 1 auto}",
    "#sa-fleet-pick .sa-fp-row{display:flex;align-items:center;justify-content:space-between;gap:8px;",
    "padding:7px 10px;cursor:grab;border-bottom:1px solid #1c160c;color:#e8d9a8;font:600 11px Orbitron,sans-serif}",
    "#sa-fleet-pick .sa-fp-row:hover,#sa-fleet-pick .sa-fp-row.sa-fp-used{background:#2a2010}",
    "#sa-fleet-pick .sa-fp-row.sa-fp-used{opacity:.45}",
    "#sa-fleet-pick .sa-fp-st{font:600 8px Orbitron,sans-serif;letter-spacing:.06em;color:#8a7840;flex:0 0 auto}",
    "#sa-fleet-pick .sa-fp-empty{padding:12px 10px;color:#8a7840;font:600 10px Orbitron,sans-serif}",
    "#sa-fleet-ghost{position:fixed;z-index:1000000;pointer-events:none;padding:4px 8px;background:#1c160c;",
    "border:1px solid #ffbe4d;color:#ffbe4d;font:700 10px Orbitron,sans-serif}",
    "#sa-action-bar.sa-bar-hidden{display:none!important}",
    /* compact stock warp / map-target chrome — planner-strip height */
    '[class*="_actionBar_138wv_"]{padding:6px 14px 8px!important;min-width:min(420px,calc(100vw - 32px))!important;',
    "gap:6px 10px!important;z-index:999995!important}",
    '[class*="_actionBar_138wv_"] [class*="_instructions_"]{font-size:.48rem!important;line-height:1.1!important}',
    '[class*="_actionButton_138wv_"]{min-height:1.85rem!important;padding:.28rem .55rem!important}',
    '[class*="_mapTargetBar_14omi_"]{min-height:0!important;padding:6px 10px!important;gap:10px!important;',
    "width:min(560px,calc(100vw - 28px))!important;z-index:999995!important}",
    '[class*="_mapTargetBar_14omi_"] p{font-size:11px!important}',
  ].join("");
}

function visiblePref() {
  try {
    return localStorage.getItem(HIDE_KEY) !== "1";
  } catch {
    return true;
  }
}

function inGame() {
  if (document.querySelector('[class*="menuContent"]')) return false;
  return !!(
    document.querySelector('[class*="fleetRail"]') ||
    document.querySelector('[class*="headerEcho"]') ||
    document.querySelector('[class*="dominionHeader"]')
  );
}

function stockRootButtons() {
  const seen = new Set();
  const out = [];
  document
    .querySelectorAll(
      '[class*="fleetActionBar"] button, [class*="statusActions"] button, [class*="fleetActionButton"], [class*="statusActionButton"]',
    )
    .forEach((b) => {
      if (!b || seen.has(b)) return;
      if (b.closest && b.closest("#sa-action-bar")) return;
      seen.add(b);
      out.push(b);
    });
  return out;
}

function buttonText(el) {
  return String(el.getAttribute("aria-label") || el.getAttribute("title") || el.textContent || "")
    .replace(/\s+/g, " ")
    .trim();
}

function findStock(action) {
  const btns = stockRootButtons();
  let loose = null;
  for (const b of btns) {
    const t = buttonText(b);
    const short = (b.textContent || "").replace(/\s+/g, " ").trim();
    if (action.match.test(short) || action.match.test(t)) {
      if (!b.disabled) return b;
      if (!loose) loose = b;
    }
  }
  return loose;
}

function selectedFleetRaw() {
  try {
    const peek = window.__SA_PEEK_FLEETS__;
    const all = typeof peek === "function" ? peek() : [];
    const key = window.__SA_SELECTED_FLEET__ && window.__SA_SELECTED_FLEET__.key;
    if (key) {
      for (let i = 0; i < all.length; i++) {
        const f = all[i];
        if (String(f && (f.address || f.key)) === String(key)) return f;
      }
    }
  } catch {
    /* ignore */
  }
  return null;
}

function fleetKind(raw) {
  const d = (raw && raw.data) || raw || {};
  const st = d.state;
  return String((st && (st.__kind || st.kind)) || d.effectiveState || "");
}

function selectedKind() {
  return fleetKind(selectedFleetRaw());
}

function movementEndUnix(raw) {
  const d = (raw && raw.data) || raw || {};
  const kind = String((d.state && (d.state.__kind || d.state.kind)) || "");
  if (kind !== "MoveWarp" && kind !== "MoveSubwarp") return 0;
  const f0 = d.state && d.state.fields && d.state.fields[0];
  if (!f0) return 0;
  const j = f0.journey || f0;
  const start = parseTs(j.departureTime);
  const dur = parseTs(j.duration);
  let end = start && dur ? start + dur : 0;
  if (!end && kind === "MoveWarp") end = parseTs(f0.warpFinish);
  return end > 0 ? end : 0;
}

function isInTransit(raw) {
  const kind = fleetKind(raw);
  if (kind !== "MoveWarp" && kind !== "MoveSubwarp") return false;
  const end = movementEndUnix(raw);
  if (end > 0) return Date.now() / 1000 < end + 0.4;
  const stop = findStock(ACTIONS.find((a) => a.id === "stop") || { match: /^stop\b/i });
  if (stop) return !stop.disabled;
  return true;
}

function warpCooldownLeft(raw) {
  const d = (raw && raw.data) || raw || {};
  let exp = d.warpCooldownExpiresAt;
  if (exp && typeof exp === "object") exp = parseTs(exp);
  exp = Number(exp);
  if (!Number.isFinite(exp) || exp <= 0) return 0;
  if (exp > 1e12) exp /= 1000;
  return Math.max(0, exp - Date.now() / 1000);
}

let pendingTx = null;

function markPending(actionId) {
  const raw = selectedFleetRaw();
  const key = raw && (raw.address || raw.key);
  pendingTx = {
    action: actionId,
    t0: Date.now(),
    key: key ? String(key) : "",
    state: fleetKind(raw),
    min: 1200,
    max: actionId === "dock" ? 180000 : 120000,
  };
}

function pendingDone() {
  if (!pendingTx) return true;
  const el = Date.now() - pendingTx.t0;
  if (el >= pendingTx.max) {
    pendingTx = null;
    return true;
  }
  if (el < pendingTx.min) return false;
  if (!pendingTx.key) {
    if (el > 4000) pendingTx = null;
    return !pendingTx;
  }
  try {
    const peek = window.__SA_PEEK_FLEETS__;
    const all = typeof peek === "function" ? peek() : [];
    for (let i = 0; i < all.length; i++) {
      const f = all[i];
      if (String(f && (f.address || f.key)) !== pendingTx.key) continue;
      if (fleetKind(f) !== pendingTx.state) {
        pendingTx = null;
        return true;
      }
      break;
    }
  } catch {
    /* ignore */
  }
  return false;
}

let root = null;

function sizeKey() {
  return `${window.innerWidth || 0}x${window.innerHeight || 0}`;
}

function loadMap() {
  try {
    return JSON.parse(localStorage.getItem(POS_KEY) || "{}") || {};
  } catch {
    return {};
  }
}

function applyPos(L, T) {
  if (!root) return;
  root.classList.add("sa-bar-pos");
  root.style.left = `${L}px`;
  root.style.top = `${T}px`;
  root.style.right = "auto";
  root.style.bottom = "auto";
  root.style.transform = "none";
  const maxX = Math.max(8, (window.innerWidth || 800) - root.offsetWidth - 8);
  const maxY = Math.max(8, (window.innerHeight || 600) - root.offsetHeight - 8);
  const l = parseFloat(root.style.left);
  const t = parseFloat(root.style.top);
  if (Number.isFinite(l)) root.style.left = `${Math.min(maxX, Math.max(8, l))}px`;
  if (Number.isFinite(t)) root.style.top = `${Math.min(maxY, Math.max(8, t))}px`;
}

function centerPos() {
  if (!root) return;
  root.classList.remove("sa-bar-pos");
  root.style.left = "";
  root.style.top = "";
  root.style.right = "";
  root.style.bottom = "";
  root.style.transform = "";
}

function resetPos() {
  centerPos();
  try {
    localStorage.removeItem(POS_KEY);
  } catch {
    /* ignore */
  }
}

function applySavedOrCenter() {
  const p = loadMap()[sizeKey()];
  if (p && Number.isFinite(p.left) && Number.isFinite(p.top)) applyPos(p.left, p.top);
  else centerPos();
}

function savePos() {
  try {
    const m = loadMap();
    m[sizeKey()] = { left: parseFloat(root.style.left), top: parseFloat(root.style.top) };
    localStorage.setItem(POS_KEY, JSON.stringify(m));
  } catch {
    /* ignore */
  }
}

function bindDrag(grip) {
  let dragging = false;
  let moved = false;
  let ox = 0;
  let oy = 0;
  let sx = 0;
  let sy = 0;
  grip.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    dragging = true;
    moved = false;
    root.classList.add("sa-bar-dragging");
    const r = root.getBoundingClientRect();
    ox = e.clientX;
    oy = e.clientY;
    sx = r.left;
    sy = r.top;
    applyPos(sx, sy);
    try {
      grip.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    e.preventDefault();
  });
  grip.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - ox;
    const dy = e.clientY - oy;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) moved = true;
    applyPos(sx + dx, sy + dy);
    placeWarpChrome();
  });
  const end = () => {
    if (!dragging) return;
    dragging = false;
    root.classList.remove("sa-bar-dragging");
    if (moved) savePos();
  };
  grip.addEventListener("pointerup", end);
  grip.addEventListener("pointercancel", end);
  grip.addEventListener("dblclick", () => resetPos());
  let rt = 0;
  window.addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(applySavedOrCenter, 200);
  });
}

function warpChromeNodes() {
  const seen = new Set();
  const out = [];
  [
    '[class*="_actionBar_138wv_"]',
    '[class*="_mapTargetBar_14omi_"]',
  ].forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => {
      if (seen.has(el)) return;
      seen.add(el);
      out.push(el);
    });
  });
  return out;
}

function placeWarpChrome() {
  const bar = root && root.isConnected ? root : document.getElementById("sa-action-bar");
  const nodes = warpChromeNodes();
  if (!bar || bar.classList.contains("sa-bar-hidden") || !nodes.length) return;
  const r = bar.getBoundingClientRect();
  if (r.width < 8) return;
  const vh = window.innerHeight || 800;
  const below = r.top < vh * 0.42;
  const gap = 12;
  nodes.forEach((el) => {
    el.style.setProperty("position", "fixed", "important");
    el.style.setProperty("left", "50%", "important");
    el.style.setProperty("right", "auto", "important");
    el.style.setProperty("transform", "translateX(-50%)", "important");
    el.style.setProperty("z-index", "999995", "important");
    el.style.setProperty("pointer-events", "auto", "important");
    if (below) {
      el.style.setProperty("top", Math.round(r.bottom + gap) + "px", "important");
      el.style.setProperty("bottom", "auto", "important");
    } else {
      el.style.setProperty("bottom", Math.round(vh - r.top + gap) + "px", "important");
      el.style.setProperty("top", "auto", "important");
    }
  });
}

function findDestructModal() {
  const nodes = document.querySelectorAll(
    '[role="dialog"], [class*="Attention"], [class*="attention"], [class*="Modal"], [class*="modal"]',
  );
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    if (!n || n.closest && n.closest("#sa-action-bar")) continue;
    const t = String(n.textContent || "");
    if (/self\s*-?\s*destruct|irreversible|are you sure/i.test(t) && /cancel/i.test(t)) return n;
  }
  return null;
}

function clearPending() {
  pendingTx = null;
}

function armDestructWatch() {
  let bound = null;
  const onBtn = (e) => {
    const btn = e.target && e.target.closest && e.target.closest("button");
    if (!btn) return;
    const t = String(btn.textContent || btn.getAttribute("aria-label") || "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
    if (t === "cancel" || t === "no" || t === "close") {
      clearPending();
      try {
        paint();
      } catch {
        /* ignore */
      }
      return;
    }
    if (/confirm|destruct|yes|ok/.test(t) && !/cancel/.test(t)) {
      markPending("destruct");
      try {
        paint();
      } catch {
        /* ignore */
      }
    }
  };
  const onKey = (e) => {
    if (e.key === "Escape") {
      clearPending();
      try {
        paint();
      } catch {
        /* ignore */
      }
    }
  };
  const stop = () => {
    if (bound) {
      try {
        bound.removeEventListener("click", onBtn, true);
      } catch {
        /* ignore */
      }
    }
    window.removeEventListener("keydown", onKey, true);
    try {
      mo.disconnect();
    } catch {
      /* ignore */
    }
  };
  const hook = (el) => {
    if (!el || el === bound) return;
    if (bound) {
      try {
        bound.removeEventListener("click", onBtn, true);
      } catch {
        /* ignore */
      }
    }
    bound = el;
    el.addEventListener("click", onBtn, true);
  };
  const mo = new MutationObserver(() => {
    const el = findDestructModal();
    if (el) hook(el);
    else if (bound && !findDestructModal()) {
      /* modal gone without Confirm — treat as cancel if we never pending */
      if (!pendingTx || pendingTx.action !== "destruct") {
        /* already clear */
      }
    }
  });
  try {
    mo.observe(document.body || document.documentElement, { childList: true, subtree: true });
  } catch {
    /* ignore */
  }
  window.addEventListener("keydown", onKey, true);
  const now = findDestructModal();
  if (now) hook(now);
  setTimeout(stop, 20000);
}

function clickStock(action) {
  try {
    if (window.__SA_FLEET_OPS__ && typeof window.__SA_FLEET_OPS__.onAction === "function") {
      if (window.__SA_FLEET_OPS__.onAction(action)) return true;
    }
  } catch {
    /* ignore */
  }
  const stock = findStock(action);
  if (!stock) return false;
  if (stock.disabled && action.id !== "stop") return false;
  try {
    stock.click();
    if (action.id === "destruct") {
      armDestructWatch();
      return true;
    }
    markPending(action.id);
    return true;
  } catch {
    return false;
  }
}

function typingInField(el) {
  if (!el) return false;
  const tag = String(el.tagName || "").toUpperCase();
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (el.isContentEditable) return true;
  return !!(el.closest && el.closest("input,textarea,select,[contenteditable=true]"));
}

function fireAction(id) {
  const action = ACTIONS.find((a) => a.id === id);
  if (!action) return false;
  return clickStock(action);
}

function bindKeys() {
  if (window.__SA_FLEET_BAR_KEYS__) return;
  window.__SA_FLEET_BAR_KEYS__ = true;
  window.addEventListener(
    "keydown",
    (e) => {
      if (e.repeat || e.defaultPrevented || e.isComposing || e.keyCode === 229) return;
      if (window.__SA_KEYBIND_HOOK__) return;
      if (typingInField(e.target)) return;
      if (!visiblePref() || !inGame()) return;
      const chord = chordFromEvent(e);
      if (!chord) return;
      const base = chord.includes("+") ? chord.slice(chord.lastIndexOf("+") + 1) : chord;
      if (RESERVED_BASE.has(base)) return;
      const taken = officialTaken();
      if (taken.has(chord)) return;
      const action = ACTIONS.find((a) => a.hk != null && chordFor(a) === chord);
      if (!action) return;
      e.preventDefault();
      clickStock(action);
    },
    true,
  );
}

const SLOT_KEY = "saFleetSlots.v1";
const SLOT_N = 8;

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function shortName(label) {
  const t = String(label || "").replace(/\s+/g, " ").trim();
  if (!t) return "?";
  if (t.length <= 8) return t;
  return t.slice(0, 7) + "…";
}

function loadSlots() {
  const empty = () => ({ keys: Array(SLOT_N).fill(null), labels: {} });
  try {
    const p = JSON.parse(localStorage.getItem(SLOT_KEY) || "null");
    if (!p || !Array.isArray(p.keys)) return empty();
    const keys = [];
    for (let i = 0; i < SLOT_N; i++) keys[i] = p.keys[i] ? String(p.keys[i]) : null;
    return { keys, labels: p.labels && typeof p.labels === "object" ? p.labels : {} };
  } catch {
    return empty();
  }
}

function saveSlots(st) {
  try {
    localStorage.setItem(SLOT_KEY, JSON.stringify({ v: 1, keys: st.keys, labels: st.labels || {} }));
  } catch {
    /* ignore */
  }
}

const COORD_SCALE = 2 ** 56;

function parseCoord(v) {
  if (v == null) return NaN;
  let n;
  if (typeof v === "bigint") n = Number(v) / COORD_SCALE;
  else if (typeof v === "object") {
    if (typeof v.toNumber === "function") n = v.toNumber();
    else if (v.raw != null) n = Number(v.raw) / COORD_SCALE;
    else n = Number(v);
  } else n = Number(v);
  if (!Number.isFinite(n)) return NaN;
  const grid = window.__SA_MAP_MATH__?.MAP_CONFIG?.WORLD_GRID_SIZE;
  const lim = (Number.isFinite(Number(grid)) ? Number(grid) : 5000) * 4;
  if (Math.abs(n) > lim) n = n / COORD_SCALE;
  return Number.isFinite(n) ? n : NaN;
}

function pairXY(a, b) {
  const x = parseCoord(a);
  const y = parseCoord(b);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return { x, y };
}

function parseTs(v) {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  if (typeof v === "bigint") return Number(v);
  if (typeof v === "object") {
    const bits = v.fractionBits != null ? v.fractionBits : v.fractionalBits;
    if (v.raw != null && bits != null) return Number(v.raw) / Math.pow(2, Number(bits));
    if (typeof v.toNumber === "function") return v.toNumber();
    if (v.raw != null) return Number(v.raw);
  }
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function movementCoords(d) {
  const kind = String((d.state && (d.state.__kind || d.state.kind)) || "");
  if (kind !== "MoveWarp" && kind !== "MoveSubwarp") return null;
  const f0 = d.state && d.state.fields && d.state.fields[0];
  if (!f0) return null;
  const j = f0.journey || f0;
  const fromArr = j.from && j.from.length >= 2 ? j.from : d.location;
  const toArr = j.to || f0.to;
  const from = fromArr && fromArr.length >= 2 ? pairXY(fromArr[0], fromArr[1]) : null;
  const to = toArr && toArr.length >= 2 ? pairXY(toArr[0], toArr[1]) : null;
  if (!to) return from;
  if (!from) return to;
  let start = parseTs(j.departureTime);
  let dur = parseTs(j.duration);
  let end = start && dur ? start + dur : 0;
  if (!start && kind === "MoveWarp") {
    start = parseTs(f0.warpStart);
    end = parseTs(f0.warpFinish);
  }
  const now = Date.now() / 1000;
  if (!start || !end || end <= start || now >= end) return to;
  const u = Math.max(0, Math.min(1, (now - start) / (end - start)));
  return { x: from.x + (to.x - from.x) * u, y: from.y + (to.y - from.y) * u };
}

function parkedCoords(d, raw) {
  const loc = d.location || raw.location;
  if (Array.isArray(loc) && loc.length >= 2) {
    const p = pairXY(loc[0], loc[1]);
    if (p) return p;
  }
  const c = d.coordinates || raw.coordinates;
  if (Array.isArray(c) && c.length >= 2) {
    const p = pairXY(c[0], c[1]);
    if (p) return p;
  }
  if (c && typeof c === "object" && !Array.isArray(c)) {
    const p = pairXY(c.x, c.y);
    if (p) return p;
  }
  return null;
}

function fleetCoords(raw) {
  if (!raw) return null;
  const d = raw.data || raw;
  return movementCoords(d) || parkedCoords(d, raw);
}

function derivedCoords(key) {
  if (!key) return null;
  try {
    const store = window.__SA_DERIVED_FLEETS__;
    const get = store && store.getDerivedFleet;
    if (typeof get !== "function") return null;
    const d = get.call(store, key);
    const c = d && d.currentCoordinates;
    if (!c || c.length < 2) return null;
    const x = Number(c[0]);
    const y = Number(c[1]);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
    return { x, y };
  } catch {
    return null;
  }
}

function liveFleetCoords(key, raw) {
  return mapGameCoords(key) || derivedCoords(key) || fleetCoords(raw);
}

function mapGameCoords(key) {
  if (!key) return null;
  try {
    const map = window.__SA_PIXI_MAP__;
    if (!map) return null;
    const stored = map.fleetGameCoordsMap && map.fleetGameCoordsMap.get(key);
    if (stored && Number.isFinite(Number(stored.x)) && Number.isFinite(Number(stored.y))) {
      return { x: Number(stored.x), y: Number(stored.y) };
    }
    if (typeof map.getFleetWorldPosition === "function" && typeof map.pixelToGame === "function") {
      const pin = map.getFleetWorldPosition(key);
      if (pin && Number.isFinite(pin.x) && Number.isFinite(pin.y)) {
        const g = map.pixelToGame(pin.x, pin.y);
        if (g && Number.isFinite(g.x) && Number.isFinite(g.y)) return { x: g.x, y: g.y };
      }
    }
  } catch {
    /* ignore */
  }
  return null;
}

function mapSelectFleet(key, game) {
  try {
    const map = window.__SA_PIXI_MAP__;
    if (!map || typeof map.selectFleetByKey !== "function") return false;
    const c = game || mapGameCoords(key);
    if (!c) return false;
    map.selectFleetByKey(key, c.x, c.y);
    return true;
  } catch {
    return false;
  }
}

function fleetState(raw) {
  const d = raw?.data || raw;
  const st = d?.state;
  return (st && (st.__kind || st.kind)) || d?.effectiveState || "";
}

function listOwned() {
  const out = [];
  const seen = {};
  try {
    const peek = window.__SA_PEEK_FLEETS__;
    const all = typeof peek === "function" ? peek() : [];
    if (!all || !all.length) return out;
    let profile = window.__SA_PLAYER_PROFILE__;
    if (!profile) {
      const sel = window.__SA_SELECTED_FLEET__;
      if (sel?.key) {
        for (let i = 0; i < all.length; i++) {
          const f = all[i];
          if (String(f?.address || f?.key) === String(sel.key) && f?.data?.ownerProfile) {
            profile = f.data.ownerProfile;
            window.__SA_PLAYER_PROFILE__ = profile;
            break;
          }
        }
      }
    }
    if (!profile) return out;
    for (let i = 0; i < all.length; i++) {
      const f = all[i];
      if (!f) continue;
      const key = String(f.address || f.key || "");
      if (!key || seen[key]) continue;
      const owner = f.data?.ownerProfile;
      if (owner && String(owner) !== String(profile)) continue;
      seen[key] = 1;
      const label = String(f.data?.fleetLabel || f.fleetLabel || `Fleet ${key.slice(0, 8)}…`);
      out.push({ key, label, state: fleetState(f), coords: fleetCoords(f), raw: f });
    }
    out.sort((a, b) => a.label.localeCompare(b.label));
  } catch {
    /* ignore */
  }
  return out;
}

function findOwned(key) {
  if (!key) return null;
  const owned = listOwned();
  return owned.find((f) => f.key === key) || null;
}

function destroyedFleetKeys() {
  const dead = new Set();
  try {
    const peek = window.__SA_PEEK_FLEETS__;
    const all = typeof peek === "function" ? peek() : [];
    if (!Array.isArray(all)) return dead;
    for (let i = 0; i < all.length; i++) {
      const f = all[i];
      if (!f) continue;
      const key = String(f.address || f.key || "");
      if (!key) continue;
      if (fleetState(f) === "Destroyed") dead.add(key);
    }
  } catch {
    /* ignore */
  }
  return dead;
}

function pruneDeadSlots() {
  const dead = destroyedFleetKeys();
  if (!dead.size) return;
  let changed = false;
  for (let i = 0; i < SLOT_N; i++) {
    const key = slotState.keys[i];
    if (key && dead.has(key)) {
      slotState.keys[i] = null;
      changed = true;
    }
  }
  if (changed) saveSlots(slotState);
}

function placeHudPad() {
  const html = document.documentElement;
  if (!root || root.classList.contains("sa-bar-hidden") || !root.getBoundingClientRect) {
    try {
      html.style.removeProperty("--sa-hud-pad-bottom");
      html.style.removeProperty("--sa-hud-pad-top");
      html.classList.remove("sa-bar-top");
    } catch {
      /* ignore */
    }
    return;
  }
  const br = root.getBoundingClientRect();
  const vh = window.innerHeight || 800;
  const gap = 14;
  const atBottom = br.top + br.height / 2 > vh * 0.45;
  const padB = atBottom ? Math.max(24, Math.round(vh - br.top + gap)) : 24;
  const padT = atBottom ? 24 : Math.max(24, Math.round(br.bottom + gap));
  html.style.setProperty("--sa-hud-pad-bottom", padB + "px");
  html.style.setProperty("--sa-hud-pad-top", padT + "px");
  html.classList.toggle("sa-bar-top", !atBottom);
}

function mapZoom() {
  try {
    const vp = window.__SA_MAP_VIEWPORT__;
    if (!vp) return NaN;
    if (typeof vp.scaled === "number" && Number.isFinite(vp.scaled)) return vp.scaled;
    if (vp.scale && typeof vp.scale.x === "number" && Number.isFinite(vp.scale.x)) return vp.scale.x;
    if (typeof vp.scale === "number" && Number.isFinite(vp.scale)) return vp.scale;
  } catch {
    /* ignore */
  }
  return NaN;
}

function paintZoom() {
  if (!root) return;
  const el = root.querySelector("[data-zoom]");
  if (!el) return;
  const z = mapZoom();
  try {
    window.__SA_MAP_ZOOM__ = z;
  } catch {
    /* ignore */
  }
  const t = Number.isFinite(z) ? "Z " + z.toFixed(2) : "Z —";
  if (el.textContent !== t) el.textContent = t;
}

function placeOptsPanel() {
  if (!root) return;
  const panel = root.querySelector("[data-opts-panel]");
  if (!panel || !panel.classList.contains("on")) return;
  const br = root.getBoundingClientRect();
  const vh = window.innerHeight || 800;
  const ph = panel.offsetHeight || 170;
  const above = br.top;
  const below = vh - br.bottom;
  const putAbove = above >= ph + 8 || above >= below;
  panel.classList.toggle("above", putAbove);
  panel.classList.toggle("below", !putAbove);
}

function clickFleetRowByLabel(label) {
  const want = String(label || "").replace(/\s+/g, " ").trim();
  if (!want) return false;
  const rows = document.querySelectorAll('[class*="fleetRow"], [class*="fleetCard"]');
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const name = row.querySelector('[class*="fleetName"], [class*="fleetLabel"]');
    const t = ((name && name.textContent) || row.textContent || "").replace(/\s+/g, " ").trim();
    if (t === want || t.indexOf(want) === 0) {
      row.click();
      return true;
    }
  }
  return false;
}

function mapFollow() {
  return window.__SA_MAP_FOLLOW__ || null;
}

function stopFollow() {
  try {
    const f = mapFollow();
    if (f && typeof f.stop === "function") f.stop();
  } catch {
    /* ignore */
  }
}

function unblockMap() {
  try {
    const mc = window.__SA_MAP_CONTROL__;
    if (mc && typeof mc.unblockMap === "function") mc.unblockMap();
  } catch {
    /* ignore */
  }
}

function dismissFleetPanel() {
  /* Do not click official Close — that also clears the selected fleet. */
  unblockMap();
}

function startFollow() {
  try {
    const f = mapFollow();
    if (!f) return;
    const cur = typeof f.key === "function" ? f.key() : null;
    const sel = window.__SA_SELECTED_FLEET__ && window.__SA_SELECTED_FLEET__.key;
    if (cur && sel && String(cur) === String(sel)) return;
    if (typeof f.toggle === "function") f.toggle();
  } catch {
    /* ignore */
  }
}

function followUntilDrag() {
  startFollow();
  const onDown = (e) => {
    if (e.button !== 0) return;
    const t = e.target;
    if (!t) return;
    if (t.closest && t.closest("#sa-action-bar, #sa-tgt-dock, #sa-tgt-scout, #sa-target-hud, #sa-ops-banner, #sa-combat-log-box")) {
      return;
    }
    const canvas = document.querySelector("canvas");
    if (canvas && (t === canvas || (canvas.contains && canvas.contains(t)))) {
      stopFollow();
      window.removeEventListener("pointerdown", onDown, true);
    }
  };
  window.addEventListener("pointerdown", onDown, true);
}

function selectFleet(key, pan) {
  if (!key) return;
  const f = findOwned(key);
  const raw = (f && f.raw) || selectedFleetRaw();
  const coords = liveFleetCoords(key, raw) || (f && f.coords);
  const mc = window.__SA_MAP_CONTROL__;
  const okCoords = coords && Number.isFinite(coords.x) && Number.isFinite(coords.y);
  try {
    window.__SA_SELECTED_FLEET__ = {
      key: String(key),
      label: String((f && f.label) || key).slice(0, 48),
    };
  } catch {
    /* ignore */
  }
  let picked = mapSelectFleet(key, coords);
  if (!picked && okCoords && mc && typeof mc.requestSelectFleet === "function") {
    try {
      mc.requestSelectFleet(key, coords);
      picked = true;
    } catch {
      /* ignore */
    }
  }
  if (!picked && f) picked = clickFleetRowByLabel(f.label);
  if (!pan) {
    stopFollow();
    dismissFleetPanel();
    paint();
    return;
  }
  if (okCoords && mc && typeof mc.requestPanTo === "function") {
    try {
      mc.requestPanTo(coords);
    } catch {
      /* ignore */
    }
  }
  followUntilDrag();
  dismissFleetPanel();
  setTimeout(unblockMap, 120);
  paint();
}

let slotState = loadSlots();
let pickFor = -1;
let pickEl = null;

function assignSlot(idx, fleet) {
  if (idx < 0 || idx >= SLOT_N || !fleet?.key) return;
  for (let i = 0; i < SLOT_N; i++) {
    if (slotState.keys[i] === fleet.key) slotState.keys[i] = null;
  }
  slotState.keys[idx] = fleet.key;
  slotState.labels[fleet.key] = fleet.label;
  saveSlots(slotState);
  closePicker();
  paintSlots();
}

function clearSlot(idx) {
  if (idx < 0 || idx >= SLOT_N) return;
  slotState.keys[idx] = null;
  saveSlots(slotState);
  paintSlots();
}

function closePicker() {
  pickFor = -1;
  if (pickEl) {
    try {
      pickEl.remove();
    } catch {
      /* ignore */
    }
    pickEl = null;
  }
}

function placePicker(idx) {
  if (!pickEl || !root) return;
  const btn = root.querySelector(`[data-slot="${idx}"]`);
  const br = btn ? btn.getBoundingClientRect() : root.getBoundingClientRect();
  const vw = window.innerWidth || 800;
  const vh = window.innerHeight || 600;
  pickEl.style.visibility = "hidden";
  pickEl.style.display = "flex";
  const w = pickEl.offsetWidth || 240;
  const h = pickEl.offsetHeight || 200;
  let left = br.left;
  let top = br.bottom + 6;
  if (top + h > vh - 8) top = Math.max(8, br.top - h - 6);
  if (left + w > vw - 8) left = Math.max(8, vw - w - 8);
  if (left < 8) left = 8;
  pickEl.style.left = `${Math.round(left)}px`;
  pickEl.style.top = `${Math.round(top)}px`;
  pickEl.style.visibility = "visible";
}

function bindFleetDrag(row, fleet) {
  row.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const sx = e.clientX;
    const sy = e.clientY;
    let ghost = null;
    let dragging = false;
    const move = (ev) => {
      ev.stopPropagation();
      const dx = ev.clientX - sx;
      const dy = ev.clientY - sy;
      if (!dragging && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
        dragging = true;
        ghost = document.createElement("div");
        ghost.id = "sa-fleet-ghost";
        ghost.textContent = fleet.label;
        document.body.appendChild(ghost);
        root?.querySelectorAll("[data-slot]").forEach((b) => {
          if (!b.classList.contains("sa-slot-on")) b.classList.add("sa-slot-drop");
        });
      }
      if (ghost) {
        ghost.style.left = `${ev.clientX + 10}px`;
        ghost.style.top = `${ev.clientY + 10}px`;
      }
    };
    const up = (ev) => {
      window.removeEventListener("pointermove", move, true);
      window.removeEventListener("pointerup", up, true);
      window.removeEventListener("pointercancel", up, true);
      if (ghost) {
        try {
          ghost.remove();
        } catch {
          /* ignore */
        }
      }
      root?.querySelectorAll("[data-slot]").forEach((b) => b.classList.remove("sa-slot-drop"));
      if (dragging) {
        const hit = document.elementFromPoint(ev.clientX, ev.clientY);
        const slot = hit && hit.closest ? hit.closest("[data-slot]") : null;
        if (slot) assignSlot(Number(slot.dataset.slot), fleet);
      } else if (pickFor >= 0) {
        assignSlot(pickFor, fleet);
      }
    };
    window.addEventListener("pointermove", move, true);
    window.addEventListener("pointerup", up, true);
    window.addEventListener("pointercancel", up, true);
  });
}

function openPicker(idx) {
  pickFor = idx;
  if (!pickEl) {
    pickEl = document.createElement("div");
    pickEl.id = "sa-fleet-pick";
    pickEl.addEventListener("pointerdown", (e) => e.stopPropagation());
    document.body.appendChild(pickEl);
  }
  const owned = listOwned();
  const used = new Set(slotState.keys.filter(Boolean));
  const rows = owned
    .map((f) => {
      const usedHere = used.has(f.key);
      const st = f.state ? esc(String(f.state)) : "";
      const el = document.createElement("div");
      el.className = "sa-fp-row" + (usedHere ? " sa-fp-used" : "");
      el.innerHTML = `<span>${esc(f.label)}</span>${st ? `<span class="sa-fp-st">${st}</span>` : ""}`;
      bindFleetDrag(el, f);
      return el;
    });
  pickEl.innerHTML = "";
  const head = document.createElement("div");
  head.className = "sa-fp-h";
  head.textContent = owned.length ? "Drag a fleet onto a slot" : "Waiting for fleets…";
  pickEl.appendChild(head);
  const list = document.createElement("div");
  list.className = "sa-fp-list";
  if (!rows.length) {
    const empty = document.createElement("div");
    empty.className = "sa-fp-empty";
    empty.textContent = "No owned fleets yet — select a fleet once, then reopen.";
    list.appendChild(empty);
  } else {
    rows.forEach((r) => list.appendChild(r));
  }
  pickEl.appendChild(list);
  placePicker(idx);
}

function paintSlots() {
  if (!root) return;
  pruneDeadSlots();
  const row = root.querySelector("[data-slots]");
  if (!row) return;
  const owned = listOwned();
  const byKey = {};
  owned.forEach((f) => {
    byKey[f.key] = f;
  });
  const sel = window.__SA_SELECTED_FLEET__?.key ? String(window.__SA_SELECTED_FLEET__.key) : "";
  for (let i = 0; i < SLOT_N; i++) {
    let b = row.querySelector(`[data-slot="${i}"]`);
    if (!b) {
      b = document.createElement("button");
      b.type = "button";
      b.dataset.slot = String(i);
      let clickTimer = 0;
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (e.target && e.target.closest && e.target.closest("[data-slot-x]")) {
          if (clickTimer) {
            clearTimeout(clickTimer);
            clickTimer = 0;
          }
          clearSlot(i);
          return;
        }
        const key = slotState.keys[i];
        if (!key) {
          openPicker(i);
          return;
        }
        if (clickTimer) clearTimeout(clickTimer);
        clickTimer = window.setTimeout(() => {
          clickTimer = 0;
          closePicker();
          selectFleet(key, false);
        }, 260);
      });
      b.addEventListener("dblclick", (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (clickTimer) {
          clearTimeout(clickTimer);
          clickTimer = 0;
        }
        const key = slotState.keys[i];
        if (key) selectFleet(key, true);
      });
      b.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (slotState.keys[i]) clearSlot(i);
        else openPicker(i);
      });
      row.appendChild(b);
    }
    const key = slotState.keys[i];
    const live = key ? byKey[key] : null;
    const label = live?.label || (key && slotState.labels[key]) || "";
    if (key && live?.label) slotState.labels[key] = live.label;
    const on = !!key;
    b.className = "sa-slot" + (on ? " sa-slot-on" : "") + (on && key === sel ? " sa-slot-sel" : "");
    b.dataset.tip = on
      ? `${label || key.slice(0, 8)} · click select · double-click follow`
      : "Empty — click for fleet list";
    b.setAttribute("aria-label", b.dataset.tip);
    const html =
      `<span class="sa-slot-ix">${i + 1}</span>` +
      (on
        ? `<span class="sa-slot-name">${esc(shortName(label || key.slice(0, 6)))}</span>` +
          `<span class="sa-slot-x" data-slot-x title="Clear">×</span>`
        : `<span class="sa-slot-plus">+</span>`);
    if (b.innerHTML !== html) b.innerHTML = html;
  }
  if (pickEl && pickFor >= 0 && owned.length && !pickEl.querySelector(".sa-fp-row")) {
    openPicker(pickFor);
  }
}

function paint() {
  if (!root) return;
  const show = visiblePref() && inGame();
  root.classList.toggle("sa-bar-hidden", !show);
  try {
    document.documentElement.classList.toggle("sa-our-fleet-bar", show);
  } catch {
    /* ignore */
  }
  if (!show) {
    closePicker();
    return;
  }
  const acts = root.querySelector("[data-acts]");
  if (!acts) return;
  const cls = liveClasses();
  const rail = root.querySelector("[data-sa-rail]");
  const fab = root.querySelector("[data-sa-fab]");
  if (rail) {
    const el = document.querySelector('[class*="fleetRail"]:not(#sa-action-bar):not(#sa-action-bar *)');
    rail.className = pickClasses(el, /fleetRail/, "_fleetRail_1040r_1");
    rail.style.display = "contents";
  }
  if (fab) {
    const el = document.querySelector(
      '[class*="fleetActionBar"]:not(#sa-action-bar):not(#sa-action-bar *):not([data-sa-fab])',
    );
    fab.className = pickClasses(el, /fleetActionBar/, "_fleetActionBar_1040r_863");
    fab.style.display = "contents";
  }
  ACTIONS.forEach((a) => {
    let b = acts.querySelector(`[data-act="${a.id}"]`);
    if (!b) {
      b = document.createElement("button");
      b.type = "button";
      b.dataset.act = a.id;
      if (a.danger) b.setAttribute("data-action-tone", "attack");
      b.addEventListener("click", () => {
        if (b.getAttribute("aria-disabled") === "true" || b.classList.contains("sa-busy")) return;
        clickStock(a);
      });
      acts.appendChild(b);
    }
    const extra = a.danger ? ` ${BTN} ${BTN_DANGER}` : ` ${BTN}`;
    b.className = `${cls.btn}${extra}`;
    const chord = chordFor(a);
    const shown = formatChord(chord);
    if (!b.querySelector("[data-ico]")) {
      b.innerHTML =
        `<span class="${cls.inner} sa-act-inner">` +
        `<span class="${cls.ico} sa-act-ico" data-ico>${ICO[a.id] || ""}</span>` +
        `<span class="${cls.text}">` +
        `<span class="${cls.label} sa-act-lab">${esc(a.short || a.label)}</span>` +
        `<span class="${cls.sub} sa-hk" data-hk>${shown ? esc(shown) : ""}</span>` +
        `</span></span>` +
        `<span class="sa-hg" aria-hidden="true"><span class="clk"></span></span>`;
    } else {
      const hk = b.querySelector("[data-hk]");
      if (hk && hk.textContent !== shown) hk.textContent = shown;
      const lab = b.querySelector(".sa-act-lab");
      if (lab && lab.textContent !== (a.short || a.label)) lab.textContent = a.short || a.label;
    }
    const stock = findStock(a);
    const ico = b.querySelector("[data-ico]");
    if (ico && !ico.querySelector("svg")) ico.innerHTML = ICO[a.id] || "";
    pendingDone();
    const raw = selectedFleetRaw();
    const moving = isInTransit(raw);
    const cd = warpCooldownLeft(raw);
    const hasFleet = !!raw || !!window.__SA_SELECTED_FLEET__;
    let dead = !stock || stock.disabled;
    if (a.id === "stop") dead = stock ? stock.disabled : !moving;
    else if (moving && /^(warp|subwarp|mine|scan|gate|dock|stims|loot)$/.test(a.id)) dead = true;
    else if (a.id === "warp" && cd > 0.5) dead = true;
    else if (!hasFleet) dead = true;
    const busy = !!(pendingTx && pendingTx.action === a.id && !pendingDone());
    b.disabled = false;
    b.setAttribute("aria-disabled", dead || busy ? "true" : "false");
    b.classList.toggle("sa-dim", dead && !busy);
    b.classList.toggle("sa-busy", busy);
    b.classList.toggle("sa-on", a.id === "stop" && moving && !dead && !busy);
    let tip = shown ? `${a.label}  (${shown})` : a.label;
    if (a.id === "warp" && cd > 0.5) tip += " · CD " + Math.ceil(cd) + "s";
    if (a.id === "stop" && moving) {
      const left = movementEndUnix(raw) - Date.now() / 1000;
      if (left > 0) tip += " · " + Math.ceil(left) + "s";
    }
    b.dataset.tip = tip;
    b.setAttribute("aria-label", tip);
    b.title = tip;
    if (stock && stock.getAttribute("data-active") === "true") b.setAttribute("data-active", "true");
    else b.removeAttribute("data-active");
  });
  paintSlots();
  placeWarpChrome();
  applyLook();
  placeHudPad();
  placeOptsPanel();
  paintZoom();
  unblockMap();
}

function ensure() {
  hideCss();
  if (root && root.isConnected) return root;
  root = document.createElement("div");
  root.id = "sa-action-bar";
  root.dataset.saOverlay = "action-bar";
  root.innerHTML =
    '<div class="sa-bar-tools">' +
    '<div class="sa-bar-grip" data-drag title="SAGE UI Fixes · Fleet bar · drag to move · double-click reset">⋮⋮</div>' +
    '<button type="button" class="sa-bar-optbtn" data-opts title="Bar options">⚙</button>' +
    '<span class="sa-zoom" data-zoom title="Map zoom (scale). Zoomed out ~0.08, in up to 100.">Z —</span></div>' +
    '<div class="sa-bar-opts" data-opts-panel>' +
    '<label>Icon size <span><input type="range" data-opt="icon" min="16" max="56" step="2"> <span class="n" data-opt-icon-n></span></span></label>' +
    '<label>Show text <input type="checkbox" data-opt="text"></label>' +
    '<label>Spacing <span><input type="range" data-opt="gap" min="0" max="24" step="1"> <span class="n" data-opt-gap-n></span></span></label>' +
    "</div>" +
    '<div data-sa-rail style="display:contents">' +
    '<div data-sa-fab style="display:contents">' +
    '<div class="sa-acts" data-acts></div></div></div>' +
    '<div class="sa-slots" data-slots></div>';
  (document.body || document.documentElement).appendChild(root);
  bindDrag(root.querySelector("[data-drag]"));
  bindKeys();
  bindPickerDismiss();
  bindOpts();
  const slots = root.querySelector("[data-slots]");
  if (slots) {
    slots.addEventListener("pointerdown", (e) => e.stopPropagation());
  }
  applySavedOrCenter();
  applyLook();
  paint();
  return root;
}

function bindOpts() {
  if (!root || root.__saOpts) return;
  root.__saOpts = true;
  const btn = root.querySelector("[data-opts]");
  const panel = root.querySelector("[data-opts-panel]");
  if (btn && panel) {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const on = !panel.classList.contains("on");
      panel.classList.toggle("on", on);
      btn.classList.toggle("on", on);
      if (on) {
        panel.classList.remove("above", "below");
        requestAnimationFrame(() => placeOptsPanel());
      }
    });
  }
  root.addEventListener("input", (e) => {
    const t = e.target;
    if (!t || !t.getAttribute) return;
    const k = t.getAttribute("data-opt");
    if (!k) return;
    if (k === "icon") look.icon = clampNum(t.value, 16, 56, LOOK_DEF.icon);
    else if (k === "gap") look.gap = clampNum(t.value, 0, 24, LOOK_DEF.gap);
    else if (k === "text") look.text = !!t.checked;
    saveLook();
    applyLook();
  });
  document.addEventListener(
    "pointerdown",
    (e) => {
      if (!panel || !panel.classList.contains("on")) return;
      const t = e.target;
      if (t && t.closest && t.closest("[data-opts-panel], [data-opts]")) return;
      panel.classList.remove("on");
      if (btn) btn.classList.remove("on");
    },
    true,
  );
}

function bindPickerDismiss() {
  if (window.__SA_SLOT_DISMISS__) return;
  window.__SA_SLOT_DISMISS__ = true;
  document.addEventListener(
    "pointerdown",
    (e) => {
      if (!pickEl) return;
      const t = e.target;
      if (t && t.closest && (t.closest("#sa-fleet-pick") || t.closest("[data-slot]"))) return;
      closePicker();
    },
    true,
  );
  window.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape" && pickEl) {
        e.preventDefault();
        closePicker();
      }
    },
    true,
  );
}

function setVisible(on) {
  try {
    if (on) localStorage.removeItem(HIDE_KEY);
    else localStorage.setItem(HIDE_KEY, "1");
  } catch {
    /* ignore */
  }
  paint();
  return visiblePref();
}

window.__SA_ACTION_BAR__ = {
  paint,
  fire: fireAction,
  isVisible: visiblePref,
  setVisible,
  show: () => setVisible(true),
  hide: () => setVisible(false),
  slots: () => slotState.keys.slice(),
  assignSlot,
  clearSlot,
  bindings: () => ACTIONS.map((a) => ({ id: a.id, chord: chordFor(a) })),
  look: () => ({ ...look }),
  setLook: (p) => {
    if (!p || typeof p !== "object") return look;
    if (p.icon != null) look.icon = clampNum(p.icon, 16, 56, look.icon);
    if (p.gap != null) look.gap = clampNum(p.gap, 0, 24, look.gap);
    if (p.text != null) look.text = !!p.text;
    saveLook();
    applyLook();
    return { ...look };
  },
};
window.__SA_BAR_RESET__ = resetPos;

hideCss();
function boot() {
  if (!document.body) {
    setTimeout(boot, 50);
    return;
  }
  ensure();
  setInterval(() => {
    try {
      paint();
    } catch {
      /* ignore */
    }
  }, 700);
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
