/** MV3: DNR entry block + MAIN inject. LEEKS / Produce Bandit ltd */
const RULE = 1001;

async function block(entryUrl) {
  if (!entryUrl) return;
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [RULE],
    addRules: [
      {
        id: RULE,
        priority: 100,
        action: { type: "block" },
        condition: {
          urlFilter: entryUrl.replace(/^https?:\/\//, "||").split("?")[0],
          resourceTypes: ["script"],
        },
      },
    ],
  });
}

function respond(sendResponse, p) {
  Promise.resolve(p)
    .then((v) => {
      try {
        sendResponse(v);
      } catch (_) {}
    })
    .catch((e) => {
      try {
        sendResponse({ ok: false, error: String(e && e.message ? e.message : e) });
      } catch (_) {}
    });
  return true;
}

/**
 * MAIN-world bootstrap. Does NOT take the patched bundle as an executeScript arg —
 * that 7.6 MB structured-clone used to kill the SW before sendResponse
 * ("message channel closed before a response was received"). Isolated world
 * posts the source via window.postMessage after this function signals ready.
 */
async function bootPatchedModule(nonce, entry) {
  if (globalThis.__SA_FIXES_MODULE_BOOTED__) return { ok: true, skipped: true };

  const source = await new Promise((resolve, reject) => {
    const t = setTimeout(() => {
      window.removeEventListener("message", onMsg);
      reject(new Error("module payload timeout"));
    }, 20000);
    function onMsg(ev) {
      if (ev.source !== window) return;
      const d = ev.data;
      if (!d || d.__saFixes !== "module" || d.nonce !== nonce || typeof d.code !== "string") return;
      window.removeEventListener("message", onMsg);
      clearTimeout(t);
      resolve(d.code);
    }
    window.addEventListener("message", onMsg);
    window.postMessage({ __saFixes: "ready", nonce }, "*");
  });

  if (!source) throw new Error("empty module payload");
  globalThis.__SA_FIXES_MODULE_BOOTED__ = true;

  for (const id of ["root", "modal-root"]) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = "";
  }
  for (const s of document.querySelectorAll('script[src*="/assets/index-"]')) {
    if (s.dataset?.saFixes !== "patched") s.remove();
  }
  const clean = String(entry || "").split("?")[0];
  const blob = URL.createObjectURL(new Blob([source], { type: "text/javascript" }));
  const imports = { [clean]: blob };
  try {
    const u = new URL(clean);
    imports[u.pathname] = blob;
    imports[u.href] = blob;
  } catch (_) {}
  const map = document.createElement("script");
  map.type = "importmap";
  map.textContent = JSON.stringify({ imports });
  const head = document.head || document.documentElement;
  head.insertBefore(map, head.firstChild);
  await new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.type = "module";
    s.src = blob;
    s.dataset.saFixes = "patched";
    s.onload = resolve;
    s.onerror = () => reject(new Error("module onerror"));
    head.appendChild(s);
  });
  return { ok: true };
}

chrome.runtime.onConnect.addListener((port) => {
  // Open port from content.js keeps this SW alive across DNR + executeScript.
  if (port.name !== "sa-boot") return;
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === "sa-ping") {
    sendResponse({ ok: true });
    return;
  }
  if (msg?.type === "sa-off") {
    return respond(
      sendResponse,
      chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: [RULE] }).then(() => ({ ok: true })),
    );
  }
  if (msg?.type === "sa-fixes-set-entry-block") {
    return respond(sendResponse, block(msg.entryUrl).then(() => ({ ok: true })));
  }
  if (msg?.type === "sa-fixes-inject-module") {
    const tabId = sender.tab?.id;
    if (!tabId) {
      sendResponse({ ok: false, error: "no tab" });
      return;
    }
    if (!msg.nonce) {
      sendResponse({ ok: false, error: "missing nonce" });
      return;
    }
    return respond(
      sendResponse,
      block(msg.entryUrl)
        .then(() =>
          chrome.scripting.executeScript({
            target: { tabId },
            world: "MAIN",
            injectImmediately: true,
            func: bootPatchedModule,
            args: [String(msg.nonce), msg.entryUrl || ""],
          }),
        )
        .then((r) => {
          if (r?.[0]?.error) return { ok: false, error: r[0].error.message || String(r[0].error) };
          return r?.[0]?.result || { ok: true };
        }),
    );
  }
  sendResponse({ ok: false, error: "unknown message" });
});
