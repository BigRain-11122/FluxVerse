// Static production build: one classic-script IIFE bundle (dist/city.js)
// so the city opens by double-click on file:// with zero server
// (MiniGame red line). Dev workflow stays on `npm run dev` (Vite HMR).
import { build } from "esbuild";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dist = path.join(root, "dist");
fs.mkdirSync(dist, { recursive: true });

const t0 = Date.now();
await build({
  entryPoints: [path.join(root, "src/main.ts")],
  bundle: true,
  format: "iife",
  platform: "browser",
  target: ["es2019"],
  minify: true,
  sourcemap: false,
  legalComments: "none",
  outfile: path.join(dist, "city.js"),
  logLevel: "info",
});

// Static entry lives in dist/ already (index.html references ./city.js and
// ./city-data.js with relative paths). Only city.js is regenerated here.
const size = fs.statSync(path.join(dist, "city.js")).size;
console.log(`[build-static] dist/city.js ${(size / 1024).toFixed(1)} KB in ${Date.now() - t0} ms`);
