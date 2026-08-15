# Live SAGE stock (gitignored)

Downloaded from **https://sage.staratlas.com** by `npm run fetch-stock`.

Minified JS/CSS only — this is what `patches.js` rewrites. Multi-MB; not committed.

```bash
npm run fetch-stock   # refresh from live
npm run probe         # apply patches + node --check
```

Current target when this rewrite landed: **0.0.355** / `assets/index-DY7IU6C2.js` (2026-08-14).
