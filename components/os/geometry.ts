/**
 * CPU-side geometry for the nervous system.
 *
 * The world is a single horizontal filament — a spine — that the camera
 * travels along. Three particle populations live on it:
 *
 *   · tissue   — dense points hugging the spine, the living body
 *   · signals  — bright points streaming along it, information in transit
 *   · halos    — points orbiting each of the six node cores
 *
 * The spine's centre-line is defined once, in `spineAt`, and mirrored in
 * GLSL (`SPINE_GLSL`) so the mesh cores placed here in JS land exactly on
 * the curve the shaders draw.
 */
import { NODES, WORLD } from "@/lib/os/system";

export const SPINE = {
  startX: WORLD.start,
  endX: NODES[NODES.length - 1].x + 10,
  ampY: 2.4,
  ampZ: 3.4,
  radius: 1.35, // tube radius of the tissue
} as const;

/** Centre-line of the spine at parameter t ∈ [0,1]. */
export function spineAt(t: number): [number, number, number] {
  const x = SPINE.startX + t * (SPINE.endX - SPINE.startX);
  const y = Math.sin(t * Math.PI * 3.2) * SPINE.ampY;
  const z = Math.sin(t * Math.PI * 2.1 + 1.3) * SPINE.ampZ;
  return [x, y, z];
}

/** Parameter t for a given world-x (X is linear along the spine). */
export function spineT(x: number): number {
  return (x - SPINE.startX) / (SPINE.endX - SPINE.startX);
}

/** The GLSL twin of `spineAt`, driven by uniforms so it stays in sync. */
export const SPINE_GLSL = /* glsl */ `
uniform float uSpineStart;
uniform float uSpineEnd;
uniform float uAmpY;
uniform float uAmpZ;
vec3 spineAt(float t){
  float x = uSpineStart + t * (uSpineEnd - uSpineStart);
  float y = sin(t * 3.14159265 * 3.2) * uAmpY;
  float z = sin(t * 3.14159265 * 2.1 + 1.3) * uAmpZ;
  return vec3(x, y, z);
}
`;

/** Shared uniform block so every material sees the same spine. */
export function spineUniforms() {
  return {
    uSpineStart: { value: SPINE.startX },
    uSpineEnd: { value: SPINE.endX },
    uAmpY: { value: SPINE.ampY },
    uAmpZ: { value: SPINE.ampZ },
  };
}

const rand = (a = 0, b = 1) => a + Math.random() * (b - a);

/* ---------------------------------------------------------------- tissue */
export interface Tissue {
  pos: Float32Array; // base positions — set the vertex count (shader recomputes)
  aT: Float32Array; // param along spine
  aRadial: Float32Array; // vec3 offset direction * radius
  aSeed: Float32Array;
  aScale: Float32Array;
  count: number;
}

/** Dense points wrapped around the spine, denser near the six nodes. */
export function buildTissue(count: number): Tissue {
  const pos = new Float32Array(count * 3);
  const aT = new Float32Array(count);
  const aRadial = new Float32Array(count * 3);
  const aSeed = new Float32Array(count);
  const aScale = new Float32Array(count);

  // node parameters, to bias density toward the knots
  const knots = NODES.map((n) => spineT(n.x));

  for (let i = 0; i < count; i++) {
    let t: number;
    if (Math.random() < 0.55) {
      // cluster around a random node
      const k = knots[(Math.random() * knots.length) | 0];
      t = Math.min(1, Math.max(0, k + rand(-0.045, 0.045)));
    } else {
      t = Math.random();
    }
    aT[i] = t;

    const base = spineAt(t);
    pos[i * 3] = base[0];
    pos[i * 3 + 1] = base[1];
    pos[i * 3 + 2] = base[2];

    // radial offset in the tube's cross-section, with a soft falloff so the
    // body is fuller at its core and wispy at its edge
    const ang = rand(0, Math.PI * 2);
    const r = SPINE.radius * Math.pow(Math.random(), 0.6);
    aRadial[i * 3] = 0;
    aRadial[i * 3 + 1] = Math.cos(ang) * r;
    aRadial[i * 3 + 2] = Math.sin(ang) * r;

    aSeed[i] = Math.random();
    let s = 0.55 + Math.pow(Math.random(), 2.2) * 1.4;
    if (Math.random() > 0.97) s *= 2.2; // rare bright cells
    aScale[i] = s;
  }
  return { pos, aT, aRadial, aSeed, aScale, count };
}

