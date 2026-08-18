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
    /* official Attack → List Targets browser (fleets + starbases in range) */
    'html.sa-our-fleet-bar [data-testid="combat-target-browser"]{',
    "visibility:visible!important;pointer-events:auto!important;z-index:2147483644!important;",
    "max-height:min(52vh,440px)!important;overflow:auto!important;",
    "scrollbar-width:thin;scrollbar-color:rgb(86 152 255 / 28%) transparent}",
    'html.sa-our-fleet-bar [data-testid="combat-target-list-button"]{pointer-events:auto!important}',
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
