#!/usr/bin/env node
/** Evaluate a JS expression in the sage.staratlas.com tab of a CDP-enabled browser.
 * Usage: node scripts/cdp-eval.mjs [port] '[reload [ms]] <js expression>'
 * `reload` first reloads the page (fresh content-script inject) and waits ms (default 12000).
 * LEEKS / Produce Bandit ltd
 */
const args = process.argv.slice(2);
const port = args.length > 1 && /^\d+$/.test(args[0]) ? args.shift() : "9223";
let expr = args.join(" ");
let reloadMs = 0;
let targetKind = "page";
{
  const m = expr.match(/^reload(?:\s+(\d+))?\s+/);
  if (m) {
    reloadMs = Number(m[1] || 12000);
    expr = expr.slice(m[0].length);
  }
}
if (expr.startsWith("sw ")) {
  targetKind = "service_worker";
  expr = expr.slice(3);
}
if (!expr) {
  console.error("usage: node scripts/cdp-eval.mjs [port] '<js expression>'");
  process.exit(2);
}

const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
const page =
  targetKind === "service_worker"
    ? list.find((t) => t.type === "service_worker" && /chrome-extension:\/\//.test(t.url || ""))
    : list.find((t) => t.type === "page" && /sage\.staratlas\.com/.test(t.url || ""));
if (!page) {
  console.error(`no ${targetKind} target on port ${port}`);
  process.exit(1);
}

const ws = new WebSocket(page.webSocketDebuggerUrl);
const send = (method, params) =>
  new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1e9);
    const onMsg = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id !== id) return;
      ws.removeEventListener("message", onMsg);
      m.error ? reject(new Error(m.error.message)) : resolve(m.result);
    };
    ws.addEventListener("message", onMsg);
    ws.send(JSON.stringify({ id, method, params }));
  });

ws.addEventListener("open", async () => {
  try {
    await send("Runtime.enable", {});
    if (reloadMs > 0) {
      await send("Page.enable", {});
      await send("Page.reload", {});
      await new Promise((r) => setTimeout(r, reloadMs));
    }
    const r = await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) {
      console.error("EXCEPTION:", JSON.stringify(r.exceptionDetails.exception?.description || r.exceptionDetails.text));
      process.exit(1);
    }
    const v = r.result.value;
    console.log(typeof v === "string" ? v : JSON.stringify(v));
    process.exit(0);
  } catch (e) {
    console.error(String(e && e.message || e));
    process.exit(1);
  }
});
ws.addEventListener("error", (e) => {
  console.error("ws error");
  process.exit(1);
});
setTimeout(() => {
  console.error("timeout");
  process.exit(1);
}, reloadMs + 20000);
