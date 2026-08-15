/** Hide official InkChat chrome — we render chats inside #sa-combat-log-box. LEEKS */
(function () {
  const ID = "sa-css-fixes";
  const CSS = [
    '[class*="_dock_opoyo_"],[class*="_container_npjv8_"],[class*="_dock_dozn0_"]{',
    "position:fixed!important;left:-14000px!important;top:0!important;",
    "opacity:0!important;pointer-events:none!important;width:0!important;height:0!important;",
    "overflow:hidden!important}",
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
