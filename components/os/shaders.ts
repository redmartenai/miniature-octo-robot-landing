/**
 * GLSL for the nervous system, written for a *light* world.
 *
 * On warm paper you cannot lean on additive blending — it just washes out.
 * So the tissue is drawn as soft dark marks (earth → copper) that sink into
 * the page, and only the signals and cores carry real light. Bloom is left
 * to pick out the few brightest heads.
 *
 * Three injects position/normal + the standard matrices; we declare only
 * our own attributes, uniforms, and varyings.
 */
import { NOISE } from "./noise";
import { SPINE_GLSL } from "./geometry";

/* ------------------------------------------------------------- tissue */
export const TISSUE_VERT = /* glsl */ `
attribute float aT;
attribute vec3 aRadial;
attribute float aSeed;
attribute float aScale;

uniform float uTime;
uniform float uReveal;
uniform float uSize;
uniform float uCollapse;
uniform vec3 uCollapseCenter;

varying float vSeed;
varying float vDepth;
varying float vEdge;

${SPINE_GLSL}
${NOISE}

void main(){
  vec3 base = spineAt(aT);

  // breathing cross-section + a little curl so the body never sits still
  float breathe = 0.85 + 0.2 * sin(uTime * 0.9 + aSeed * 6.2831);
  vec3 off = aRadial * breathe;
  off += curlNoise(base * 0.05 + uTime * 0.03) * 0.35;

  // the filament assembles from the centre outward as the world reveals
  vec3 pos = base + off * smoothstep(0.0, 1.0, uReveal);

  // the signature moment: all complexity implodes toward one point
  pos = mix(pos, uCollapseCenter, uCollapse);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;

  float size = uSize * aScale * mix(0.4, 1.0, uReveal);
  gl_PointSize = clamp(size * (60.0 / max(-mv.z, 0.1)), 1.0, 40.0);

  vSeed = aSeed;
  vDepth = clamp((-mv.z - 20.0) / 90.0, 0.0, 1.0);
  vEdge = length(aRadial) / 1.35;
}
`;

export const TISSUE_FRAG = /* glsl */ `
precision highp float;
uniform vec3 uEarth;
uniform vec3 uCopper;
uniform float uReveal;
uniform float uCollapse;

varying float vSeed;
varying float vDepth;
varying float vEdge;

void main(){
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float a = smoothstep(0.5, 0.04, d);
  if (a <= 0.001) discard;

  // copper at the core of the body, earthen at the skin
  vec3 col = mix(uCopper, uEarth, smoothstep(0.1, 0.9, vEdge));
  // distant tissue dissolves into the paper
  a *= mix(0.55, 0.12, vDepth) * uReveal;
  // fade the body away as it implodes, leaving only the decisions
  a *= 1.0 - uCollapse;
  gl_FragColor = vec4(col, a);
}
`;

/* ------------------------------------------------------------ signals */
export const SIGNAL_VERT = /* glsl */ `
attribute float aStart;
attribute float aSpeed;
attribute float aAngle;
attribute float aReach;
attribute float aSeed;

uniform float uTime;
uniform float uReveal;
uniform float uSize;
uniform float uCollapse;
uniform vec3 uCollapseCenter;

varying float vHead;
varying float vSeed;

${SPINE_GLSL}
${NOISE}

void main(){
  // travel along the spine, wrapping around
  float t = fract(aStart + uTime * aSpeed);
  vec3 base = spineAt(t);

  // ride slightly off-axis, spiralling as it goes
  float ang = aAngle + uTime * (0.6 + aSpeed * 4.0);
  float r = aReach * (0.6 + 0.4 * sin(uTime + aSeed * 6.2831));
  vec3 off = vec3(0.0, cos(ang) * r, sin(ang) * r);
  off += curlNoise(base * 0.06 + uTime * 0.05) * 0.25;

  vec3 pos = base + off;
  pos = mix(pos, uCollapseCenter, uCollapse);
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;

  // brighter as they near a node? approximate with a slow pulse
  vHead = 0.5 + 0.5 * sin(t * 40.0 + aSeed * 20.0);
  float size = uSize * (0.7 + aSeed * 1.1);
  gl_PointSize = clamp(size * (70.0 / max(-mv.z, 0.1)), 1.0, 22.0) * uReveal;
  vSeed = aSeed;
}
`;

