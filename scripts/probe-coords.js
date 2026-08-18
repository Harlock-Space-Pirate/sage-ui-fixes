(() => {
  // Paste in the sage.staratlas.com console while a fleet is MOVING (subwarp/warp),
  // or: node scripts/cdp-eval.mjs 9223 "$(cat scripts/probe-coords.js)"
  const sel = window.__SA_SELECTED_FLEET__;
  const key = (sel && sel.key) || null;
  if (!key) return "select a fleet first (click a slot)";
  const df = window.__SA_DERIVED_FLEETS__;
  const der = df && df.getDerivedFleet && df.getDerivedFleet(key);
  const peek = (window.__SA_PEEK_FLEETS__ && window.__SA_PEEK_FLEETS__()) || [];
  const f = peek.find((p) => String(p.address || p.key) === String(key));
  const d = f && f.data;
  const st = d && d.state;
  const f0 = st && st.fields && st.fields[0];
  const j = f0 && (f0.journey || f0);
  const map = window.__SA_PIXI_MAP__;
  const pin = map && map.getFleetWorldPosition && map.getFleetWorldPosition(key);
  const vp = window.__SA_MAP_VIEWPORT__;
  let screen = null, scale = null, pinGame = null;
  try {
    if (vp && pin) {
      screen = vp.toScreen(pin.x, pin.y);
      scale = vp.scale.x;
      const mm = window.__SA_MAP_MATH__;
      if (mm) pinGame = mm.pixelPointToGamePoint(screen, vp.screenHeight, scale);
    }
  } catch (e) { screen = "err:" + e.message; }
  const r2 = (n) => Math.round(Number(n) * 100) / 100;
  return JSON.stringify({
    kind: st && st.__kind,
    derived: der && der.currentCoordinates && [r2(der.currentCoordinates[0]), r2(der.currentCoordinates[1])],
    location: d && d.location && [r2(d.location[0]), r2(d.location[1])],
    dest: j && j.destination && [r2(j.destination[0]), r2(j.destination[1])],
    pinGame: pinGame && [r2(pinGame.x), r2(pinGame.y)],
    pin: pin && [r2(pin.x), r2(pin.y)],
    scale: scale && scale.toFixed(4),
    screenWH: vp && [vp.screenWidth, vp.screenHeight],
  });
})();
