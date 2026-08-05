/** Popup: version + map-debug + warp-trails toggles. LEEKS / Produce Bandit ltd */
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

/** Warp trails: ON = stock trails, OFF = disabled for FPS (issue #1). */
async function readTrailsState(tabId) {
  return pageEval(tabId, () => {
    try {
      const noTrails = localStorage.getItem("saNoWarpTrails") === "1";
      const flag = !!window.__SA_NO_WARP_TRAILS__;
      const api = window.__SA_WARP_TRAILS__;
      const enabled = api && typeof api.isEnabled === "function" ? api.isEnabled() : !noTrails && !flag;
      return { on: enabled, noTrails, hasApi: !!api };
    } catch (e) {
      return { on: true, error: String(e?.message || e) };
    }
  });
}

async function setTrailsState(tabId, enabled) {
  return pageEval(
    tabId,
    (on) => {
      try {
        if (window.__SA_WARP_TRAILS__?.setEnabled) {
          window.__SA_WARP_TRAILS__.setEnabled(!!on);
          return { ok: true, on: !!window.__SA_WARP_TRAILS__.isEnabled?.() };
        }
        // Fallback before patched bundle boots
        if (on) {
          localStorage.removeItem("saNoWarpTrails");
          try {
            window.__SA_NO_WARP_TRAILS__ = false;
          } catch (_) {}
        } else {
          localStorage.setItem("saNoWarpTrails", "1");
          try {
            window.__SA_NO_WARP_TRAILS__ = true;
          } catch (_) {}
        }
        return { ok: true, on: !!on, needsReload: true };
      } catch (e) {
        return { ok: false, error: String(e?.message || e) };
      }
    },
    [enabled],
  );
}

/** Zoom counter HUD: ON = live scale/center overlay for map troubleshooting. */
async function readZoomState(tabId) {
  return pageEval(tabId, () => {
    try {
      const stored = localStorage.getItem("saZoomHud") === "1";
      const api = window.__SA_ZOOM_HUD__;
      const on = api && typeof api.isOn === "function" ? api.isOn() : stored;
      const snap = api && typeof api.read === "function" ? api.read() : null;
      return {
        on,
        stored,
        hasApi: !!api,
        scale: snap && Number.isFinite(snap.scale) ? snap.scale : null,
      };
    } catch (e) {
      return { on: false, error: String(e?.message || e) };
    }
  });
}