export const SIGNAL_FRAG = /* glsl */ `
precision highp float;
uniform vec3 uGlow;
uniform float uReveal;
varying float vHead;
varying float vSeed;

void main(){
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float core = smoothstep(0.5, 0.0, d);
  if (core <= 0.001) discard;

  // amber body, near-white spark at the head of the brightest motes
  vec3 col = uGlow + vec3(0.9, 0.8, 0.6) * pow(vHead, 3.0) * 0.6;
  float a = core * (0.35 + 0.65 * vHead) * uReveal;
  gl_FragColor = vec4(col, a);
}
`;

/* -------------------------------------------------------------- halos */
export const HALO_VERT = /* glsl */ `
attribute vec3 aCenter;
attribute float aRadius;
attribute float aPhase;
attribute float aTilt;
attribute float aNode;
attribute float aSeed;

uniform float uTime;
uniform float uActive;   // index of the focused node
uniform float uFocus;    // 0..1 how arrived we are
uniform float uReveal;
uniform float uSize;
uniform float uCollapse;
uniform vec3 uCollapseCenter;

varying float vAct;
varying float vSeed;

void main(){
  // how "focused" is this particle's node right now
  float near = 1.0 - clamp(abs(aNode - uActive), 0.0, 1.0);
  float act = near * uFocus;
  vAct = act;

  // orbit the core; tighten and speed up when the node is in focus
  float speed = 0.3 + act * 0.9;
  float ang = aPhase + uTime * speed;
  float r = aRadius * mix(1.0, 0.7, act);
  vec3 off = vec3(
    cos(ang) * r,
    sin(ang) * r * (0.4 + 0.6 * abs(aTilt)),
    sin(ang) * r * aTilt
  );
  vec3 pos = aCenter + off;
  pos = mix(pos, uCollapseCenter, uCollapse);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;

  float size = uSize * (0.6 + aSeed) * mix(0.6, 1.4, act);
  gl_PointSize = clamp(size * (60.0 / max(-mv.z, 0.1)), 1.0, 26.0) * uReveal;
  vSeed = aSeed;
}
`;

export const HALO_FRAG = /* glsl */ `
precision highp float;
uniform vec3 uCopper;
uniform vec3 uGlow;
uniform float uReveal;
varying float vAct;
varying float vSeed;

void main(){
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float core = smoothstep(0.5, 0.02, d);
  if (core <= 0.001) discard;

  vec3 col = mix(uCopper, uGlow, vAct);
  float a = core * (0.18 + 0.7 * vAct) * uReveal;
  gl_FragColor = vec4(col, a);
}
`;

/* --------------------------------------------------------------- core */
export const CORE_VERT = /* glsl */ `
uniform float uTime;
varying vec3 vN;
varying vec3 vView;
void main(){
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vN = normalize(mat3(modelMatrix) * normal);
  vView = normalize(cameraPosition - wp.xyz);
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

export const CORE_FRAG = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uFocus;
uniform vec3 uAccent;
varying vec3 vN;
varying vec3 vView;
void main(){
  float fres = pow(1.0 - max(dot(vN, vView), 0.0), 2.2);
  float pulse = 0.6 + 0.4 * sin(uTime * 1.4);
  vec3 c = uAccent * (fres * 1.9 + 0.12) * pulse;
  float a = (fres * 0.9 + 0.08) * (0.4 + 0.6 * uFocus);
  gl_FragColor = vec4(c, a);
}
`;
