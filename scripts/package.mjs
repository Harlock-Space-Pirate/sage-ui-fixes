#!/usr/bin/env node
/** Package SAGE UI Fixes runtime zip. LEEKS / Produce Bandit ltd */
import { mkdir, readFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(await readFile(path.join(root, "manifest.json"), "utf8"));
const ver = manifest.version;
const outDir = path.join(root, "dist");
const out = path.join(outDir, `sage-ui-fixes-${ver}.zip`);

await mkdir(outDir, { recursive: true });
await rm(out, { force: true });

// Runtime only — never include docs, stock dumps, sprites, analytics, or local scratch.
// Explicit allow-list (paths relative to repo root).
const include = [
  "manifest.json",
  "background.js",
  "patches.js",
  "content.js",
  "hud",
  "popup.html",
  "popup.css",
  "popup.js",
  "rules.json",
  "icons",
];

execFileSync(
  "zip",
  [
    "-r",
    out,
    ...include,
    "-x",
    "*.DS_Store",
    "-x",
    "*__MACOSX*",
    "-x",
    "*_metadata*",
    "-x",
    "*_metadata/*",
    "-x",
    "*/.git/*",
  ],
  { cwd: root, stdio: "inherit" },
);

console.log(`wrote ${out}`);
console.log(`includes: ${include.join(", ")}`);
