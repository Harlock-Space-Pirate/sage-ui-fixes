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
  // chrome://extensions shows console.error's first arg as the error title — no %c there
  if (kind === "err") {
    const detail = extra instanceof Error ? extra.message : extra !== undefined ? extra : "";
    if (detail) fn(`${TAG} ${plain}: ${detail}`, extra);
    else fn(`${TAG} ${plain}`);
    return;
  }
  if (extra !== undefined) fn(`%c ${TAG} %c ${plain}`, C.badge, style, extra);
  else fn(`%c ${TAG} %c ${plain}`, C.badge, style);
}

const TRANSIENT_MSG = /message channel closed|Receiving end does not exist|asynchronous response/i;

function msgOnce(m) {
  return new Promise((resolve) => {
    try {
      chrome.runtime.sendMessage(m, (r) =>
        resolve(chrome.runtime.lastError ? { ok: false, error: chrome.runtime.lastError.message } : r || { ok: false }),
      );
    } catch (e) {
      resolve({ ok: false, error: String(e) });
    }
  });
}

async function msg(m, tries = 4) {
  let last = { ok: false, error: "no attempt" };
  for (let i = 0; i < tries; i++) {
    last = await msgOnce(m);
    if (last?.ok) return last;
    if (!TRANSIENT_MSG.test(String(last?.error || ""))) return last;
    await new Promise((r) => setTimeout(r, 40 * (i + 1)));
  }
  return last;
}

function waitPageMessage(pred, ms, label) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => {
      window.removeEventListener("message", on);
      reject(new Error(label));
    }, ms);
    function on(ev) {
      if (ev.source !== window) return;
      if (!pred(ev.data)) return;
      window.removeEventListener("message", on);
      clearTimeout(t);
      resolve(ev.data);
    }
    window.addEventListener("message", on);
  });
}

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

function countFind(src, find) {
  let n = 0;
  let i = 0;
  while ((i = src.indexOf(find, i)) >= 0) {
    n++;
    i += find.length;
    if (n > 1) break;
  }
  return n;
}

function apply(src, patches) {
  const landed = [];
  const missed = [];
  const hits = [];
  for (const p of patches) {
    if (typeof p.find !== "string" || !p.find || countFind(src, p.find) !== 1) {
      missed.push(p.id || "?");
      continue;
    }
    hits.push({ i: src.indexOf(p.find), p });
  }
  // apply right-to-left so earlier indices stay valid
  hits.sort((a, b) => b.i - a.i);
  let out = src;
  for (const h of hits) {
    out = out.slice(0, h.i) + h.p.replace + out.slice(h.i + h.p.find.length);
    landed.push(h.p.id || "?");
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
(async () => {
  let bootPort = null;
  try {
    if (localStorage.getItem("saEnabled") !== "1") {
      slog("dim", "⏻", "OFF — enable in the popup, then reload");
      // leftover dynamic block rule from an ON session would blank the stock game
      const off = await msg({ type: "sa-off" });
      if (!off?.ok) slog("warn", "⚠️", "could not clear leftover entry block", off?.error);
      return;
    }
    try {
      bootPort = chrome.runtime.connect({ name: "sa-boot" });
    } catch (_) {}
    await msg({ type: "sa-ping" });
    slog("info", "🚀", "v2 patch engine online — intercepting SAGE entry");
    neutralize();
    let entry = await entryUrl();
    for (let i = 0; !entry && i < 25; i++) {
      await new Promise((r) => setTimeout(r, 40));
      entry = await entryUrl();
    }
    if (!entry) throw new Error("no entry bundle (assets/index-*.js)");

    const entryName = String(entry).split("/").pop() || entry;
    slog("info", "📦", `entry found → ${entryName}`);

    const blocked = await msg({ type: "sa-fixes-set-entry-block", entryUrl: entry });
    if (!blocked?.ok) throw new Error(blocked?.error || "entry block failed");
    slog("dim", "🛡️", "stock entry blocked (DNR)");

    // hashed entry URL is immutable (30d public cache); HTML is no-store so new deploys show up as new hashes
    const res = await fetch(entry);
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

    // Isolated → MAIN postMessage for the bundle; SW only gets a nonce (see background.js).
    const nonce =
      (globalThis.crypto && crypto.randomUUID && crypto.randomUUID()) || `n${Date.now()}-${Math.random()}`;
    const ready = waitPageMessage((d) => d && d.__saFixes === "ready" && d.nonce === nonce, 12000, "inject bootstrap timeout");
    const injectWait = msg({ type: "sa-fixes-inject-module", nonce, entryUrl: entry }, 1);
    const first = await Promise.race([ready.then(() => ({ kind: "ready" })), injectWait.then((r) => ({ kind: "inject", r }))]);
    if (first.kind === "inject") {
      if (!first.r?.ok) throw new Error(first.r?.error || "inject failed");
      if (first.r?.skipped) {
        slog("warn", "♻️", "module already booted — skipped re-inject");
        return;
      }
    } else {
      window.postMessage({ __saFixes: "module", nonce, code }, "*");
    }
    const r = first.kind === "inject" ? first.r : await injectWait;
    if (!r?.ok) throw new Error(r?.error || "inject failed");
    if (r?.skipped) slog("warn", "♻️", "module already booted — skipped re-inject");
    else slog("ok", "✅", "patched MAIN module live");
  } catch (e) {
    slog("err", "💥", "patch boot failed", e);
  } finally {
    try {
      bootPort?.disconnect();
    } catch (_) {}
  }
})();
