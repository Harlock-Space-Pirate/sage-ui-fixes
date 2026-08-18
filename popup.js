/** Popup: version + warp-trails + map-debug flag. LEEKS / Produce Bandit ltd */
const REPO_RELEASES = "https://github.com/Harlock-Space-Pirate/sage-ui-fixes/releases";
const SAGE_MATCH = "https://sage.staratlas.com/*";
const SNIPPET_ON = 'localStorage.setItem("saMapDebug","1");location.reload();// SAGE map debugger ON';
const SNIPPET_OFF = 'localStorage.removeItem("saMapDebug");location.reload();// SAGE map debugger OFF';

function tagUrl(version) {
  const v = String(version || "").replace(/^v/i, "");
  return `${REPO_RELEASES}/tag/v${v}`;
}

async function getSageTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];
  if (tab?.id != null && tab.url && /https:\/\/sage\.staratlas\.com\//i.test(tab.url)) return tab;
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

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
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

function setToggle(btn, statusEl, on, note) {
  if (btn) {
    btn.textContent = on ? "ON" : "OFF";
    btn.classList.toggle("on", on);
    btn.classList.toggle("off", !on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
  }
  if (statusEl && note) statusEl.textContent = note;
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

const trailsBtn = document.getElementById("trails-toggle");
const trailsStatus = document.getElementById("trails-status");
const debugBtn = document.getElementById("debug-toggle");
const debugStatus = document.getElementById("debug-status");
const barBtn = document.getElementById("bar-toggle");
const barStatus = document.getElementById("bar-status");
const barReset = document.getElementById("bar-reset");
const logBtn = document.getElementById("log-toggle");
const logStatus = document.getElementById("log-status");

(async () => {
  const tab = await getSageTab();
  if (!tab?.id) {
    setToggle(trailsBtn, trailsStatus, true, "Open sage.staratlas.com first.");
    setToggle(debugBtn, debugStatus, false, "Open sage.staratlas.com first.");
    setToggle(barBtn, barStatus, true, "Open sage.staratlas.com first.");
    setToggle(logBtn, logStatus, true, "Open sage.staratlas.com first.");
    if (trailsBtn) trailsBtn.disabled = true;
    if (debugBtn) debugBtn.disabled = true;
    if (barBtn) barBtn.disabled = true;
    if (logBtn) logBtn.disabled = true;
    return;
  }

  try {
    const log = await pageEval(tab.id, () => {
      const api = window.__SA_LOG_COMBAT_EVENT;
      const hidden = localStorage.getItem("saHideCombatLog") === "1";
      const on = api && typeof api.isVisible === "function" ? !!api.isVisible() : !hidden;
      return { on };
    });
    setToggle(logBtn, logStatus, !!log?.on, log?.on ? "Log ON." : "Log OFF.");
  } catch (e) {
    setToggle(logBtn, logStatus, true, "Refresh the SAGE tab, then try again.");
  }

  try {
    const bar = await pageEval(tab.id, () => {
      const api = window.__SA_ACTION_BAR__;
      const hidden = localStorage.getItem("saHideActionBar") === "1";
      const on = api && typeof api.isVisible === "function" ? !!api.isVisible() : !hidden;
      return { on, hasApi: !!api };
    });
    setToggle(
      barBtn,
      barStatus,
      !!bar?.on,
      bar?.on ? "Fleet bar ON — one-row stock tiles." : "Fleet bar OFF — stock 3-row panel.",
    );
  } catch (e) {
    setToggle(barBtn, barStatus, true, "Refresh the SAGE tab, then try again.");
  }

  try {
    const trails = await pageEval(tab.id, () => {
      const api = window.__SA_WARP_TRAILS__;
      const no = localStorage.getItem("saNoWarpTrails") === "1";
      const on = api && typeof api.isEnabled === "function" ? api.isEnabled() : !no;
      return { on, hasApi: !!api };
    });
    setToggle(
      trailsBtn,
      trailsStatus,
      !!trails?.on,
      trails?.on ? "Trails ON — warp/subwarp particle FX." : "Trails OFF — better FPS.",
    );
  } catch (e) {
    setToggle(trailsBtn, trailsStatus, true, "Refresh the SAGE tab, then try again.");
  }

  try {
    const dbg = await pageEval(tab.id, () => ({
      on: localStorage.getItem("saMapDebug") === "1",
    }));
    setToggle(
      debugBtn,
      debugStatus,
      !!dbg?.on,
      dbg?.on ? "Debug flag ON." : "Debug flag OFF.",
    );
  } catch (e) {
    setToggle(debugBtn, debugStatus, false, "Refresh the SAGE tab, then try again.");
  }

  logBtn?.addEventListener("click", async () => {
    logBtn.disabled = true;
    try {
      const res = await pageEval(tab.id, () => {
        const api = window.__SA_LOG_COMBAT_EVENT;
        const cur = api && typeof api.isVisible === "function" ? api.isVisible() : localStorage.getItem("saHideCombatLog") !== "1";
        const next = !cur;
        if (api?.setVisible) api.setVisible(next);
        else if (next) localStorage.removeItem("saHideCombatLog");
        else localStorage.setItem("saHideCombatLog", "1");
        return { on: next };
      });
      setToggle(logBtn, logStatus, !!res?.on, res?.on ? "Log ON." : "Log OFF.");
    } finally {
      logBtn.disabled = false;
    }
  });

  barBtn?.addEventListener("click", async () => {
    barBtn.disabled = true;
    try {
      const res = await pageEval(tab.id, () => {
        const api = window.__SA_ACTION_BAR__;
        const cur = api && typeof api.isVisible === "function" ? api.isVisible() : localStorage.getItem("saHideActionBar") !== "1";
        const next = !cur;
        if (api?.setVisible) api.setVisible(next);
        else if (next) localStorage.removeItem("saHideActionBar");
        else localStorage.setItem("saHideActionBar", "1");
        return { on: next };
      });
      setToggle(
        barBtn,
        barStatus,
        !!res?.on,
        res?.on ? "Fleet bar ON — one-row stock tiles." : "Fleet bar OFF — stock 3-row panel.",
      );
    } finally {
      barBtn.disabled = false;
    }
  });

  barReset?.addEventListener("click", async () => {
    barReset.disabled = true;
    try {
      const res = await pageEval(tab.id, () => {
        try {
          if (window.__SA_BAR_RESET__) {
            window.__SA_BAR_RESET__();
            return { ok: true };
          }
          return { ok: false };
        } catch (e) {
          return { ok: false, error: String(e?.message || e) };
        }
      });
      if (barStatus) {
        barStatus.textContent = res?.ok
          ? "Fleet bar re-centered; saved positions cleared."
          : "Reset failed — is the SAGE tab loaded?";
      }
    } finally {
      barReset.disabled = false;
    }
  });

  trailsBtn?.addEventListener("click", async () => {
    trailsBtn.disabled = true;
    try {
      const res = await pageEval(tab.id, () => {
        const api = window.__SA_WARP_TRAILS__;
        const cur = api && typeof api.isEnabled === "function" ? api.isEnabled() : localStorage.getItem("saNoWarpTrails") !== "1";
        const next = !cur;
        if (api?.setEnabled) api.setEnabled(next);
        else if (next) localStorage.removeItem("saNoWarpTrails");
        else localStorage.setItem("saNoWarpTrails", "1");
        return { on: next };
      });
      setToggle(trailsBtn, trailsStatus, !!res?.on, res?.on ? "Trails ON." : "Trails OFF.");
    } finally {
      trailsBtn.disabled = false;
    }
  });

  debugBtn?.addEventListener("click", async () => {
    debugBtn.disabled = true;
    try {
      const res = await pageEval(tab.id, () => {
        const cur = localStorage.getItem("saMapDebug") === "1";
        if (cur) {
          localStorage.removeItem("saMapDebug");
          window.__SA_MAP_DEBUG__?.off?.();
          return { on: false };
        }
        localStorage.setItem("saMapDebug", "1");
        window.__SA_MAP_DEBUG__?.on?.();
        return { on: true };
      });
      setToggle(debugBtn, debugStatus, !!res?.on, res?.on ? "Debug flag ON." : "Debug flag OFF.");
    } finally {
      debugBtn.disabled = false;
    }
  });
})();

document.getElementById("copy-on")?.addEventListener("click", async () => {
  const ok = await copyText(SNIPPET_ON);
  if (debugStatus) debugStatus.textContent = ok ? "Copied ON one-liner." : "Copy failed.";
});
document.getElementById("probe-on")?.addEventListener("click", async () => {
  const tab = await getSageTab();
  if (!tab?.id) {
    if (debugStatus) debugStatus.textContent = "Open sage.staratlas.com first.";
    return;
  }
  await pageEval(tab.id, () => window.__SA_PROBE__?.on?.());
  if (debugStatus) debugStatus.textContent = "HUD probe ON — bottom-left overlay.";
});
document.getElementById("probe-off")?.addEventListener("click", async () => {
  const tab = await getSageTab();
  if (!tab?.id) return;
  await pageEval(tab.id, () => window.__SA_PROBE__?.off?.());
  if (debugStatus) debugStatus.textContent = "HUD probe OFF.";
});
document.getElementById("copy-off")?.addEventListener("click", async () => {
  const ok = await copyText(SNIPPET_OFF);
  if (debugStatus) debugStatus.textContent = ok ? "Copied OFF one-liner." : "Copy failed.";
});
