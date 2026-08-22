/** Combat / Flight / Comms / Contacts HUD. MAIN. LEEKS / Produce Bandit ltd
 * Comms/Contacts host the live SAGE InkChat panels (real messages, emoji, DMs).
 * Minimized chip = motion-teardown `.typing`. Positions persist.
 */
(function () {
  if (localStorage.getItem("saEnabled") !== "1") return;
  const POS_KEY = "saCombatLogPos.v1";
  const CHIP_KEY = "saClChipPos.v1";
  const HIDE_KEY = "saHideCombatLog";
  const FONT_KEY = "saLogFont.v1";
  const Z = "2147482000";

  const CSS = [
    "#sa-cl-chip.typing{position:fixed;left:16px;bottom:16px;z-index:" + Z + ";",
    "display:none;align-items:flex-end;gap:7px;padding:14px 18px;margin:0;",
    "border:0;border-radius:16px 16px 16px 4px;background:#131A26;cursor:pointer;",
    "box-shadow:0 10px 28px rgba(0,0,0,.55);pointer-events:auto}",
    "#sa-cl-chip.typing.on{display:flex}",
    "#sa-cl-chip.typing i{display:block;width:8px;height:8px;border-radius:50%;",
    "background:#E9ECF1;opacity:.45}",
    "@keyframes typing-dot{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-7px);opacity:1}}",
    "#sa-cl-chip.typing.live i{animation:typing-dot 1.3s ease-in-out infinite}",
    "#sa-cl-chip.typing.live i:nth-child(2){animation-delay:.16s}",
    "#sa-cl-chip.typing.live i:nth-child(3){animation-delay:.32s}",
    "#sa-cl-chip .sa-cl-pip{position:absolute;top:6px;right:6px;width:8px;height:8px;",
    "border-radius:50%;background:#e84a4a;box-shadow:0 0 0 2px #131A26;display:none}",
    "#sa-cl-chip.live .sa-cl-pip{display:block}",
    "#sa-combat-log-box{position:fixed!important;left:16px;bottom:16px;z-index:" + Z + ";",
    "width:min(440px,calc(100vw - 24px));height:min(420px,58vh);",
    "display:flex;flex-direction:column;overflow:hidden;box-sizing:border-box;",
    "background:linear-gradient(165deg,rgba(22,18,12,.97),rgba(10,12,16,.98));",
    "border:1px solid rgba(255,190,77,.4);border-radius:4px;",
    "box-shadow:0 16px 48px rgba(0,0,0,.65);font-family:Orbitron,sans-serif;color:#e8d9a8}",
    "#sa-combat-log-box.sa-cl-hidden{display:none!important}",
    "#sa-combat-log-box .sa-cl-tabs{display:flex;align-items:stretch;flex-shrink:0;cursor:grab;",
    "border-bottom:1px solid rgba(255,190,77,.18);background:rgba(0,0,0,.2);user-select:none}",
    "#sa-combat-log-box .sa-cl-tabs button[data-tab]{flex:1;appearance:none;border:0;background:transparent;",
    "color:rgba(200,184,138,.45);font:700 9px Orbitron,sans-serif;letter-spacing:.1em;",
    "text-transform:uppercase;padding:9px 4px;cursor:pointer}",
    "#sa-combat-log-box .sa-cl-tabs button[data-tab].on{color:#ffbe4d;background:rgba(255,190,77,.1);box-shadow:inset 0 -2px #ffbe4d}",
    "#sa-combat-log-box .sa-cl-tabs button[data-tab].ping{color:#ff6b6b}",
    "#sa-combat-log-box .sa-cl-grip{display:flex;align-items:center;padding:0 7px;color:rgba(255,190,77,.65)}",
    "#sa-combat-log-box .sa-cl-ctl{position:relative;display:flex;margin-left:auto;border-left:1px solid rgba(255,190,77,.18)}",
    "#sa-combat-log-box .sa-cl-ico{appearance:none;min-width:28px;padding:4px 8px;border:0;background:transparent;",
    "color:#e8d9a8;cursor:pointer;font:700 11px Orbitron,sans-serif}",
    "#sa-combat-log-box .sa-cl-ico:hover{color:#ffbe4d}",
    "#sa-combat-log-box .sa-cl-fontpop{display:none;position:absolute;top:100%;right:0;z-index:8;",
    "flex-direction:column;min-width:44px;padding:4px;background:#0a0e1a;border:1px solid rgba(255,190,77,.45);",
    "border-top:0;box-shadow:0 8px 20px rgba(0,0,0,.55)}",
    "#sa-combat-log-box .sa-cl-fontpop.on{display:flex}",
    "#sa-combat-log-box .sa-cl-fontpop button{appearance:none;border:0;background:transparent;color:#e8d9a8;",
    "cursor:pointer;padding:4px 8px;line-height:1;font-family:Georgia,Times,serif}",
    "#sa-combat-log-box .sa-cl-fontpop button:hover{color:#ffbe4d;background:rgba(255,190,77,.1)}",
    "#sa-combat-log-box .sa-cl-fontpop [data-font=down]{font-size:11px;font-weight:500}",
    "#sa-combat-log-box .sa-cl-fontpop [data-font=up]{font-size:18px;font-weight:700}",
    "#sa-combat-log-box .sa-cl-body{flex:1;min-height:0;padding:8px 10px;overflow:auto;display:none;flex-direction:column;gap:5px;",
    "scrollbar-width:thin;scrollbar-color:rgba(255,190,77,.45) transparent}",
    "#sa-combat-log-box .sa-cl-body.on{display:flex}",
    "#sa-combat-log-box .sa-cl-body[data-pane=comms],#sa-combat-log-box .sa-cl-body[data-pane=contacts]{padding:6px 8px 6px;overflow:hidden;gap:4px}",
    "#sa-combat-log-box .sa-cl-chans{display:flex;flex-wrap:wrap;gap:4px;flex-shrink:0}",
    "#sa-combat-log-box .sa-cl-sub{display:flex;gap:6px;flex-shrink:0;padding:2px 0 6px}",
    "#sa-combat-log-box .sa-cl-sub button{flex:1;appearance:none;cursor:pointer;padding:7px 8px;",
    "border:1px solid rgba(255,190,77,.28);background:#141008;color:#c8b88a;",
    "font:700 11px Orbitron,sans-serif;letter-spacing:.1em;text-transform:uppercase;border-radius:3px}",
    "#sa-combat-log-box .sa-cl-sub button.on{color:#0a0e1a;background:#ffbe4d;border-color:#ffbe4d}",
    "#sa-combat-log-box .sa-cl-row,#sa-combat-log-box .sa-cl-msg,#sa-combat-log-box .sa-cl-empty,",
    "#sa-combat-log-box .sa-cl-msgs{font-size:var(--sa-cl-fs,11px)}",
    "#sa-combat-log-box .sa-cl-chip{appearance:none;cursor:pointer;padding:3px 7px;border-radius:99px;",
    "border:1px solid rgba(255,255,255,.16);background:rgba(0,0,0,.35);color:#e8d9a8;",
    "font:700 8px Orbitron,sans-serif;letter-spacing:.06em;text-transform:uppercase}",
    "#sa-combat-log-box .sa-cl-chip.on{border-color:rgba(255,190,77,.55);color:#ffbe4d;background:rgba(255,190,77,.12)}",
    "#sa-combat-log-box .sa-cl-chip.dim{opacity:.4}",
    "#sa-combat-log-box .sa-cl-msgs{flex:1;min-height:0;overflow:auto;display:flex;flex-direction:column;gap:4px}",
    "#sa-combat-log-box .sa-cl-msg{padding:3px 2px 4px;border-bottom:1px solid rgba(255,190,77,.08);",
    "font-weight:600;line-height:1.35;font-family:ui-sans-serif,system-ui,sans-serif;",
    "color:rgba(232,217,168,.9);cursor:context-menu}",
    "#sa-combat-log-box .sa-cl-msg .who{color:#7ac8ffe5;font:700 9px Orbitron,sans-serif;letter-spacing:.04em}",
    "#sa-combat-log-box .sa-cl-msg .when{color:rgba(200,184,138,.4);font:600 9px ui-monospace,Menlo,monospace;margin-left:6px}",
    "#sa-combat-log-box .sa-cl-msg .sa-fac{display:inline-flex;align-items:center;justify-content:center;",
    "width:14px;height:14px;margin-right:5px;border-radius:2px;font:800 7px Orbitron,sans-serif;",
    "letter-spacing:0;color:#0a0e1a;vertical-align:middle}",
    "#sa-combat-log-box .sa-fac-mud{background:#e43f26;color:#fff}",
    "#sa-combat-log-box .sa-fac-oni{background:#0066ff;color:#fff}",
    "#sa-combat-log-box .sa-fac-ustur{background:#ffaa00;color:#1a1200}",
    "#sa-combat-log-box .sa-fac-none{background:#5a564c;color:#d8d0b8}",
    "#sa-cl-menu{position:fixed;z-index:2147483646;min-width:168px;padding:4px 0;background:#0a0e1a;",
    "border:1px solid rgba(255,190,77,.45);color:#e8d9a8;font:700 10px Orbitron,sans-serif;letter-spacing:.04em}",
    "#sa-cl-menu button{display:block;width:100%;text-align:left;appearance:none;border:0;background:transparent;",
    "color:#e8d9a8;padding:6px 10px;cursor:pointer;font:inherit}",
    "#sa-cl-menu button:hover{background:rgba(255,190,77,.12);color:#ffbe4d}",
    "#sa-combat-log-box .sa-cl-compose{flex-shrink:0;display:flex;align-items:center;gap:4px;margin-top:auto}",
    "#sa-combat-log-box .sa-cl-compose input{flex:1;min-width:0;padding:6px 8px;border-radius:2px;",
    "border:1px solid rgba(255,190,77,.25);background:rgba(0,0,0,.4);color:#fff8e8;font:600 12px ui-sans-serif,sans-serif}",
    "#sa-combat-log-box .sa-cl-compose button{appearance:none;padding:6px 8px;border:1px solid rgba(255,190,77,.4);",
    "background:rgba(255,190,77,.12);color:#ffbe4d;font:800 9px Orbitron,sans-serif;cursor:pointer}",
    "#sa-combat-log-box .sa-cl-emo{position:absolute;left:8px;right:8px;bottom:42px;max-height:140px;overflow:auto;",
    "padding:6px;background:#0a0e1af7;border:1px solid rgba(255,190,77,.35);z-index:6;display:none}",
    "#sa-combat-log-box .sa-cl-emo.on{display:block}",
    "#sa-combat-log-box .sa-cl-emo b{display:block;color:#ffbe4d;font:700 8px Orbitron,sans-serif;margin:4px 0 2px}",
    "#sa-combat-log-box .sa-cl-emo i{cursor:pointer;font-style:normal;font-size:16px;padding:2px}",
    "#sa-combat-log-box .sa-cl-row{line-height:1.4;border-bottom:1px solid rgba(255,190,77,.1);padding:4px 2px 6px;",
    "font-weight:600;font-family:ui-sans-serif,system-ui,sans-serif;color:rgba(232,217,168,.85);overflow-wrap:anywhere}",
    "#sa-combat-log-box .sa-cl-row .t{color:rgba(200,184,138,.45);font:600 .9em ui-monospace,Menlo,monospace}",
    "#sa-combat-log-box .sa-cl-acts{display:inline-flex;align-items:center;gap:3px;margin-left:6px;vertical-align:middle}",
    "#sa-combat-log-box .sa-cl-copy{appearance:none;display:inline-flex;align-items:center;justify-content:center;",
    "width:20px;height:20px;padding:0;border:1px solid rgba(255,190,77,.35);background:transparent;color:#ffbe4d;cursor:pointer}",
    "#sa-combat-log-box .sa-cl-copy:hover{background:rgba(255,190,77,.12)}",
    "#sa-combat-log-box .sa-cl-copy svg{width:12px;height:12px;display:block}",
    "#sa-combat-log-box .sa-cl-dmg{display:inline-flex;align-items:center;gap:8px;margin-left:6px;vertical-align:middle}",
    "#sa-combat-log-box .sa-cl-dmg i{display:inline-flex;align-items:center;gap:3px;font:800 11px Orbitron,sans-serif;font-style:normal}",
    "#sa-combat-log-box .sa-cl-dmg i.hp{color:#f87171}",
    "#sa-combat-log-box .sa-cl-dmg i.sp{color:#32feff}",
    "#sa-combat-log-box .sa-cl-dmg svg{width:12px;height:12px}",
    "#sa-combat-log-box .sa-cl-empty{color:rgba(200,184,138,.4)}",
    "#sa-combat-log-box .sa-cl-resize{position:absolute;right:2px;bottom:2px;width:14px;height:14px;cursor:nwse-resize;z-index:4;",
    "background:linear-gradient(135deg,transparent 50%,rgba(255,190,77,.55) 50%)}",
  ].join("");

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function injectCss() {
    let st = document.getElementById("sa-cl-style");
    if (!st) {
      st = document.createElement("style");
      st.id = "sa-cl-style";
      (document.documentElement || document.head).appendChild(st);
    }
    if (st.textContent !== CSS) st.textContent = CSS;
  }

  function footerClearance() {
    const f =
      document.querySelector('[class~="_footer_1qpfc_762"]') ||
      document.querySelector('[class*="_footer_1qpfc_"]');
    if (!f) return 16;
    const r = f.getBoundingClientRect();
    if (r.height > 0 && r.top < window.innerHeight && r.bottom > 0) {
      return Math.max(16, Math.round(window.innerHeight - r.top + 8));
    }
    return 16;
  }

  function inGame() {
    return !!(
      document.querySelector('[class*="fleetRail"]') ||
      document.querySelector('[class*="headerEcho"]') ||
      document.querySelector('[class*="dominionHeader"]') ||
      document.querySelector('[class*="_dock_opoyo_"]') ||
      document.querySelector('[class*="_pill_opoyo_"]') ||
      document.querySelector('[class*="menuContent"]') ||
      document.querySelector('[class*="_menu_1qpfc_"]')
    );
  }

  function hiddenPref() {
    try {
      return localStorage.getItem(HIDE_KEY) === "1";
    } catch {
      return false;
    }
  }

  function q(sel, root) {
    return (root || document).querySelector(sel);
  }
  function qa(sel, root) {
    return [...(root || document).querySelectorAll(sel)];
  }

  function readJson(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || "null");
    } catch {
      return null;
    }
  }
  function writeJson(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (_) {}
  }

  const combat = [];
  let tab = "combat";
  let min = false;
  let box = null;
  let chip = null;

  function clock() {
    return new Date().toLocaleTimeString("en-US", { hour12: false });
  }

  function fontPx() {
    try {
      const v = parseFloat(localStorage.getItem(FONT_KEY));
      if (Number.isFinite(v)) return Math.max(9, Math.min(22, v));
    } catch (_) {}
    return 11;
  }

  function applyFont() {
    if (!box) return;
    box.style.setProperty("--sa-cl-fs", fontPx() + "px");
  }

  function bumpFont(delta) {
    const next = Math.max(9, Math.min(22, fontPx() + delta));
    try {
      localStorage.setItem(FONT_KEY, String(next));
    } catch (_) {}
    applyFont();
  }

  const EMOJI = [
    { label: "Smileys", emojis: Array.from("😀😃😄😁😆😅😂🤣😊😇🙂😉😍😘😎🤩🥳😢😭😡🤯👍") },
    { label: "Space", emojis: Array.from("⭐✨⚡🔥💥🚀🛸🌍🪐⛽🔧🛡️⚔️🎯🗺️💎🏆📦💰📡🔍") },
    { label: "Signs", emojis: Array.from("✅❌❓❗⚠️🚫🔔📢💬👌✌️🤞👏🙌🙏💪👀❤️") },
  ];

  let dmAddr = null;
  let lastChatSig = "";
  let chatGroup = "channels";
  let showHidden = false;
  let replyTo = null;
  let menuEl = null;

  const PUBLIC_CHANS = [
    { id: "Galia", name: "Galia" },
    { id: "MUD", name: "MUD" },
    { id: "ONI", name: "ONI" },
    { id: "Ustur", name: "Ustur" },
  ];
  const TEAM_FALLBACK = [
    { id: "community:Arcade", name: "Arcade" },
    { id: "community:Vanguard", name: "Vanguard" },
  ];

  function ink() {
    return window.__SA_INK__ || null;
  }
  function inkDm() {
    return window.__SA_INK_DM__ || null;
  }
  function inkSet() {
    return window.__SA_INK_SET__ || null;
  }
  function readSig(v) {
    return typeof v === "function" ? v() : v;
  }
  function shortAddr(a) {
    const s = String(a || "");
    return s.length > 10 ? s.slice(0, 4) + "…" + s.slice(-4) : s;
  }

  function settingsKey() {
    try {
      const keys = Object.keys(localStorage).filter((k) => k.indexOf("ink-chat-settings:") === 0);
      return keys[0] || "ink-chat-settings:default";
    } catch {
      return "ink-chat-settings:default";
    }
  }

  function loadRawSet() {
    try {
      return JSON.parse(localStorage.getItem(settingsKey()) || "{}") || {};
    } catch {
      return {};
    }
  }

  function saveRawSet(s) {
    try {
      localStorage.setItem(settingsKey(), JSON.stringify(s));
    } catch (_) {}
  }

  function myWallet() {
    const k = settingsKey();
    const w = k.slice("ink-chat-settings:".length);
    return w && w !== "default" ? w : "";
  }

  function isBlocked(addr) {
    const a = String(addr || "");
    const api = inkSet();
    if (api && typeof api.isBlocked === "function") return !!api.isBlocked(a);
    return (loadRawSet().blocked || []).some((b) => String(b.address) === a);
  }

  function isHidden(name) {
    const n = String(name || "");
    const api = inkSet();
    if (api && typeof api.isChannelVisible === "function") return !api.isChannelVisible(n);
    return (loadRawSet().hiddenChannels || []).indexOf(n) >= 0;
  }

  function blockUser(addr) {
    const a = String(addr || "");
    const api = inkSet();
    if (api && api.blockUser) {
      api.blockUser(a);
      return;
    }
    const s = loadRawSet();
    s.blocked = s.blocked || [];
    if (!s.blocked.some((b) => String(b.address) === a)) s.blocked.push({ address: a, blockedAt: Date.now() });
    saveRawSet(s);
  }

  function unblockUser(addr) {
    const a = String(addr || "");
    const api = inkSet();
    if (api && api.unblockUser) {
      api.unblockUser(a);
      return;
    }
    const s = loadRawSet();
    s.blocked = (s.blocked || []).filter((b) => String(b.address) !== a);
    saveRawSet(s);
  }

  function toggleHide(name) {
    const n = String(name || "");
    const api = inkSet();
    if (api && api.toggleChannel) {
      api.toggleChannel(n);
      return;
    }
    const s = loadRawSet();
    const set = new Set(s.hiddenChannels || []);
    if (set.has(n)) set.delete(n);
    else set.add(n);
    s.hiddenChannels = Array.from(set);
    saveRawSet(s);
  }

  function addContact(addr, label) {
    const a = String(addr || "");
    const api = inkSet();
    if (api && api.addContact) {
      api.addContact(a, label || "");
      return;
    }
    const s = loadRawSet();
    s.contacts = s.contacts || [];
    if (!s.contacts.some((c) => String(c.address) === a)) {
      s.contacts.push({ address: a, label: label || "", addedAt: Date.now() });
    }
    saveRawSet(s);
  }

  function identFor(msg) {
    const sender = String((msg && msg.sender) || "");
    const idx = window.__SA_IDENTITY__;
    try {
      if (idx) {
        const byP = idx.byProfile;
        const claim = msg && msg.profileClaim;
        if (claim && byP) {
          const p = typeof byP.get === "function" ? byP.get(claim) : byP[claim];
          if (p && (!p.authority || String(p.authority) === sender)) {
            return { name: p.name || null, faction: p.faction || null };
          }
        }
        const byW = idx.byWallet;
        if (byW) {
          const w = typeof byW.get === "function" ? byW.get(sender) : byW[sender];
          if (w) return { name: w.name || null, faction: w.faction || null };
        }
      }
    } catch (_) {}
    return { name: (msg && msg.name) || null, faction: (msg && msg.faction) || null };
  }

  function displayName(msg) {
    const n = String(identFor(msg).name || "").trim();
    return n || shortAddr(msg && msg.sender);
  }

  function factionOf(f) {
    if (f == null || f === "") return null;
    const n = Number(f);
    if (n === 1) return "MUD";
    if (n === 2) return "ONI";
    if (n === 3) return "Ustur";
    const s = String(f).toLowerCase();
    if (s === "mud" || s === "1") return "MUD";
    if (s === "oni" || s === "2") return "ONI";
    if (s === "ustur" || s === "ust" || s === "3") return "Ustur";
    return null;
  }

  function facBadge(faction) {
    const f = factionOf(faction);
    if (f === "MUD") return '<span class="sa-fac sa-fac-mud" title="MUD">M</span>';
    if (f === "ONI") return '<span class="sa-fac sa-fac-oni" title="ONI">O</span>';
    if (f === "Ustur") return '<span class="sa-fac sa-fac-ustur" title="Ustur">U</span>';
    return '<span class="sa-fac sa-fac-none" title="Unaligned">·</span>';
  }

  function teamChannels() {
    const api = ink();
    const out = [];
    try {
      const extra = api && api.communityChannels ? api.communityChannels() : [];
      (extra || []).forEach((ch) => {
        if (ch && ch.name) out.push({ id: "community:" + ch.name, name: ch.name });
      });
    } catch (_) {}
    if (!out.length) return TEAM_FALLBACK.slice();
    return out;
  }

  function channelList() {
    return chatGroup === "teams" ? teamChannels() : PUBLIC_CHANS.slice();
  }

  function activeChanId() {
    const api = ink();
    if (!api || !api.activeChannel) return "Galia";
    return String(readSig(api.activeChannel) || "Galia");
  }

  function chatMessages() {
    if (dmAddr) {
      const dm = inkDm();
      if (!dm || !dm.getMessages) return [];
      return readSig(dm.getMessages(dmAddr)) || [];
    }
    const api = ink();
    if (!api || !api.messages) return [];
    return readSig(api.messages) || [];
  }

  function ensureChatShell(pane, kind) {
    if (pane.dataset.shell === kind) return;
    pane.dataset.shell = kind;
    if (String(kind).indexOf("comms") === 0) {
      pane.innerHTML =
        '<div class="sa-cl-sub" data-sub>' +
        '<button type="button" data-grp="channels">Channels</button>' +
        '<button type="button" data-grp="teams">Teams</button></div>' +
        '<div class="sa-cl-chans" data-chans></div>' +
        '<div class="sa-cl-msgs" data-msgs></div>' +
        '<div class="sa-cl-emo" data-emo></div>' +
        '<div class="sa-cl-compose">' +
        '<button type="button" data-emo-btn title="Emoji">☺</button>' +
        '<input type="text" maxlength="500" placeholder="Message…" data-in />' +
        '<button type="button" data-send>SEND</button></div>';
      pane.querySelectorAll("[data-grp]").forEach((b) => {
        b.onclick = () => setChatGroup(b.dataset.grp);
      });
      const emo = q("[data-emo]", pane);
      EMOJI.forEach((cat) => {
        const b = document.createElement("b");
        b.textContent = cat.label;
        emo.appendChild(b);
        cat.emojis.forEach((em) => {
          if (!em.trim()) return;
          const i = document.createElement("i");
          i.textContent = em;
          i.onclick = () => {
            const inp = q("[data-in]", pane);
            if (inp) inp.value += em;
          };
          emo.appendChild(i);
        });
      });
      q("[data-emo-btn]", pane).onclick = () => emo.classList.toggle("on");
      q("[data-send]", pane).onclick = () => sendChat(pane);
      q("[data-in]", pane).addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          sendChat(pane);
        }
      });
    } else {
      pane.innerHTML = '<div class="sa-cl-chans" data-people></div>';
    }
  }

  function sendChat(pane) {
    const inp = q("[data-in]", pane);
    const text = inp ? String(inp.value || "").trim() : "";
    if (!text) return;
    if (dmAddr && inkDm() && inkDm().sendDM) {
      Promise.resolve(inkDm().sendDM(text, dmAddr)).catch(() => {});
    } else if (ink() && ink().sendMessage) {
      const opts = replyTo && replyTo.pubkey ? { replyTo: replyTo.pubkey } : void 0;
      Promise.resolve(ink().sendMessage(text, opts)).catch(() => {});
    }
    replyTo = null;
    if (inp) inp.value = "";
    const emo = q("[data-emo]", pane);
    if (emo) emo.classList.remove("on");
    setTimeout(() => paintChat(true), 300);
  }

  function closeMenu() {
    if (menuEl) {
      try {
        menuEl.remove();
      } catch (_) {}
      menuEl = null;
    }
  }

  function openMenu(x, y, items) {
    closeMenu();
    menuEl = document.createElement("div");
    menuEl.id = "sa-cl-menu";
    items.forEach((it) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = it.label;
      b.onclick = () => {
        closeMenu();
        try {
          it.run();
        } catch (_) {}
      };
      menuEl.appendChild(b);
    });
    document.body.appendChild(menuEl);
    const w = menuEl.offsetWidth || 168;
    const h = menuEl.offsetHeight || 80;
    const vw = window.innerWidth || 800;
    const vh = window.innerHeight || 600;
    menuEl.style.left = Math.min(vw - w - 8, Math.max(8, x)) + "px";
    menuEl.style.top = Math.min(vh - h - 8, Math.max(8, y)) + "px";
  }

  function pickChannel(ch) {
    dmAddr = null;
    try {
      ink() && ink().setActiveChannel && ink().setActiveChannel(ch.id);
    } catch (_) {}
    lastChatSig = "";
    paintChat(true);
  }

  function setChatGroup(grp) {
    chatGroup = grp === "teams" ? "teams" : "channels";
    dmAddr = null;
    try {
      const api = ink();
      if (api && api.setActiveChannel) {
        const cur = String(activeChanId() || "");
        if (chatGroup === "channels" && cur.indexOf("community:") === 0) {
          api.setActiveChannel("Galia");
        } else if (chatGroup === "teams" && cur.indexOf("community:") !== 0) {
          const teams = teamChannels();
          if (teams[0]) api.setActiveChannel(teams[0].id);
        }
      }
    } catch (_) {}
    lastChatSig = "";
    paintChat(true);
  }

  function paintChat(force) {
    const pane = q('[data-pane="comms"]', box);
    if (!pane) return;
    ensureChatShell(pane, "comms-v4");
    const active = dmAddr ? "dm:" + dmAddr : activeChanId();
    pane.querySelectorAll("[data-grp]").forEach((b) => {
      b.classList.toggle("on", b.dataset.grp === chatGroup);
    });
    const chans = channelList();
    const row = q("[data-chans]", pane);
    const vis = chans.filter((ch) => showHidden || !isHidden(ch.name));
    const sigCh = chatGroup + ":" + active + ":" + vis.map((c) => c.name).join(",") + ":" + (showHidden ? "1" : "0");
    if (row && (force || row.dataset.sig !== sigCh)) {
      row.dataset.sig = sigCh;
      row.innerHTML = "";
      vis.forEach((ch) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "sa-cl-chip" + (active === ch.id ? " on" : "") + (isHidden(ch.name) ? " dim" : "");
        b.textContent = ch.name;
        b.title = "Click to open · right-click hide/show";
        b.onclick = () => pickChannel(ch);
        b.oncontextmenu = (e) => {
          e.preventDefault();
          e.stopPropagation();
          openMenu(e.clientX, e.clientY, [
            {
              label: isHidden(ch.name) ? "Show " + ch.name : "Hide " + ch.name,
              run: () => {
                toggleHide(ch.name);
                paintChat(true);
              },
            },
          ]);
        };
        row.appendChild(b);
      });
      const more = document.createElement("button");
      more.type = "button";
      more.className = "sa-cl-chip";
      more.textContent = showHidden ? "Hidden ✓" : "Hidden";
      more.title = "Show hidden channels";
      more.onclick = () => {
        showHidden = !showHidden;
        paintChat(true);
      };
      row.appendChild(more);
    }
    const msgs = (chatMessages() || []).filter((m) => !isBlocked(m.sender));
    const sig =
      (dmAddr || active) +
      ":" +
      msgs.length +
      ":" +
      (msgs[msgs.length - 1] && (msgs[msgs.length - 1].pubkey || msgs[msgs.length - 1].timestamp)) +
      ":" +
      (window.__SA_IDENTITY__ ? "id" : "noid");
    const list = q("[data-msgs]", pane);
    if (!list) return;
    if (!force && sig === lastChatSig) return;
    lastChatSig = sig;
    list.innerHTML = "";
    if (!ink() && !inkDm()) {
      list.innerHTML = '<div class="sa-cl-row sa-cl-empty">Chat engine not hooked — reload SAGE after updating the extension.</div>';
      return;
    }
    if (!msgs.length) {
      list.innerHTML = '<div class="sa-cl-row sa-cl-empty">No messages yet.</div>';
      return;
    }
    const me = myWallet();
    msgs.slice(-80).forEach((m) => {
      const r = document.createElement("div");
      r.className = "sa-cl-msg";
      const id = identFor(m);
      const who = displayName(m);
      const body = m.content || m.plaintext || m.text || "";
      const when = m.timestamp ? new Date(Number(m.timestamp)).toLocaleTimeString("en-US", { hour12: false }) : "";
      r.innerHTML =
        facBadge(id.faction) +
        '<span class="who">' +
        esc(who) +
        '</span><span class="when">' +
        esc(when) +
        "</span><div>" +
        esc(body) +
        "</div>";
      r.oncontextmenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const blocked = isBlocked(m.sender);
        const items = [
          {
            label: "Add contact",
            run: () => {
              addContact(m.sender, who);
              if (tab === "contacts") paintContacts();
            },
          },
          {
            label: blocked ? "Unblock" : "Block",
            run: () => {
              if (blocked) unblockUser(m.sender);
              else blockUser(m.sender);
              paintChat(true);
            },
          },
          {
            label: "Copy wallet",
            run: () => {
              try {
                navigator.clipboard.writeText(String(m.sender || ""));
              } catch (_) {}
            },
          },
          {
            label: "Reply",
            run: () => {
              replyTo = m;
              const inp = q("[data-in]", pane);
              if (inp) {
                inp.placeholder = "Reply to " + who + "…";
                inp.focus();
              }
            },
          },
        ];
        if (me && String(m.sender) === me && m.pubkey && ink() && ink().deleteMessage) {
          items.push({
            label: "Delete",
            run: () => {
              Promise.resolve(ink().deleteMessage(m.pubkey)).catch(() => {});
              setTimeout(() => paintChat(true), 800);
            },
          });
        }
        openMenu(e.clientX, e.clientY, items);
      };
      list.appendChild(r);
    });
    list.scrollTop = list.scrollHeight;
  }

  function paintContacts() {
    const pane = q('[data-pane="contacts"]', box);
    if (!pane) return;
    ensureChatShell(pane, "contacts");
    const dm = inkDm();
    let people = [];
    try {
      people = dm && dm.contacts ? readSig(dm.contacts) || [] : [];
    } catch (_) {}
    try {
      const keys = Object.keys(localStorage);
      keys.filter((k) => k.indexOf("ink-chat-settings:") === 0).forEach((k) => {
        const s = JSON.parse(localStorage.getItem(k) || "{}");
        (s.contacts || []).forEach((c) => {
          if (!people.some((p) => String(p.address) === String(c.address))) {
            people.push({
              address: c.address,
              name: c.label || shortAddr(c.address),
              unreadCount: 0,
            });
          }
        });
      });
    } catch (_) {}
    const row = q("[data-people]", pane);
    if (!row) return;
    row.innerHTML = "";
    if (!people.length) {
      row.innerHTML = '<div class="sa-cl-row sa-cl-empty">No contacts yet.</div>';
      return;
    }
    people.forEach((p) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "sa-cl-chip";
      b.textContent =
        displayName({ sender: p.address, name: p.name, profileClaim: p.profileClaim }) +
        (p.unreadCount ? " · " + p.unreadCount : "");
      b.onclick = () => {
        dmAddr = String(p.address);
        try {
          dm && dm.openDM && dm.openDM(p.address);
        } catch (_) {}
        lastChatSig = "";
        showTab("comms");
      };
      row.appendChild(b);
    });
  }

  function showTab(id) {
    tab = id;
    if (!box) return;
    box.querySelectorAll("[data-tab]").forEach((b) => b.classList.toggle("on", b.dataset.tab === id));
    box.querySelectorAll(".sa-cl-body").forEach((el) => {
      el.classList.toggle("on", el.dataset.pane === id);
    });
    const btn = box.querySelector('[data-tab="' + id + '"]');
    if (btn) btn.classList.remove("ping");
    if (id === "flight") paintFlight();
    if (id === "combat") paintCombat();
    if (id === "comms") paintChat(true);
    if (id === "contacts") paintContacts();
  }

  function combatSentence(e) {
    const who = e.attacker || "";
    const tgt = e.target || "target";
    const type = String(e.type || "");
    if (type === "PENDING") return (who ? who + " is attacking " : "Attacking ") + tgt + "…";
    if (type === "HIT") return (who ? who + " hit " : "Hit ") + tgt;
    if (type === "ABSORBED") return tgt + " absorbed the hit";
    if (type === "MISS") return (who ? who + " missed " : "Missed ") + tgt;
    if (type === "FLEE") return tgt + " fled";
    if (type === "CAPTURE") return "Captured " + tgt;
    if (type === "FAIL") return e.msg || ("Attack on " + tgt + " failed");
    return e.msg || type;
  }

  const EXPLORER_TX = "https://solana.fm/tx/";
  const EXPLORER_QS = "?cluster=custom-rpc1.z.ink";
  const SIG_RE = /[1-9A-HJ-NP-Za-km-z]{80,90}/;

  function sigFromTx(raw) {
    const s = String(raw || "").trim();
    if (!s) return "";
    if (/^[1-9A-HJ-NP-Za-km-z]{80,90}$/.test(s)) return s;
    try {
      const o = JSON.parse(s);
      const cand = o.signature || o.txid || o.signatureStatus || (o.result && o.result.signature);
      if (typeof cand === "string") {
        const m = cand.match(SIG_RE);
        if (m) return m[0];
      }
    } catch (_) {}
    const m = s.match(SIG_RE);
    return m ? m[0] : "";
  }

  function explorerLink(raw) {
    const sig = sigFromTx(raw);
    return sig ? EXPLORER_TX + sig + EXPLORER_QS : "";
  }

  function copyText(t) {
    const s = String(t || "");
    if (!s) return;
    const done = () => {};
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(s).then(done).catch(() => {
        const ta = document.createElement("textarea");
        ta.value = s;
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand("copy");
        } catch (_) {}
        ta.remove();
      });
      return;
    }
    const ta = document.createElement("textarea");
    ta.value = s;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
    } catch (_) {}
    ta.remove();
  }

  function paintCombat() {
    const pane = q('[data-pane="combat"]', box);
    if (!pane) return;
    pane.innerHTML = "";
    if (!combat.length) {
      pane.innerHTML = '<div class="sa-cl-row sa-cl-empty">No combat yet.</div>';
      return;
    }
    combat.slice().reverse().forEach((e) => {
      const r = document.createElement("div");
      r.className = "sa-cl-row";
      const type = String(e.type || "EVENT");
      let col = "rgba(232,217,168,.85)";
      if (type === "PENDING") col = "#ffbe4d";
      else if (type === "HIT") col = "#f87171";
      else if (type === "ABSORBED") col = "#32feff";
      else if (type === "MISS") col = "#9ca3af";
      else if (type === "FLEE") col = "#fbbf24";
      else if (type === "CAPTURE") col = "#34d399";
      else if (type === "FAIL") col = "#f87171";
      const time = document.createElement("span");
      time.className = "t";
      time.textContent = "[" + (e.at || "") + "] ";
      const body = document.createElement("span");
      body.style.color = col;
      body.textContent = combatSentence(e);
      r.appendChild(time);
      r.appendChild(body);
      if (type === "HIT" || type === "ABSORBED") {
        const hp = Number.isFinite(Number(e.damageHp)) ? Math.round(Number(e.damageHp)) : 0;
        const sp = Number.isFinite(Number(e.damageSp)) ? Math.round(Number(e.damageSp)) : 0;
        const dmg = document.createElement("span");
        dmg.className = "sa-cl-dmg";
        const ns = "http://www.w3.org/2000/svg";
        const icon = (d, color) => {
          const svg = document.createElementNS(ns, "svg");
          svg.setAttribute("viewBox", "0 0 24 24");
          svg.setAttribute("width", "12");
          svg.setAttribute("height", "12");
          svg.style.width = "12px";
          svg.style.height = "12px";
          const p = document.createElementNS(ns, "path");
          p.setAttribute("d", d);
          p.setAttribute("fill", color);
          svg.appendChild(p);
          return svg;
        };
        const pill = (cls, color, d, n) => {
          const i = document.createElement("i");
          i.className = cls;
          i.style.color = color;
          i.appendChild(icon(d, color));
          i.appendChild(document.createTextNode(" −" + n.toLocaleString()));
          return i;
        };
        const heart =
          "M12.1 21.35S2.4 14.2 2.4 8.7C2.4 5.6 4.8 3.5 7.7 3.5c1.7 0 3.2.8 4.4 2.2C13.3 4.3 14.8 3.5 16.5 3.5c2.9 0 5.3 2.1 5.3 5.2 0 5.5-9.7 12.65-9.7 12.65z";
        const shield = "M12 2.2l8.2 3.2v6.4c0 5.5-3.6 10.5-8.2 12-4.6-1.5-8.2-6.5-8.2-12V5.4L12 2.2z";
        dmg.appendChild(pill("sp", "#32feff", shield, sp));
        dmg.appendChild(pill("hp", "#f87171", heart, hp));
        r.appendChild(dmg);
      }
      if (e.tx) {
        const sig = sigFromTx(e.tx);
        const link = explorerLink(e.tx);
        const acts = document.createElement("span");
        acts.className = "sa-cl-acts";
        const iconBtn = (title, svgChild, onClick) => {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "sa-cl-copy";
          b.title = title;
          b.appendChild(svgChild);
          b.addEventListener("click", (ev) => {
            ev.stopPropagation();
            onClick(b);
          });
          return b;
        };
        const ns = "http://www.w3.org/2000/svg";
        const path = (d, stroke) => {
          const svg = document.createElementNS(ns, "svg");
          svg.setAttribute("viewBox", "0 0 24 24");
          svg.setAttribute("width", "12");
          svg.setAttribute("height", "12");
          const p = document.createElementNS(ns, "path");
          p.setAttribute("d", d);
          if (stroke) {
            p.setAttribute("fill", "none");
            p.setAttribute("stroke", "currentColor");
            p.setAttribute("stroke-width", "2");
            p.setAttribute("stroke-linecap", "round");
            p.setAttribute("stroke-linejoin", "round");
          } else {
            p.setAttribute("fill", "currentColor");
          }
          svg.appendChild(p);
          return svg;
        };
        if (link) {
          acts.appendChild(
            iconBtn("Open in Solana.fm (Zink)", path("M14 5h5v5M19 5l-7 7M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4", true), () => {
              window.open(link, "_blank", "noopener,noreferrer");
            }),
          );
        }
        acts.appendChild(
          iconBtn(sig ? "Copy transaction ID" : "Copy error", path("M8 4h8v2H8V4zm-2 4h12a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V10a2 2 0 012-2z", true), (b) => {
            copyText(sig || e.tx);
            b.title = "Copied";
            setTimeout(() => {
              b.title = sig ? "Copy transaction ID" : "Copy error";
            }, 900);
          }),
        );
        r.appendChild(acts);
      }
      pane.appendChild(r);
    });
  }

  function paintFlight() {
    const pane = q('[data-pane="flight"]', box);
    if (!pane) return;
    const ev =
      (window.__SA_FLIGHT_LOG__ && window.__SA_FLIGHT_LOG__.get && window.__SA_FLIGHT_LOG__.get()) || [];
    pane.innerHTML = "";
    if (!ev.length) {
      pane.innerHTML = '<div class="sa-cl-row sa-cl-empty">No flight orders yet.</div>';
      return;
    }
    ev.slice()
      .reverse()
      .forEach((e) => {
        const r = document.createElement("div");
        r.className = "sa-cl-row";
        const t = e.at ? new Date(e.at).toLocaleTimeString("en-US", { hour12: false }) : "";
        r.innerHTML =
          '<span class="t">[' +
          esc(t) +
          "]</span> <b>" +
          esc(e.type || "LOG") +
          "</b> " +
          esc(e.msg || e.dest || "");
        pane.appendChild(r);
      });
  }

  function ping(which) {
    if (chip) chip.classList.add("live");
    if (box && tab !== which) {
      const btn = box.querySelector('[data-tab="' + which + '"]');
      if (btn) btn.classList.add("ping");
    }
  }

  function logCombat(e) {
    const ev = {
      at: clock(),
      type: (e && (e.type || e.kind)) || "EVENT",
      target: (e && (e.target || e.systemName || e.fleetLabel)) || "",
      attacker: (e && e.attacker) || "",
      msg: (e && e.msg) || "",
      tx: (e && e.tx) || "",
      damage: Number(e && e.damage) || 0,
      damageKind: (e && e.damageKind) || "HP",
      damageHp: Number(e && e.damageHp) || 0,
      damageSp: Number(e && e.damageSp) || 0,
      id: e && e.id,
    };
    if (ev.id && ev.type !== "PENDING") {
      const i = combat.findIndex((x) => x.id && String(x.id) === String(ev.id));
      if (i >= 0) {
        const prev = combat[i];
        combat[i] = Object.assign({}, prev, ev);
        if (!ev.tx) combat[i].tx = prev.tx;
        if (!ev.attacker) combat[i].attacker = prev.attacker;
        if (!ev.damageHp && prev.damageHp) combat[i].damageHp = prev.damageHp;
        if (!ev.damageSp && prev.damageSp) combat[i].damageSp = prev.damageSp;
        if (tab === "combat" && !min) paintCombat();
        ping("combat");
        return;
      }
    }
    combat.push(ev);
    if (combat.length > 80) combat.shift();
    if (tab === "combat" && !min) paintCombat();
    ping("combat");
  }

  function saveBox() {
    if (!box) return;
    writeJson(POS_KEY, {
      left: parseFloat(box.style.left),
      top: parseFloat(box.style.top),
      w: box.offsetWidth,
      h: box.offsetHeight,
    });
  }

  function saveChip() {
    if (!chip) return;
    writeJson(CHIP_KEY, {
      left: parseFloat(chip.style.left),
      top: parseFloat(chip.style.top),
    });
  }

  function clampIntoView(el, pad) {
    if (!el) return;
    const p = pad == null ? 8 : pad;
    const r = el.getBoundingClientRect();
    const vw = window.innerWidth || 800;
    const vh = window.innerHeight || 600;
    const w = Math.max(40, Math.min(r.width || 80, vw - p * 2));
    const h = Math.max(28, Math.min(r.height || 40, vh - p * 2));
    let L = parseFloat(el.style.left);
    let T = parseFloat(el.style.top);
    if (!Number.isFinite(L)) L = r.left;
    if (!Number.isFinite(T)) T = r.top;
    const maxL = Math.max(p, vw - w - p);
    const maxT = Math.max(p, vh - h - p);
    el.style.left = Math.min(maxL, Math.max(p, L)) + "px";
    el.style.top = Math.min(maxT, Math.max(p, T)) + "px";
    el.style.right = "auto";
    el.style.bottom = "auto";
  }

  function clampBox() {
    clampIntoView(box, 8);
  }

  function clampChip() {
    clampIntoView(chip, 8);
  }

  function applySavedBox() {
    const p = readJson(POS_KEY);
    if (!p || !box) return;
    if (Number.isFinite(p.left) && Number.isFinite(p.top)) {
      box.style.left = p.left + "px";
      box.style.top = p.top + "px";
      box.style.right = "auto";
      box.style.bottom = "auto";
    }
    if (Number.isFinite(p.w)) box.style.width = p.w + "px";
    if (Number.isFinite(p.h)) box.style.height = p.h + "px";
    clampBox();
  }

  function applySavedChip() {
    const p = readJson(CHIP_KEY);
    if (!p || !chip) return;
    if (Number.isFinite(p.left) && Number.isFinite(p.top)) {
      chip.style.left = p.left + "px";
      chip.style.top = p.top + "px";
      chip.style.bottom = "auto";
    }
    clampChip();
  }

  function setMin(on) {
    min = !!on;
    if (!box || !chip) return;
    box.classList.toggle("sa-cl-hidden", min);
    chip.classList.toggle("on", min);
    if (!min) chip.classList.remove("live");
    if (min) closeMenu();
    if (min && box) {
      const pop = q("[data-fontpop]", box);
      if (pop) pop.classList.remove("on");
    }
    placeChip();
    if (min) clampChip();
  }

  function placeChip() {
    if (!chip) return;
    if (!chip.style.top) chip.style.bottom = footerClearance() + "px";
    if (box && !box.style.top) box.style.bottom = footerClearance() + "px";
  }

  function bindDrag(handle, el, onSave) {
    let drag = false;
    let moved = false;
    let ox = 0;
    let oy = 0;
    let sx = 0;
    let sy = 0;
    handle.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      if (e.target.closest && e.target.closest("button") && e.target.closest("button") !== el) return;
      drag = true;
      moved = false;
      const r = el.getBoundingClientRect();
      ox = e.clientX;
      oy = e.clientY;
      sx = r.left;
      sy = r.top;
      el.style.left = sx + "px";
      el.style.top = sy + "px";
      el.style.right = "auto";
      el.style.bottom = "auto";
      try {
        handle.setPointerCapture(e.pointerId);
      } catch (_) {}
      e.preventDefault();
    });
    handle.addEventListener("pointermove", (e) => {
      if (!drag) return;
      const dx = e.clientX - ox;
      const dy = e.clientY - oy;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) moved = true;
      el.style.left = sx + dx + "px";
      el.style.top = sy + dy + "px";
      clampIntoView(el, 8);
    });
    const up = () => {
      if (!drag) return;
      drag = false;
      clampIntoView(el, 8);
      if (moved && onSave) onSave();
    };
    handle.addEventListener("pointerup", up);
    handle.addEventListener("pointercancel", up);
  }

  function mount() {
    injectCss();
    if (!document.body) return;
    if (!chip) {
      chip = document.createElement("button");
      chip.id = "sa-cl-chip";
      chip.className = "typing";
      chip.type = "button";
      chip.title = "SAGE log — drag to move · click to open";
      chip.innerHTML = "<i></i><i></i><i></i><span class='sa-cl-pip'></span>";
      chip.addEventListener("click", (e) => {
        if (chip.dataset.dragged === "1") {
          chip.dataset.dragged = "";
          return;
        }
        setMin(false);
      });
      document.body.appendChild(chip);
      bindDrag(chip, chip, () => {
        chip.dataset.dragged = "1";
        saveChip();
      });
      applySavedChip();
    }
    if (!box) {
      box = document.createElement("div");
      box.id = "sa-combat-log-box";
      box.innerHTML =
        '<div class="sa-cl-tabs">' +
        '<span class="sa-cl-grip" title="Drag">⠿</span>' +
        '<button type="button" data-tab="combat" class="on">Combat</button>' +
        '<button type="button" data-tab="flight">Flight</button>' +
        '<button type="button" data-tab="comms">Comms</button>' +
        '<button type="button" data-tab="contacts">Contacts</button>' +
        '<span class="sa-cl-ctl">' +
        '<button type="button" class="sa-cl-ico" data-more title="Text size">⋮</button>' +
        '<button type="button" class="sa-cl-ico" data-min title="Minimize">−</button>' +
        '<div class="sa-cl-fontpop" data-fontpop>' +
        '<button type="button" data-font="down" title="Smaller text">A−</button>' +
        '<button type="button" data-font="up" title="Bigger text">A+</button></div></span>' +
        "</div>" +
        '<div class="sa-cl-body on" data-pane="combat"></div>' +
        '<div class="sa-cl-body" data-pane="flight"></div>' +
        '<div class="sa-cl-body" data-pane="comms"></div>' +
        '<div class="sa-cl-body" data-pane="contacts"></div>' +
        '<div class="sa-cl-resize" title="Resize"></div>';
      document.body.appendChild(box);
      const tabs = q(".sa-cl-tabs", box);
      tabs.addEventListener("click", (e) => {
        const more = e.target.closest("[data-more]");
        const font = e.target.closest("[data-font]");
        const pop = q("[data-fontpop]", box);
        if (font) {
          e.stopPropagation();
          bumpFont(font.getAttribute("data-font") === "up" ? 1 : -1);
          return;
        }
        if (more) {
          e.stopPropagation();
          if (pop) pop.classList.toggle("on");
          return;
        }
        if (pop) pop.classList.remove("on");
        const b = e.target.closest("[data-tab]");
        if (b) showTab(b.dataset.tab);
        if (e.target.closest("[data-min]")) setMin(true);
      });
      bindDrag(tabs, box, saveBox);
      tabs.addEventListener("dblclick", (e) => {
        if (e.target && e.target.closest && e.target.closest("button")) return;
        box.style.left = "";
        box.style.top = "";
        box.style.right = "";
        box.style.bottom = "";
        box.style.width = "";
        box.style.height = "";
        try {
          localStorage.removeItem(POS_KEY);
        } catch (_) {}
        placeChip();
      });
      applySavedBox();
      applyFont();
      const rz = q(".sa-cl-resize", box);
      let rd = false;
      let rw = 0;
      let rh = 0;
      let rx = 0;
      let ry = 0;
      rz.addEventListener("pointerdown", (e) => {
        rd = true;
        rx = e.clientX;
        ry = e.clientY;
        rw = box.offsetWidth;
        rh = box.offsetHeight;
        try {
          rz.setPointerCapture(e.pointerId);
        } catch (_) {}
        e.preventDefault();
        e.stopPropagation();
      });
      rz.addEventListener("pointermove", (e) => {
        if (!rd) return;
        box.style.width = Math.max(300, rw + (e.clientX - rx)) + "px";
        box.style.height = Math.max(220, rh + (e.clientY - ry)) + "px";
      });
      rz.addEventListener("pointerup", () => {
        if (rd) saveBox();
        rd = false;
      });
      paintCombat();
    }
    const hide = hiddenPref() || !inGame();
    if (hide) {
      box.classList.add("sa-cl-hidden");
      chip.classList.remove("on");
    } else {
      box.classList.toggle("sa-cl-hidden", min);
      chip.classList.toggle("on", min);
    }
    placeChip();
    if (!hide && !min && tab === "comms") {
      try {
        paintChat();
      } catch (_) {}
    }
    if (!hide && !min && tab === "contacts") {
      try {
        paintContacts();
      } catch (_) {}
    }
  }

  window.__SA_LOG_COMBAT_EVENT = function (e) {
    logCombat(e || {});
  };
  window.__SA_LOG_COMBAT_EVENT.showTab = showTab;
  window.__SA_LOG_COMBAT_EVENT.setVisible = function (on) {
    try {
      if (on) localStorage.removeItem(HIDE_KEY);
      else localStorage.setItem(HIDE_KEY, "1");
    } catch (_) {}
    mount();
  };
  window.__SA_LOG_COMBAT_EVENT.isVisible = function () {
    return !hiddenPref();
  };
  window.__SA_FLIGHT_LOG__ = window.__SA_FLIGHT_LOG__ || {
    _e: [],
    push(e) {
      this._e.push(Object.assign({ at: Date.now() }, e));
      if (this._e.length > 200) this._e.shift();
      if (tab === "flight") paintFlight();
    },
    get() {
      return this._e.slice();
    },
    clear() {
      this._e = [];
    },
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
  setInterval(() => {
    if (document.visibilityState !== "visible") return;
    mount();
  }, 400);
  window.addEventListener("resize", () => {
    placeChip();
    clampChip();
    clampBox();
  });
  document.addEventListener(
    "pointerdown",
    (e) => {
      if (menuEl && !(e.target && e.target.closest && e.target.closest("#sa-cl-menu"))) closeMenu();
      if (box) {
        const pop = q("[data-fontpop]", box);
        if (
          pop &&
          pop.classList.contains("on") &&
          !(e.target && e.target.closest && e.target.closest("[data-more], [data-fontpop]"))
        ) {
          pop.classList.remove("on");
        }
      }
    },
    true,
  );
})();
