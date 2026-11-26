# formsCat — vendor notes (P1 silicon cat player form)

## Vendor method

`npm install github:majidmanzarpour/threejs-procedural-animals --no-audit --no-fund --save`

- Installed package: `procedural-animals@0.1.0` (MIT), under `CityWeb/node_modules/procedural-animals`.
- The repo ships **pure ESM source only** (`src/**/*.js`, `"main"/"module": "./src/index.js"`,
  `"types": "./src/index.d.ts"`). No `dist`, no build step, no bundled worker URL asset.
- `package.json` records `"procedural-animals": "github:majidmanzarpour/threejs-procedural-animals"`
  in dependencies, and `package-lock.json` pins the resolved git commit.
- The npm path worked, so the `git clone` fallback was not used.

## Library API (as used)

```ts
import { createAnimal, type Animal } from "procedural-animals";
const animal = await createAnimal("cat", {
  seed: 7,
  quality: "crowd",   // 'hero' | 'high' | 'medium' | 'low' | 'crowd'
  worker: false,      // build on the calling thread (file:// has no Worker)
  castShadow: true,
  receiveShadow: true,
});
animal.update(dt);    // idle motion + DQS skin + coat dynamics, once per frame
animal.object;        // THREE.Group to add to the scene
animal.stats;         // { vertices, triangles, bones, buildMs, updateMs }
animal.setCoverings(false); // hides fur shells + silhouette fins
```

The species registry (`src/registry.js`) resolves `"cat"` through a **dynamic `import()`**.
It is statically analysable, so esbuild inlines it — but it also means **all 24 species**
are pulled into the bundle (see pitfalls).

### Worker handling

`src/build.js#makeWorker(false)` returns `null` immediately, so `buildInWorkers()` takes
the `buildSync()` path; `new Worker(new URL("./worker.js", import.meta.url))` is never
evaluated. **No vendor source patch was needed** and no Worker/`import.meta` is touched at
runtime. (esbuild still lowers the unreachable `import.meta` reference harmlessly in IIFE.)

## Why the body is not a plain MeshStandardMaterial

The library's body, shell and fin passes are **custom `THREE.ShaderMaterial`s** doing
dual-quaternion skinning: a per-animal `uDQ` DataTexture plus `dqsSkin()` in the vertex
shader (`src/core/render/coatMaterial.js`, `src/core/render/dqs.js`). Replacing them with
`MeshStandardMaterial` would drop DQS and leave the mesh frozen in bind pose — animation
would visibly die.

Implementation therefore:
- **DQS ShaderMaterials** (body/shells/fins/membrane): kept, and patched through
  `onBeforeCompile`. New uniforms `uSiColor` / `uSiGlow` / `uSiGlowGain` are injected after
  `#include <common>`, and `gl_FragColor = vec4(col, alpha);` is replaced with a silicon
  palette that keeps the library's luminance term for form shading:
  `siBody = uSiColor * (0.30 + 0.70 * luminance(col))`, then `+ uSiGlow * uSiGlowGain`.
- **Any non-shader material** (eye meshes, membranes when present): replaced with a real
  `MeshStandardMaterial` carrying the exact CEO values (color `0x22303e`, metalness `0.7`,
  roughness `0.3`, emissive `0x2fbfa8`, emissiveIntensity `0.25`).

Net effect: the exact requested material exists and is applied where safe; the deformable
body keeps its skinning and renders as the silicon shell.

## Scale

Measured headless (seed 7, crowd): base geometry bbox height **0.3205 m**, length 0.7022 m,
min.y ≈ -0.0008. `root.scale = 0.5 / 0.3205 = 1.5599` gives a 0.5 m-tall cat; `pivot.y =
-box.min.y` puts the feet exactly on y = 0.

## Known pitfalls

1. **`Box3.setFromObject()` is unusable here.** The fin pass is a 1×1 instanced card and the
   attachment nodes sit at the origin, so the object-space box reports ~1.0 × 1.0008 m. The
   code measures `object.getObjectByName("base").geometry.boundingBox` instead.
2. **All-species bundle cost.** `createAnimal("cat", …)` keeps the string-id API but pulls all
   24 species via the registry: probe bundle main+formsCat = **2563.1 KB** vs main alone
   **1138.5 KB** (≈ +1.4 MB, minified). To trim later, import the species module directly
   (`import cat from "procedural-animals/species/cat"`, then `createAnimal(cat, …)`); that
   subpath has **no `.d.ts`**, so it needs a small module declaration shim (not done in P1 to
   keep one new code file).
3. **Tone mapping.** The city renderer uses ACESFilmic; the silicon base will read slightly
   darker than the raw `0x22303e`. The 0.25 emissive glow is what keeps it readable at night.
4. **Material program cache.** Do not set `customProgramCacheKey` — three keys ShaderMaterial
   programs by `onBeforeCompile.toString()` + defines; the library shares programs across
   animals and relies on that.
5. **Motion units.** Root scaling (×1.56) also scales any future `animal.move()` speed in
   world metres. Idle is unaffected; if locomotion is wired later, drive the player controller
   and use `animal.follow()` with real-world velocities.
6. **Shader patch is string-anchored** (`#include <common>`, `gl_FragColor = vec4(col, alpha);`).
   If the library updates those lines, the patch logs `silicon shader anchor not found` and
   leaves the coat untouched rather than breaking the build.
7. **Lockfile URL is `git+ssh`.** `package.json` pins the spec as
   `git+https://github.com/majidmanzarpour/threejs-procedural-animals.git#c95ae493…`, but npm
   normalised `resolved` in `package-lock.json` to `git+ssh://git@github.com/…` (this machine
   has GitHub SSH keys). A machine without SSH keys should run
   `npm install git+https://github.com/majidmanzarpour/threejs-procedural-animals.git#c95ae49346aa8e140a924376cec6cf0073d99512`
   once; the commit hash is identical either way.

## Verification

- `npx tsc --noEmit` → exit 0, no output.
- `node tools/build-static.mjs` → `dist/city.js` **1138.5 KB**, exit 0.
- Probe IIFE bundling `src/main.ts` + `src/player/formsCat.ts` with the same esbuild flags →
  **2563.1 KB**, exit 0 (library graph including dynamic species imports bundles fine).
- Headless smoke (esbuild ESM build, seed 7): root children 1, pivot present, scale 1.5599,
  pivot.y 0.00078, body is ShaderMaterial, injected uniform present, output replaced,
  0 unpatched anchors, `update(0.016, 0.016)` no throw.
