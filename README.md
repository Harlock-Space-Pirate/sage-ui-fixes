# SAGE UI Fixes

Client-side browser extension that applies small UI corrections on [sage.staratlas.com](https://sage.staratlas.com). It does not change chain state and does not touch your wallet keys.

**Author:** LEEKS · **Produce Bandit ltd**  
**Not affiliated with Star Atlas, ATMTA, or the official SAGE client.**

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

        .     *        .   ✦     .
    *      🍄     .    🚀      *     .
        .    ☁️  WEED  ☁️    .      ✦
   ✦   *    👁️  DMT  👁️      *   .
        .      🍄🍄🍄      .
```

**Bullit** is the reason this ship still warps after every patch.

Commodore kid. Nintendo kid. Grew up on CRT glow, cartridge dust, and the sacred art of *blowing on the contacts and praying*. Same generation that learned physics from *Elite*, ethics from *Star Control*, and patience from a tape deck that screamed for three minutes before whispering `FOUND`. If the galaxy map glitches, he is already mid-jump — one hand on the stick, one hand mid-thesis on why the starbase bar is lying through its teeth.

He does not “QA.” He **tinkers in the void**:

- Spots dead fleet pins like a stoner spotting the **mushroom** in the wallpaper that was *definitely* always a face  
- Files bug reports that hit harder than a **DMT** launch window and somehow still include reproduction steps, screenshots, and a joke  
- Brings ideas that smell like garage science, **weed** philosophy, and 1992 sci-fi paperbacks left open on a beanbag next to a C64  
- Stress-tests combat and ownership UIs until Neutral Zone stops gaslighting the whole sector  
- Will say “bro what if…” — and three deploys later it’s a real fix with a body count of regressions he already killed  
- Keeps mashing **Start** while the rest of us are still stuck on `PRESS PLAY ON TAPE`

```text
  **** COMMODORE 64 BASIC V2 ****
  64K RAM SYSTEM  38911 BASIC BYTES FREE
  READY.
  10 REM BULLIT MODE
  20 POKE 53280,0 : POKE 53281,0
  30 PRINT "QA FROM HYPERSPACE"
  40 GOTO 30
  RUN
```

If this extension feels less cursed than stock SAGE, thank the pilot on the **legend plaque**.

*Bullit — co-conspirator · idea factory · live-fire tester · void tinkerer · high score forever.*

**Author / shipwright:** LEEKS · **Produce Bandit ltd**

## What it fixes

- Destroyed fleets lingering on the map / in combat target lists
- Starbase HP bar presentation
- Post-capture ownership / NEUTRAL lag on system views
- Live HUD ownership and related display sync after capture or attack

## Install

### Option A — Load unpacked (development / from source)

1. Clone this repository.
2. Chrome → **Extensions** → enable **Developer mode**.
3. **Load unpacked** → select this repository root (the folder that contains `manifest.json`).

### Option B — Release zip (recommended)

1. Download the zip from a [GitHub Release](https://github.com/Harlock-Space-Pirate/sage-ui-fixes/releases) for this project.
2. Unzip it.
3. Chrome → **Load unpacked** → select the unzipped folder.

Only published GitHub Releases for this repository are supported installs. Do not load arbitrary third-party zips claiming to be this extension.

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
