/** Hide official InkChat chrome — we render chats inside #sa-combat-log-box. LEEKS */
(function () {
  const ID = "sa-css-fixes";
  const CSS = [
    /* official Galia / contacts launchers — 355 opoyo + 371 1jl14 / dozn0 / npjv8 */
    '[class*="_dock_opoyo_"],[class*="_dock_dozn0_"],[class*="_dock_1jl14_"],',
    '[class*="_collapsedStack_1jl14_"],[class*="_channelBar_1jl14_"],',
    '[class*="_pill_1jl14_"],[class*="_channelTab_1jl14_"],',
    '[class*="_minimizedTab_dozn0_"],[class*="_panel_dozn0_"],[class*="_panel_1jl14_"],',
    '[class*="_container_npjv8_"],[class*="_toggleButton_npjv8_"]{',
    "position:fixed!important;left:-14000px!important;top:0!important;",
    "opacity:0!important;pointer-events:none!important;width:0!important;height:0!important;",
    "overflow:hidden!important;visibility:hidden!important}",
    /* keep official confirm / faucet toasts out of the action bar */
    "html.sa-our-fleet-bar [class*=notificationStack]{bottom:var(--sa-hud-pad-bottom,8rem)!important;",
    "top:auto!important;left:50%!important;transform:translateX(-50%)!important}",
    "html.sa-our-fleet-bar.sa-bar-top [class*=notificationStack]{top:var(--sa-hud-pad-top,6rem)!important;",
    "bottom:auto!important}",
    "html.sa-our-fleet-bar [class*=_container_1euns_],",
    "html.sa-our-fleet-bar [class*=modalLayer],",
    "html.sa-our-fleet-bar [class*=modalOverlay],",
    "html.sa-our-fleet-bar [class*=Attention][class*=container]{",
    "padding-bottom:var(--sa-hud-pad-bottom,8rem)!important;",
    "padding-top:var(--sa-hud-pad-top,1.5rem)!important;box-sizing:border-box!important}",
    /* hide official Fleet Command overlay without clicking Close (Close unselects) */
    'html.sa-our-fleet-bar [data-panel="fleet-info"]{visibility:hidden!important;pointer-events:none!important}',
    /* official List Targets — cards only, no sheet chrome */
    "#sa-combat-host{position:fixed;right:12px;bottom:var(--sa-hud-pad-bottom,8rem);left:auto;transform:none;",
    "z-index:2147483644;pointer-events:auto;display:flex;flex-direction:column;gap:6px;",
    "width:min(28rem,94vw);max-height:min(56vh,520px);overflow:auto;",
    "scrollbar-width:thin;scrollbar-color:rgb(86 152 255 / 28%) transparent}",
    'html.sa-our-fleet-bar [class*="fleetStatsSheetScrim"],',
    'html.sa-our-fleet-bar [class*="fleetStatsSheetHeader"],',
    'html.sa-our-fleet-bar [class*="fleetStatsSheetClose"],',
    'html.sa-our-fleet-bar [class*="fleetStatsSheetKicker"],',
    'html.sa-our-fleet-bar [class*="combatBrowserSectionHeader"],',
    'html.sa-our-fleet-bar [data-testid="combat-target-confirm-panel"]{display:none!important}',
    'html.sa-our-fleet-bar [class*="fleetStatsSheetPanel"][class*="combatTargetBrowserPanel"],',
    'html.sa-our-fleet-bar [data-testid="combat-target-browser"]{',
    "position:relative!important;inset:auto!important;top:auto!important;right:auto!important;",
    "bottom:auto!important;left:auto!important;width:100%!important;max-width:none!important;",
    "height:auto!important;padding:0!important;border:none!important;background:transparent!important;",
    "box-shadow:none!important;overflow:visible!important}",
    'html.sa-our-fleet-bar [class*="combatTargetCard"]{min-height:132px!important;position:relative!important}',
    "html.sa-our-fleet-bar [data-sa-pin]{position:absolute;top:8px;right:8px;z-index:4;",
    "appearance:none;border:1px solid rgb(227 235 241 / 30%);background:#070d18cc;color:#ffbe4d;",
    "font:800 8px Orbitron,sans-serif;letter-spacing:.1em;padding:3px 7px;cursor:pointer}",
    "html.sa-our-fleet-bar [data-sa-pin].on{border-color:#ffbe4d;background:#2a2010}",
  ].join("");
  function inject() {
    let st = document.getElementById(ID);
    if (!st) {
      st = document.createElement("style");
      st.id = ID;
      (document.documentElement || document.head).appendChild(st);
    }
    if (st.textContent !== CSS) st.textContent = CSS;
  }
  inject();
  setInterval(inject, 2000);
})();
