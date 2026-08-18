# Handoff — sage-ui-fixes (2026-08-19)

LEEKS / Produce Bandit ltd. Next session: start here, then `CHANGELOG.md`.

## Now

| | |
|--|--|
| **Version** | **2.5.27** on `main` |
| **Repo** | https://github.com/Harlock-Space-Pirate/sage-ui-fixes (**public**) |
| **Testers** | https://github.com/Harlock-Space-Pirate/sage-ui-fixes/releases/latest — zip only, not Source code |
| **Issues** | https://github.com/Harlock-Space-Pirate/sage-ui-fixes/issues/new/choose |
| **Live SAGE** | **0.0.371** (`index-DmmfP5d6.js` / `index-BjTVBnk0.css`) — `stock/` matches this |
| **Local** | `/Users/maurice/Documents/VSCode/staratlas/products/sage-ui-fixes` |
| **Test browser** | Brave, logged-in `sage.staratlas.com` (computer-use `com.brave.Browser`) |

Release workflow: `.github/workflows/release.yml` — any `manifest.json` version bump on `main` publishes `dist/sage-ui-fixes-X.Y.Z.zip`.

## What shipped this arc (2.4.0 → 2.5.26)

### Action bar
- One-row tiles using live stock classes + gold fill (not glass).
- ⚙ options: icon size, labels, spacing (`saActionBarLook.v1`).
- Official Options keybinds: **Fleet actions** `d w s t c a r n x v` + **P** Reload AP (`fc-app-keybindings`).
- Slots persist; prune **only** if state is `Destroyed` (empty peek on reload used to wipe slots).
- **LIST** tile + Attack hoists official List Targets (`combat-target-list-button`).
- Destruct: clock only after Confirm, not on Cancel.

### Combat / HUD
- `hud/combat-resolve.js`: RESOLVING → poll peek HP/SP → HIT/MISS/FLEE floats + top TARGET chip (drag/resize, `saTargetHudPos.v1`).
- **Cannot** pre-know hit/miss (SlotHashes). Official `HP CRIT` = low HP, not crit-hit.
- Subwarp “still moving”: journey clock ended → treat Idle. Warp has `warpCooldownExpiresAt`; hover Warp for CD.

### Select / camera (fragile — read this)
Official list click uses **`Nd()`**: `derived.currentCoordinates[0/1]` or `location.toNumber()` (game units ~±50).  
`selectFleet` → `showInteractionRange(x,y)` → **`gameToPixel`**.

`pixelToGame` is **not** the inverse (`abs` + Y-squash 0.7). Feeding `fleetGameCoordsMap` / `pixelToGame(pin)` parks the ring off the ship (~794px).

Qwen path (2.5.15/17): `officialSelectCoords` → `__SA_PIXI_MAP__.selectFleetByKey(key, x, y)` + `requestSelectFleet`. Double-click: `requestPanTo(coords)` **without** fleet key (key starts Follow and locks the camera).

**Do not click** `[title="Close fleet panel"]` — that **clears selection**. Unblock via `publishMapInteractionBlocked(false)`.

**Do not auto-click Attack** (2.5.25 did; 2.5.26 reverted). Official Attack sets tab `yh()==="combat"`; empty `Ec()` snaps back to `"actions"` and deselects.

### Targeting / pin
- Official Victim cards (`_fleetCard_jkjbl_*` / `combatTargetCard`) only appear when Attack puts the tab on `"combat"`.
- Homemade **HOSTILES** list was deleted (2.5.24) — wrong icons, showed LEEKS One.
- PIN on official cards; **PINNED** stack clones those cards (`saEnemyList.v1`).
- Always-on cards **shipped 2.5.27**: patch `expose-combat-tab` exposes `__SA_COMBAT_TAB__={get,set,derived,targets}` (raw tab signal `An`, targets memo `Ec`); fleet-ops `maybeForceCombatTab()` sets `"combat"` directly when the selected fleet has targets — no Attack click, no deselect. Respects manual tab switches until the target set changes; max 3 forces per selection. `Ec()` is faction-filtered by the official client (same-faction/Unaligned hostiles never count).

### Craft
- Recipe card click → `openStarbaseMenu({ activeTab:"CRAFTING", activeSubTab:"Bays" })` if a station is already selected.

### Comms
- Official GALIA COMMS / Arcade / Vanguard dock hidden (`_dock_1jl14_` etc.). Chat stays in our Comms tab.

## Key files

| Path | Role |
|------|------|
| `hud/fleet-bar.js` | Bar, slots, select/pan, List Targets hoist, pending clock |
| `hud/fleet-ops.js` | Groups, pin stack, decorate official cards |
| `hud/combat-resolve.js` | HIT/MISS + top TARGET HUD |
| `hud/craft-jump.js` | Recipe → bays |
| `hud/css-fixes.js` | Hide Galia, hoist combat browser, strip sheet chrome |
| `hud/sa-probe.js` | `__SA_PROBE__.on()` / popup **HUD probe ON** |
| `patches.js` | 0.0.371 finds (planner, peek, nearby, pixi map, keybinds) |

Hooks: `__SA_PIXI_MAP__`, `__SA_DERIVED_FLEETS__`, `__SA_MAP_CONTROL__` (`unblockMap`), `__SA_NEARBY_FLEETS__`, `__SA_NEARBY_STARBASES__`, `__SA_PEEK_FLEETS__`.

## Open / do not regress

1. **Always-on Victim cards** — shipped 2.5.27 via `__SA_COMBAT_TAB__` + `maybeForceCombatTab()`. Verified live. Superseded by the compact combat overview spec (see Open feature below).
2. **HUD ring** — FIXED 2.5.28 (`pixel-to-game-squash` patch + pin-first select). Verified live in subwarp.
3. **Pending clock** — FIXED 2.5.28 (stale-journey clear + 30s fail-safe; verified live in saProbe log).
4. **Live client bump** — patches pinned to 0.0.371. Re-run `node scripts/apply-patches.mjs --check` after a SAGE deploy.

## Open feature — compact combat overview (spec 2026-08-19, LEEKS screenshot)

- Double-click slot: camera focus + HUD + show nearby enemies (same as official `data-testid="combat-target-list-button"`), but as a **compact floating strip** (top area, see his pink box), NOT the full "Combat target browser".
- Strip shows only the official compact fleet target cards (`_combatBrowserTargetCard_1040r_5065`) plus starbases rendered as equally compact cards (official starbase card is big — build/copy compact variant).
- Click a target card → **pin**: pixel-perfect static copy (no polling).
- Click a pinned card → **attack** with the selected fleet.
- Pinned card also offers **follow** (pursue the enemy fleet).

## How to test (Brave / Canary)

1. Unpacked load from this folder (or latest Release zip).
2. **Console first**: ⚔️ sa-ui-fixes lines, `patches landed ×49/49`, no page SyntaxError.
3. Popup → HUD probe ON (optional).
4. Click slot: fleet stays selected, tiles enable, no HOSTILES box.
5. Hostiles in attack range → official Victim cards appear without ATK; manual tab switch respected.
6. ATK or LIST: official Victim cards + PIN.
7. Double-click slot: camera pans, map still draggable, ring on ship.
8. Console: `__SA_PROBE__.dump()`, `__SA_VIEW_BOX__`, `__SA_COMBAT_TAB__`.
9. CDP (Chrome Canary :9223): `node scripts/cdp-eval.mjs 9223 '[reload [ms]] <js>'`.

## Identity

LEEKS / Produce Bandit ltd / Harlock-Space-Pirate only. Not affiliated with Star Atlas.
