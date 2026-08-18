/** SAGE UI Fixes v2 — document_start isolated. LEEKS / Produce Bandit ltd */
const ENTRY_RE = /assets\/index-[A-Za-z0-9_-]+\.js(?:\?.*)?$/i;
const TAG = "⚔️ sa-ui-fixes";
const C = {
  badge:
    "background:linear-gradient(90deg,#0a0f19,#0d2137);color:#00e5ff;border:1px solid rgba(0,229,255,.45);padding:2px 8px;border-radius:4px;font-weight:800;font-family:ui-monospace,Menlo,monospace;letter-spacing:.4px",
  ok: "color:#34d399;font-weight:700;font-family:ui-monospace,Menlo,monospace",
  info: "color:#67e8f9;font-weight:600;font-family:ui-monospace,Menlo,monospace",
  warn: "color:#fbbf24;font-weight:700;font-family:ui-monospace,Menlo,monospace",
  err: "color:#f87171;font-weight:700;font-family:ui-monospace,Menlo,monospace",
  dim: "color:#64748b;font-family:ui-monospace,Menlo,monospace",
};

function slog(kind, emoji, msg, extra) {
  const style = kind === "ok" ? C.ok : kind === "warn" ? C.warn : kind === "err" ? C.err : kind === "dim" ? C.dim : C.info;
  const fn = kind === "err" ? console.error : kind === "warn" ? console.warn : console.log;
  const plain = `${emoji} ${msg}`;
  if (extra !== undefined) fn(`%c ${TAG} %c ${plain}`, C.badge, style, extra);
  else fn(`%c ${TAG} %c ${plain}`, C.badge, style);
}

const msg = (m) =>
  new Promise((resolve) => {
    try {
      chrome.runtime.sendMessage(m, (r) =>
        resolve(chrome.runtime.lastError ? { ok: false, error: chrome.runtime.lastError.message } : r || { ok: false }),
      );
    } catch (e) {
      resolve({ ok: false, error: String(e) });
    }
  });

function killStock(node) {
  if (!node || node.nodeType !== 1 || node.tagName !== "SCRIPT" || node.dataset?.saFixes === "patched") return;
  const src = node.getAttribute("src") || node.src || "";
  if (!ENTRY_RE.test(src)) return;
  try {
    node.type = "javascript/blocked";
    node.removeAttribute("src");
    node.remove();
  } catch (_) {}
}

function neutralize() {
  try {
    for (const s of document.querySelectorAll("script[src]")) killStock(s);
  } catch (_) {}
  const obs = new MutationObserver((ms) => {
    for (const m of ms) for (const n of m.addedNodes) killStock(n);
  });
  try {
    obs.observe(document.documentElement || document, { childList: true, subtree: true });
  } catch (_) {}
  setTimeout(() => {
    try {
      obs.disconnect();
    } catch (_) {}
  }, 6e4);
}

async function entryUrl() {
  for (const el of document.querySelectorAll("script[src]")) {
    const src = el.getAttribute("src") || "";
    if (!ENTRY_RE.test(src)) continue;
    try {
      return new URL(src, location.href).href;
    } catch (_) {}
  }
  const html = await (await fetch(location.href, { cache: "no-cache" })).text();
  const m = html.match(/src="(\.\/assets\/index-[^"]+\.js)"/);
  if (!m) return null;
  try {
    return new URL(m[1], location.href).href;
  } catch (_) {
    return null;
  }
}

function apply(src, patches) {
  let out = src;
  const landed = [];
  const missed = [];
  for (const p of patches) {
    const find = p.find;
    if (typeof find !== "string" || !find) {
      missed.push(p.id || "?");
      continue;
    }
    const n = out.split(find).length - 1;
    if (n !== 1) {
      missed.push(p.id || "?");
      continue;
    }
    out = out.replace(find, p.replace);
    landed.push(p.id || "?");
  }
  return { out, landed, missed };
}

