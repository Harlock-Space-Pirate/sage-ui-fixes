# Changelog

## 2.3.9

- Starbase **capture** (last hit / level drop) sends `FactionEconomicsConfig`
  (`Ej43zV14…`). Stock omits it → `0x51890057` / `faction_economics_config
  required for an NPC capture`. Sim clean on Bullet2 Vanguard T1 vs
  `FGigytZV…`.

## 2.3.8

- **Starbase attack** now sends the fleet FactionOwnership sidecar and the
  Jorvik (or Baron) FactionAccount. Stock SAGE leaves those optionals empty,
  which is `npc_attacker_ownership_missing`. Tagged hulls can Attack from
  the official button. Fleet must be idle on the target system.

## 2.3.7

- Comms resolves **profile names** (not raw wallets) and shows a **faction badge** (MUD / ONI / Ustur).
- Comms inner tabs: **Channels** (Galia, MUD, ONI, Ustur) and **Teams** (Arcade, Vanguard).
- Right-click a message: Add contact · Block/Unblock · Copy wallet · Reply · Delete (own). Right-click a channel: Hide/Show. Same `ink-chat-settings` store as official chat.

## 2.3.6

- Clicking an assigned fleet slot no longer blows up PixiMap (`coordinates.x` on null). Select only runs with real game coords (`data.location`, 2^56 scale). Double-click pans.

## 2.3.5

- Combat / Comms window was falling out of the viewport (`position:relative` after `fixed`). It is pinned again. Double-click the tab row to reset position.

## 2.3.4

- Action tiles that **cannot** be used are dark bronze; ready tiles stay bright gold (Destruct ready stays red).

## 2.3.3

- **Fleet slots** under the action bar (8). Empty slot → fleet list; drag a fleet onto a slot (or click the row). Filled slot selects + pans to that fleet. × or right-click clears. Saved as `saFleetSlots.v1`.

## 2.3.2

- Fleet bar tiles drop the stock glass classes. Solid fill, icons fill the button (our stroke set — stock glyphs were 0.95rem and washed out).

## 2.3.1

- Fleet bar tiles are **opaque** (solid fill, no glass). Icons fill most of the button.

## 2.3.0

- Comms / Contacts are **our** layout inside the log (no overlaid official window). Messages and send go through the live InkChat/DM engine. Composer + emoji stay at the bottom of the pane.

## 2.2.3

- Warp/subwarp `_actionBar_138wv_` and `_mapTargetBar_14omi_` sit just above the fleet-bar grip (or below the bar if you dragged it up). Slimmed to planner-strip height.

## 2.2.2

- Chat / combat log stays up in **Port of Entry** and other starbase menus (it was hiding on `_menuContent_`). Stacked above that overlay.

## 2.2.1

- Comms / Contacts now **host the live SAGE panels** (real channel messages, stock composer + emoji at the bottom, real contact book + DMs). Official launchers stay hidden.
- Log window size + position, typing-chip position, and fleet bar position all persist.

## 2.2.0

- Restored the **combat log window** (Combat · Flight · Comms · Contacts). Official Galia dock and Contacts popup are hidden; channels and contacts live in this panel.
- Minimized chip is the motion-teardown **`.typing`** bubble (dark, 16px/4px tail, 8px dots, 0.16s stagger). Unread turns the dots on and shows a red pip.
- Contacts no longer opens the stock window.

## 2.1.3

- InkChat: lift **Contacts** with the Galia dock above `_footer_1qpfc_762`. Hide the standalone CONTACTS pill; **Comms / Contacts** tabs on the open Galia panel.
- Galia comms collapsed control is an **icon** (bouncing dots). Unread/mention lights the dots and a red pip.
- Destruct has **no hotkey**.

## 2.1.2

- Fleet bar tiles are **icon-only**. Hover shows the name (so Warp Gate no longer stretches the row).
- Hotkey badges: **1–9**, **0**, **−** (minus = Destruct). Same keys fire the action.

## 2.1.1

- **InkChat dock:** keep the official comms/contacts pills above command-panel `_footer_1qpfc_762` and raise their z-index so they stay clickable. No replacement dock.

## 2.1.0

- **Fleet action bar** back: one row of stock 0.0.355 tiles (`_statusActionButton_nsg6t_336 _fleetActionButton_1040r_21`), always painted (inactive tiles stay visible and disabled). Destruct is spaced off the other buttons.
- Stock fleet-view grid (`_statusActions_nsg6t_313 _fleetActionBar_1040r_863`, the 2-column / 3-row block) is hidden. Our tiles click the hidden stock buttons.
- Draggable grip; position stored in `localStorage` (`saActionBarPos.v1`) per screen size. Double-click grip resets. Popup can hide the bar (`saHideActionBar`).

## 2.0.0

Rewrite against live **sage.staratlas.com 0.0.355** (`assets/index-DY7IU6C2.js`, commit `8240f8c2d`, 2026-08-14).

- **New inject engine:** DNR-block stock entry → fetch live minified JS → exact once-only patches in `patches.js` → inject patched MAIN. Same proven boot as v1, without the 3.3k-line all-in-one `content.js`.
- **Stock kit:** `npm run fetch-stock` downloads every JS/CSS in the live Vite graph into `stock/` (gitignored). `npm run probe` applies patches and `node --check`s the result.
- **v1 archived** at `archive/v1.0.51-pre-rewrite/` (local only). Fleet action bar, combat-log HUD, wings, lock tables, and zoom HUD are **not** in 2.0.0 — they will be re-ported as separate modules against 355.
- **Patches that land on 355:** destroyed fleet pins, dead fleets out of attack lists, starbase HP bar, ownership fingerprint + `resolveDisplayOwner`, panel owner memo, warp-trail gate, glow wash clamps, culler bypass, startup-debug idle, systems/regions memo hooks, post-attack poll 1.5s/6s, in-place pin re-tint, detail-faction recreate, attack success hooks + contested/AP error toasts, builder pulse 1000 ms, catalog autoscroll off, `__SA_MAP_MATH__` / `__SA_MAP_CONTROL__` / `__SA_PLANNER__`.

## 1.0.51 and earlier

See git history and `archive/v1.0.51-pre-rewrite/CHANGELOG.md`.
