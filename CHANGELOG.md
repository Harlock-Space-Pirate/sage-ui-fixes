# Changelog

## 2.5.22

- No IN VIEW toggle: hostiles show immediately as compact Victim-style cards. **Pin** keeps them in a vertical PINNED stack after they leave view.

## 2.5.21

- List Targets shows **only official ship/starbase cards** (The Victim style). Sheet chrome hidden. PIN on each card. Starbase cards same 132px card size.

## 2.5.20

- **LIST** tile + Attack hoist official **List Targets** / combat-target-browser (fleets + starbases) out of the hidden stock bar so it stays on screen.

## 2.5.19

- Attack tile opens official **List Targets** (`combat-target-list-button`) — Enemy Fleets + Enemy Starbases in range. Confirm panel is not auto-pending.

## 2.5.18

- IN VIEW stays tight: pins must sit in the **viewport world rect**; peek/nearby only if `gameToPixel` lands on screen. Dropped the lossy pixelToGame AABB that dumped the whole map.

## 2.5.17

- Qwen HUD select: Nd() coords into pixi `selectFleetByKey`; bind map if hook is late. Ships with viewport IN VIEW scan.

## 2.5.16

- IN VIEW uses the **viewport game box** (canvas corners → game coords) plus pins/nearby. Rescan **1.5s after zoom** settles, and every 2s for movers.

## 2.5.15

- Fleet slot select puts the interaction-range HUD on the ship: official Nd() game coords into the pixi map's `selectFleetByKey` (+ `requestSelectFleet` sync); never `pixelToGame`/`fleetGameCoordsMap`. Double-click pans without the fleet key (no Follow lock).

## 2.5.14

- IN VIEW uses **map pins** + official `nearbyFleets`, not peek+broken screen projection. Enemies next to you show even when peek is owned-only.

## 2.5.13

- Action bar has **Reload AP** again (stock `Reload AP` button, hotkey `P`).

## 2.5.12

- HUD select uses official **Nd()** coords (`currentCoordinates` or `location.toNumber()`). `pixelToGame` is not the inverse of `gameToPixel` (abs + Y-squash) and was parking the ring off the ship. Double-click pans once, no Follow.

## 2.5.11

- Derived fleet coords go through the same scale parse as the rest of the bar (GLM: raw `Number` skipped `/2**56` and parked the HUD elsewhere).

## 2.5.10

- HUD ring uses the **pixi pin / fleetGameCoordsMap** (same as the sprite), not account `location`. Double-click follows until you drag the map.

## 2.5.9

- Double-click a slot pans to the fleet and keeps it selected. It no longer starts official Follow, so the map stays draggable.

## 2.5.8

- Slot click no longer auto-clicks **Close fleet panel** (that cleared the selection a moment later). Map is unblocked without cancelling the target.

## 2.5.7

- Top **TARGET** chip is draggable and resizable. Position and size persist (`saTargetHudPos.v1`).

## 2.5.6

- Target lists use stock command scrollbars and checkbox tiles. **+/−** scales the HUD. IN VIEW grows **up** from the bottom (down from the top) and scrolls when still too long.

## 2.5.5

- Targets no longer sit on the action bar. Compact **TGT** stack is bottom-right (draggable, saved). Focus on top, other pins below. **IN VIEW** opens a hideable scout list to the left. Both stay above all HUD.

## 2.5.4

- Action bar shows live map zoom as **Z n.nn** (official scale: ~0.08 far out, 100 close in).

## 2.5.3

- Double-click a fleet slot uses official **current** coordinates (derived store), not the departure `location`. HUD ring sits on the ship. Also calls `requestFocusSelectedFleet`.

## 2.5.2

- After subwarp/warp **arrives**, Stop turns off and Warp/Subwarp work again. We no longer treat a leftover `MoveSubwarp` account as still moving once the journey clock has ended. Warp hover shows remaining **CD** (`warpCooldownExpiresAt`) if any. Subwarp has no separate cooldown in the 0.0.371 client.

## 2.5.1

- Slot and group assignments persist across reload. A fleet is only dropped when its state is **Destroyed**, not when peek is still empty.

## 2.5.0

- Enemies in view show as **PIN** buttons. Pinned targets are 5-wide cards (name + HP/SP bars). Click = target, **GO** = fly to them, **ATK** = attack, **HUNT** / prompt if they leave view (uses last warp dest).

## 2.4.10

