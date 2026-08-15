/** SAGE UI Fixes v2 — fleet action bar. MAIN world. LEEKS / Produce Bandit ltd
 *
 * Live 0.0.355: hide stock 3-row `_statusActions`+`_fleetActionBar`, click those
 * buttons from our one-row `#sa-action-bar`. Our tiles are `sa-act` (opaque);
 * stock button classes are glass and pin icons at 0.95rem.
 * Second row: 8 fleet slots (`saFleetSlots.v1`) — click empty → list, drag to assign.
 */
const POS_KEY = "saActionBarPos.v1";
const HIDE_KEY = "saHideActionBar";
const BTN = "sa-act";
const BTN_DANGER = "sa-act-danger";

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
  { id: "dock", label: "Dock", match: /^(dock|undock)$/i, hk: "1" },
  { id: "warp", label: "Warp", match: /^warp$/i, hk: "2" },
  { id: "subwarp", label: "Subwarp", match: /^subwarp$/i, hk: "3" },
  { id: "gate", label: "Warp Gate", match: /warp\s*(gate|lane)/i, hk: "4" },
  { id: "scan", label: "Scan", match: /^scan$/i, hk: "5" },
  { id: "attack", label: "Attack", match: /^attack$/i, hk: "6" },
  { id: "repair", label: "Repair", match: /^repair/i, hk: "7" },
  { id: "mine", label: "Mine", match: /^mine$/i, hk: "8" },
  { id: "stop", label: "Stop", match: /^stop$/i, hk: "9" },
  { id: "stims", label: "Stims", match: /^(stims|stimulant|apply stimulant)$/i, hk: "0" },
  { id: "loot", label: "Loot", match: /loot/i, hk: null },
  { id: "destruct", label: "Destruct", match: /destruct/i, hk: null, danger: true },
];

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
    "#sa-action-bar{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:999990;",
    "display:flex;flex-direction:column;align-items:center;gap:4px;pointer-events:none;",
    "font-family:var(--font-family-display,Orbitron,sans-serif)}",
    "#sa-action-bar.sa-bar-pos{left:auto;bottom:auto;transform:none}",
    "#sa-action-bar .sa-bar-grip{pointer-events:auto;cursor:grab;user-select:none;touch-action:none;",
    "padding:2px 14px;opacity:.35;color:#ffbe4d;font:600 9px Orbitron,sans-serif;letter-spacing:.28em}",
    "#sa-action-bar .sa-bar-grip:hover,#sa-action-bar.sa-bar-dragging .sa-bar-grip{opacity:.9;cursor:grabbing}",
    "#sa-action-bar .sa-acts{pointer-events:auto;display:flex;flex-wrap:nowrap;align-items:stretch;",
    "gap:6px;padding:6px 8px;background:#0a0e1a;border-radius:4px}",
    /* solid tiles — stock status/fleet classes are glass + 0.95rem icons */
    "#sa-action-bar .sa-acts>button{all:unset;box-sizing:border-box;position:relative;display:flex;",
    "align-items:center;justify-content:center;width:2.85rem!important;min-width:2.85rem!important;",
    "height:2.85rem!important;min-height:2.85rem!important;padding:2px!important;flex:0 0 auto;",
    "cursor:pointer;opacity:1!important;background:#1c160c!important;background-image:none!important;",
    "border:1px solid #ffbe4d!important;color:#ffbe4d!important;box-shadow:none!important;",
    "filter:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;overflow:hidden}",
    "#sa-action-bar .sa-acts>button:hover:not(:disabled){background:#2a2010!important;color:#ffe08a!important}",
    "#sa-action-bar .sa-acts>button:disabled{cursor:not-allowed;opacity:1!important;background:#0e0c09!important;",
    "border-color:#2e2818!important;color:#3d3624!important}",
    "#sa-action-bar .sa-acts>button:disabled .sa-hk{opacity:.28}",
    "#sa-action-bar .sa-acts>button[data-act=destruct]:not(:disabled){background:#2a1012!important;border-color:#ff4960!important;color:#ff6b7a!important}",
    "#sa-action-bar .sa-acts>button[data-act=destruct]:disabled{background:#10080a!important;border-color:#2a181c!important;color:#3a2226!important}",
    "#sa-action-bar .sa-acts>button::before{content:none!important;display:none!important}",
    "#sa-action-bar .sa-acts>button .sa-act-inner,#sa-action-bar .sa-acts>button .sa-act-ico{",
    "display:flex!important;align-items:center!important;justify-content:center!important;",
    "width:100%!important;height:100%!important;padding:0!important;margin:0!important;gap:0!important}",
    "#sa-action-bar .sa-acts>button svg{display:block!important;width:100%!important;height:100%!important;",
    "max-width:none!important;max-height:none!important;stroke:currentColor!important;fill:none!important;",
    "stroke-width:2;stroke-linejoin:round;stroke-linecap:round}",
    "#sa-action-bar .sa-acts .sa-hk{position:absolute;right:3px;bottom:2px;font:700 8px Orbitron,sans-serif;",
    "letter-spacing:.04em;opacity:.7;line-height:1;pointer-events:none}",
    "#sa-action-bar .sa-acts>button[data-tip]:hover::after{content:attr(data-tip);position:absolute;",
    "left:50%;bottom:calc(100% + 7px);transform:translateX(-50%);white-space:nowrap;z-index:2;",
    "padding:4px 8px;border-radius:2px;background:#0a0e1af2;border:1px solid rgba(255,190,77,.45);",
    "color:#ffbe4d;font:700 9px Orbitron,sans-serif;letter-spacing:.08em;text-transform:uppercase;",
    "pointer-events:none}",
    "#sa-action-bar .sa-acts>button[data-act=destruct]{margin-left:2.2rem}",
    "#sa-action-bar .sa-slots{pointer-events:auto;display:flex;flex-wrap:nowrap;align-items:stretch;",
    "gap:6px;padding:4px 8px 6px;background:#0a0e1a;border-radius:4px}",
    "#sa-action-bar .sa-slots>button{all:unset;box-sizing:border-box;position:relative;display:flex;",
    "flex-direction:column;align-items:center;justify-content:center;width:2.85rem!important;",
    "min-width:2.85rem!important;height:2.85rem!important;min-height:2.85rem!important;",
    "padding:3px 2px 2px!important;flex:0 0 auto;cursor:pointer;opacity:1!important;",
    "background:#14110c!important;border:1px dashed #6a5a28!important;color:#8a7840!important;",
    "overflow:hidden;text-align:center}",
    "#sa-action-bar .sa-slots>button.sa-slot-on{border-style:solid!important;border-color:#ffbe4d!important;",
    "background:#1c160c!important;color:#ffbe4d!important}",
    "#sa-action-bar .sa-slots>button.sa-slot-sel{background:#2a2010!important;box-shadow:inset 0 0 0 1px #ffbe4d}",
    "#sa-action-bar .sa-slots>button.sa-slot-drop{border-color:#ffe08a!important;background:#2a2010!important}",
    "#sa-action-bar .sa-slots>button .sa-slot-ix{position:absolute;top:1px;left:3px;font:700 7px Orbitron,sans-serif;",
    "letter-spacing:.04em;opacity:.45;line-height:1;pointer-events:none}",
    "#sa-action-bar .sa-slots>button .sa-slot-name{display:block;width:100%;max-height:2.2em;overflow:hidden;",
    "font:700 8px/1.1 Orbitron,sans-serif;letter-spacing:.02em;word-break:break-all}",
    "#sa-action-bar .sa-slots>button .sa-slot-plus{font:600 16px/1 Orbitron,sans-serif;opacity:.7}",
    "#sa-action-bar .sa-slots>button .sa-slot-x{position:absolute;top:0;right:1px;width:12px;height:12px;",
    "border:0;background:transparent;color:#ffbe4d;font:700 10px/12px Orbitron,sans-serif;cursor:pointer;",
    "opacity:0;padding:0}",
    "#sa-action-bar .sa-slots>button.sa-slot-on:hover .sa-slot-x{opacity:.85}",
    "#sa-action-bar .sa-slots>button[data-tip]:hover::after{content:attr(data-tip);position:absolute;",
    "left:50%;bottom:calc(100% + 7px);transform:translateX(-50%);white-space:nowrap;z-index:2;",
    "padding:4px 8px;border-radius:2px;background:#0a0e1af2;border:1px solid rgba(255,190,77,.45);",
    "color:#ffbe4d;font:700 9px Orbitron,sans-serif;letter-spacing:.08em;text-transform:uppercase;",
    "pointer-events:none}",
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
  const roots = document.querySelectorAll(
    '[class~="_statusActions_nsg6t_313"][class~="_fleetActionBar_1040r_863"], [class*="statusActions"][class*="fleetActionBar"]',
  );
  const out = [];
  roots.forEach((root) => {
    root.querySelectorAll("button").forEach((b) => out.push(b));
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
  for (const b of btns) {
    const t = buttonText(b);
    const short = (b.textContent || "").replace(/\s+/g, " ").trim();
    if (action.match.test(short) || action.match.test(t)) return b;
  }
  return null;
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

function clickStock(action) {
  const stock = findStock(action);
  if (!stock || stock.disabled) return false;
  try {
    stock.click();
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

function bindKeys() {
  if (window.__SA_FLEET_BAR_KEYS__) return;
  window.__SA_FLEET_BAR_KEYS__ = true;
  window.addEventListener(
    "keydown",
    (e) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      if (typingInField(e.target)) return;
      if (!visiblePref() || !inGame()) return;
      let action = null;
      if (e.key >= "1" && e.key <= "9") {
        action = ACTIONS.find((a) => a.hk === e.key);
      } else if (e.key === "0") {
        action = ACTIONS.find((a) => a.hk === "0");
      }
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

function fleetCoords(raw) {
  if (!raw) return null;
  const d = raw.data || raw;
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

function selectFleet(key, pan) {
  if (!key) return;
  const f = findOwned(key);
  const coords = (f && f.coords) || fleetCoords(f && f.raw);
  const mc = window.__SA_MAP_CONTROL__;
  if (coords && Number.isFinite(coords.x) && Number.isFinite(coords.y) && mc) {
    try {
      if (typeof mc.requestSelectFleet === "function") mc.requestSelectFleet(key, coords);
    } catch {
      /* ignore */
    }
    if (pan) {
      try {
        if (typeof mc.requestPanTo === "function") mc.requestPanTo(coords, key);
      } catch {
        /* ignore */
      }
    }
    return;
  }
  if (f && clickFleetRowByLabel(f.label)) return;
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
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        if (e.target && e.target.closest && e.target.closest("[data-slot-x]")) {
          clearSlot(i);
          return;
        }
        const key = slotState.keys[i];
        if (key) {
          closePicker();
          selectFleet(key, false);
        } else openPicker(i);
      });
      b.addEventListener("dblclick", (e) => {
        e.stopPropagation();
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
    b.dataset.tip = on ? label || key.slice(0, 8) : "Empty — click for fleet list";
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
  ACTIONS.forEach((a) => {
    let b = acts.querySelector(`[data-act="${a.id}"]`);
    if (!b) {
      b = document.createElement("button");
      b.type = "button";
      b.dataset.act = a.id;
      if (a.danger) b.setAttribute("data-action-tone", "danger");
      b.addEventListener("click", () => {
        if (b.disabled) return;
        clickStock(a);
      });
      acts.appendChild(b);
    }
    b.className = a.danger ? `${BTN} ${BTN_DANGER}` : BTN;
    if (!b.querySelector(".sa-act-ico")) {
      b.innerHTML =
        `<span class="sa-act-inner">` +
        `<span class="sa-act-ico" data-ico>${ICO[a.id] || ""}</span>` +
        (a.hk ? `<span class="sa-hk">${a.hk}</span>` : "") +
        `</span>`;
    }
    const stock = findStock(a);
    const ico = b.querySelector("[data-ico]");
    const liveLabel = stock
      ? (stock.querySelector('[class*="statusActionLabel"], [class*="ActionLabel"]') || stock)
          .textContent.replace(/\s+/g, " ")
          .trim()
      : a.label;
    if (ico && !ico.querySelector("svg")) ico.innerHTML = ICO[a.id] || "";
    const dead = !stock || stock.disabled;
    b.disabled = dead;
    const tip = dead
      ? `${liveLabel || a.label} — select a fleet`
      : a.hk
        ? `${liveLabel || a.label}  (${a.hk})`
        : liveLabel || a.label;
    b.dataset.tip = tip;
    b.setAttribute("aria-label", tip);
    b.title = "";
    if (stock && stock.getAttribute("data-active") === "true") b.setAttribute("data-active", "true");
    else b.removeAttribute("data-active");
  });
  paintSlots();
  placeWarpChrome();
}

function ensure() {
  hideCss();
  if (root && root.isConnected) return root;
  root = document.createElement("div");
  root.id = "sa-action-bar";
  root.dataset.saOverlay = "action-bar";
  root.innerHTML =
    '<div class="sa-bar-grip" data-drag title="SAGE UI Fixes · Fleet bar · drag to move · double-click reset">⋮⋮</div>' +
    '<div class="sa-acts" data-acts></div>' +
    '<div class="sa-slots" data-slots></div>';
  (document.body || document.documentElement).appendChild(root);
  bindDrag(root.querySelector("[data-drag]"));
  bindKeys();
  bindPickerDismiss();
  const slots = root.querySelector("[data-slots]");
  if (slots) {
    slots.addEventListener("pointerdown", (e) => e.stopPropagation());
  }
  applySavedOrCenter();
  paint();
  return root;
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
  isVisible: visiblePref,
  setVisible,
  show: () => setVisible(true),
  hide: () => setVisible(false),
  slots: () => slotState.keys.slice(),
  assignSlot,
  clearSlot,
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