function rewrite(src, entry) {
  const base = entry.replace(/[^/]+(?:\?.*)?$/, "");
  return src
    .replace(/(["'])\.\/([A-Za-z0-9_.-]+\.js)\1/g, `$1${base}$2$1`)
    .replace(/\bimport\.meta\.url\b/g, JSON.stringify(entry));
}

/** Small MAIN prelude. HUD / combat log / fleet bar return as later modules. */
function prelude(ver, meta) {
  const payload = JSON.stringify({
    version: ver,
    entry: meta.entryName,
    landed: meta.landed,
    missed: meta.missed,
  });
  return `
window.__SA_UI_FIXES__=${payload};
window.__SA_UI_FIXES__.help=function(){console.log("sa-ui-fixes v"+this.version+"  entry="+this.entry+"  landed="+this.landed.length+"/"+ (this.landed.length+this.missed.length));return this};
(function(){
  var KEY="saNoWarpTrails";
  function read(){try{return localStorage.getItem(KEY)==="1"}catch(e){return!1}}
  function apply(){try{window.__SA_NO_WARP_TRAILS__=read()}catch(e){window.__SA_NO_WARP_TRAILS__=!1}}
  function setEnabled(on){try{if(on)localStorage.removeItem(KEY);else localStorage.setItem(KEY,"1")}catch(e){}apply();return !read()}
  apply();
  window.__SA_WARP_TRAILS__={isEnabled:function(){return !read()&&!window.__SA_NO_WARP_TRAILS__},setEnabled:setEnabled,enable:function(){return setEnabled(!0)},disable:function(){return setEnabled(!1)}};
})();
window.__SA_ON_ATTACK__=window.__SA_ON_ATTACK__||function(ev){try{console.log("%c "+${JSON.stringify(TAG)}+" %c ⚔️ "+(ev&&ev.kind||"ATTACK")+" "+((ev&&(ev.systemName||ev.fleetLabel))||""),"background:#0a0f19;color:#00e5ff;padding:2px 8px","color:#67e8f9")}catch(e){}};
window.__SA_MAP_DEBUG__=window.__SA_MAP_DEBUG__||{on:function(){try{localStorage.setItem("saMapDebug","1")}catch(e){}console.log("sa-ui-fixes map debug flag ON — reload if needed")},off:function(){try{localStorage.removeItem("saMapDebug")}catch(e){}},isOn:function(){try{return localStorage.getItem("saMapDebug")==="1"}catch(e){return!1}}};
`;
}

const VER = chrome.runtime.getManifest().version;
console.log(
  `%c ${TAG} %c  LEEKS · Produce Bandit  %c  v${VER}  `,
  C.badge,
  "background:#111827;color:#e2e8f0;padding:2px 8px;font-family:ui-monospace,Menlo,monospace",
  "background:#00e5ff22;color:#00e5ff;padding:2px 8px;font-weight:800;font-family:ui-monospace,Menlo,monospace;border-radius:0 4px 4px 0",
);
slog("info", "🚀", "v2 patch engine online — intercepting SAGE entry");
neutralize();

(async () => {
  try {
    let entry = await entryUrl();
    for (let i = 0; !entry && i < 25; i++) {
      await new Promise((r) => setTimeout(r, 40));
      entry = await entryUrl();
    }
    if (!entry) throw new Error("no entry bundle (assets/index-*.js)");

    const entryName = String(entry).split("/").pop() || entry;
    slog("info", "📦", `entry found → ${entryName}`);

    await msg({ type: "sa-fixes-set-entry-block", entryUrl: entry });
    slog("dim", "🛡️", "stock entry blocked (DNR)");

    const res = await fetch(entry, { cache: "no-cache" });
    if (!res.ok) throw new Error("fetch " + res.status);
    const patches = Array.isArray(globalThis.__SA_PATCHES__) ? globalThis.__SA_PATCHES__ : [];
    const { out, landed, missed } = apply(await res.text(), patches);
    const code = prelude(VER, { entryName, landed, missed }) + rewrite(out, entry);

    slog(
      landed.length ? "ok" : "warn",
      "🩹",
      `patches landed ×${landed.length}/${patches.length}` + (missed.length ? `  missed: ${missed.join(", ")}` : ""),
    );
    slog("info", "🚀", "warp trails → __SA_WARP_TRAILS__.enable() / .disable()");
    slog("info", "💬", "InkChat dock lifted above command footer");
    slog("info", "🧹", "culler bypass · glow clamp · destroyed pins · ownership · builder pulse");

    for (const id of ["root", "modal-root"]) {
      const el = document.getElementById(id);
      if (el) el.innerHTML = "";
    }
    neutralize();

    const r = await msg({ type: "sa-fixes-inject-module", code, entryUrl: entry });
    if (!r?.ok) throw new Error(r?.error || "inject failed");
    if (r?.skipped) slog("warn", "♻️", "module already booted — skipped re-inject");
    else slog("ok", "✅", "patched MAIN module live — SAGE 0.0.371 + LEEKS v2");
  } catch (e) {
    slog("err", "💥", "patch boot failed", e);
  }
})();
