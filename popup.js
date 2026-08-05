/** Popup: version + map-debug toggle. LEEKS / Produce Bandit ltd */
const REPO_RELEASES = "https://github.com/Harlock-Space-Pirate/sage-ui-fixes/releases";
const SAGE_MATCH = "https://sage.staratlas.com/*";

/** One-liners anyone can paste in the browser console (F12 → Console). */
const SNIPPET_ON =
  'localStorage.setItem("saMapDebug","1");location.reload();// SAGE map debugger ON';
const SNIPPET_OFF =
  'localStorage.removeItem("saMapDebug");location.reload();// SAGE map debugger OFF';

function tagUrl(version) {
  const v = String(version || "").replace(/^v/i, "");
  return `${REPO_RELEASES}/tag/v${v}`;
}

async function getSageTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];
  if (tab?.id != null && tab.url && /https:\/\/sage\.staratlas\.com\//i.test(tab.url)) {
    return tab;
  }
  const sage = await chrome.tabs.query({ url: SAGE_MATCH });
  return sage[0] || null;
}

async function pageEval(tabId, func, args = []) {
  const [{ result } = {}] = await chrome.scripting.executeScript({
    target: { tabId },
    world: "MAIN",
    func,
    args,
  });
  return result;
}

async function readDebugState(tabId) {
  return pageEval(tabId, () => {
    try {
      const stored = localStorage.getItem("saMapDebug") === "1";
      const watching = !!(window.__SA_MAP_DEBUG__ && window.__SA_MAP_DEBUG__.isOn && window.__SA_MAP_DEBUG__.isOn());
      const hasApi = !!window.__SA_MAP_DEBUG__;
      return { on: stored || watching, stored, watching, hasApi };
    } catch (e) {
      return { on: false, error: String(e?.message || e) };
    }
  });
}

async function setDebugState(tabId, on) {
  return pageEval(
    tabId,
    (enable) => {
      try {
        if (enable) {
          localStorage.setItem("saMapDebug", "1");
          if (window.__SA_MAP_DEBUG__?.on) window.__SA_MAP_DEBUG__.on();
          else if (window.__SA_MAP_DEBUG__?.watch) window.__SA_MAP_DEBUG__.watch(true, 250);
          return { ok: true, on: true, reloaded: false };
        }
        localStorage.removeItem("saMapDebug");
        if (window.__SA_MAP_DEBUG__?.off) window.__SA_MAP_DEBUG__.off();
        else if (window.__SA_MAP_DEBUG__?.watch) window.__SA_MAP_DEBUG__.watch(false);
        return { ok: true, on: false, reloaded: false };
      } catch (e) {
        return { ok: false, error: String(e?.message || e) };
      }
    },
    [on],
  );
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for restricted clipboard
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;left:-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

function setToggleUi(btn, statusEl, state, note) {
  const on = !!(state && state.on);
  if (btn) {
    btn.textContent = on ? "ON" : "OFF";
    btn.classList.toggle("on", on);
    btn.classList.toggle("off", !on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
  }
  if (statusEl) {
    if (note) statusEl.textContent = note;
    else if (!state) statusEl.textContent = "Open sage.staratlas.com, then toggle.";
    else if (state.error) statusEl.textContent = "Could not read page: " + state.error;
    else if (on) statusEl.textContent = "Debugger ON — watching star glows. Toggle OFF when done.";
    else statusEl.textContent = "Debugger OFF. Toggle ON while the map is open.";
  }
}

try {
  const { version } = chrome.runtime.getManifest();
  const verEl = document.getElementById("version");
  const notes = document.getElementById("release-notes");
  const all = document.getElementById("releases-list");
  if (verEl) verEl.textContent = `v${version}`;
  if (notes) {
    notes.href = tagUrl(version);
    notes.textContent = `v${version} release notes`;
  }
  if (all) all.href = REPO_RELEASES;
} catch (e) {
  const verEl = document.getElementById("version");
  if (verEl) verEl.textContent = "unknown";
  console.warn("[sa-ui-fixes] popup", e);
}

const toggleBtn = document.getElementById("debug-toggle");
const statusEl = document.getElementById("debug-status");
const copyOn = document.getElementById("copy-on");
const copyOff = document.getElementById("copy-off");

(async () => {
  const tab = await getSageTab();
  if (!tab?.id) {
    setToggleUi(toggleBtn, statusEl, null, "Open sage.staratlas.com first, then click the extension icon.");
    if (toggleBtn) toggleBtn.disabled = true;
    return;
  }
  try {
    const state = await readDebugState(tab.id);
    setToggleUi(toggleBtn, statusEl, state);
  } catch (e) {
    setToggleUi(toggleBtn, statusEl, null, "Refresh the SAGE tab, then try again.");
    console.warn("[sa-ui-fixes] read debug", e);
  }

  toggleBtn?.addEventListener("click", async () => {
    toggleBtn.disabled = true;
    try {
      const cur = await readDebugState(tab.id);
      const next = !cur?.on;
      const res = await setDebugState(tab.id, next);
      if (!res?.ok) {
        setToggleUi(toggleBtn, statusEl, cur, res?.error || "Toggle failed — hard refresh SAGE and retry.");
      } else {
        const state = await readDebugState(tab.id);
        setToggleUi(
          toggleBtn,
          statusEl,
          state,
          next
            ? "ON — dimming wash glows every 250ms. Turn OFF when finished."
            : "OFF — debugger disabled.",
        );
      }
    } catch (e) {
      setToggleUi(toggleBtn, statusEl, null, "Toggle failed — is the SAGE tab loaded?");
      console.warn("[sa-ui-fixes] toggle", e);
    } finally {
      toggleBtn.disabled = false;
    }
  });
})();

copyOn?.addEventListener("click", async () => {
  const ok = await copyText(SNIPPET_ON);
  if (statusEl) statusEl.textContent = ok ? "Copied ON one-liner — paste in console (F12) on SAGE." : "Copy failed — select manually.";
});

copyOff?.addEventListener("click", async () => {
  const ok = await copyText(SNIPPET_OFF);
  if (statusEl) statusEl.textContent = ok ? "Copied OFF one-liner — paste in console (F12) on SAGE." : "Copy failed — select manually.";
});
