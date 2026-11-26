import { defineConfig } from "vite";

// Dev server only. Production static build (file:// double-click delivery)
// is tools/build-static.mjs via esbuild IIFE bundle -> dist/city.js.
export default defineConfig({
  base: "./",
  server: {
    port: 5183,
    host: "127.0.0.1",
  },
  build: {
    outDir: "dist",
  },
});
