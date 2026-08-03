# SAGE UI Fixes

Client-side browser extension that applies small UI corrections on [sage.staratlas.com](https://sage.staratlas.com). It does not change chain state and does not touch your wallet keys.

**Author:** LEEKS · **Produce Bandit ltd**  
**Not affiliated with Star Atlas, ATMTA, or the official SAGE client.**

## Credits

### Bullit — QA from hyperspace

**Bullit** is the reason this ship still warps after every patch.

Commodore kid. Nintendo kid. Grew up on CRT glow, cartridge dust, and the sacred art of *blowing on the contacts and praying*. Same generation that learned physics from *Elite*, ethics from *Star Control*, and patience from a tape deck that said `FOUND` after three minutes of screeching. If the galaxy map glitches, he is already mid-jump with a controller in one hand and a thesis on why the starbase bar is lying.

He does not “QA.” He **tinkers in the void**:

- Spots dead fleet pins like a stoner spotting the **mushroom** in the wallpaper that was *definitely* always a face  
- Files bug reports that hit harder than a **DMT** blast and somehow still include reproduction steps  
- Brings ideas that smell like garage science, **weed** philosophy, and 1992 sci-fi paperbacks left open on a beanbag  
- Stress-tests combat and ownership UIs until Neutral Zone stops gaslighting us  
- Will say “bro what if…” and then it becomes a real fix three deploys later  

If this extension feels less cursed than stock SAGE, thank the pilot who kept mashing **Start** while the rest of us were still loading from cassette.

*Bullit — co-conspirator, idea factory, live-fire tester. We see you, legend.*

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
