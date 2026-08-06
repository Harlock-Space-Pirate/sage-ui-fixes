# Changelog

## 1.0.37

- **Action bar absorbs stock Fleet Actions:** Dock / Gate / Stims / Mine / Destruct tiles join Warp / Swarp / Scan / Atk (clicks forward to the stock buttons, so game logic + confirms stay stock); the bulky stock "Fleet actions" section is hidden; tiles slimmed to fit
- **Movement Orders panel docks top:** the movement planner opens just under the top bar instead of the bottom sheet
- **Compact support tiles:** Fuel / Ammo / Food / Toolkit tiles shrink to slim chips with a percent fill bar + % readout (gold → amber ≤40% → red ≤15%) instead of tall empty boxes
- **COMMS tab in the log viewer:** every game pop-up/toast is captured into a third tab (Combat / Flight / Comms); new pop-ups blink the tab and flash a top-center strip for 6s (click strip → opens Comms); rows are copy-pasteable, long messages stay one-line until clicked, then expand big
- **Flexible wing chains:** plain click toggles a wing in/out (pick 1+3 freely), Shift+click daisy-chains the range, Alt+click solos; consecutive active wings get a gold connector, disjoint actives read as separate chains
- **Attack mirrors stock:** the Attack tile is disabled (not hidden) when the stock fleet panel shows no Attack button (nothing in range); bar buttons renamed to stock labels (Subwarp / Warp Gate / Attack / Destruct) with matching line icons
- **Top bar polish:** dark notch behind the header clusters (resources / dominion icons / utilities / account card) for contrast; dominion chips no longer overlap on small screens; STAR ATLAS wordmark replaced by a compact icon-only mark
- **Log text size:** A− / A+ buttons resize the log text (9–14px, persisted) — WoW-chat style
- **Log viewer slimmed:** title bar removed — A− / A+ / CLR / collapse now sit on the tab row; drag the tab row to move, dbl-click resets; fixed body height so switching Combat/Flight/Comms no longer resizes the box
- **Bar readability:** translucent dark backdrop panel behind the whole fleet bar
- **COMMS captures everything:** the big INFO cards (with copy button) and green warp/success toasts now land in the Comms tab; the stock notification stack is moved to the top-right so it no longer covers the action bar
- **Dock ⇄ Undock:** the Dock tile relabels to Undock when the stock panel offers it (and forwards correctly)
- **Cancel Warp floats** above the drag bar instead of pushing the bar down

## 1.0.36

- **Out-of-ammo warning lamp:** blinking red diamond + AMMO label centered on the fleet bar when your selected fleet / active wing draws ammo and sits at 0 (same rule as stock "Resource deficient": `totalAmmoDraw > 0 && ammoCurrent <= 0`); ATK tile pulses red too; hover the lamp for the empty fleet list
- **HUD clicks no longer leak into the game:** fleet bar, combat log, wings board and confirm modals stop pointer/mouse event propagation — dragging the bar or clicking the log while docked no longer kicks you out of the space-station view
- **Movement confirms restyled:** warp/subwarp fly confirm + wing confirm now use the chamfered gold-frame Star Atlas skin (Orbitron, angular, WARP/SUBWARP mode chip, Enter/Esc/Shift+click hints) instead of the browser-ish cyan rounded card
- **Security:** fleet labels and system names are on-chain untrusted strings; they are now HTML-escaped in combat log, flight log and confirms, so a hostile fleet name cannot inject markup/script into the page

## 1.0.35

- **Shift+click skips warp/subwarp confirm** (single fleet + wing): marquee no longer steals Shift while destination pick is active
- Wing map pick tip: Shift+click skip · headless GO READY when shift held
- More robust mod-key detect (`__SA_MOD_SKIP__`, Pixi originalEvent)

## 1.0.34

- **Toggle fleet action bar** (popup): OFF hides wings/Warp/Swarp/Scan/Atk strip — stock **click fleet + map pick** still works
- **Toggle combat log panel** (popup): hide HIT/MISS/flight log when you want a clean map
- Prefs: `saHideActionBar=1`, `saHideCombatLog=1` · console `__SA_ACTION_BAR__.hide()` / `.show()`, `__SA_LOG_COMBAT_EVENT.hide()` / `.show()`

