/** Fleet groups + enemy list. MAIN. LEEKS / Produce Bandit ltd
 *
 * Groups warp via official planner selectedFleetKeys (one dest, N fleets).
 * Fat planner panel is hidden; map click + one confirm.
 * Modifier+click (default Shift) adds the nearest unowned fleet to Targets.
 */
(function () {
  const GRP_KEY = "saFleetGroups.v1";
  const EN_KEY = "saEnemyList.v1";
  const OPT_KEY = "saFleetOps.v1";
  const HUD_KEY = "saTgtHud.v1";
  const G_N = 4;
  const GROUP_NAMES = ["G1", "G2", "G3", "G4"];

  const OPT_DEF = { addMod: "shift" };

  function loadJson(key, fb) {
    try {
      const p = JSON.parse(localStorage.getItem(key) || "null");
      return p && typeof p === "object" ? p : fb;
    } catch {
      return fb;
    }
  }
  function saveJson(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {
      /* ignore */
    }
  }

  function emptyGroups() {
    return {
      v: 1,
      active: -1,
      groups: GROUP_NAMES.map((name) => ({ name, keys: [], labels: {} })),
    };
  }

  function loadGroups() {
    const p = loadJson(GRP_KEY, null);
    if (!p || !Array.isArray(p.groups)) return emptyGroups();
    const groups = [];
    for (let i = 0; i < G_N; i++) {
      const g = p.groups[i] || {};
      const keys = Array.isArray(g.keys) ? g.keys.filter(Boolean).map(String) : [];
      groups.push({
        name: String(g.name || GROUP_NAMES[i]).slice(0, 8),
        keys,
        labels: g.labels && typeof g.labels === "object" ? g.labels : {},
      });
    }
    const active = Number(p.active);
    return { v: 1, active: active >= 0 && active < G_N ? active : -1, groups };
  }

  function loadEnemies() {
    const p = loadJson(EN_KEY, null);
    if (!p || !Array.isArray(p.keys)) return { keys: [], labels: {}, last: {} };
    return {
      keys: p.keys.filter(Boolean).map(String),
      labels: p.labels && typeof p.labels === "object" ? p.labels : {},
      last: p.last && typeof p.last === "object" ? p.last : {},
    };
  }

  function loadOpt() {
    const p = loadJson(OPT_KEY, null);
    const addMod = p && /^(shift|ctrl|alt)$/.test(p.addMod) ? p.addMod : OPT_DEF.addMod;
    return { addMod };
  }

  function loadHudPos() {
    const p = loadJson(HUD_KEY, null) || {};
    const s = p.scale != null ? Number(p.scale) : 1;
    return {
      dock: p.dock && Number.isFinite(p.dock.x) ? p.dock : null,
      scout: p.scout && Number.isFinite(p.scout.x) ? p.scout : null,
      scoutOn: true,
      scale: Number.isFinite(s) ? Math.min(1.6, Math.max(0.7, s)) : 1,
    };
  }

  let hudPos = loadHudPos();

  function saveHudPos() {
    saveJson(HUD_KEY, hudPos);
  }

  let groups = loadGroups();
  let enemies = loadEnemies();
  let opt = loadOpt();
  let move = null;
  let banner = null;
  let listEl = null;
  let scoutEl = null;

  function persist() {
    saveJson(GRP_KEY, groups);
    saveJson(EN_KEY, enemies);
    saveJson(OPT_KEY, opt);
  }

  function pruneDeadGroups() {
    const dead = new Set();
    try {
      peekAll().forEach((raw) => {
        const f = fleetRec(raw);
        if (f && f.state === "Destroyed") dead.add(f.key);
      });
    } catch {
      return;
    }
    if (!dead.size) return;
    let changed = false;
    groups.groups.forEach((g) => {
      const next = g.keys.filter((k) => !dead.has(k));
      if (next.length !== g.keys.length) {
        g.keys = next;
        changed = true;
      }
    });
    if (changed) persist();
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

  function profileKey() {
    try {
      return window.__SA_PLAYER_PROFILE__ ? String(window.__SA_PLAYER_PROFILE__) : "";
    } catch {
      return "";
    }
  }

  function fleetRec(raw) {
    if (!raw) return null;
    const d = raw.data || raw;
    const key = String(raw.address || raw.key || d.key || "");
    if (!key) return null;
    const label = String(d.fleetLabel || raw.fleetLabel || key).slice(0, 40);
    const owner = d.ownerProfile ? String(d.ownerProfile) : "";
    const st = d.state && (d.state.__kind || d.state.kind);
    return { key, label, owner, state: String(st || ""), raw };
  }

  function ownedList() {
    const me = profileKey();
    const out = [];
    const seen = {};
    peekAll().forEach((raw) => {
      const f = fleetRec(raw);
      if (!f || seen[f.key]) return;
      if (me && f.owner && f.owner !== me) return;
      if (me && !f.owner) return;
      seen[f.key] = 1;
      out.push(f);
    });
    return out;
  }

  function ownKeys() {
    const s = new Set();
    ownedList().forEach((f) => s.add(f.key));
    try {
      const slots = window.__SA_ACTION_BAR__ && window.__SA_ACTION_BAR__.slots;
      const ks = typeof slots === "function" ? slots() : null;
      if (Array.isArray(ks)) ks.forEach((k) => k && s.add(String(k)));
      const sel = window.__SA_SELECTED_FLEET__;
      if (sel && sel.key) s.add(String(sel.key));
    } catch {
      /* ignore */
    }
    return s;
  }

  function ownLabels() {
    const s = new Set();
    ownedList().forEach((f) => s.add(String(f.label || "").toLowerCase()));
    try {
      const sel = window.__SA_SELECTED_FLEET__;
      if (sel && sel.label) s.add(String(sel.label).toLowerCase());
    } catch {
      /* ignore */
    }
    return s;
  }

  function isOwned(key) {
    if (!key) return false;
    if (ownKeys().has(String(key))) return true;
    const raw = findRaw(key);
    const rec = fleetRec(raw);
    if (rec && ownLabels().has(String(rec.label || "").toLowerCase())) return true;
    return false;
  }

  function officialCardNodes() {
    return Array.prototype.slice.call(
      document.querySelectorAll('[class*="combatTargetCard"], [class*="_fleetCard_"], [class*="fleetCard"]'),
    );
  }

  function stealOfficialArt(label) {
    const want = String(label || "").toLowerCase();
    if (!want) return "";
    const nodes = officialCardNodes();
    for (let i = 0; i < nodes.length; i++) {
      const t = String(nodes[i].textContent || "").toLowerCase();
      if (t.indexOf(want) < 0) continue;
      const img = nodes[i].querySelector("img");
      if (img && img.src) return img.src;
    }
    return "";
  }

  function isOwnCardEl(el) {
    const t = String((el && el.textContent) || "").toLowerCase();
    const labs = ownLabels();
    for (const l of labs) {
      if (l && t.indexOf(l) >= 0) return true;
    }
    return false;
  }

  function findRaw(key) {
    const want = String(key);
    const all = peekAll();
    for (let i = 0; i < all.length; i++) {
      const f = fleetRec(all[i]);
      if (f && f.key === want) return all[i];
    }
    return null;
  }

  function parseCoord(v) {
    if (v == null) return NaN;
    let n = typeof v === "object" && v && typeof v.toNumber === "function" ? v.toNumber() : Number(v);
    if (!Number.isFinite(n)) return NaN;
    const scale = 2 ** 56;
    if (Math.abs(n) > 20000) n = n / scale;
    return n;
  }

  function fleetXY(raw) {
    const d = (raw && raw.data) || raw || {};
    const kind = d.state && (d.state.__kind || d.state.kind);
    if (kind === "MoveWarp" || kind === "MoveSubwarp") {
      const mid = journeyPos(d);
      if (mid) return mid;
    }
    const loc = d.location || d.coordinates;
    if (Array.isArray(loc) && loc.length >= 2) {
      const x = parseCoord(loc[0]);
      const y = parseCoord(loc[1]);
      if (Number.isFinite(x) && Number.isFinite(y)) return { x, y };
    }
    return null;
  }

  function num(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : NaN;
  }

  function parseTs(v) {
    if (v == null) return 0;
    if (typeof v === "number") return v;
    if (typeof v === "bigint") return Number(v);
    if (typeof v === "object") {
      const bits = v.fractionBits != null ? v.fractionBits : v.fractionalBits;
      if (v.raw != null && bits != null) return Number(v.raw) / Math.pow(2, Number(bits));
      if (typeof v.toNumber === "function") return v.toNumber();
    }
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  function journeyDest(d) {
    const kind = d && d.state && (d.state.__kind || d.state.kind);
    if (kind !== "MoveWarp" && kind !== "MoveSubwarp") return null;
    const f0 = d.state && d.state.fields && d.state.fields[0];
    if (!f0) return null;
    const j = f0.journey || f0;
    const toArr = j.to || f0.to;
    if (!toArr || toArr.length < 2) return null;
    const x = parseCoord(toArr[0]);
    const y = parseCoord(toArr[1]);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
    return { x, y, label: (kind === "MoveWarp" ? "warp dest" : "subwarp dest") + " " + x.toFixed(1) + "," + y.toFixed(1) };
  }

  function journeyPos(d) {
    const dest = journeyDest(d);
    const f0 = d.state && d.state.fields && d.state.fields[0];
    if (!f0) return dest;
    const j = f0.journey || f0;
    const fromArr = j.from && j.from.length >= 2 ? j.from : d.location;
    const from =
      fromArr && fromArr.length >= 2
        ? { x: parseCoord(fromArr[0]), y: parseCoord(fromArr[1]) }
        : null;
    if (!from || !dest || !Number.isFinite(from.x) || !Number.isFinite(from.y)) return dest;
    let start = parseTs(j.departureTime);
    let dur = parseTs(j.duration);
    let end = start && dur ? start + dur : 0;
    if (!start && d.state && d.state.__kind === "MoveWarp") {
      start = parseTs(f0.warpStart);
      end = parseTs(f0.warpFinish);
    }
    const now = Date.now() / 1000;
    if (!start || !end || end <= start || now >= end) return dest;
    const u = Math.max(0, Math.min(1, (now - start) / (end - start)));
    return { x: from.x + (dest.x - from.x) * u, y: from.y + (dest.y - from.y) * u };
  }

  function fleetVitals(raw) {
    const d = (raw && raw.data) || raw || {};
    const s = (d.stats && d.stats.combatStats) || d.combatStats || {};
    const hp = num(d.hp);
    const sp = num(d.sp);
    const mhp = num(s.hp) || num(s.maxHp) || num(d.maxHp) || (Number.isFinite(hp) ? Math.max(hp, 1) : NaN);
    const msp = num(s.sp) || num(s.maxSp) || num(d.maxSp) || (Number.isFinite(sp) ? Math.max(sp, 1) : NaN);
    return { hp, sp, mhp, msp };
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
      }
      const app = window.__SA_PIXI_APP__;
      if (app && app.screen && app.screen.width > 0) {
        sx = (sx / app.screen.width) * rect.width;
        sy = (sy / app.screen.height) * rect.height;
      }
      const left = rect.left + sx;
      const top = rect.top + sy;
      if (left < rect.left - 8 || top < rect.top - 8 || left > rect.right + 8 || top > rect.bottom + 8) {
        return null;
      }
      return { x: left, y: top };
    } catch {
      return null;
    }
  }

  function rememberEnemy(key, raw) {
    const rec = fleetRec(raw) || { key, label: enemies.labels[key] || key };
    const xy = fleetXY(raw);
    const dest = raw ? journeyDest(raw.data || raw) : null;
    const prev = enemies.last[key] || {};
    enemies.last[key] = {
      label: rec.label || prev.label,
      x: xy ? xy.x : prev.x,
      y: xy ? xy.y : prev.y,
      destX: dest ? dest.x : prev.destX,
      destY: dest ? dest.y : prev.destY,
      destLabel: dest ? dest.label : prev.destLabel,
      t: Date.now(),
    };
    if (rec.label) enemies.labels[key] = rec.label;
  }

  function mapZoomNow() {
    try {
      const vp = window.__SA_MAP_VIEWPORT__;
      if (!vp) return NaN;
      if (typeof vp.scaled === "number" && Number.isFinite(vp.scaled)) return vp.scaled;
      if (vp.scale && typeof vp.scale.x === "number") return vp.scale.x;
    } catch {
      /* ignore */
    }
    return NaN;
  }

  function viewGameBox() {
    try {
      const map = window.__SA_PIXI_MAP__;
      const vp = window.__SA_MAP_VIEWPORT__;
      if (!vp) return null;
      const L = Number(vp.left);
      const T = Number(vp.top);
      const R = Number(vp.right);
      const B = Number(vp.bottom);
      if (![L, T, R, B].every(Number.isFinite)) return null;
      const corners = [
        [L, T],
        [R, T],
        [R, B],
        [L, B],
      ];
      const pts = [];
      for (let i = 0; i < corners.length; i++) {
        let g = null;
        if (map && typeof map.pixelToGame === "function") g = map.pixelToGame(corners[i][0], corners[i][1]);
        if (!g) {
          const math = window.__SA_MAP_MATH__;
          if (math && typeof math.pixelPointToGamePoint === "function") {
            g = math.pixelPointToGamePoint({ x: corners[i][0], y: corners[i][1] }, 101, 80);
          }
        }
        if (g && Number.isFinite(g.x) && Number.isFinite(g.y)) pts.push(g);
      }
      if (pts.length < 2) return null;
      const xs = pts.map((p) => p.x);
      const ys = pts.map((p) => p.y);
      const box = {
        minX: Math.min.apply(null, xs),
        maxX: Math.max.apply(null, xs),
        minY: Math.min.apply(null, ys),
        maxY: Math.max.apply(null, ys),
      };
      try {
        window.__SA_VIEW_BOX__ = box;
      } catch {
        /* ignore */
      }
      return box;
    } catch {
      return null;
    }
  }

  function gameOnScreen(gx, gy) {
    if (!Number.isFinite(gx) || !Number.isFinite(gy)) return false;
    try {
      const map = window.__SA_PIXI_MAP__;
      const vp = window.__SA_MAP_VIEWPORT__;
      if (map && typeof map.gameToPixel === "function" && vp) {
        const p = map.gameToPixel(gx, gy);
        if (p && Number.isFinite(p.x) && Number.isFinite(p.y)) {
          return p.x >= vp.left && p.x <= vp.right && p.y >= vp.top && p.y <= vp.bottom;
        }
      }
    } catch {
      /* ignore */
    }
    return false;
  }

  function pinOnScreen(pin, key, map, vp) {
    if (!pin || pin.destroyed) return false;
    let x = Number(pin.x);
    let y = Number(pin.y);
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      try {
        const p = map && typeof map.getFleetWorldPosition === "function" ? map.getFleetWorldPosition(key) : null;
        if (p) {
          x = Number(p.x);
          y = Number(p.y);
        }
      } catch {
        /* ignore */
      }
    }
    if (vp && Number.isFinite(x) && Number.isFinite(y)) {
      return x >= vp.left && x <= vp.right && y >= vp.top && y <= vp.bottom;
    }
    return false;
  }

  function nearbyList() {
    try {
      const fn = window.__SA_NEARBY_FLEETS__;
      const all = typeof fn === "function" ? fn() : fn;
      return Array.isArray(all) ? all : [];
    } catch {
      return [];
    }
  }

  function nearbyStarbases() {
    try {
      const fn = window.__SA_NEARBY_STARBASES__;
      const all = typeof fn === "function" ? fn() : fn;
      return Array.isArray(all) ? all : [];
    } catch {
      return [];
    }
  }

  function resolveCardTarget(card) {
    const nameEl = card.querySelector('[class*="combatTargetName"], [class*="TargetName"]');
    const name = String((nameEl && nameEl.textContent) || card.textContent || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 48);
    const low = name.toLowerCase();
    const fleets = nearbyList();
    for (let i = 0; i < fleets.length; i++) {
      const n = fleets[i];
      const lab = String((n && (n.fleetLabel || n.label || n.name)) || "").toLowerCase();
      if (lab && low.indexOf(lab) >= 0) {
        return { key: String(n.fleetKey || n.address || n.key || name), label: n.fleetLabel || name, raw: n };
      }
    }
    const sbs = nearbyStarbases();
    for (let i = 0; i < sbs.length; i++) {
      const n = sbs[i];
      const lab = String((n && (n.systemName || n.name || n.label)) || "").toLowerCase();
      if (lab && low.indexOf(lab) >= 0) {
        return { key: "sb:" + String(n.systemKey || n.address || name), label: n.systemName || name, raw: n };
      }
    }
    return name ? { key: "name:" + name, label: name, raw: null } : null;
  }

  function decorateCombatCards() {
    const cards = document.querySelectorAll('[class*="combatTargetCard"], [class*="_fleetCard_"], [class*="fleetCard"]');
    cards.forEach((card) => {
      let btn = card.querySelector("[data-sa-pin]");
      if (!btn) {
        btn = document.createElement("button");
        btn.type = "button";
        btn.dataset.saPin = "1";
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const hit = resolveCardTarget(card);
          if (!hit) return;
          if (enemies.keys.includes(hit.key)) {
            removeEnemy(hit.key);
            btn.classList.remove("on");
            btn.textContent = "PIN";
          } else {
            addEnemy(hit);
            setCurrentTarget(hit.key);
            btn.classList.add("on");
            btn.textContent = "PINNED";
          }
        });
        card.appendChild(btn);
      }
      const hit = resolveCardTarget(card);
      const on = !!(hit && enemies.keys.includes(hit.key));
      btn.classList.toggle("on", on);
      btn.textContent = on ? "PINNED" : "PIN";
    });
  }

  function visibleEnemies() {
    const me = profileKey();
    const out = [];
    const seen = {};
    const add = (f) => {
      if (!f || !f.key || seen[f.key] || f.state === "Destroyed") return;
      if (isOwned(f.key)) return;
      if (me && f.owner && f.owner === me) return;
      if (ownLabels().has(String(f.label || "").toLowerCase())) return;
      seen[f.key] = 1;
      out.push(f);
    };
    try {
      const map = window.__SA_PIXI_MAP__;
      if (map && !map.getFleetWorldPosition && map.fleetPins) {
        /* already bound */
      } else if (map && typeof map.getFleetWorldPosition === "function") {
        try {
          map.getFleetWorldPosition("__sa_bind__");
        } catch {
          /* ignore */
        }
      }
      const pins = map && map.fleetPins;
      const vp = window.__SA_MAP_VIEWPORT__;
      if (pins && typeof pins.forEach === "function") {
        pins.forEach((pin, key) => {
          if (!pin || pin.destroyed || pin.isOwnedByPlayer) return;
          const k = String(key);
          if (!pinOnScreen(pin, k, map, vp)) return;
          const raw = findRaw(k);
          const rec = fleetRec(raw) || {
            key: k,
            label: String(pin.fleetLabel || pin.name || k).slice(0, 40),
            owner: pin.ownerPublicKey ? String(pin.ownerPublicKey) : "",
            state: "",
            raw: raw || pin,
          };
          add(rec);
        });
      }
    } catch {
      /* ignore */
    }
    nearbyList().forEach((n) => {
      const k = String((n && (n.fleetKey || n.address || n.key)) || "");
      if (!k) return;
      const c = n.coordinates || n.location;
      if (Array.isArray(c) && c.length >= 2) {
        const x = parseCoord(c[0]);
        const y = parseCoord(c[1]);
        if (Number.isFinite(x) && Number.isFinite(y) && !gameOnScreen(x, y)) return;
      }
      const rec = fleetRec(n) || {
        key: k,
        label: String((n && (n.fleetLabel || n.label || n.name)) || k).slice(0, 40),
        owner: "",
        state: "",
        raw: n,
      };
      add(rec);
    });
    peekAll().forEach((raw) => {
      const f = fleetRec(raw);
      if (!f) return;
      if (me && f.owner && f.owner === me) return;
      const xy = fleetXY(raw);
      if (!xy || !gameOnScreen(xy.x, xy.y)) return;
      add(f);
    });
    return out;
  }

  function chaseKeys() {
    const g = activeGroup();
    const gk = g ? idleKeys(g) : [];
    if (gk.length) return gk;
    const sel = selectedOwned();
    if (sel && sel.key) return [sel.key];
    const owned = ownedList();
    const idle = owned.filter((f) => !f.state || f.state === "Idle" || f.state === "StarbaseLoadingBay");
    return idle[0] ? [idle[0].key] : [];
  }

  function activeGroup() {
    if (groups.active < 0) return null;
    return groups.groups[groups.active] || null;
  }

  function groupKeys(g) {
    return (g && g.keys ? g.keys : []).filter(Boolean);
  }

  function addToGroup(idx, fleet) {
    if (idx < 0 || idx >= G_N || !fleet || !fleet.key) return;
    for (let i = 0; i < G_N; i++) {
      groups.groups[i].keys = groups.groups[i].keys.filter((k) => k !== fleet.key);
    }
    const g = groups.groups[idx];
    g.keys.push(fleet.key);
    g.labels[fleet.key] = fleet.label;
    persist();
    paint();
  }

  function removeFromGroup(idx, key) {
    const g = groups.groups[idx];
    if (!g) return;
    g.keys = g.keys.filter((k) => k !== String(key));
    persist();
    paint();
  }

  function addEnemy(fleet) {
    if (!fleet || !fleet.key) return;
    if (isOwned(fleet.key)) return;
    if (!enemies.keys.includes(fleet.key)) enemies.keys.push(fleet.key);
    enemies.labels[fleet.key] = fleet.label;
    rememberEnemy(fleet.key, fleet.raw);
    persist();
    paint();
  }

  function removeEnemy(key) {
    enemies.keys = enemies.keys.filter((k) => k !== String(key));
    persist();
    paint();
  }

  function selectedOwned() {
    const k = window.__SA_SELECTED_FLEET__ && window.__SA_SELECTED_FLEET__.key;
    if (!k) return null;
    const rec = fleetRec(findRaw(k));
    if (rec) return rec;
    return { key: String(k), label: String(window.__SA_SELECTED_FLEET__.label || k) };
  }

  function planner() {
    return window.__SA_PLANNER__ || null;
  }

  function setGroupMoveCss(on) {
    document.documentElement.classList.toggle("sa-group-move", !!on);
  }

  function destLabel(dest) {
    if (!dest) return "map point";
    if (dest.name) return String(dest.name);
    if (dest.label) return String(dest.label);
    const x = dest.x != null ? dest.x : dest.coordinates && dest.coordinates[0];
    const y = dest.y != null ? dest.y : dest.coordinates && dest.coordinates[1];
    if (Number.isFinite(Number(x)) && Number.isFinite(Number(y))) {
      return Number(x).toFixed(1) + ", " + Number(y).toFixed(1);
    }
    return "map point";
  }

  function showBanner(html) {
    if (!banner) {
      banner = document.createElement("div");
      banner.id = "sa-ops-banner";
      document.body.appendChild(banner);
    }
    banner.innerHTML = html;
    banner.style.display = "flex";
  }

  function hideBanner() {
    if (banner) banner.style.display = "none";
  }

  function cancelMove() {
    move = null;
    setGroupMoveCss(false);
    hideBanner();
    try {
      const p = planner();
      if (p && p.dispatch) p.dispatch({ type: "close" });
    } catch {
      /* ignore */
    }
  }

  function confirmMove() {
    const p = planner();
    if (!p) return;
    const st = p.getState ? p.getState() : null;
    const dest = st && st.destination;
    const n = move ? move.keys.length : 0;
    const mode = (move && move.mode) || "warp";
    if (!dest) return;
    const ok = window.confirm(
      (mode === "subwarp" ? "SUBWARP " : "WARP ") + n + " fleets → " + destLabel(dest) + " ?",
    );
    if (!ok) {
      cancelMove();
      return;
    }
    Promise.resolve(p.submit ? p.submit() : null)
      .catch(() => {})
      .finally(() => {
        cancelMove();
      });
  }

  function idleKeys(g) {
    return groupKeys(g).filter((k) => {
      const f = fleetRec(findRaw(k));
      if (!f) return false;
      const st = f.state;
      return !st || st === "Idle" || st === "StarbaseLoadingBay";
    });
  }

  function startGroupMove(mode) {
    const g = activeGroup();
    const keys = idleKeys(g);
    if (keys.length < 2) return false;
    const p = planner();
    if (!p || typeof p.openWing !== "function") return false;
    move = { mode: mode === "subwarp" ? "subwarp" : "warp", keys: keys.slice() };
    setGroupMoveCss(true);
    try {
      p.openWing(keys, move.mode);
    } catch {
      cancelMove();
      return false;
    }
    showBanner(
      "<b>" +
        (move.mode === "subwarp" ? "SUBWARP" : "WARP") +
        " " +
        keys.length +
        "</b><span>click map destination</span>" +
        '<button type="button" data-ops-go>Confirm</button>' +
        '<button type="button" data-ops-x>Cancel</button>',
    );
    const go = banner.querySelector("[data-ops-go]");
    const x = banner.querySelector("[data-ops-x]");
    if (go) go.onclick = () => confirmMove();
    if (x) x.onclick = () => cancelMove();
    return true;
  }

  function watchPlannerDest() {
    if (!move) return;
    try {
      const p = planner();
      const st = p && p.getState ? p.getState() : null;
      if (st && st.destination && banner) {
        const lab = destLabel(st.destination);
        const t = banner.querySelector("span");
        if (t) t.textContent = "→ " + lab + " · Confirm";
      }
    } catch {
      /* ignore */
    }
  }

  function onAction(action) {
    if (!action) return false;
    if (action.id !== "warp" && action.id !== "subwarp") return false;
    const g = activeGroup();
    if (!g || groupKeys(g).length < 2) return false;
    return startGroupMove(action.id);
  }

  let currentTarget = "";
  const huntAsked = {};
  const seenOnScreen = new Set();

  function setCurrentTarget(key) {
    currentTarget = String(key || "");
    const lab = enemies.labels[currentTarget] || currentTarget;
    try {
      window.__SA_COMBAT_TARGET__ &&
        window.__SA_COMBAT_TARGET__.set({
          fleetKey: currentTarget,
          target: lab.slice(0, 40),
          kind: "FLEET",
        });
    } catch {
      /* ignore */
    }
    paintTargets();
  }

  function destFromMemory(key) {
    const last = enemies.last[key] || {};
    if (Number.isFinite(last.destX) && Number.isFinite(last.destY)) {
      return { x: last.destX, y: last.destY, label: last.destLabel || "intercept" };
    }
    if (Number.isFinite(last.x) && Number.isFinite(last.y)) {
      return { x: last.x, y: last.y, label: last.label || "last seen" };
    }
    return null;
  }

  function flyToDest(dest, mode, title) {
    if (!dest || !Number.isFinite(dest.x) || !Number.isFinite(dest.y)) return false;
    const keys = chaseKeys();
    if (!keys.length) {
      showBanner("<b>SELECT A FLEET</b><span>then chase</span><button type=\"button\" data-ops-x>OK</button>");
      const x = banner && banner.querySelector("[data-ops-x]");
      if (x) x.onclick = () => hideBanner();
      return false;
    }
    const p = planner();
    if (!p || typeof p.primeBatch !== "function") return false;
    const m = mode === "warp" ? "warp" : "subwarp";
    move = { mode: m, keys: keys.slice() };
    setGroupMoveCss(true);
    try {
      p.primeBatch(keys, m, { x: dest.x, y: dest.y, label: dest.label || title || "chase" });
    } catch {
      cancelMove();
      return false;
    }
    showBanner(
      "<b>" +
        (m === "warp" ? "WARP" : "SUBWARP") +
        " " +
        keys.length +
        "</b><span>→ " +
        destLabel(dest) +
        "</span>" +
        '<button type="button" data-ops-go>Go</button>' +
        '<button type="button" data-ops-x>Cancel</button>',
    );
    const go = banner.querySelector("[data-ops-go]");
    const x = banner.querySelector("[data-ops-x]");
    if (go) go.onclick = () => confirmMove();
    if (x) x.onclick = () => cancelMove();
    return true;
  }

  function chaseTarget(key, intercept) {
    const raw = findRaw(key);
    if (raw) rememberEnemy(key, raw);
    const d = raw ? raw.data || raw : null;
    const dest = intercept ? journeyDest(d) || destFromMemory(key) : fleetXY(raw) || destFromMemory(key);
    if (!dest) return false;
    const far = destFromMemory(key);
    const mode = intercept || (far && (Math.abs((far.x || 0) - dest.x) > 2 || Math.abs((far.y || 0) - dest.y) > 2)) ? "warp" : "subwarp";
    return flyToDest(dest, mode, intercept ? "intercept" : "chase");
  }

  function askHunt(key) {
    const dest = destFromMemory(key);
    const name = enemies.labels[key] || key.slice(0, 10);
    if (!dest) return;
    showBanner(
      "<b>HUNT</b><span>" +
        name +
        " left view → " +
        destLabel(dest) +
        "</span>" +
        '<button type="button" data-ops-go>Hunt</button>' +
        '<button type="button" data-ops-x>Ignore</button>',
    );
    const go = banner && banner.querySelector("[data-ops-go]");
    const x = banner && banner.querySelector("[data-ops-x]");
    if (go)
      go.onclick = () => {
        hideBanner();
        chaseTarget(key, true);
      };
    if (x) x.onclick = () => hideBanner();
  }

  function watchSpots() {
    const vis = visibleEnemies();
    const visKeys = new Set(vis.map((v) => v.key));
    vis.forEach((v) => rememberEnemy(v.key, v.raw));
    enemies.keys.forEach((k) => {
      const raw = findRaw(k);
      if (raw) rememberEnemy(k, raw);
      const on = visKeys.has(k);
      if (seenOnScreen.has(k) && !on && !huntAsked[k]) {
        huntAsked[k] = Date.now();
        askHunt(k);
      }
      if (on) delete huntAsked[k];
    });
    seenOnScreen.clear();
    vis.forEach((v) => seenOnScreen.add(v.key));
  }

  function clickMod(e) {
    const m = opt.addMod || "shift";
    if (m === "shift") return e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey;
    if (m === "ctrl") return e.ctrlKey && !e.shiftKey && !e.altKey;
    if (m === "alt") return e.altKey && !e.shiftKey && !e.ctrlKey;
    return false;
  }

  function screenToGame(ev) {
    const canvas = document.querySelector("canvas");
    if (!canvas) return null;
    const r = canvas.getBoundingClientRect();
    const sx = ev.clientX - r.left;
    const sy = ev.clientY - r.top;
    if (sx < 0 || sy < 0 || sx > r.width || sy > r.height) return null;
    try {
      const vp = window.__SA_MAP_VIEWPORT__;
      if (vp && typeof vp.toWorld === "function") {
        const p = vp.toWorld(sx, sy);
        if (p && Number.isFinite(p.x) && Number.isFinite(p.y)) return { x: p.x, y: p.y };
      }
    } catch {
      /* ignore */
    }
    try {
      const math = window.__SA_MAP_MATH__;
      if (math && typeof math.pixelPointToGamePoint === "function") {
        const grid = math.MAP_CONFIG && math.MAP_CONFIG.WORLD_GRID_SIZE;
        const gsz = Number(grid) || 5000;
        const p = math.pixelPointToGamePoint({ x: sx, y: sy }, gsz, 1);
        if (p && Number.isFinite(p.x) && Number.isFinite(p.y)) return { x: p.x, y: p.y };
      }
    } catch {
      /* ignore */
    }
    return null;
  }

  function nearestUnowned(pt) {
    if (!pt) return null;
    let best = null;
    let bestD = 1e12;
    peekAll().forEach((raw) => {
      const f = fleetRec(raw);
      if (!f) return;
      if (isOwned(f.key)) return;
      const xy = fleetXY(raw);
      if (!xy) return;
      const dx = xy.x - pt.x;
      const dy = xy.y - pt.y;
      const d = dx * dx + dy * dy;
      if (d < bestD) {
        bestD = d;
        best = f;
      }
    });
    if (!best || bestD > 9) return null;
    return best;
  }

  function onMapClick(e) {
    if (!clickMod(e)) return;
    if (e.target && e.target.closest && e.target.closest("#sa-action-bar, #sa-ops-editor, #sa-ops-banner, #sa-ops-targets")) {
      return;
    }
    const pt = screenToGame(e);
    const f = nearestUnowned(pt);
    if (!f) return;
    e.preventDefault();
    e.stopPropagation();
    if (enemies.keys.includes(f.key)) removeEnemy(f.key);
    else addEnemy(f);
  }

  function panTo(key) {
    const raw = findRaw(key);
    const xy = fleetXY(raw);
    const mc = window.__SA_MAP_CONTROL__;
    if (xy && mc && typeof mc.requestPanTo === "function") {
      try {
        mc.requestPanTo(xy, key);
      } catch {
        /* ignore */
      }
    }
    try {
      window.__SA_COMBAT_TARGET__ &&
        window.__SA_COMBAT_TARGET__.set({
          fleetKey: key,
          target: (enemies.labels[key] || key).slice(0, 40),
          kind: "FLEET",
        });
    } catch {
      /* ignore */
    }
  }

  function attackListed(key) {
    panTo(key);
    setTimeout(() => {
      try {
        const bar = window.__SA_ACTION_BAR__;
        if (bar && typeof bar.fire === "function") bar.fire("attack");
      } catch {
        /* ignore */
      }
      const want = String(enemies.labels[key] || "").toLowerCase();
      if (!want) return;
      document.querySelectorAll('[class*="nearby"] button, [class*="fleet"] button').forEach((b) => {
        const t = String(b.textContent || "").toLowerCase();
        if (want && t.indexOf(want.slice(0, 8)) >= 0) {
          try {
            b.click();
          } catch {
            /* ignore */
          }
        }
      });
    }, 80);
  }

  function css() {
    let s = document.getElementById("sa-ops-css");
    if (!s) {
      s = document.createElement("style");
      s.id = "sa-ops-css";
      (document.head || document.documentElement).appendChild(s);
    }
    const next = [
      "html.sa-group-move [class*=plannerPanel],html.sa-group-move [class*=plannerRail]{",
      "opacity:0!important;pointer-events:none!important}",
      "#sa-ops-row{pointer-events:auto;display:flex;flex-wrap:wrap;align-items:center;gap:6px;padding:4px 8px;",
      "background:#0a0e1a;border:1px solid #2a2618;font-family:Orbitron,sans-serif}",
      "#sa-ops-row button{appearance:none;border:1px solid #3a3420;background:#14110c;color:#c8b88a;",
      "font:700 9px Orbitron,sans-serif;letter-spacing:.08em;padding:4px 8px;cursor:pointer;min-height:24px}",
      "#sa-ops-row button.on{border-color:#ffbe4d;color:#ffbe4d;background:#2a2010}",
      "#sa-ops-row button.tgt{border-color:#ff4960;color:#ff8a96}",
      "#sa-ops-row button.tgt.on{background:#2a1012}",
      "#sa-ops-banner{position:fixed;left:50%;bottom:var(--sa-hud-pad-bottom,8rem);transform:translateX(-50%);z-index:999992;",
      "display:none;align-items:center;gap:10px;padding:8px 12px;background:#0a0e1a;border:1px solid #ffbe4d;",
      "color:#ffbe4d;font:700 11px Orbitron,sans-serif;letter-spacing:.08em}",
      "#sa-ops-banner span{color:#e8d9a8;font-weight:600}",
      "#sa-ops-banner button{appearance:none;border:1px solid #ffbe4d;background:#2a2010;color:#ffbe4d;",
      "font:800 10px Orbitron,sans-serif;padding:4px 10px;cursor:pointer}",
      "#sa-tgt-dock,#sa-tgt-scout{--sa-tgt-s:1;position:fixed;z-index:2147483646;pointer-events:auto;",
      "display:flex;flex-direction:column;background:#09111df5;border:1px solid rgb(126 159 191 / 26%);",
      "color:#e8d9a8;font-family:var(--font-family-display,Orbitron,sans-serif);box-shadow:0 10px 28px #000000cc;",
      "font-size:calc(10px * var(--sa-tgt-s,1))}",
      "#sa-tgt-dock{width:calc(168px * var(--sa-tgt-s,1))}",
      "#sa-tgt-scout{width:calc(188px * var(--sa-tgt-s,1))}",
      "#sa-tgt-scout.hid{display:none!important}",
      "#sa-tgt-dock .cards{display:flex;flex-direction:column;gap:6px}",
      "#sa-tgt-scout .spots{display:flex;flex-direction:column;gap:6px}",
      "#sa-tgt-dock .vcard,#sa-tgt-scout .vcard{position:relative;display:grid;grid-template-columns:52px 1fr 22px;gap:4px 8px;",
      "align-items:center;min-height:72px;padding:8px 10px;background:#070c12e8;border:1px solid rgb(255 73 96 / 35%);",
      "color:#fff4f6;cursor:pointer}",
      "#sa-tgt-dock .vcard.focus{box-shadow:inset 0 0 0 1px #ff4960}",
      "#sa-tgt-dock .vcard.gone{opacity:.55}",
      "#sa-tgt-dock .vcard .art,#sa-tgt-scout .vcard .art{width:48px;height:40px;object-fit:contain}",
      "#sa-tgt-dock .vcard .nm,#sa-tgt-scout .vcard .nm{font:800 10px Orbitron,sans-serif;letter-spacing:.1em;text-transform:uppercase}",
      "#sa-tgt-dock .vcard .meta,#sa-tgt-scout .vcard .meta{font:700 7px Orbitron,sans-serif;letter-spacing:.08em;color:#deeef29e;text-transform:uppercase}",
      "#sa-tgt-dock .vcard .bars,#sa-tgt-scout .vcard .bars{grid-column:2;display:flex;flex-direction:column;gap:2px}",
      "#sa-tgt-dock .vcard .bar,#sa-tgt-scout .vcard .bar{display:flex;gap:1px;height:4px}",
      "#sa-tgt-dock .vcard .bar i,#sa-tgt-scout .vcard .bar i{flex:1;background:#2a2010}",
      "#sa-tgt-dock .vcard .bar.hp i.on,#sa-tgt-scout .vcard .bar.hp i.on{background:#e43f26}",
      "#sa-tgt-dock .vcard .bar.sp i.on,#sa-tgt-scout .vcard .bar.sp i.on{background:#32feff}",
      "#sa-tgt-dock .vcard .bar.am i.on,#sa-tgt-scout .vcard .bar.am i.on{background:#c8a24a}",
      "#sa-tgt-dock .pinbtn,#sa-tgt-scout .pinbtn{appearance:none;border:0;background:transparent;color:#ff4960;",
      "font-size:14px;line-height:1;cursor:pointer;padding:0;grid-column:3;grid-row:1 / span 3}",
      "#sa-tgt-dock .pinbtn.on,#sa-tgt-scout .pinbtn.on{color:#ffbe4d}",
      "#sa-tgt-dock .hd,#sa-tgt-scout .hd{display:flex;align-items:center;gap:.4em;padding:.35em .5em;",
      "cursor:grab;user-select:none;color:#ffbe4d;font-weight:800;letter-spacing:.1em;flex:0 0 auto}",
      "#sa-tgt-dock .hd button,#sa-tgt-scout .hd button{appearance:none;border:1px solid rgb(227 235 241 / 30%);",
      "background:#070d18cc;color:#e3ebf1cc;font:700 .72em Orbitron,sans-serif;padding:.2em .45em;cursor:pointer;",
      "letter-spacing:.08em}",
      "#sa-tgt-dock .hd button:hover,#sa-tgt-scout .hd button:hover{border-color:rgb(50 254 255 / 50%);color:#32feff}",
      "#sa-tgt-dock [data-cards],#sa-tgt-scout .spots{min-height:0;overflow:auto;flex:1 1 auto;",
      "scrollbar-width:thin;scrollbar-color:rgb(86 152 255 / 28%) transparent}",
      "#sa-tgt-dock [data-cards]::-webkit-scrollbar,#sa-tgt-scout .spots::-webkit-scrollbar{width:6px}",
      "#sa-tgt-dock [data-cards]::-webkit-scrollbar-track,#sa-tgt-scout .spots::-webkit-scrollbar-track{background:transparent}",
      "#sa-tgt-dock [data-cards]::-webkit-scrollbar-thumb,#sa-tgt-scout .spots::-webkit-scrollbar-thumb{background:#5698ff47}",
      "#sa-tgt-dock [data-cards]::-webkit-scrollbar-thumb:hover,#sa-tgt-scout .spots::-webkit-scrollbar-thumb:hover{background:#70b1ff66}",
      "#sa-tgt-dock .card{position:relative;display:flex;flex-direction:column;gap:.2em;padding:.3em .45em .4em;",
      "background:#14110c;border-top:1px solid #2a2618;cursor:pointer}",
      "#sa-tgt-dock .card.focus{border-top:1px solid #ffbe4d;background:#2a2010}",
      "#sa-tgt-dock .card.gone{opacity:.65}",
      "#sa-tgt-dock .nm{font-weight:800;letter-spacing:.05em;text-transform:uppercase;",
      "overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding-right:1.2em}",
      "#sa-tgt-dock .bar{display:block;height:.28em;background:#2a2010;overflow:hidden}",
      "#sa-tgt-dock .bar>i{display:block;height:100%;width:0}",
      "#sa-tgt-dock .bar.hp>i{background:#e43f26}",
      "#sa-tgt-dock .bar.sp>i{background:#32feff}",
      "#sa-tgt-dock .acts{display:flex;gap:.3em}",
      "#sa-tgt-dock .acts button{appearance:none;flex:1;border:1px solid rgb(227 235 241 / 30%);background:#070d18cc;",
      "color:#e3ebf1cc;font:800 .7em Orbitron,sans-serif;padding:.15em 0;cursor:pointer}",
      "#sa-tgt-dock .acts button:hover{border-color:rgb(50 254 255 / 50%);color:#32feff}",
      "#sa-tgt-dock .pinx{position:absolute;top:.1em;right:.15em;border:0;background:transparent;color:#ffbe4d;",
      "font:800 1em Orbitron,sans-serif;cursor:pointer;padding:0 .15em}",
      "#sa-tgt-scout .spot{display:flex;align-items:center;gap:.45em;width:100%;appearance:none;border:0;",
      "border-top:1px solid #ffffff12;background:transparent;color:#fffffff5;font:700 .78em Orbitron,sans-serif;",
      "text-align:left;padding:.4em .5em;cursor:pointer;letter-spacing:.06em}",
      "#sa-tgt-scout .spot:hover{background:#14243ee0}",
      "#sa-tgt-scout .spot .box{flex:0 0 auto;width:1.45em;height:1.45em;border:1px solid rgb(255 255 255 / 20%);",
      "background:#070d18cc;display:flex;align-items:center;justify-content:center}",
      "#sa-tgt-scout .spot.on .box{background:#14243ee0;border-color:#5292ff70;color:#66a2f8}",
      "#sa-tgt-scout .spot .box:after{content:'';width:.55em;height:.55em;background:transparent}",
      "#sa-tgt-scout .spot.on .box:after{background:#66a2f8}",
      "html.sa-bar-top #sa-ops-banner{top:var(--sa-hud-pad-top,6rem);bottom:auto}",
      "#sa-ops-editor{position:fixed;left:50%;z-index:2147483640;display:none;flex-wrap:wrap;align-content:flex-start;",
      "gap:10px;padding:12px;background:#0a0e1a;border:1px solid #ffbe4d;color:#e8d9a8;",
      "font:600 10px Orbitron,sans-serif;width:min(920px,96vw);box-sizing:border-box;overflow:auto;",
      "transform:translateX(-50%);box-shadow:0 16px 48px #000000a8}",
      "#sa-ops-editor.on{display:flex}",
      "#sa-ops-editor .sa-ed-head{display:flex;align-items:center;justify-content:space-between;width:100%;gap:12px}",
      "#sa-ops-editor .sa-ed-head span{color:#ffbe4d;letter-spacing:.16em;font-weight:800}",
      "#sa-ops-editor .sa-ed-x{appearance:none;border:1px solid #ffbe4d;background:#1c160c;color:#ffbe4d;",
      "font:800 14px/1 Orbitron,sans-serif;width:28px;height:24px;cursor:pointer;padding:0}",
      "#sa-ops-editor .sa-ed-x:hover{background:#2a2010}",
      "#sa-ops-editor .col{display:flex;flex-direction:column;gap:4px;min-width:140px;min-height:80px;",
      "max-height:240px;overflow:auto;padding:4px;border:1px solid transparent}",
      "#sa-ops-editor h4{margin:0 0 4px;color:#ffbe4d;letter-spacing:.12em}",
      "#sa-ops-editor button.chip{appearance:none;border:1px solid #3a3420;background:#14110c;color:#c8b88a;",
      "font:700 9px Orbitron,sans-serif;text-align:left;padding:4px 6px;cursor:grab}",
      "#sa-ops-editor button.chip:active{cursor:grabbing}",
      "#sa-ops-editor .col.g.on,#sa-ops-editor .col.drop{border:1px solid #ffbe4d}",
      "#sa-ops-editor .hint{width:100%;margin:0;color:#8a7840;letter-spacing:.06em}",
    ].join("");
    if (s.textContent !== next) s.textContent = next;
  }

  function ensureRow() {
    const bar = document.getElementById("sa-action-bar");
    if (!bar) return null;
    let row = document.getElementById("sa-ops-row");
    if (!row) {
      row = document.createElement("div");
      row.id = "sa-ops-row";
      bar.appendChild(row);
    }
    return row;
  }

  function paint() {
    css();
    pruneDeadGroups();
    const row = ensureRow();
    if (!row) return;
    row.innerHTML = "";
    for (let i = 0; i < G_N; i++) {
      const g = groups.groups[i];
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = g.name + (g.keys.length ? " " + g.keys.length : "");
      if (groups.active === i) b.classList.add("on");
      b.title = "Click: use this group for Warp/Subwarp. Right-click: add selected fleet. Double-click: pan.";
      b.addEventListener("click", () => {
        groups.active = groups.active === i ? -1 : i;
        persist();
        paint();
      });
      b.addEventListener("dblclick", (e) => {
        e.preventDefault();
        const k = g.keys[0];
        if (!k) return;
        const rec = fleetRec(findRaw(k));
        if (rec) {
          try {
            window.__SA_ACTION_BAR__ && window.__SA_ACTION_BAR__.assignSlot;
          } catch {
            /* ignore */
          }
          const mc = window.__SA_MAP_CONTROL__;
          const xy = fleetXY(findRaw(k));
          if (xy && mc && mc.requestPanTo) mc.requestPanTo(xy, k);
        }
      });
      b.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        const sel = selectedOwned();
        if (sel) addToGroup(i, sel);
      });
      row.appendChild(b);
    }
    const ed = document.createElement("button");
    ed.type = "button";
    ed.textContent = "EDIT";
    ed.title = "Fleet editor";
    ed.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleEditor();
    });
    row.appendChild(ed);
    paintTargets();
    paintEditor();
    placeEditor();
    injectOpt();
  }

  function applyTgtScale() {
    const s = hudPos.scale || 1;
    if (listEl) listEl.style.setProperty("--sa-tgt-s", String(s));
  }

  function bumpScale(d) {
    hudPos.scale = Math.min(1.6, Math.max(0.7, Math.round(((hudPos.scale || 1) + d) * 20) / 20));
    saveHudPos();
    applyTgtScale();
    placeGrow(listEl);
  }

  function placeGrow(el) {
    if (!el || el.classList.contains("hid")) return;
    const vh = window.innerHeight || 800;
    const r = el.getBoundingClientRect();
    if (r.width < 2) return;
    const left = Math.max(0, Math.min(r.left, (window.innerWidth || 1200) - r.width - 8));
    const mid = r.top + r.height / 2;
    el.style.left = left + "px";
    el.style.right = "auto";
    if (mid > vh * 0.5) {
      const bottom = Math.max(8, vh - r.bottom);
      el.style.top = "auto";
      el.style.bottom = bottom + "px";
      el.style.maxHeight = Math.max(120, r.bottom - 8) + "px";
    } else {
      const top = Math.max(8, r.top);
      el.style.bottom = "auto";
      el.style.top = top + "px";
      el.style.maxHeight = Math.max(120, vh - top - 8) + "px";
    }
  }

  function applyHudPos(el, pos, fallback) {
    if (!el) return;
    el.style.left = el.style.right = el.style.top = el.style.bottom = "";
    if (pos && Number.isFinite(pos.x) && Number.isFinite(pos.y)) {
      el.style.left = Math.max(0, pos.x) + "px";
      el.style.top = Math.max(0, pos.y) + "px";
      return;
    }
    if (fallback.right != null) el.style.right = fallback.right + "px";
    if (fallback.bottom != null) el.style.bottom = fallback.bottom + "px";
    if (fallback.top != null) el.style.top = fallback.top + "px";
    if (fallback.left != null) el.style.left = fallback.left + "px";
  }

  let hudDragging = false;

  function bindFloatDrag(el, which) {
    if (!el || el.__saDrag) return;
    el.__saDrag = true;
    const grip = el.querySelector("[data-drag]") || el;
    let sx = 0;
    let sy = 0;
    let sl = 0;
    let st = 0;
    const onMove = (e) => {
      const x = Math.max(0, sl + (e.clientX - sx));
      const y = Math.max(0, st + (e.clientY - sy));
      el.style.left = x + "px";
      el.style.top = y + "px";
      el.style.right = "auto";
      el.style.bottom = "auto";
    };
    const onUp = (e) => {
      hudDragging = false;
      window.removeEventListener("pointermove", onMove, true);
      window.removeEventListener("pointerup", onUp, true);
      const r = el.getBoundingClientRect();
      hudPos[which] = { x: r.left, y: r.top };
      saveHudPos();
      placeGrow(el);
    };
    grip.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      if (e.target && e.target.closest && e.target.closest("button")) return;
      e.preventDefault();
      hudDragging = true;
      const r = el.getBoundingClientRect();
      sx = e.clientX;
      sy = e.clientY;
      sl = r.left;
      st = r.top;
      window.addEventListener("pointermove", onMove, true);
      window.addEventListener("pointerup", onUp, true);
    });
  }

  function ensureTargetHud() {
    const old = document.getElementById("sa-ops-targets");
    if (old && old.parentNode && old.parentNode.id === "sa-action-bar") {
      try {
        old.remove();
      } catch {
        /* ignore */
      }
      if (listEl === old) listEl = null;
    }
    if (!listEl || !listEl.isConnected || listEl.id !== "sa-tgt-dock") {
      listEl = document.createElement("div");
      listEl.id = "sa-tgt-dock";
      listEl.innerHTML =
        '<div class="hd" data-drag><span data-title>⋮⋮ PINNED 0</span>' +
        '<button type="button" data-minus title="Smaller">−</button>' +
        '<button type="button" data-plus title="Larger">+</button></div>' +
        '<div class="cards" data-cards></div>';
      document.body.appendChild(listEl);
      applyHudPos(listEl, hudPos.dock, { right: 12, top: 88 });
      bindFloatDrag(listEl, "dock");
      listEl.querySelector("[data-minus]").addEventListener("click", (e) => {
        e.stopPropagation();
        bumpScale(-0.1);
      });
      listEl.querySelector("[data-plus]").addEventListener("click", (e) => {
        e.stopPropagation();
        bumpScale(0.1);
      });
    }
    if (scoutEl) {
      try {
        scoutEl.remove();
      } catch {
        /* ignore */
      }
      scoutEl = null;
    }
    const leftover = document.getElementById("sa-tgt-scout");
    if (leftover) leftover.remove();
  }

  function segs(pct, n) {
    const on = Math.round((Math.max(0, Math.min(100, pct)) / 100) * n);
    let h = "";
    for (let i = 0; i < n; i++) h += i < on ? "<i class=\"on\"></i>" : "<i></i>";
    return h;
  }

  function makeVictimCard(k, rec, vis, pinned) {
    const raw = (rec && rec.raw) || findRaw(k);
    if (raw) rememberEnemy(k, raw);
    const vit = fleetVitals(raw);
    const onScreen = vis.some((v) => v.key === k);
    const card = document.createElement("div");
    card.className = "vcard" + (currentTarget === k ? " focus" : "") + (raw && onScreen ? "" : " gone");
    const hpPct = Number.isFinite(vit.hp) && vit.mhp > 0 ? (vit.hp / vit.mhp) * 100 : 0;
    const spPct = Number.isFinite(vit.sp) && vit.msp > 0 ? (vit.sp / vit.msp) * 100 : 0;
    const name = (rec && rec.label) || enemies.labels[k] || k.slice(0, 12);
    const st = rec && rec.state ? rec.state : "";
    card.innerHTML =
      '<img class="art" alt="" src="">' +
      '<div><div class="nm">' +
      name +
      '</div><div class="meta">' +
      (st || (onScreen ? "IN RANGE" : "LAST SEEN")) +
      '</div><div class="bars"><span class="bar hp">' +
      segs(hpPct, 12) +
      '</span><span class="bar sp">' +
      segs(spPct, 12) +
      "</span></div></div>" +
      '<button type="button" class="pinbtn' +
      (pinned ? " on" : "") +
      '" title="' +
      (pinned ? "Unpin" : "Pin") +
      '">📍</button>';
    const img = card.querySelector(".art");
    if (img) {
      const src =
        stealOfficialArt(name) ||
        (raw && (raw.imageUrl || raw.shipImage || raw.image || (raw.data && (raw.data.imageUrl || raw.data.image))));
      if (src) img.src = src;
      else img.style.opacity = ".35";
    }
    card.addEventListener("click", (e) => {
      if (e.target && e.target.closest && e.target.closest("button")) return;
      setCurrentTarget(k);
      panTo(k);
    });
    card.querySelector(".pinbtn").onclick = (e) => {
      e.stopPropagation();
      if (pinned) removeEnemy(k);
      else addEnemy(rec || { key: k, label: name, raw: raw });
    };
    return card;
  }

  function paintTargets() {
    ensureTargetHud();
    const vis = visibleEnemies();
    const pinned = new Set(enemies.keys);
    const cards = listEl.querySelector("[data-cards]");
    const n = enemies.keys.length;
    const title = listEl.querySelector("[data-title]");
    if (title) title.textContent = "⋮⋮ PINNED " + n;
    const official = officialCardNodes().filter((el) => !isOwnCardEl(el) && !el.closest("#sa-tgt-dock"));
    if (cards) {
      cards.innerHTML = "";
      const order = [];
      if (currentTarget && pinned.has(currentTarget)) order.push(currentTarget);
      enemies.keys.forEach((k) => {
        if (k !== currentTarget) order.push(k);
      });
      order.forEach((k) => {
        const lab = String(enemies.labels[k] || "").toLowerCase();
        const src = official.find((el) => String(el.textContent || "").toLowerCase().indexOf(lab) >= 0);
        if (src && lab) {
          const clone = src.cloneNode(true);
          clone.querySelectorAll("[data-sa-pin]").forEach((b) => b.remove());
          const pin = document.createElement("button");
          pin.type = "button";
          pin.className = "pinbtn on";
          pin.textContent = "📌";
          pin.onclick = (e) => {
            e.stopPropagation();
            removeEnemy(k);
          };
          clone.style.position = "relative";
          clone.appendChild(pin);
          cards.appendChild(clone);
        } else {
          cards.appendChild(makeVictimCard(k, null, vis, true));
        }
      });
    }
    applyTgtScale();
    decorateCombatCards();
    officialCardNodes().forEach((el) => {
      if (el.closest("#sa-tgt-dock")) return;
      if (isOwnCardEl(el)) el.style.display = "none";
    });
    if (!hudDragging) {
      requestAnimationFrame(() => {
        placeGrow(listEl);
      });
    }
  }

  let editor = null;

  function placeEditor() {
    if (!editor || !editor.classList.contains("on")) return;
    if (editor.parentNode !== document.body) document.body.appendChild(editor);
    const vh = window.innerHeight || 800;
    const bar = document.getElementById("sa-action-bar");
    let top = 16;
    let bottom = 16;
    if (bar && !bar.classList.contains("sa-bar-hidden")) {
      const br = bar.getBoundingClientRect();
      const mid = br.top + br.height / 2;
      if (mid > vh * 0.45) bottom = Math.max(16, Math.round(vh - br.top + 10));
      else top = Math.max(16, Math.round(br.bottom + 10));
    }
    editor.style.top = top + "px";
    editor.style.bottom = bottom + "px";
    editor.style.left = "50%";
    editor.style.right = "auto";
    editor.style.maxHeight = Math.max(160, vh - top - bottom) + "px";
    editor.style.display = "flex";
  }

  function closeEditor() {
    if (!editor) return;
    editor.classList.remove("on");
    editor.style.display = "none";
  }

  function toggleEditor() {
    if (!editor) {
      editor = document.createElement("div");
      editor.id = "sa-ops-editor";
    }
    if (!editor.isConnected) document.body.appendChild(editor);
    const open = !editor.classList.contains("on");
    editor.classList.toggle("on", open);
    if (!open) {
      editor.style.display = "none";
      return;
    }
    paintEditor();
    placeEditor();
  }

  function parseDrag(e) {
    try {
      return JSON.parse(e.dataTransfer.getData("text/plain") || "null");
    } catch {
      return null;
    }
  }

  function bindChip(el, payload) {
    el.className = "chip";
    el.draggable = true;
    el.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", JSON.stringify(payload));
      e.dataTransfer.effectAllowed = "move";
    });
  }

  function dropIndex(col, e) {
    const chips = [...col.querySelectorAll("button.chip")];
    for (let i = 0; i < chips.length; i++) {
      const r = chips[i].getBoundingClientRect();
      if (e.clientY < r.top + r.height / 2) return i;
    }
    return chips.length;
  }

  function bindDrop(col, dest) {
    col.addEventListener("dragover", (e) => {
      e.preventDefault();
      col.classList.add("drop");
    });
    col.addEventListener("dragleave", () => col.classList.remove("drop"));
    col.addEventListener("drop", (e) => {
      e.preventDefault();
      col.classList.remove("drop");
      const p = parseDrag(e);
      if (!p || !p.key) return;
      const at = dropIndex(col, e);
      if (dest === "pool") {
        for (let i = 0; i < G_N; i++) removeFromGroup(i, p.key);
        return;
      }
      if (dest === "tgt") {
        if (!isOwned(p.key)) addEnemy({ key: p.key, label: p.label });
        return;
      }
      const idx = Number(dest);
      if (!Number.isFinite(idx)) return;
      const g = groups.groups[idx];
      const already = g.keys.indexOf(p.key);
      for (let i = 0; i < G_N; i++) {
        groups.groups[i].keys = groups.groups[i].keys.filter((k) => k !== p.key);
      }
      let insert = at;
      if (already >= 0 && already < insert) insert -= 1;
      insert = Math.max(0, Math.min(insert, g.keys.length));
      g.keys.splice(insert, 0, p.key);
      g.labels[p.key] = p.label || g.labels[p.key] || p.key;
      groups.active = idx;
      persist();
      paint();
    });
  }

  function paintEditor() {
    if (!editor || !editor.classList.contains("on")) return;
    editor.innerHTML = "";
    const head = document.createElement("div");
    head.className = "sa-ed-head";
    head.innerHTML = "<span>FLEET EDITOR</span>";
    const x = document.createElement("button");
    x.type = "button";
    x.className = "sa-ed-x";
    x.title = "Close fleet editor";
    x.setAttribute("aria-label", "Close fleet editor");
    x.textContent = "×";
    x.addEventListener("click", (e) => {
      e.stopPropagation();
      closeEditor();
    });
    head.appendChild(x);
    editor.appendChild(head);
    const hint = document.createElement("p");
    hint.className = "hint";
    hint.textContent = "Drag fleets into G1–G4. Drag back to OWNED to unassign. Reorder inside a group.";
    editor.appendChild(hint);

    const pool = document.createElement("div");
    pool.className = "col";
    pool.innerHTML = "<h4>OWNED</h4>";
    bindDrop(pool, "pool");
    ownedList().forEach((f) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = f.label;
      b.title = "Drag onto a group";
      bindChip(b, { key: f.key, label: f.label, from: "pool" });
      pool.appendChild(b);
    });
    editor.appendChild(pool);
    for (let i = 0; i < G_N; i++) {
      const g = groups.groups[i];
      const col = document.createElement("div");
      col.className = "col g" + (groups.active === i ? " on" : "");
      const h = document.createElement("h4");
      h.textContent = g.name;
      h.style.cursor = "pointer";
      h.onclick = () => {
        groups.active = i;
        persist();
        paint();
      };
      col.appendChild(h);
      bindDrop(col, String(i));
      g.keys.forEach((k) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = g.labels[k] || k.slice(0, 10);
        b.title = "Drag to reorder or move. Click to remove.";
        bindChip(b, { key: k, label: g.labels[k] || k, from: "g" + i });
        b.addEventListener("click", () => removeFromGroup(i, k));
        col.appendChild(b);
      });
      editor.appendChild(col);
    }
    const en = document.createElement("div");
    en.className = "col";
    en.innerHTML = "<h4>TARGETS</h4>";
    bindDrop(en, "tgt");
    enemies.keys.forEach((k) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = enemies.labels[k] || k.slice(0, 10);
      b.title = "Drag. Click to remove.";
      bindChip(b, { key: k, label: enemies.labels[k] || k, from: "tgt" });
      b.addEventListener("click", () => removeEnemy(k));
      en.appendChild(b);
    });
    editor.appendChild(en);
  }

  function injectOpt() {
    const bar = document.getElementById("sa-action-bar");
    const panel = bar && bar.querySelector("[data-opts-panel]");
    if (!panel || panel.querySelector("[data-opt=addMod]")) return;
    const lab = document.createElement("label");
    lab.innerHTML =
      'Add target <select data-opt="addMod">' +
      '<option value="shift">Shift+click</option>' +
      '<option value="ctrl">Ctrl+click</option>' +
      '<option value="alt">Alt+click</option></select>';
    const sel = lab.querySelector("select");
    sel.value = opt.addMod;
    sel.addEventListener("change", () => {
      opt.addMod = sel.value;
      persist();
      paint();
    });
    panel.appendChild(lab);
  }

  window.__SA_FLEET_OPS__ = {
    onAction,
    groups: () => groups,
    enemies: () => enemies,
    addEnemy,
    paint,
    toggleEditor,
  };

  function boot() {
    css();
    paint();
    if (!window.__SA_OPS_CLICK__) {
      window.__SA_OPS_CLICK__ = true;
      document.addEventListener("click", onMapClick, true);
      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && move) {
          e.preventDefault();
          cancelMove();
          return;
        }
        if (e.key === "Escape" && editor && editor.classList.contains("on")) {
          e.preventDefault();
          closeEditor();
          return;
        }
        if (e.key === "Enter" && move) {
          e.preventDefault();
          confirmMove();
        }
      });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  let lastZoomSeen = NaN;
  let zoomScanTimer = 0;
  function noteZoomScan() {
    const z = mapZoomNow();
    if (!Number.isFinite(z)) return;
    if (z === lastZoomSeen) return;
    lastZoomSeen = z;
    if (zoomScanTimer) clearTimeout(zoomScanTimer);
    zoomScanTimer = setTimeout(() => {
      zoomScanTimer = 0;
      try {
        watchSpots();
        paintTargets();
      } catch {
        /* ignore */
      }
    }, 1500);
  }

  setInterval(() => {
    try {
      watchPlannerDest();
      const bar = document.getElementById("sa-action-bar");
      if (bar && !document.getElementById("sa-ops-row")) paint();
      noteZoomScan();
      decorateCombatCards();
      placeEditor();
      injectOpt();
    } catch {
      /* ignore */
    }
  }, 400);
  setInterval(() => {
    try {
      watchSpots();
      decorateCombatCards();
      paintTargets();
    } catch {
      /* ignore */
    }
  }, 2000);
})();
