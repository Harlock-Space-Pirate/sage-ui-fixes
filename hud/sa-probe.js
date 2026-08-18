/** Dev probe: ring buffer I can dump from Brave console / popup. LEEKS */
(function () {
  const KEY = "saProbe.v1";
  const FLAG = "saProbe";
  const MAX = 80;
  const buf = [];

  function on() {
    try {
      return localStorage.getItem(FLAG) === "1";
    } catch {
      return false;
    }
  }

  function push(ev, data) {
    const row = {
      t: new Date().toISOString().slice(11, 23),
      ev: String(ev || ""),
      data: data && typeof data === "object" ? data : { v: data },
    };
    buf.push(row);
    if (buf.length > MAX) buf.shift();
    try {
      localStorage.setItem(KEY, JSON.stringify(buf.slice(-40)));
    } catch {
      /* ignore */
    }
    if (on()) {
      try {
        console.log("%c sa-probe %c " + row.t + " " + row.ev, "background:#0a0f19;color:#ffbe4d", "color:#e8d9a8", row.data);
      } catch {
        /* ignore */
      }
      paint();
    }
  }

  function dump() {
    return buf.slice();
  }

  function last() {
    return buf[buf.length - 1] || null;
  }

  function paint() {
    if (!on()) {
      const old = document.getElementById("sa-probe-hud");
      if (old) old.remove();
      return;
    }
    let el = document.getElementById("sa-probe-hud");
    if (!el) {
      el = document.createElement("pre");
      el.id = "sa-probe-hud";
      el.style.cssText =
        "position:fixed;left:8px;bottom:8px;z-index:2147483647;max-width:min(420px,46vw);max-height:28vh;overflow:auto;" +
        "margin:0;padding:6px 8px;background:#0a0e1af2;border:1px solid #ffbe4d;color:#e8d9a8;" +
        "font:700 10px/1.35 ui-monospace,Menlo,monospace;pointer-events:none;white-space:pre-wrap";
      (document.body || document.documentElement).appendChild(el);
    }
    el.textContent = buf
      .slice(-8)
      .map((r) => r.t + " " + r.ev + " " + JSON.stringify(r.data))
      .join("\n");
  }

  window.__SA_PROBE__ = {
    push,
    dump,
    last,
    on: () => {
      try {
        localStorage.setItem(FLAG, "1");
      } catch {
        /* ignore */
      }
      paint();
      return "probe ON — reload not required";
    },
    off: () => {
      try {
        localStorage.removeItem(FLAG);
      } catch {
        /* ignore */
      }
      paint();
      return "probe OFF";
    },
    isOn: on,
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", paint);
  else paint();
})();
