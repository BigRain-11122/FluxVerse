import * as THREE from "three";
import { createAnimal, type Animal } from "procedural-animals";

/**
 * Player avatar form: "silicon cat" pilot (P1).
 *
 * Wheel: github.com/majidmanzarpour/threejs-procedural-animals (MIT), vendored via
 * `npm install github:...` -> node_modules/procedural-animals.
 *
 * Two non-obvious constraints drove this implementation:
 *  1. file:// has no Web Worker. We pass `worker: false`, which makes build.js take the
 *     buildSync() path on the calling thread (no `new Worker` is ever constructed).
 *  2. The library's body/shell/fin passes are NOT MeshStandardMaterial: they are custom
 *     ShaderMaterials that deform vertices with dual-quaternion skinning (a `uDQ` data
 *     texture + `dqsSkin()` in the vertex shader). Swapping them for MeshStandardMaterial
 *     would compile the mesh in bind pose and kill all animation. So for those passes we
 *     keep the material and override only the final pixel colour (see patchMaterial).
 *     Ordinary materials that do show up (eye meshes, membranes) get a real
 *     MeshStandardMaterial silicon shell.
 *
 * CEO shell law: dark blue-grey 0x22303e, metalness 0.7, roughness 0.3,
 * emissive 0x2fbfa8 @ 0.25 (glowing "vessel" look). No realistic animal skin.
 */

export interface PlayerFormRig {
  root: THREE.Group;
  update: (dt: number, elapsed: number) => void;
}

const SILICON_BASE = 0x22303e;
const SILICON_METALNESS = 0.7;
const SILICON_ROUGHNESS = 0.3;
const SILICON_EMISSIVE = 0x2fbfa8;
const SILICON_EMISSIVE_INTENSITY = 0.25;

/** Target world height of the cat, in metres (world 1 unit = 1 m). */
const CAT_HEIGHT_M = 0.5;

const FRAG_ANCHOR = "gl_FragColor = vec4(col, alpha);";
const COMMON_ANCHOR = "#include <common>";

/** The exact shell material requested by the CEO law, used where plain materials exist. */
function makeSiliconShell(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: SILICON_BASE,
    metalness: SILICON_METALNESS,
    roughness: SILICON_ROUGHNESS,
    emissive: SILICON_EMISSIVE,
    emissiveIntensity: SILICON_EMISSIVE_INTENSITY,
  });
}

/**
 * Replace / re-skin one material with the silicon shell while preserving deformation.
 * - DQS ShaderMaterial (body, shells, fins, membrane): keep it, patch the fragment output.
 * - Any other material (eyes, ...): swap for the standard silicon shell.
 */
function patchMaterial(mat: THREE.Material, shell: THREE.MeshStandardMaterial): THREE.Material {
  const shaderMat = mat as THREE.ShaderMaterial;
  if (shaderMat.isShaderMaterial) {
    const prev = shaderMat.onBeforeCompile;
    shaderMat.onBeforeCompile = (shader, renderer) => {
      prev?.call(shaderMat, shader, renderer);
      shader.uniforms.uSiColor = { value: new THREE.Color(SILICON_BASE) };
      shader.uniforms.uSiGlow = { value: new THREE.Color(SILICON_EMISSIVE) };
      shader.uniforms.uSiGlowGain = { value: SILICON_EMISSIVE_INTENSITY };

      if (shader.fragmentShader.includes(COMMON_ANCHOR)) {
        shader.fragmentShader = shader.fragmentShader.replace(
          COMMON_ANCHOR,
          COMMON_ANCHOR +
            "\nuniform vec3 uSiColor;\nuniform vec3 uSiGlow;\nuniform float uSiGlowGain;",
        );
      }
      if (shader.fragmentShader.includes(FRAG_ANCHOR)) {
        // Keep the library's own shading as a cheap luminance term so the body still reads
        // as a solid form, then force the silicon palette + emissive vessel glow on top.
        shader.fragmentShader = shader.fragmentShader.replace(
          FRAG_ANCHOR,
          [
            "{",
            "  float siLum = clamp(dot(col, vec3(0.299, 0.587, 0.114)), 0.0, 1.0);",
            "  vec3 siBody = uSiColor * (0.30 + 0.70 * siLum);",
            "  gl_FragColor = vec4(siBody + uSiGlow * uSiGlowGain, alpha);",
            "}",
          ].join("\n"),
        );
      } else {
        console.warn("[formsCat] silicon shader anchor not found; coat left untouched");
      }
    };
    shaderMat.needsUpdate = true;
    return shaderMat;
  }
  return shell;
}

function applySiliconToMesh(mesh: THREE.Mesh, shell: THREE.MeshStandardMaterial): void {
  const current = mesh.material;
  if (Array.isArray(current)) {
    mesh.material = current.map((m) => patchMaterial(m, shell));
  } else if (current) {
    mesh.material = patchMaterial(current, shell);
  }
}

/**
 * Build the silicon-cat player form. The procedural build is async (the library returns a
 * Promise), so `root` starts empty and is populated on the microtask/timer tick; `update`
 * is safe to call immediately and becomes a no-op until the cat is ready.
 */
export function buildSiliconCat(seed: number): PlayerFormRig {
  const root = new THREE.Group();
  root.name = `silicon-cat-${seed}`;

  // Inner pivot: holds the "feet on the ground" offset so we never fight the library's own
  // motion transform on animal.object (the library drives object.position itself).
  const pivot = new THREE.Group();
  pivot.name = "silicon-cat-pivot";
  root.add(pivot);

  let animal: Animal | null = null;
  let disposed = false;

  createAnimal("cat", {
    seed,
    quality: "crowd", // 5-8k verts tier; single draw call (no shells/fins/eye meshes)
    worker: false, // file:// red line: build on the calling thread, never spawn a Worker
    castShadow: true,
    receiveShadow: true,
  })
    .then((built) => {
      if (disposed) {
        built.dispose();
        return;
      }
      animal = built;

      // No fur cards / shells: the crowd tier is already shell-less, this just guarantees it.
      built.setCoverings(false);

      const shell = makeSiliconShell();
      built.object.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.isMesh) applySiliconToMesh(mesh, shell);
      });

      pivot.add(built.object);

      // Normalise height from the base skin geometry. Box3.setFromObject() is wrong here:
      // the fin pass is a 1x1 instanced card and the attachments sit at the origin, so it
      // reports a ~1 m box. The base geometry holds the real sculpted body in metres.
      const base = built.object.getObjectByName("base") as THREE.Mesh | null;
      const geom = base?.geometry;
      geom?.computeBoundingBox();
      const box = geom?.boundingBox;
      if (box) {
        const height = box.max.y - box.min.y;
        if (Number.isFinite(height) && height > 1e-4) {
          root.scale.setScalar(CAT_HEIGHT_M / height); // cat ~0.32 m tall -> ~1.56x
        }
        pivot.position.y = -box.min.y; // feet at root y = 0
      }
    })
    .catch((err) => {
      console.error("[formsCat] procedural cat build failed", err);
    });

  return {
    root,
    update: (dt: number, elapsed: number): void => {
      void elapsed; // library keeps its own clock (Animal.time); elapsed unused here
      const a = animal;
      if (!a || disposed) return;
      if (!(dt > 0) || !Number.isFinite(dt)) return;
      a.update(dt); // runs the idle motion + DQS update + coat dynamics
    },
  };
}