/* --------------------------------------------------------------- signals */
export interface Signals {
  pos: Float32Array; // base positions — set the vertex count
  aStart: Float32Array; // starting param
  aSpeed: Float32Array; // param units / sec
  aAngle: Float32Array; // lane angle around the spine
  aReach: Float32Array; // how far out the signal rides
  aSeed: Float32Array;
  count: number;
}

/** Bright motes that stream along the spine — data in transit. */
export function buildSignals(count: number): Signals {
  const pos = new Float32Array(count * 3);
  const aStart = new Float32Array(count);
  const aSpeed = new Float32Array(count);
  const aAngle = new Float32Array(count);
  const aReach = new Float32Array(count);
  const aSeed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    aStart[i] = Math.random();
    aSpeed[i] = rand(0.012, 0.05) * (Math.random() > 0.5 ? 1 : 0.6);
    aAngle[i] = rand(0, Math.PI * 2);
    aReach[i] = rand(0.15, 1.05);
    aSeed[i] = Math.random();
    const base = spineAt(aStart[i]);
    pos[i * 3] = base[0];
    pos[i * 3 + 1] = base[1];
    pos[i * 3 + 2] = base[2];
  }
  return { pos, aStart, aSpeed, aAngle, aReach, aSeed, count };
}

/* ----------------------------------------------------------------- halos */
export interface Halos {
  aCenter: Float32Array; // node core position
  aRadius: Float32Array;
  aPhase: Float32Array;
  aTilt: Float32Array; // orbit-plane tilt
  aNode: Float32Array; // node index, for per-node activation
  aSeed: Float32Array;
  count: number;
}

/** A shell of points orbiting each node core. */
export function buildHalos(perNode: number): Halos {
  const total = perNode * NODES.length;
  const aCenter = new Float32Array(total * 3);
  const aRadius = new Float32Array(total);
  const aPhase = new Float32Array(total);
  const aTilt = new Float32Array(total);
  const aNode = new Float32Array(total);
  const aSeed = new Float32Array(total);

  let i = 0;
  NODES.forEach((n, ni) => {
    const c = spineAt(spineT(n.x));
    for (let j = 0; j < perNode; j++) {
      aCenter[i * 3] = c[0];
      aCenter[i * 3 + 1] = c[1];
      aCenter[i * 3 + 2] = c[2];
      aRadius[i] = rand(1.6, 3.6) * Math.pow(Math.random(), 0.5);
      aPhase[i] = rand(0, Math.PI * 2);
      aTilt[i] = rand(-1, 1);
      aNode[i] = ni;
      aSeed[i] = Math.random();
      i++;
    }
  });
  return { aCenter, aRadius, aPhase, aTilt, aNode, aSeed, count: total };
}

/** World-space centres of the six cores — for placing meshes and labels. */
export const NODE_CENTERS = NODES.map((n) => spineAt(spineT(n.x)));

/* ------------------------------------------------------------ device fit */
export function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl2") || c.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

export type Budget = { tissue: number; signals: number; halo: number };

/** Particle budget scaled to the device. */
export function budget(): Budget {
  if (typeof window === "undefined")
    return { tissue: 26000, signals: 2600, halo: 340 };
  const w = window.innerWidth;
  const mem =
    (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 4;
  if (w < 760)
    return mem <= 4
      ? { tissue: 9000, signals: 900, halo: 130 }
      : { tissue: 13000, signals: 1300, halo: 180 };
  if (w < 1400) return { tissue: 22000, signals: 2200, halo: 300 };
  return mem <= 4
    ? { tissue: 26000, signals: 2600, halo: 340 }
    : { tissue: 34000, signals: 3400, halo: 420 };
}