async function setZoomState(tabId, enabled) {
  return pageEval(
    tabId,
    (on) => {
      try {
        if (window.__SA_ZOOM_HUD__?.setEnabled) {
          window.__SA_ZOOM_HUD__.setEnabled(!!on);
          const snap = window.__SA_ZOOM_HUD__.read?.();
          return {
            ok: true,
            on: !!window.__SA_ZOOM_HUD__.isOn?.(),
            scale: snap && Number.isFinite(snap.scale) ? snap.scale : null,
          };
        }
        if (on) localStorage.setItem("saZoomHud", "1");
        else localStorage.removeItem("saZoomHud");
        return { ok: true, on: !!on, needsReload: true };
      } catch (e) {
        return { ok: false, error: String(e?.message || e) };
      }
    },
    [enabled],
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

function setTrailsUi(btn, statusEl, state, note) {
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
    else if (on) statusEl.textContent = "Trails ON — warp/subwarp particle FX active.";
    else statusEl.textContent = "Trails OFF — createWarpTrail skipped (better FPS).";
  }
}

function setZoomUi(btn, statusEl, state, note) {
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
    else if (on) {
      const sc = state.scale != null && Number.isFinite(Number(state.scale)) ? ` · now ×${Number(state.scale).toFixed(2)}` : "";
      statusEl.textContent = `Zoom HUD ON — top-right counter${sc}.`;
    } else statusEl.textContent = "Zoom HUD OFF.";
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
const trailsBtn = document.getElementById("trails-toggle");
const trailsStatus = document.getElementById("trails-status");
const zoomBtn = document.getElementById("zoom-toggle");
const zoomStatus = document.getElementById("zoom-status");

(async () => {
  const tab = await getSageTab();
  if (!tab?.id) {
    setToggleUi(toggleBtn, statusEl, null, "Open sage.staratlas.com first, then click the extension icon.");
    setTrailsUi(trailsBtn, trailsStatus, null, "Open sage.staratlas.com first, then click the extension icon.");
    setZoomUi(zoomBtn, zoomStatus, null, "Open sage.staratlas.com first, then click the extension icon.");
    if (toggleBtn) toggleBtn.disabled = true;
    if (trailsBtn) trailsBtn.disabled = true;
    if (zoomBtn) zoomBtn.disabled = true;
    return;
  }
  try {
    const state = await readDebugState(tab.id);
    setToggleUi(toggleBtn, statusEl, state);
  } catch (e) {
    setToggleUi(toggleBtn, statusEl, null, "Refresh the SAGE tab, then try again.");
    console.warn("[sa-ui-fixes] read debug", e);
  }
  try {
    const trails = await readTrailsState(tab.id);
    setTrailsUi(trailsBtn, trailsStatus, trails);
  } catch (e) {
    setTrailsUi(trailsBtn, trailsStatus, null, "Refresh the SAGE tab, then try again.");
    console.warn("[sa-ui-fixes] read trails", e);
  }
  try {
    const zoom = await readZoomState(tab.id);
    setZoomUi(zoomBtn, zoomStatus, zoom);
  } catch (e) {
    setZoomUi(zoomBtn, zoomStatus, null, "Refresh the SAGE tab, then try again.");
    console.warn("[sa-ui-fixes] read zoom", e);
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

  trailsBtn?.addEventListener("click", async () => {
    trailsBtn.disabled = true;
    try {
      const cur = await readTrailsState(tab.id);
      const next = !cur?.on;
      const res = await setTrailsState(tab.id, next);
      if (!res?.ok) {
        setTrailsUi(trailsBtn, trailsStatus, cur, res?.error || "Toggle failed — hard refresh SAGE and retry.");
      } else {
        const state = await readTrailsState(tab.id);
        setTrailsUi(
          trailsBtn,
          trailsStatus,
          state,
          next
            ? "Trails ON — new warps will show particle trails."
            : res.needsReload
              ? "Trails OFF saved — hard-refresh SAGE once so the patch applies."
              : "Trails OFF — existing trails cleared; new warps skip FX.",
        );
      }
    } catch (e) {
      setTrailsUi(trailsBtn, trailsStatus, null, "Toggle failed — is the SAGE tab loaded?");
      console.warn("[sa-ui-fixes] trails toggle", e);
    } finally {
      trailsBtn.disabled = false;
    }
  });

  zoomBtn?.addEventListener("click", async () => {
    zoomBtn.disabled = true;
    try {
      const cur = await readZoomState(tab.id);
      const next = !cur?.on;
      const res = await setZoomState(tab.id, next);
      if (!res?.ok) {
        setZoomUi(zoomBtn, zoomStatus, cur, res?.error || "Toggle failed — hard refresh SAGE and retry.");
      } else {
        const state = await readZoomState(tab.id);
        setZoomUi(
          zoomBtn,
          zoomStatus,
          state,
          next
            ? res.needsReload
              ? "Zoom HUD saved — hard-refresh SAGE once so it appears."
              : `Zoom HUD ON — top-right${res.scale != null ? ` · ×${Number(res.scale).toFixed(2)}` : ""}.`
            : "Zoom HUD OFF.",
        );
      }
    } catch (e) {
      setZoomUi(zoomBtn, zoomStatus, null, "Toggle failed — is the SAGE tab loaded?");
      console.warn("[sa-ui-fixes] zoom toggle", e);
    } finally {
      zoomBtn.disabled = false;
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
