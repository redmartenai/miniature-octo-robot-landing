"use client";

import { memo, useMemo, useRef, type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import {
  buildTissue,
  buildSignals,
  buildHalos,
  spineAt,
  spineT,
  spineUniforms,
  NODE_CENTERS,
  type Budget,
} from "./geometry";
import {
  TISSUE_VERT,
  TISSUE_FRAG,
  SIGNAL_VERT,
  SIGNAL_FRAG,
  HALO_VERT,
  HALO_FRAG,
  CORE_VERT,
  CORE_FRAG,
} from "./shaders";
import { NODES, PALETTE, nodeAt } from "@/lib/os/system";

export type NumRef = MutableRefObject<number>;
export type PtrRef = MutableRefObject<{ x: number; y: number }>;

const damp = THREE.MathUtils.damp;
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/* Everything implodes toward the final node during the signature moment. */
const COLLAPSE_CENTER = new THREE.Vector3(...NODE_CENTERS[NODES.length - 1]);

/* Palette as THREE.Color, built once. */
const COL = {
  earth: new THREE.Color(PALETTE.earth),
  copper: new THREE.Color(PALETTE.copper),
  glow: new THREE.Color(PALETTE.glow),
};

export interface Feeds {
  progress: NumRef;
  pointer: PtrRef;
  collapse: NumRef;
  reveal: NumRef;
}

/* ------------------------------------------------------------ tissue */
function Tissue({ count, feeds }: { count: number; feeds: Feeds }) {
  const g = useMemo(() => buildTissue(count), [count]);
  const u = useMemo(
    () => ({
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uSize: { value: 3.0 },
      uCollapse: { value: 0 },
      uCollapseCenter: { value: COLLAPSE_CENTER },
      uEarth: { value: COL.earth },
      uCopper: { value: COL.copper },
      ...spineUniforms(),
    }),
    [],
  );

  useFrame((_, dt) => {
    u.uTime.value += dt;
    u.uReveal.value = damp(u.uReveal.value, feeds.reveal.current, 2.4, dt);
    u.uCollapse.value = damp(u.uCollapse.value, feeds.collapse.current, 3.5, dt);
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[g.pos, 3]} />
        <bufferAttribute attach="attributes-aT" args={[g.aT, 1]} />
        <bufferAttribute attach="attributes-aRadial" args={[g.aRadial, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[g.aSeed, 1]} />
        <bufferAttribute attach="attributes-aScale" args={[g.aScale, 1]} />
      </bufferGeometry>
      <shaderMaterial
        args={[
          {
            uniforms: u,
            vertexShader: TISSUE_VERT,
            fragmentShader: TISSUE_FRAG,
            transparent: true,
            depthWrite: false,
            depthTest: false,
          },
        ]}
      />
    </points>
  );
}

/* ----------------------------------------------------------- signals */
function SignalStream({ count, feeds }: { count: number; feeds: Feeds }) {
  const g = useMemo(() => buildSignals(count), [count]);
  const u = useMemo(
    () => ({
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uSize: { value: 3.4 },
      uCollapse: { value: 0 },
      uCollapseCenter: { value: COLLAPSE_CENTER },
      uGlow: { value: COL.glow },
      ...spineUniforms(),
    }),
    [],
  );

  useFrame((_, dt) => {
    u.uTime.value += dt;
    u.uReveal.value = damp(u.uReveal.value, feeds.reveal.current, 2.4, dt);
    u.uCollapse.value = damp(u.uCollapse.value, feeds.collapse.current, 3.5, dt);
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[g.pos, 3]} />
        <bufferAttribute attach="attributes-aStart" args={[g.aStart, 1]} />
        <bufferAttribute attach="attributes-aSpeed" args={[g.aSpeed, 1]} />
        <bufferAttribute attach="attributes-aAngle" args={[g.aAngle, 1]} />
        <bufferAttribute attach="attributes-aReach" args={[g.aReach, 1]} />
        <bufferAttribute attach="attributes-aSeed" args={[g.aSeed, 1]} />
      </bufferGeometry>
      <shaderMaterial
        args={[
          {
            uniforms: u,
            vertexShader: SIGNAL_VERT,
            fragmentShader: SIGNAL_FRAG,
            transparent: true,
            depthWrite: false,
            depthTest: false,
            blending: THREE.AdditiveBlending,
          },
        ]}
      />
    </points>
  );
}

/* ------------------------------------------------------------- halos */
function Halos({ perNode, feeds }: { perNode: number; feeds: Feeds }) {
  const g = useMemo(() => buildHalos(perNode), [perNode]);
  const u = useMemo(
    () => ({
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uSize: { value: 3.0 },
      uActive: { value: 0 },
      uFocus: { value: 0 },
      uCollapse: { value: 0 },
      uCollapseCenter: { value: COLLAPSE_CENTER },
      uCopper: { value: COL.copper },
      uGlow: { value: COL.glow },
    }),
    [],
  );

  useFrame((_, dt) => {
    u.uTime.value += dt;
    u.uReveal.value = damp(u.uReveal.value, feeds.reveal.current, 2.4, dt);
    u.uCollapse.value = damp(u.uCollapse.value, feeds.collapse.current, 3.5, dt);
    const { node, focus } = nodeAt(feeds.progress.current);
    u.uActive.value = damp(u.uActive.value, node.index, 5, dt);
    u.uFocus.value = damp(u.uFocus.value, focus, 4, dt);
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[g.aCenter, 3]} />
        <bufferAttribute attach="attributes-aCenter" args={[g.aCenter, 3]} />
        <bufferAttribute attach="attributes-aRadius" args={[g.aRadius, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[g.aPhase, 1]} />
        <bufferAttribute attach="attributes-aTilt" args={[g.aTilt, 1]} />
        <bufferAttribute attach="attributes-aNode" args={[g.aNode, 1]} />
        <bufferAttribute attach="attributes-aSeed" args={[g.aSeed, 1]} />
      </bufferGeometry>
      <shaderMaterial
        args={[
          {
            uniforms: u,
            vertexShader: HALO_VERT,
            fragmentShader: HALO_FRAG,
            transparent: true,
            depthWrite: false,
            depthTest: false,
            blending: THREE.AdditiveBlending,
          },
        ]}
      />
    </points>
  );
}

/* ------------------------------------------------------------- cores */
function NodeCore({ index, feeds }: { index: number; feeds: Feeds }) {
  const ref = useRef<THREE.Mesh>(null!);
  const node = NODES[index];
  const u = useMemo(
    () => ({
      uTime: { value: 0 },
      uFocus: { value: 0 },
      uAccent: { value: new THREE.Color(node.accent) },
    }),
    [node.accent],
  );

  useFrame((_, dt) => {
    u.uTime.value += dt;
    const { node: active, focus } = nodeAt(feeds.progress.current);
    const f = active.index === index ? focus : 0.05;
    u.uFocus.value = damp(u.uFocus.value, f * (1 - feeds.collapse.current), 4, dt);
    const s = 0.9 + u.uFocus.value * 0.8;
    ref.current.scale.setScalar(s);
    ref.current.rotation.y += dt * 0.2;
    ref.current.rotation.x += dt * 0.06;
  });

  return (
    <mesh ref={ref} position={NODE_CENTERS[index]}>
      <icosahedronGeometry args={[1.15, 3]} />
      <shaderMaterial
        args={[
          {
            uniforms: u,
            vertexShader: CORE_VERT,
            fragmentShader: CORE_FRAG,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          },
        ]}
      />
    </mesh>
  );
}

/* ------------------------------------------------------- camera rig */
function CameraRig({ feeds }: { feeds: Feeds }) {
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3());
  const collapsePos = useMemo(
    () => COLLAPSE_CENTER.clone().add(new THREE.Vector3(0, 1.5, 21)),
    [],
  );

  // scroll → parameter along the spine (first node at p≈0.1, last at p≈0.86)
  const T0 = spineT(NODES[0].x);
  const T5 = spineT(NODES[NODES.length - 1].x);

  useFrame((state, dt) => {
    const p = clamp01(feeds.progress.current);
    const camT = T0 + ((p - 0.1) / (0.86 - 0.1)) * (T5 - T0);
    const focus = spineAt(camT);
    const lead = spineAt(camT + 0.015);
    const col = feeds.collapse.current;

    const idle = state.clock.elapsedTime;
    const par = feeds.pointer.current;
    const px = par.x * (1 - col);
    const py = par.y * (1 - col);

    // travelling framing — a calm 3/4 view riding just above the filament
    const travelX = focus[0] + px * 2.6 + Math.sin(idle * 0.1) * 0.4;
    const travelY = focus[1] + 3.0 + py * 1.6 + Math.cos(idle * 0.12) * 0.3;
    const travelZ = focus[2] + 16.5;

    // blend to a centred framing of the core as the world implodes
    const tx = THREE.MathUtils.lerp(travelX, collapsePos.x, col);
    const ty = THREE.MathUtils.lerp(travelY, collapsePos.y, col);
    const tz = THREE.MathUtils.lerp(travelZ, collapsePos.z, col);

    camera.position.x = damp(camera.position.x, tx, 3, dt);
    camera.position.y = damp(camera.position.y, ty, 3, dt);
    camera.position.z = damp(camera.position.z, tz, 3, dt);

    look.current.set(
      THREE.MathUtils.lerp(lead[0], COLLAPSE_CENTER.x, col),
      THREE.MathUtils.lerp(lead[1], COLLAPSE_CENTER.y, col),
      THREE.MathUtils.lerp(lead[2], COLLAPSE_CENTER.z, col),
    );
    camera.lookAt(look.current);

    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = damp(cam.fov, 46 - col * 6, 3, dt);
    cam.updateProjectionMatrix();
  });

  return null;
}

/* ------------------------------------------------------------ scene */
function WorldImpl({ feeds, budget }: { feeds: Feeds; budget: Budget }) {
  return (
    <>
      <color attach="background" args={[PALETTE.bg]} />
      <fog attach="fog" args={[PALETTE.bg, 22, 120]} />
      <CameraRig feeds={feeds} />
      <Tissue count={budget.tissue} feeds={feeds} />
      <SignalStream count={budget.signals} feeds={feeds} />
      <Halos perNode={budget.halo} feeds={feeds} />
      {NODES.map((n) => (
        <NodeCore key={n.id} index={n.index} feeds={feeds} />
      ))}
      <EffectComposer multisampling={0}>
        <Bloom
          mipmapBlur
          intensity={0.85}
          luminanceThreshold={0.62}
          luminanceSmoothing={0.3}
          radius={0.7}
        />
        <Vignette offset={0.28} darkness={0.42} eskil={false} />
      </EffectComposer>
    </>
  );
}

/* Stable props → the world builds its buffers and compiles its shaders once,
   and ignores the HUD's frequent React re-renders. */
export const World = memo(WorldImpl);
