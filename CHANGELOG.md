# Changelog

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
