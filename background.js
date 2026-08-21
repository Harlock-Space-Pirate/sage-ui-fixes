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

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === "sa-off") {
    chrome.declarativeNetRequest
      .updateDynamicRules({ removeRuleIds: [RULE] })
      .then(() => sendResponse({ ok: true }))
      .catch((e) => sendResponse({ ok: false, error: String(e) }));
    return true;
  }
  if (msg?.type === "sa-fixes-set-entry-block") {
    block(msg.entryUrl)
      .then(() => sendResponse({ ok: true }))
      .catch((e) => sendResponse({ ok: false, error: String(e) }));
    return true;
  }
  if (msg?.type !== "sa-fixes-inject-module" || !sender.tab?.id) return;
  if (typeof msg.code !== "string" || !msg.code) {
    sendResponse({ ok: false, error: "empty code" });
    return;
  }

  block(msg.entryUrl)
    .then(() =>
      chrome.scripting.executeScript({
        target: { tabId: sender.tab.id },
        world: "MAIN",
        injectImmediately: true,
        func: async (source, entry) => {
          if (globalThis.__SA_FIXES_MODULE_BOOTED__) return { ok: true, skipped: true };
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
        },
        args: [msg.code, msg.entryUrl],
      }),
    )
    .then((r) => sendResponse(r?.[0]?.result || { ok: true }))
    .catch((e) => sendResponse({ ok: false, error: String(e) }));
  return true;
});