- Fleet editor sits in the free space **above** the action bar (scrolls if tall). It was drawing off the top of the screen.

## 2.4.9

- Fleet editor has a **× close** (Esc too). Drag fleets between OWNED and G1–G4; drop on a chip to reorder.

## 2.4.8

- Slot select / double-click no longer leaves the official **Fleet Command** panel open (that overlay blocks the map). We click **Close fleet panel** after focus.

## 2.4.7

- Double-click a fleet slot (including the name text) pans/zooms. Label no longer steals the click.

## 2.4.6

- Official confirm (self-destruct) and faucet/error toasts sit **above** the action bar, not on top of the tiles.
- ⚙ options float out of flow: above the bar at the bottom, below if there is no room at the top.
- Slots, groups, and the TGT list drop fleets that are gone or Destroyed.

## 2.4.5

- **Fleet groups** (G1–G4) under the slots. Click = active group; right-click adds the selected fleet; **EDIT** opens the pool. Saved as `saFleetGroups.v1`.
- Active group with 2+ fleets: Warp/Subwarp uses official multi-fleet planner (`selectedFleetKeys`) — one destination, all go there. Fat planner panel hidden; banner + Confirm / Esc.
- **TGT list:** Shift+click (rebindable in ⚙) nearest enemy on the map. Click = pan + target; double-click = Attack. Saved as `saEnemyList.v1`.

## 2.4.4

- Action bar **⚙ options**: icon size, show/hide text, button spacing. Saved as `saActionBarLook.v1`.
- **KILL** (self-destruct) no longer starts the clock on the confirm dialog. Cancel / Esc leaves the tile idle; Confirm still shows the clock until the fleet state changes.

## 2.4.3

- Action tiles and fleet slots are **solid** (no stock glass). Dimmed tiles stay opaque, just darker.

## 2.4.2

- Hide official **GALIA COMMS**, Arcade, and Vanguard dock pills (0.0.371 `_dock_1jl14_` / channel tabs). Chat stays in our Comms tab.

## 2.4.1

- **PvP resolve** (v1 path, 371 vars): attack send shows RESOLVING immediately; we poll the live fleet store for HP/SP. HIT / MISS / FLEE floats on the map + combat-log rows. Target HUD (HP + SP) for the last attack target. No fake hits — chain still decides. Official “HP CRIT” on the chip means the target is low, not a critical strike (client has no crit-outcome flag).
- Fleet-attack hook uses `go` / `hg` (the old `To` name was undefined on 0.0.371).
- Recipe card click reopens the current station on **CRAFTING → Bays** so you stay in the craft loop instead of hunting the map.

## 2.4.0

- Target live **SAGE 0.0.371** (`index-DmmfP5d6.js`, 2026-08-18). All 41 patches land.
- Action bar tiles use **stock** fleet-action classes (icon + Orbitron label + keybind sublabel) and stock HUD frame ticks. Compact one-row still hides their 3-row grid.
- **Fleet actions** (`d w s t c a r n x v`) appear in official Options → Command Settings keybinds (`fc-app-keybindings`). Remap there; tiles show the live chord. Destruct stays unbound.
- Fleet slots are quieter map chips (no fake 1–8 hotkeys).

## 2.3.15

- Action tiles use the starmap **crosshair** cursor (cross + center dot). No more stop-sign pointer on dimmed tiles.

## 2.3.14

- Comms Channels/Teams came back (`active` was missing in `paintChat` and crashed the log).
- Fleet slot select also clicks the stock My Fleets row so action tiles actually arm. Double-click still follows.

## 2.3.13

- Fleet slot **click** only selects (action tiles light up; camera stays free). **Double-click** pans to the live position and turns official Follow on.

## 2.3.12

- Clicking a fleet in warp/subwarp pans to **where it is now** (or the destination if the trip is already over). On-chain `location` stays at the departure point until Exit Movement.

## 2.3.11

- Comms **Channels / Teams** stay on the tab you pick (Teams no longer traps you). Tabs are gold/dark buttons.
- **⋮** next to minimize: **a** / **A** change log text size (saved).

## 2.3.10

- **Stop** lights up while the selected fleet is subwarping (or warping) and actually clicks stock Stop (label was `Stop` + ETA, so we never matched).
- Hover always shows the action name, including on dimmed tiles (no native `disabled`).
- Clicking Dock / Warp / Subwarp / Stop / etc. shows the old **clock** until the fleet state changes.

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
