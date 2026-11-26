// Ambient type declaration for troika-three-text 0.54.
//
// Why this shim exists (verified against the installed package):
//   1. The package ships declarations under dist/types/, but package.json
//      has no "types" entry, so under tsconfig's moduleResolution "bundler"
//      the canonical `import ... from "troika-three-text"` finds nothing
//      (TS7016) — the shipped files are never reached.
//   2. The shipped dist/types/Text.d.ts declares `class Text` WITHOUT the
//      THREE.Mesh base class, so Object3D members (position, renderOrder,
//      frustumCulled, add, ...) are untyped anyway.
//
// This ambient module declares exactly the surface src/city/streetSigns.ts
// uses, with Text properly extending THREE.Mesh (the runtime class does
// extend Mesh — confirmed in dist/troika-three-text.esm.js). Delete this
// file once a troika release wires up complete, resolvable types.
declare module "troika-three-text" {
  import { Color, Mesh, MeshBasicMaterial } from "three";

  /**
   * SDF text mesh: runtime `class Text extends THREE.Mesh` from
   * troika-three-text. Only the streetSigns surface is declared here.
   */
  export class Text extends Mesh {
    /** The string of text to be rendered. */
    text: string;
    /** Render size in local units; equals the font's em-box height. */
    fontSize: number;
    /** Glyph fill colour: hex number, CSS string, or Color. */
    color: number | string | Color;
    /** Outline width in local units; 0 = no outline. */
    outlineWidth: number;
    /** Maximum text block width before wrapping kicks in. */
    maxWidth: number;
    /** Horizontal anchor: 'left' | 'center' | 'right' | number | 'NN%'. */
    anchorX: string | number;
    /** Vertical anchor: 'top' | 'middle' | 'bottom' | number | 'NN%'. */
    anchorY: string | number;
    /** Re-runs layout + glyph generation; async. Call after property edits. */
    sync(callback?: () => void): void;
    /**
     * Derived SDF material: troika derives it from a transparent
     * MeshBasicMaterial (per instance), and with an outline configured the
     * getter returns the multi-material pair [outlineMaterial, fillMaterial].
     */
    material: MeshBasicMaterial | MeshBasicMaterial[];
  }
}
