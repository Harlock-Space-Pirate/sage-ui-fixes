/** Pin Zink RPC in Solana.fm `explorer-settings` before the app hydrates.
 * ?cluster=custom-rpc1.z.ink only works if that slug is already in customRPCList;
 * otherwise Solana.fm falls back to preferredRPC (mainnet-alpha) and rewrites the URL.
 * LEEKS / Produce Bandit ltd */
(function () {
  try {
    const SLUG = "custom-rpc1.z.ink";
    const ZINK = {
      network: "Mainnet",
      friendlyKey: "custom-rpc",
      isCustom: true,
      logoUri: "",
      networkType: "mainnet",
      provider: "rpc1.z.ink",
      rank: 3,
      slug: SLUG,
      url: "https://rpc1.z.ink",
    };
    const q = new URLSearchParams(location.search).get("cluster") || "";
    const want = q === SLUG || /rpc1\.z\.ink/i.test(q);
    const KEY = "explorer-settings";
    let wrap = { state: {} };
    try {
      wrap = JSON.parse(localStorage.getItem(KEY) || "null") || wrap;
    } catch (_) {}
    if (!wrap || typeof wrap !== "object") wrap = { state: {} };
    if (!wrap.state || typeof wrap.state !== "object") wrap.state = {};
    const list = Array.isArray(wrap.state.customRPCList) ? wrap.state.customRPCList.slice() : [];
    if (!list.some((x) => x && (x.slug === SLUG || x.url === ZINK.url))) list.push(ZINK);
    wrap.state.customRPCList = list;
    if (!Array.isArray(wrap.state.localIdlMap)) wrap.state.localIdlMap = [];
    if (want) {
      wrap.state.currentRPC = ZINK;
      wrap.state.lastSynced = Date.now();
    }
    localStorage.setItem(KEY, JSON.stringify(wrap));
  } catch (_) {}
})();
