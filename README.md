# SAGE UI Fixes

Client-side browser extension that applies small UI corrections on [sage.staratlas.com](https://sage.staratlas.com). It does not change chain state and does not touch your wallet keys.

**Author:** LEEKS · **Produce Bandit ltd**  
**Not affiliated with Star Atlas, ATMTA, or the official SAGE client.**

## Credits

Huge thanks to **Bullit** for testing every build, catching regressions in the wild, bringing ideas for what to fix next, and helping tinker through map, combat, and ownership fixes. This release is better because of that collaboration.

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
