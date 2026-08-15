#!/usr/bin/env node
/**
 * Download the live sage.staratlas.com JS/CSS graph into stock/.
 * Minified only — that is what the inject engine patches.
 *
 * LEEKS / Produce Bandit ltd
 */
import { createHash } from "node:crypto";
import { mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const STOCK = path.join(ROOT, "stock");
const BASE = process.env.SAGE_BASE_URL || "https://sage.staratlas.com";
const UA = "sage-ui-fixes-fetch-stock/2.0 (LEEKS / Produce Bandit ltd)";

function sha256(buf) {
  return createHash("sha256").update(buf).digest("hex");
}

async function get(rel) {
  const url = new URL(rel, BASE.endsWith("/") ? BASE : `${BASE}/`).href;
  const res = await fetch(url, {
    headers: { "user-agent": UA, "cache-control": "no-cache" },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} ${url}`);
  const bytes = Buffer.from(await res.arrayBuffer());
  return { url, bytes, text: bytes.toString("utf8") };
}

function depsFromJs(src) {
  const found = new Set();
  for (const m of src.matchAll(/["']\.\/([A-Za-z0-9_.-]+\.js)["']/g)) found.add(m[1]);
  for (const m of src.matchAll(/import\s*\(\s*["']\.\/([A-Za-z0-9_.-]+\.js)["']\s*\)/g)) {
    found.add(m[1]);
  }
  return [...found].sort();
}

function buildInfo(src) {
  const full =
    src.match(/\{version:"([^"]+)",commit:"([^"]+)",ref:"([^"]+)",builtAt:"([^"]+)"\}/) ||
    src.match(/version:"([^"]+)",commit:"([^"]+)",ref:"([^"]+)",builtAt:"([^"]+)"/);
  if (full) {
    return { version: full[1], commit: full[2], ref: full[3], builtAt: full[4] };
  }
  const v = src.match(/version:"(0\.\d+\.\d+)"/);
  return { version: v ? v[1] : "unknown", commit: null, ref: null, builtAt: null };
}

const index = await get("/");
const scriptMatch = index.text.match(/src="(\.\/assets\/[^"]+\.js)"/);
if (!scriptMatch) throw new Error("no entry script in index.html");
const cssMatch = index.text.match(/href="(\.\/assets\/[^"]+\.css)"/);
const entryPath = scriptMatch[1].replace(/^\.\//, "");
const cssPath = cssMatch ? cssMatch[1].replace(/^\.\//, "") : null;

const entry = await get(entryPath);
const build = buildInfo(entry.text);
const names = depsFromJs(entry.text);

await rm(STOCK, { recursive: true, force: true });
await mkdir(path.join(STOCK, "assets"), { recursive: true });
await writeFile(path.join(STOCK, "index.html"), index.text);

const assets = [];

async function writeAsset(rel, role, file) {
  const dest = path.join(STOCK, rel);
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, file.bytes);
  const rec = {
    path: rel,
    role,
    bytes: file.bytes.length,
    sha256: sha256(file.bytes),
    url: file.url,
  };
  assets.push(rec);
  console.log(`  ${role.padEnd(10)} ${rel}  ${rec.bytes.toLocaleString()} B  ${rec.sha256.slice(0, 12)}`);
}

console.log(`[fetch-stock] ${BASE}  →  ${build.version} ${build.commit || ""}`);
await writeAsset(entryPath, "entry", entry);

for (const name of names) {
  const rel = `assets/${name}`;
  if (rel === entryPath) continue;
  await writeAsset(rel, "chunk", await get(rel));
}
if (cssPath) await writeAsset(cssPath, "stylesheet", await get(cssPath));

const fetchedAt = new Date().toISOString();
const manifest = {
  source: BASE,
  fetchedAt,
  ...build,
  entryScript: entryPath,
  entryCss: cssPath,
  assets,
};
await writeFile(path.join(STOCK, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
await writeFile(
  path.join(STOCK, "VERSION"),
  `${build.version}\ncommit=${build.commit ?? ""}\nbuiltAt=${build.builtAt ?? ""}\nfetchedAt=${fetchedAt}\nentry=${entryPath}\n`,
);
console.log(`[fetch-stock] wrote ${assets.length} files → stock/`);
