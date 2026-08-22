/** Combat resolve + map floats + target HP/SP. MAIN. LEEKS / Produce Bandit ltd
 *
 * Hit/miss is NOT known before the chain. We show RESOLVING on send, then poll
 * the live fleet store (__SA_PEEK_FLEETS__) for HP/SP. HIT = drop, MISS = timeout,
 * FLEE = target started warp/subwarp. Official "HP CRIT" means low HP, not a crit hit.
 */
(function () {
  if (localStorage.getItem("saEnabled") !== "1") return;
  const FLEET_STEPS = [0, 120, 280, 500, 800, 1300, 2e3, 3200, 5e3, 8e3, 12e3];
  const SB_STEPS = [0, 200, 500, 1e3, 2e3, 3500, 6e3, 10e3, 16e3, 24e3];

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function peekAll() {
    try {
      const fn = window.__SA_PEEK_FLEETS__;
      const all = typeof fn === "function" ? fn() : [];
      return Array.isArray(all) ? all : [];
    } catch {
      return [];
    }
  }

  function peekOne(key) {
    if (!key) return null;
    const want = String(key);
    const all = peekAll();
    for (let i = 0; i < all.length; i++) {
      const f = all[i];
      if (!f) continue;
      if (String(f.address || f.key || "") === want) return f;
    }
    return null;
  }

  function num(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : NaN;
  }

  function fleetHp(f) {
    return num(f && f.data ? f.data.hp : f && f.hp);
  }

  function fleetSp(f) {
    return num(f && f.data ? f.data.sp : f && f.sp);
  }

  function fleetMaxHp(f) {
    const d = f && f.data;
    const s = (d && d.stats && d.stats.combatStats) || (d && d.combatStats) || {};
    return num(s.hp) || num(s.maxHp) || num(d && d.maxHp) || NaN;
  }

  function fleetMaxSp(f) {
    const d = f && f.data;
    const s = (d && d.stats && d.stats.combatStats) || (d && d.combatStats) || {};
    return num(s.sp) || num(s.maxSp) || num(d && d.maxSp) || NaN;
  }

  function fleetState(f) {
    const st = f && f.data && f.data.state;
    return (st && (st.__kind || st.kind)) || "";
  }

  function floatsOn() {
    try {
      return localStorage.getItem("saCombatFloats") !== "0";
    } catch {
      return true;
    }
  }

  function attackerName(ev) {
    if (ev && ev.attacker) return String(ev.attacker);
    try {
      return String((window.__SA_SELECTED_FLEET__ && window.__SA_SELECTED_FLEET__.label) || "");
    } catch {
      return "";
    }
  }

  function log(e) {
    try {
      if (typeof window.__SA_LOG_COMBAT_EVENT === "function") window.__SA_LOG_COMBAT_EVENT(e);
    } catch {
      /* ignore */
    }
  }

  function toClient(wx, wy) {
    if (!Number.isFinite(wx) || !Number.isFinite(wy)) return null;
    try {
      const canvas = document.querySelector("canvas");
      const rect = canvas && canvas.getBoundingClientRect();
      if (!rect || rect.width < 2) return null;
      let sx = wx;
      let sy = wy;
      const vp = window.__SA_MAP_VIEWPORT__;
      if (vp && typeof vp.toScreen === "function") {
        const p = vp.toScreen(wx, wy);
        if (p && Number.isFinite(p.x) && Number.isFinite(p.y)) {
          sx = p.x;
          sy = p.y;
        }
      } else {
        const math = window.__SA_MAP_MATH__;
        if (math && typeof math.gamePointToPixelPoint === "function") {
          const p = math.gamePointToPixelPoint({ x: wx, y: wy });
          if (p && Number.isFinite(p.x) && Number.isFinite(p.y)) {
            sx = p.x;
            sy = p.y;
          }
        }
      }
      const app = window.__SA_PIXI_APP__;
      let scaleX = 1;
      let scaleY = 1;
      if (app && app.screen && app.screen.width > 0) {
        scaleX = rect.width / app.screen.width;
        scaleY = rect.height / app.screen.height;
      }
      const left = rect.left + sx * scaleX;
      const top = rect.top + sy * scaleY;
      if (!Number.isFinite(left) || !Number.isFinite(top)) return null;
      return { x: left, y: top };
    } catch {
      return null;
    }
  }

  function ensureAnim() {
    if (document.getElementById("sa-c-style")) return;
    const s = document.createElement("style");
    s.id = "sa-c-style";
    s.textContent = [
      "@keyframes saFloatUp{0%{opacity:0;transform:translate(-50%,0) scale(.6)}",
      "18%{opacity:1;transform:translate(-50%,-18px) scale(1.2)}",
      "70%{opacity:1;transform:translate(-50%,-42px) scale(1)}",
      "100%{opacity:0;transform:translate(-50%,-64px) scale(.85)}}",
      "#sa-target-hud{position:fixed;left:50%;top:72px;transform:translateX(-50%);z-index:2147483645;",
      "min-width:180px;min-height:52px;width:240px;padding:6px 8px 8px;pointer-events:auto;box-sizing:border-box;",
      "background:linear-gradient(180deg,rgb(18 16 10 / 92%),rgb(8 10 14 / 94%));",
      "border:1px solid color-mix(in srgb,rgb(255 190 77) 45%,transparent);",
      "box-shadow:0 10px 28px rgb(0 0 0 / 45%);font-family:var(--font-family-display,Orbitron,sans-serif);",
      "color:#f4ecd0}",
      "#sa-target-hud.placed{transform:none}",
      "#sa-target-hud[hidden]{display:none!important}",
      "#sa-target-hud .sa-th-hd{cursor:grab;user-select:none;font:800 8px Orbitron,sans-serif;",
      "letter-spacing:.14em;color:#ffbe4d;opacity:.7;margin:0 0 4px}",
      "#sa-target-hud .sa-th-name{font:800 10px Orbitron,sans-serif;letter-spacing:.12em;",
      "text-transform:uppercase;margin:0 0 6px;color:#ffbe4d}",
      "#sa-target-hud .sa-th-row{display:flex;align-items:center;gap:6px;margin-top:3px}",
      "#sa-target-hud .sa-th-k{width:18px;font:800 8px Orbitron,sans-serif;letter-spacing:.06em;opacity:.7}",
      "#sa-target-hud .sa-th-bar{flex:1;height:7px;background:rgb(255 255 255 / 8%);overflow:hidden}",
      "#sa-target-hud .sa-th-bar>i{display:block;height:100%;width:0%;background:#e43f26}",
      "#sa-target-hud .sa-th-bar.sp>i{background:#32feff}",
      "#sa-target-hud .sa-th-n{min-width:4.5rem;text-align:right;font:700 9px Orbitron,sans-serif}",
      "#sa-target-hud.crit .sa-th-name{color:#ff4960}",
      "#sa-target-hud .sa-th-rs{position:absolute;right:0;bottom:0;width:12px;height:12px;cursor:nwse-resize;",
      "background:linear-gradient(135deg,transparent 50%,#ffbe4d 50%)}",
    ].join("");
    (document.head || document.documentElement).appendChild(s);
  }

  function spawnFloat(pt, txt, col, scale) {
    if (!pt || !txt) return;
    ensureAnim();
    const pop = document.createElement("div");
    pop.textContent = txt;
    pop.style.cssText =
      "position:fixed;left:" +
      pt.x +
      "px;top:" +
      (pt.y - 24) +
      "px;transform:translate(-50%,-50%) scale(" +
      (scale || 1) +
      ");font:900 " +
      (scale > 1 ? 22 : 18) +
      "px Orbitron,monospace;letter-spacing:.06em;color:" +
      col +
      ";text-shadow:0 0 8px #000,2px 2px 0 #000;pointer-events:none;z-index:999999;" +
      "animation:saFloatUp 1.35s cubic-bezier(.2,.8,.2,1) forwards";
    document.body.appendChild(pop);
    setTimeout(() => {
      try {
        pop.remove();
      } catch {
        /* ignore */
      }
    }, 1400);
  }

  function floats(o, tgtTxt, srcTxt, col) {
    if (!floatsOn()) return;
    const tgt = toClient(o.x, o.y);
    const src = toClient(o.sx, o.sy);
    if (tgt || src) {
      spawnFloat(tgt, tgtTxt, col, 1.15);
      spawnFloat(src, srcTxt, col === "#f87171" ? "#67e8f9" : col, 0.95);
    } else {
      const vw = window.innerWidth || 800;
      const vh = window.innerHeight || 600;
      spawnFloat({ x: vw / 2, y: vh * 0.32 }, tgtTxt, col, 1);
    }
  }

  let lastTarget = null;
  const HUD_POS_KEY = "saTargetHudPos.v1";

  function loadHudGeom() {
    try {
      const p = JSON.parse(localStorage.getItem(HUD_POS_KEY) || "null");
      if (!p || typeof p !== "object") return null;
      return p;
    } catch {
      return null;
    }
  }

  function saveHudGeom(el) {
    if (!el) return;
    const r = el.getBoundingClientRect();
    try {
      localStorage.setItem(
        HUD_POS_KEY,
        JSON.stringify({ x: r.left, y: r.top, w: r.width, h: r.height }),
      );
    } catch {
      /* ignore */
    }
  }

  function applyHudGeom(el) {
    const p = loadHudGeom();
    if (!p || !el) return;
    if (Number.isFinite(p.x) && Number.isFinite(p.y)) {
      el.classList.add("placed");
      el.style.left = Math.max(0, p.x) + "px";
      el.style.top = Math.max(0, p.y) + "px";
      el.style.right = "auto";
      el.style.transform = "none";
    }
    if (Number.isFinite(p.w) && p.w >= 160) el.style.width = p.w + "px";
    if (Number.isFinite(p.h) && p.h >= 48) el.style.height = p.h + "px";
  }

  function bindHudChrome(el) {
    if (!el || el.__saHudBound) return;
    el.__saHudBound = true;
    el.style.position = "fixed";
    applyHudGeom(el);
    let mode = "";
    let sx = 0;
    let sy = 0;
    let sl = 0;
    let st = 0;
    let sw = 0;
    let sh = 0;
    const onMove = (e) => {
      if (mode === "drag") {
        el.classList.add("placed");
        el.style.left = Math.max(0, sl + (e.clientX - sx)) + "px";
        el.style.top = Math.max(0, st + (e.clientY - sy)) + "px";
        el.style.transform = "none";
      } else if (mode === "resize") {
        el.style.width = Math.max(160, sw + (e.clientX - sx)) + "px";
        el.style.height = Math.max(48, sh + (e.clientY - sy)) + "px";
      }
    };
    const onUp = () => {
      mode = "";
      window.removeEventListener("pointermove", onMove, true);
      window.removeEventListener("pointerup", onUp, true);
      saveHudGeom(el);
    };
    el.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      const rs = e.target && e.target.closest && e.target.closest(".sa-th-rs");
      const hd = e.target && e.target.closest && e.target.closest(".sa-th-hd, .sa-th-name");
      if (!rs && !hd) return;
      e.preventDefault();
      const r = el.getBoundingClientRect();
      sx = e.clientX;
      sy = e.clientY;
      sl = r.left;
      st = r.top;
      sw = r.width;
      sh = r.height;
      mode = rs ? "resize" : "drag";
      window.addEventListener("pointermove", onMove, true);
      window.addEventListener("pointerup", onUp, true);
    });
  }

  function setTarget(o) {
    if (!floatsOn()) return;
    if (!o) return;
    lastTarget = {
      key: o.fleetKey ? String(o.fleetKey) : "",
      label: o.target || o.fleetLabel || "Target",
      kind: o.kind || "FLEET",
      t: Date.now(),
    };
    paintHud();
  }

  function paintHud() {
    if (!floatsOn()) {
      const old = document.getElementById("sa-target-hud");
      if (old) old.setAttribute("hidden", "");
      return;
    }
    ensureAnim();
    let el = document.getElementById("sa-target-hud");
    if (!el) {
      el = document.createElement("div");
      el.id = "sa-target-hud";
      el.setAttribute("hidden", "");
      el.innerHTML =
        '<div class="sa-th-hd">⋮⋮ TARGET</div><div class="sa-th-body"></div><div class="sa-th-rs" title="Resize"></div>';
      (document.body || document.documentElement).appendChild(el);
      bindHudChrome(el);
    } else {
      bindHudChrome(el);
    }
    const body = el.querySelector(".sa-th-body") || el;
    const t = lastTarget;
    if (!t || Date.now() - t.t > 180000) {
      el.setAttribute("hidden", "");
      return;
    }
    const f = t.key ? peekOne(t.key) : null;
    const hp = f ? fleetHp(f) : NaN;
    const sp = f ? fleetSp(f) : NaN;
    const mhp = f ? fleetMaxHp(f) : NaN;
    const msp = f ? fleetMaxSp(f) : NaN;
    if (!Number.isFinite(hp) && !Number.isFinite(sp)) {
      body.innerHTML =
        '<div class="sa-th-name">' +
        String(t.label || "TARGET") +
        "</div>" +
        '<div class="sa-th-n" style="opacity:.55">Waiting for scan…</div>';
      el.removeAttribute("hidden");
      return;
    }
    const hpMax = Number.isFinite(mhp) && mhp > 0 ? mhp : Number.isFinite(hp) ? Math.max(hp, 1) : 1;
    const spMax = Number.isFinite(msp) && msp > 0 ? msp : Number.isFinite(sp) ? Math.max(sp, 1) : 1;
    const hpPct = Number.isFinite(hp) ? Math.max(0, Math.min(100, (hp / hpMax) * 100)) : 0;
    const spPct = Number.isFinite(sp) ? Math.max(0, Math.min(100, (sp / spMax) * 100)) : 0;
    const crit = Number.isFinite(hp) && hpMax > 0 && hp / hpMax <= 0.25;
    el.classList.toggle("crit", crit);
    body.innerHTML =
      '<div class="sa-th-name">' +
      (crit ? "LOW HP · " : "") +
      String(t.label || "TARGET") +
      "</div>" +
      '<div class="sa-th-row"><span class="sa-th-k">HP</span><span class="sa-th-bar"><i style="width:' +
      hpPct.toFixed(1) +
      '%"></i></span><span class="sa-th-n">' +
      (Number.isFinite(hp) ? Math.round(hp).toLocaleString() : "—") +
      "</span></div>" +
      '<div class="sa-th-row"><span class="sa-th-k">SP</span><span class="sa-th-bar sp"><i style="width:' +
      spPct.toFixed(1) +
      '%"></i></span><span class="sa-th-n">' +
      (Number.isFinite(sp) ? Math.round(sp).toLocaleString() : "—") +
      "</span></div>";
    el.removeAttribute("hidden");
  }

  let seq = 0;

  async function resolve(o) {
    if (!o) return;
    const id = o.id || "r" + Date.now().toString(36) + "-" + ++seq;
    const base = {
      id,
      kind: o.kind || "FLEET",
      target: o.target || o.fleetLabel || "Target",
      attacker: o.attacker || attackerName(o),
      tx: o.tx || "",
      fleetKey: o.fleetKey,
      x: o.x,
      y: o.y,
      sx: o.sx,
      sy: o.sy,
    };
    setTarget(base);
    let preHp = num(o.preHp);
    let preSp = num(o.preSp);
    if (!Number.isFinite(preHp) && o.fleetKey) preHp = fleetHp(peekOne(o.fleetKey));
    if (!Number.isFinite(preSp) && o.fleetKey) preSp = fleetSp(peekOne(o.fleetKey));
    log({ type: "PENDING", ...base, damage: 0 });
    floats(base, "RESOLVING", "FIRE", "#ffbe4d");

    const steps = base.kind === "STARBASE" ? SB_STEPS : FLEET_STEPS;
    let peakHp = Number.isFinite(preHp) ? preHp : NaN;
    let troughHp = peakHp;
    let peakSp = Number.isFinite(preSp) ? preSp : NaN;
    let troughSp = peakSp;
    let flee = false;
    let prev = 0;

    for (let i = 0; i < steps.length; i++) {
      const t = steps[i];
      if (t) await sleep(t - prev);
      prev = t;
      try {
        if (typeof o.refetch === "function") await o.refetch();
      } catch {
        /* ignore */
      }
      const live = o.fleetKey ? peekOne(o.fleetKey) : null;
      const hp = typeof o.readHp === "function" ? num(o.readHp()) : fleetHp(live);
      const sp = typeof o.readSp === "function" ? num(o.readSp()) : fleetSp(live);
      const st = typeof o.readState === "function" ? o.readState() : fleetState(live);
      if (Number.isFinite(hp)) {
        if (!Number.isFinite(peakHp) || hp > peakHp) peakHp = hp;
        if (!Number.isFinite(troughHp) || hp < troughHp) troughHp = hp;
      }
      if (Number.isFinite(sp)) {
        if (!Number.isFinite(peakSp) || sp > peakSp) peakSp = sp;
        if (!Number.isFinite(troughSp) || sp < troughSp) troughSp = sp;
      }
      if (st === "MoveWarp" || st === "MoveSubwarp") {
        flee = true;
        break;
      }
      const dHp = Number.isFinite(peakHp) && Number.isFinite(troughHp) ? Math.max(0, peakHp - troughHp) : 0;
      const dSp = Number.isFinite(peakSp) && Number.isFinite(troughSp) ? Math.max(0, peakSp - troughSp) : 0;
      if (dHp > 0 || dSp > 0) break;
      paintHud();
    }

    const dHp = Number.isFinite(peakHp) && Number.isFinite(troughHp) ? Math.max(0, peakHp - troughHp) : 0;
    const dSp = Number.isFinite(peakSp) && Number.isFinite(troughSp) ? Math.max(0, peakSp - troughSp) : 0;
    let type = "MISS";
    let dmg = 0;
    let kind = "HP";
    if (flee) type = "FLEE";
    else if (dHp > 0) {
      type = "HIT";
      dmg = dHp;
      kind = "HP";
    } else if (dSp > 0) {
      type = "HIT";
      dmg = dSp;
      kind = "SP";
    }
    log({ type, ...base, damage: dmg, damageKind: kind });
    const col = type === "HIT" ? "#f87171" : type === "FLEE" ? "#fbbf24" : "#9ca3af";
    const tgtTxt =
      type === "HIT"
        ? "-" + dmg.toLocaleString() + " " + kind
        : type === "FLEE"
          ? "FLED"
          : "MISS";
    const srcTxt = type === "HIT" ? "HIT!" : type === "FLEE" ? "FLED" : "MISS";
    floats(base, tgtTxt, srcTxt, col);
    paintHud();
  }

  window.__SA_RESOLVE_COMBAT__ = resolve;
  window.__SA_COMBAT_TARGET__ = {
    set: setTarget,
    get: () => lastTarget,
    paint: paintHud,
  };
  window.__SA_COMBAT_FX__ = {
    isEnabled: floatsOn,
    setEnabled: (on) => {
      try {
        if (on) localStorage.removeItem("saCombatFloats");
        else localStorage.setItem("saCombatFloats", "0");
      } catch {
        /* ignore */
      }
      paintHud();
      return floatsOn();
    },
  };

  const prev = window.__SA_ON_ATTACK__;
  window.__SA_ON_ATTACK__ = function (ev) {
    try {
      if (ev && ev.kind === "FLEET" && ev.fleetKey && !ev._resolved) {
        ev._resolved = true;
        resolve({
          kind: "FLEET",
          target: ev.fleetLabel || ev.target,
          attacker: attackerName(ev),
          tx: ev.tx || "",
          fleetKey: ev.fleetKey,
          x: ev.x,
          y: ev.y,
          sx: ev.sx,
          sy: ev.sy,
          preHp: ev.preHp,
          preSp: ev.preSp,
        });
      } else if (ev && ev.kind === "STARBASE" && !ev._resolved) {
        ev._resolved = true;
        const sk = ev.systemKey || ev.systemName;
        resolve({
          kind: "STARBASE",
          target: ev.systemName || ev.target,
          attacker: attackerName(ev),
          tx: ev.tx || "",
          fleetKey: sk,
          x: ev.x,
          y: ev.y,
          sx: ev.sx,
          sy: ev.sy,
          readHp: () => {
            try {
              const fn = window.__SA_NEARBY_STARBASES__;
              const all = typeof fn === "function" ? fn() : fn;
              const want = String(sk || "");
              if (!Array.isArray(all) || !want) return NaN;
              for (let i = 0; i < all.length; i++) {
                const s = all[i];
                if (!s) continue;
                if (
                  String(s.systemKey || s.key || s.address || "") === want ||
                  String(s.systemName || s.name || "") === want
                ) {
                  return num(s.hp ?? (s.data && s.data.hp) ?? s.starbaseHp);
                }
              }
            } catch {
              /* ignore */
            }
            return NaN;
          },
          readSp: () => NaN,
          readState: () => "",
        });
      }
    } catch {
      /* ignore */
    }
    if (typeof prev === "function") return prev(ev);
  };

  setInterval(() => {
    if (document.visibilityState !== "visible") return;
    try {
      paintHud();
    } catch {
      /* ignore */
    }
  }, 700);
})();
