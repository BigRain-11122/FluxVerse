import * as THREE from "three";

// Silicon shell material library (lane C1 - POOL-ASSET, art domain).
//
// Why this module exists: the CEO packaging law (docs/player-gameplay-vocation.md,
// sec.1 "silicon body packaging") says every avatar, animal, mount and NEW building
// in FluxVerse wears the same "silicon shell" language - glowing vessel circuitry
// plus data interfaces - and never a photoreal organic skin. A citizen changes form
// (human / cat / bird / street-mech / data ghost) many times per life, so the shell
// must read as ONE species across all forms. If each form shipped its own
// hand-tuned material the four would drift apart and the city would stop looking
// like silicon; this module is the single source of that look.
//
// Why a cache: draw-call and program count are dominated by distinct materials.
// One grade+tint pair maps to exactly ONE MeshStandardMaterial instance, so 400
// residents or 60 pets of the same form share a single material (material budget
// law). Callers must treat the returned material as immutable: grade identity
// lives in its emissive channel, and mutating it changes every object wearing it.
//
// Grade legend (same family, only the "circuit" hue and metal finish differ):
//   body   - silicon humanoid: deep teal-grey alloy, gaming-artery emissive
//   animal - silicon animal: dark graphite body, bright teal "fiber fur" emissive
//   mech   - street robot / heavy machine: steel body, capital-gold circuit
//   ghost  - pure data form: darkest body, brain-blue emissive, translucent
//
// The emissive hexes intentionally alias palette FLOW values (data / capital /
// brain) but are inlined on purpose: this contract pins exact numbers, and binding
// them to FLOW would let an unrelated palette edit silently re-spec the shell.

export type ShellGrade = "body" | "animal" | "mech" | "ghost";

export interface ShellKit {
  material: THREE.MeshStandardMaterial; // single cached instance (grade+tint)
  accentColor: THREE.Color; // this grade's accent color (HUD / label / trail)
}

interface ShellSpec {
  base: number;
  metalness: number;
  roughness: number;
  emissive: number;
  emissiveIntensity: number;
  transparent: boolean;
  opacity: number;
}

// Numbers are the contract. Roughness/metalness split keeps body and animal on the
// matte side of the family (organic-ish silhouette, non-organic surface), pulls mech
// to a machined hard specular, and pushes ghost to a soft near-diffuse data haze.
const SHELL_SPEC: Record<ShellGrade, ShellSpec> = {
  body: {
    base: 0x22303e,
    metalness: 0.7,
    roughness: 0.3,
    emissive: 0x2fbfa8,
    emissiveIntensity: 0.25,
    transparent: false,
    opacity: 1,
  },
  animal: {
    base: 0x1b2530,
    metalness: 0.55,
    roughness: 0.45,
    emissive: 0x5eead4,
    emissiveIntensity: 0.3,
    transparent: false,
    opacity: 1,
  },
  mech: {
    base: 0x26313f,
    metalness: 0.85,
    roughness: 0.25,
    emissive: 0xfbbf24,
    emissiveIntensity: 0.18,
    transparent: false,
    opacity: 1,
  },
  ghost: {
    base: 0x14202e,
    metalness: 0.2,
    roughness: 0.6,
    emissive: 0x60a5fa,
    emissiveIntensity: 0.45,
    transparent: true,
    opacity: 0.72,
  },
};

// All cached kits, keyed by grade + tint. Module-level on purpose: the shell look
// is a global material budget, not a per-scene resource, and one cache keeps every
// caller (residents, pets, mech, buildings) literally sharing the same instances.
const cache = new Map<string, ShellKit>();

/** Runtime guard: grades also arrive from untyped data (JSON form ids), not only TS. */
function specOf(grade: ShellGrade): ShellSpec {
  const table = SHELL_SPEC as Record<string, ShellSpec | undefined>;
  return table[grade] ?? SHELL_SPEC.body;
}

/** Cache key = grade + tint. Undefined tint is its own slot, never merged with 0xffffff. */
function keyOf(grade: ShellGrade, tint: number | undefined): string {
  return `${grade}|${tint === undefined ? "-" : String(tint)}`;
}

/**
 * Resolve the silicon shell for a grade, optionally multiplied by a body tint.
 * Repeated calls with the same (grade, tint) return the SAME kit instance.
 */
export function shellMaterial(grade: ShellGrade, tint?: number): ShellKit {
  const key = keyOf(grade, tint);
  const cached = cache.get(key);
  if (cached) return cached;

  const spec = specOf(grade);

  // Tint multiplies only the body color: a form may shift hue for identity, but the
  // emissive circuit color is what tells the player "this is silicon, grade X", so
  // emissive stays bound to the grade. The copy avoids aliasing spec/palette Colors.
  const color = new THREE.Color(spec.base);
  if (tint !== undefined) color.multiply(new THREE.Color(tint));

  const material = new THREE.MeshStandardMaterial({
    color,
    metalness: spec.metalness,
    roughness: spec.roughness,
    emissive: new THREE.Color(spec.emissive),
    emissiveIntensity: spec.emissiveIntensity,
    // Ghost transparency is part of the grade identity, not a caller option:
    // pass it at construction so the material compiles the right program once.
    transparent: spec.transparent,
    opacity: spec.opacity,
  });
  // Name is for profiler / devtools readability only; it is not used for lookups.
  material.name = `silicon-shell:${grade}`;

  const kit: ShellKit = {
    // Independent color instance: callers tint HUD/labels with it and must not be
    // able to mutate the shared material's emissive by accident.
    accentColor: new THREE.Color(spec.emissive),
    material,
  };
  cache.set(key, kit);
  return kit;
}

/** Accent (circuit) color for a grade, as a fresh Color the caller may mutate. */
export function shellEmissiveColor(grade: ShellGrade): THREE.Color {
  return new THREE.Color(specOf(grade).emissive);
}

/**
 * Drop every cached kit and dispose its material. Call on teardown only: anything
 * still wearing a shell material must be rebuilt (the next shellMaterial() call
 * recreates the program). Keeps long-lived tabs from leaking GPU programs.
 */
export function disposeShellCache(): void {
  for (const kit of cache.values()) kit.material.dispose();
  cache.clear();
}

/**
 * Repaint a whole subtree with one silicon grade (P1 cat pilot, residents, pets).
 * Returns the number of meshes actually changed, so a pilot can assert "all 9 body
 * parts converted" and a second pass returns 0 (idempotent re-application).
 *
 * The previous materials are deliberately NOT disposed here: a resident batch or a
 * day/night rig may share one material across many objects outside this subtree, and
 * disposing it would black out unrelated geometry.
 */
export function applyShellTo(
  object: THREE.Object3D,
  grade: ShellGrade,
  tint?: number,
): number {
  const kit = shellMaterial(grade, tint);
  let replaced = 0;
  object.traverse((node) => {
    if (!(node as THREE.Mesh).isMesh) return;
    const mesh = node as THREE.Mesh;
    if (mesh.material === kit.material) return; // already wearing this grade
    // Array materials (multi-material meshes) are replaced whole on purpose: the
    // shell is one material for the full silhouette, not a per-slot patchwork.
    mesh.material = kit.material;
    replaced++;
  });
  return replaced;
}