## 1.0.33

- **Draggable combat log** + **fleet action bar** with clear SAGE UI Fixes labels
- Drag combat log header / gold fleet-bar grip; position remembered (`saCombatLogPos.v1`, `saActionBarPos.v1`)
- Double-click header/grip to reset position
- Overlay identity: titles + `data-sa-overlay` (`combat-log` / `action-bar`) so you know what is covering UI

## 1.0.32

- **Zoom counter HUD** (popup toggle): live map scale `×N.NN` + world/game center coords (top-right amber chip)
- Preference: `localStorage.saZoomHud=1` · console `__SA_ZOOM_HUD__.on()` / `.off()`

## 1.0.31

- **Combat log restyle** to match Wings / action-bar amber HUD (Orbitron, gold accents, square corners, same button scale as other panels)
- Combat / Flight tabs use amber active underline instead of cyan

## 1.0.30

- **Warp trails toggle** ([#1](https://github.com/Harlock-Space-Pirate/sage-ui-fixes/issues/1)): extension popup ON/OFF; OFF skips `createWarpTrail` (FPS) and clears existing trails
- Preference: `localStorage.saNoWarpTrails=1` · runtime `__SA_WARP_TRAILS__.enable()` / `.disable()`

## 1.0.29

- **Wings panel:** resizable corner handle; size + position saved (`saWingsPanelPos.v1`)
- **Compact fleet cards** closer to stock My Fleets: size bars, `UNDOCKED / IDLE` / `DOCKED` status colors, location, segmented HP/SP/fuel bars
- **Per-wing colors** on columns and action-bar chips [1–5]
- **Larger Wings buttons** (header + Use wing / delete) matching other pop-up controls

## 1.0.28

- Wings panel resize foundation; fleet card pips; column accents; button sizing pass

## 1.0.27

- **Wings editor = floating compact panel** (not full-screen modal): map stays interactive
- Opens centered; **drag header** to park on the side (position remembered)
- Denser amber HUD layout (Orbitron, smaller columns/cards)

## 1.0.26

- **Wing WARP/SWARP without Movement Planner pane:** click map only → compact Ready/Blocked confirm → stock `submit` batch (same preflight/math as planner)
- Planner left rail stays closed (`active:false` / `primeBatch`); no more huge left panel for multi-fleet moves

## 1.0.25

- **Shift+drag marquee** on the map: select owned fleets only (ignores systems/starbases) into temporary wing **[0]**
- Action bar: **[0]** marquee chip, then **[1–5]**, then extra space before **[×]** (harder to mis-click)
- Key **0** selects marquee wing; temp group is memory-only (not saved across refresh)

## 1.0.24

- **Wing groups survive refresh:** fixed wipe on load — no longer prune/save empty membership before fleets are ready
- Persist `groups` + labels in `localStorage` (`saFleetGroups.v1`) with safer load/save

## 1.0.23

- **Chain wings:** Ctrl/Cmd+click wing chips (or Ctrl+1…5) to link groups for one shared destination
- Visual **chain links** between selected chips + count badge; plain click = solo wing; ×/Esc clears chain
- WARP/SWARP with multiple wings merges fleets into one stock multi-order (same preflight confirm)

## 1.0.22

- **Cancel** during warp/swarp pick sits **above** the wing chips bar (not replacing action tiles)
- Action tiles stay visible; active mode (WARP/SWARP) highlighted while picking

## 1.0.21

- **Simple action bar:** `[1][2][3][4][5] [×]` + `|WARP|SWARP|SCAN|ATK|` — no outer border panel
- **Wing keys 1–5 / Esc=×** clear selection; cancel map pick
- **Single fleet:** WARP/SWARP/SCAN/ATK use stock paths
- **Wing + WARP/SWARP:** map pick → compact Ready/Blocked confirm → stock multi-fleet batch (preflight)
- Stock Movement Planner chrome hidden during wing order (logic kept)

## 1.0.20

- **Wing + Subwarp:** use **stock multi-fleet movement planner** (same path as checkbox multi-select)
  - Pre-selects all wing fleets, **map targeting** for the normal click-map pick
  - Auto **Issue Movement Orders** after destination → stock preflight + `executeMovementOrderBatch`
  - No more custom overlay / sequential fallback when planner is ready
- Flight log: clearer PICK/SUBMIT messages for wing orders

## 1.0.19

- **Action bar restyle:** stock-like **Fleet actions** panel (cyan frame, Orbitron labels) matching movement-order UI
- **Wing mini-bar** above actions: buttons **1–9** for each wing (count badge); key **1–9** selects wing
- **Wing + Subwarp:** custom map pick (crosshair overlay) → multi-subwarp all ships in wing via stock planner batch when available
- **Flight log tab** on combat log window (Combat | Flight); per-fleet skip/error/cooldown notes; clear respects active tab
- Planner + map math exposes for multi-orders (`__SA_PLANNER__`, `__SA_MAP_MATH__`, `__SA_WING_PICK__`, `__SA_FLIGHT_LOG__`)

## 1.0.18

- **Fix "Unreal Engine is not available":** stock `showSubwarp`/`showWarp` call `getEngine()` (web SAGE has no UE bridge). Action bar + wrappers now use **map movement** (`__SA_MOVEMENT__.start` / `tp`) and DOM Subwarp fallback — never the broken getEngine path
- Register `__SA_MOVEMENT__` at map init (`Ap` createMemo boot) so Space/bar work without a prior subwarp

## 1.0.17

- **Fleet Wings — all owned fleets:** Unassigned lists every fleet you own (from live `peekFleets` + player profile), not only the selected one
- **Selected highlight:** current fleet is pinned to the **top** of Unassigned/wing lists with a cyan highlight
- **Refresh** button on the Wings board if fleets load after open

## 1.0.16

- **Combat log concurrent attacks:** each resolve has a unique `id` so multi-hits on the same starbase no longer leave a stuck **RESOLVING** row or clobber each other
- **Pre-attack HP snapshot:** capture starbase HP at `⚔️ Attacking starbase…` (before wallet confirm), not only after confirm — fixes first-hit damage missed when chain already applied
- **HP tracking:** peak/trough across polls so late RPC/cache still yields a delta
- **Recorder:** `__SA_COMBAT_RECORDER__.dump()` / `.clear()` — last ~150 events in `localStorage` (`saCombatLog.v1`)

## 1.0.15

- **Boot fix:** SyntaxError `Unexpected token 'var'` — ASI missing after `__SA_SAGE_ACTIONS__` assign; removed illegal comma-chain inject before `Ap=` that broke the minified module parse
- Movement API now registers safely inside `tp` / `zp` function bodies

## 1.0.14

- **Styled fly confirm** — game-style modal (not browser `confirm`); Shift+click / Meta+click still skips and launches immediately
- **No leftover Start Subwarp bar** — auto-launch uses stock `zp()` submit path (shows Submitting, then clears)
- **Bottom fleet action bar** — Subwarp / Warp / Attack / Scan / Stop (no Destruct); becomes **Cancel move** while ordering/moving
- **Rebindable hotkeys** — double-click a key badge on the bar to capture a new shortcut (saved in `localStorage`)
- **Fleet Wings board** — Trello-style groups (drag fleets, rename, SUBWARP WING, add group); open with **Wings** or hotkey `G`

## 1.0.13

- **Combat log UX:** text wraps to width (`overflow-wrap`); custom thin cyan scrollbar; **draggable** by header
- **Fleet Space → subwarp pick:** with a fleet selected, **Space** starts subwarp destination mode (map pick)
- **Map destination:** **click** asks “Fly subwarp/warp to …?”; **Shift+click** flies immediately (no prompt); Cancel exits pick mode

## 1.0.12

- **Map debugger for non-techies:** extension popup **ON/OFF toggle** + **Copy ON / Copy OFF** one-liners
- Console: `__SA_MAP_DEBUG__.on()` / `.off()` (also `enable`/`disable`); persists via `localStorage.saMapDebug`

## 1.0.11

- **Surgical map pins (live CZzek2X2+):** stock `shouldRecreateStarSystemVisuals` destroyed+recreated pins on owner flip (slow + glow wash). Now **in-place** re-tint/retexture (`_starGlow`/`_starCore`/`_softHalo`) + keep container
- **Dirty fingerprint:** HP fraction in systems signature (`hl` + legacy locals) so HP bars update without full galaxy thrash
- **Coalesced ownership refresh:** stock 0/2/5/10s `starSystem`+`factionOwnership` storm → single-flight **0 / 1.5s / 6s** (`__SA_COALESCE_MAP_REFRESH__`)
- **Post-capture bump:** `__SA_MAP_BUMP__` after CAPTURE / refetch to force pin chrome without zoom-to-refresh
- **Create-time glow clamp:** initial `_starGlow.alpha` min 0.05 (with existing pulse hard-cap)
- **Legacy pin path** kept for pre-`shouldRecreate` entry hashes
- Stock snapshots: `stock-snapshots/DIFF-REPORT.md` (A→D comparison)

## 1.0.10

- **Combat log capture:** starbase resolve tracks **owner flip** (Neutral→Ustur etc.), not only HP. Logs `CAPTURE` + toast when system is taken with 0 HP dmg; still HIT when damage only
- **Map yellow wash (permanent):** harder macro `GLOW` (SIZE 14→3, lower alpha); per-frame `starGlow.alpha` hard-cap 0.04; detail `GLOW_BASE_ALPHA` 0.45→0.08
- **Map debug:** dump tags loot (`#9b4dca`) vs system glows; `dimWash`/`watch` skip loot markers by default

## 1.0.9

- **Map debug v3:** `watch`/`dimWash` only star-glow sprites (not fleets); no `.width` reads (no mask thrash / blink)

## 1.0.8

- **Map yellow wash:** dump showed Ustur tint `16755200` (#ffaa00) on huge star-glow Sprites (`screen`/`add`). Shrink macro `SYSTEM_STAR_CONFIG.GLOW` (14→4.5, lower alpha); tighter detail glow; ownership tint clamps glow alpha; `dimWash` hard-caps Ustur/add glows

## 1.0.7

- **Combat log:** re-hook starbase attack success on current bundle (`index-CZzek2X2` + extra AP hooks before toast). Stock path confirmed txs but never called `__SA_RESOLVE_COMBAT` → empty combat log / no HIT-MISS UI

## 1.0.6

- **Map debug v2:** screen-space wash scoring (was 7k+ false positives from world-bounds); Pixi v8 `label` only; `markPre`/`markPost` capture diff; tighter `dimWash`

## 1.0.5

- **Map debug:** `__SA_MAP_DEBUG__` runtime tool — `dump` / `dimWash` / `watch` / `restore` / `snapshot` for capture-glow wash; auto via `?saMapDebug=1` or `localStorage.saMapDebug=1`

## 1.0.4

- **Map / capture:** Neutral→Ustur (and MUD/Oni) full-system wash — previous glow patch **never landed** (minifier renamed `wo`→`bo`). Now: exact + name-agnostic regex shrink/dim outer glow, desaturate primary star mesh faction colors, re-hide macro star on detail recreate

## 1.0.3

- **Combat:** log + toast **counterstrike** (stock VFX was immediate; panel/feed were silent)
- **Combat:** longer starbase hit/miss poll (up to ~30s) so slow chain confirms are not false MISS
- **Map / capture:** first attempt to soften post-capture star glow (incomplete — see 1.0.4)
- **Boot:** fix fleet-attack regex that left a stray `)` and crashed the patched entry (`Unexpected token ')'`) — page blank after inject

## 1.0.2


Production POC release — map, combat, claim builder, ownership presentation.

- **Toolbar popup:** click the extension icon for version number and a link to GitHub release notes
- **Combat:** hit/miss resolve without waiting on fleet AP reload; combat log; starbase labels as `STARBASE @ system`
- **Claim builder:** safer diagram scroll/recenter; catalog autoscroll off; pulse throttle; no fake central-hub preview when none staged; builder tips when `+` is blocked
- **Map / ownership:** destroyed fleets, starbase HP presentation, post-capture ownership sync (from 1.0.x line)
- Regex + exact patch engine for minified SAGE client entry bundles

## 1.0.1

- Combat hit/miss floating indicators and feed toasts
- Starbase contested error intercept
- Future-proof regex patch engine

## 1.0.0

- First public release
- Client-only fixes for map destroyed fleets, combat target filter, starbase HP presentation, post-capture ownership UI sync
- **Bullit** on the legend plaque: live-fire QA and idea co-pilot
