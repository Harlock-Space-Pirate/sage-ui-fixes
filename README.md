# SAGE UI Fixes

Client-side browser extension that applies small UI corrections on [sage.staratlas.com](https://sage.staratlas.com). It does not change chain state and does not touch your wallet keys.

**Author:** LEEKS · **Produce Bandit ltd**  
**Not affiliated with Star Atlas, ATMTA, or the official SAGE client.**

**Target client (v2.4.0):** live SAGE **0.0.371** / `assets/index-DmmfP5d6.js` (2026-08-18).

## Credits

### ★ BULLIT — LEGEND PLAQUE ★

```text
  ╔══════════════════════════════════════════════════════════╗
  ║   ★  HIGH SCORE  ★   BULLIT   ★  INSERT COIN  ★          ║
  ║                                                          ║
  ║     READY.                                               ║
  ║     LOAD "*",8,1                                         ║
  ║     SEARCHING FOR BULLIT                                 ║
  ║     LOADING  ████████████████  OK                        ║
  ║     RUN                                                  ║
  ║                                                          ║
  ║     ↑ ↑ ↓ ↓ ← → ← →  B  A  ·  START                     ║
  ║     (Konami Code unlocked: infinite QA continues)        ║
  ╚══════════════════════════════════════════════════════════╝
```

**Bullit** is the reason this ship still warps after every patch.

Commodore kid. Nintendo kid. Grew up on CRT glow, cartridge dust, and the sacred art of *blowing on the contacts and praying*. If the galaxy map glitches, he is already mid-jump.

*Bullit — co-conspirator · idea factory · live-fire tester · void tinkerer · high score forever.*

**Author / shipwright:** LEEKS · **Produce Bandit ltd**

## What it fixes (v2)

- Destroyed fleets lingering on the map / in combat target lists
- Starbase HP bar presentation
- Post-capture ownership / NEUTRAL lag on system views
- Yellow wash from oversized star glows
- PixiJS cull pass that walked the whole scene graph for nothing
- Startup-debug effect that re-ran on every store tick
- Post-attack refetch storm (2s/5s/10s → 1.5s/6s)
- Contested-starbase / AP-depleted attack errors
- Starbase Attack from a Jorvik/Baron-tagged player hull (stock omits FO + FA + econ config on capture)
- Hab-builder diagram pulse (30 fps → 1 Hz) and catalog autoscroll
- Optional warp-trail disable for FPS (`__SA_WARP_TRAILS__.disable()`)
- **Fleet action bar** — one row of stock tiles (stock 3-row fleet panel hidden); drag to move, position saved per screen size. Second row: 8 assignable fleet slots.

v1 fleet bar / combat-log HUD / wings are archived and will return as modules.

## How it works

1. Content script finds `assets/index-*.js`.
2. Background DNR blocks the stock entry.
3. Extension fetches the live minified module, applies once-only string patches, injects it as a MAIN-world ES module.

```text
sage.staratlas.com  →  DNR block entry  →  fetch + patches.js  →  inject MAIN
```

Refresh stock after a SAGE deploy:

```bash
npm run fetch-stock
npm run probe
```

`probe` must print every patch `ok` and `node --check OK`. If SAGE shipped a new hash, update the `find` strings in `patches.js`.

## Install

### Option A — Load unpacked (development / from source)

1. Clone this repository.
2. Chrome → **Extensions** → enable **Developer mode**.
3. **Load unpacked** → select this repository root (the folder that contains `manifest.json`).

### Option B — Release zip (recommended)

1. Download the zip from a [GitHub Release](https://github.com/Harlock-Space-Pirate/sage-ui-fixes/releases) for this project.
2. Unzip it.
3. Chrome → **Load unpacked** → select the unzipped folder.

Only published GitHub Releases for this repository are supported installs.

A new Release is published automatically when `manifest.json` version changes on `main`. Testers only need the zip.

## Permissions

| Permission | Why |
|------------|-----|
| `https://sage.staratlas.com/*` | Only host the extension runs on |
| `scripting` | Inject the patched page module in the page context |
| `declarativeNetRequest` (+ host access) | Block the stock entry script so the fixed module can load; adjust CORS headers for same-origin asset fetch |

## Safety

- **No wallet signing** — the extension never requests signatures or private keys.
- **No key storage** — nothing reads or writes seed phrases or key material.
- **Client-only** — presentation and local script patching; chain truth is unchanged.
- **Host-scoped** — matches `sage.staratlas.com` only.

## Privacy

See [PRIVACY.md](./PRIVACY.md). No analytics, no remote config, no collection of wallet data.

## License

MIT — Copyright (c) 2026 Produce Bandit ltd. See [LICENSE](./LICENSE).

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).
