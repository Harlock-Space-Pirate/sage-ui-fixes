#!/usr/bin/env node
/**
 * Apply patches.js to stock/ entry and syntax-check the result.
 *   node scripts/apply-patches.mjs          write stock/patched-entry.js
 *   node scripts/apply-patches.mjs --check  report only (exit 1 if any miss)
 *
 * LEEKS / Produce Bandit ltd
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const checkOnly = process.argv.includes("--check");

const stockMan = JSON.parse(await readFile(path.join(ROOT, "stock", "manifest.json"), "utf8"));
const entryRel = stockMan.entryScript;
const src = await readFile(path.join(ROOT, "stock", entryRel), "utf8");

const ctx = { globalThis: {} };
vm.createContext(ctx);
vm.runInContext(await readFile(path.join(ROOT, "patches.js"), "utf8"), ctx);
const patches = ctx.globalThis.__SA_PATCHES__;
if (!Array.isArray(patches)) throw new Error("patches.js did not set __SA_PATCHES__");

let out = src;
const landed = [];
const missed = [];
for (const p of patches) {
  const n = out.split(p.find).length - 1;
  if (n !== 1) {
    missed.push({ id: p.id, hits: n });
    continue;
  }
  out = out.replace(p.find, p.replace);
  landed.push(p.id);
}

console.log(`[apply] stock ${stockMan.version} ${entryRel}  ${src.length.toLocaleString()} chars`);
console.log(`[apply] landed ${landed.length}/${patches.length}`);
for (const id of landed) console.log(`  ok    ${id}`);
for (const m of missed) console.log(`  MISS  ${m.id}  hits=${m.hits}`);

const tmp = path.join(ROOT, "stock", "patched-entry.js");
if (!checkOnly) {
  await writeFile(tmp, out);
  console.log(`[apply] wrote ${tmp}  ${out.length.toLocaleString()} chars`);
}

const probe = checkOnly ? path.join(ROOT, ".tmp-patched-check.js") : tmp;
if (checkOnly) await writeFile(probe, out);
const chk = spawnSync(process.execPath, ["--check", probe], { encoding: "utf8" });
if (checkOnly) {
  try {
    const { rm } = await import("node:fs/promises");
    await rm(probe, { force: true });
  } catch (_) {}
}
if (chk.status !== 0) {
  console.error("[apply] node --check FAILED");
  process.stderr.write(chk.stderr || chk.stdout || "");
  process.exit(1);
}
console.log("[apply] node --check OK");
if (missed.length) process.exit(2);
