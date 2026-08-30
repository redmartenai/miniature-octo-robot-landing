"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import { MartenMark } from "@/brand/MartenLogo";
import { World } from "./World";
import { Pulse } from "./Pulse";
import { Universe } from "./Universe";
import { BriefStage } from "./BriefStage";
import { useScrollProgress } from "./useScrollProgress";
import { hasWebGL, budget, type Budget } from "./geometry";
import { NODES, COPY, BRIEF, nodeAt, type OSNode } from "@/lib/os/system";
import type { Feeds } from "./World";

const ease = [0.22, 1, 0.36, 1] as const;
type Mode = "travel" | "brief";

export function OSExperience() {
  /* ---- imperative feeds shared with the WebGL world ---- */
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const collapse = useRef(0);
  const reveal = useRef(0);
  // stable identity — holds refs only, so the WebGL world never re-renders
  // when the HUD's React state changes
  const feeds = useMemo<Feeds>(
    () => ({ progress, pointer, collapse, reveal }),
    [],
  );

  /* ---- DOM refs updated per-frame (kept out of React state) ---- */
  const railRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const exploreRef = useRef<HTMLButtonElement>(null);
  const briefBtnRef = useRef<HTMLDivElement>(null);
  const idxRef = useRef(-1);

  /* ---- sparse React state ---- */
  const [ready, setReady] = useState<boolean | null>(null);
  const [reduced, setReduced] = useState(false);
  const [budgets, setBudgets] = useState<Budget | null>(null);
  const [entered, setEntered] = useState(false);
  const [active, setActive] = useState(0);
  const [openNode, setOpenNode] = useState<OSNode | null>(null);
  const [mode, setMode] = useState<Mode>("travel");

  /* ---- capability + device probe ---- */
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setReady(hasWebGL());
    setBudgets(budget());
    window.scrollTo(0, 0);
  }, []);

  /* the organism breathes behind the gate the moment WebGL is ready */
  useEffect(() => {
    reveal.current = ready ? 1 : 0;
  }, [ready]);

  /* body scroll: locked until entered, and whenever an overlay is up */
  useEffect(() => {
    const lock = !entered || !!openNode || mode === "brief";
    document.body.style.overflow = lock ? "hidden" : "";
    document.body.classList.add("osx-body");
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("osx-body");
    };
  }, [entered, openNode, mode]);

  /* pointer parallax */
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  /* smooth scroll → progress */
  const lenisRef = useScrollProgress(entered && !reduced && ready === true, (p) => {
    progress.current = p;
  });

  /* pause the journey while an overlay owns the screen */
  useEffect(() => {
    const l = lenisRef.current;
    if (!l) return;
    if (openNode || mode === "brief") l.stop();
    else l.start();
  }, [openNode, mode, lenisRef]);

  /* collapse the world during the signature moment */
  useEffect(() => {
    collapse.current = mode === "brief" ? 1 : 0;
  }, [mode]);

  /* ---- the per-frame HUD driver (imperative, cheap) ---- */
  useEffect(() => {
    if (!entered) return;
    let raf = 0;
    const tick = () => {
      const p = progress.current;
      const { node, focus } = nodeAt(p);

      if (railRef.current) railRef.current.style.width = `${p * 100}%`;

      if (captionRef.current) {
        const o = mode === "brief" ? 0 : Math.max(0, (focus - 0.12) / 0.88);
        captionRef.current.style.opacity = String(o);
        captionRef.current.style.transform = `translateY(${(1 - o) * 18}px)`;
      }
      if (exploreRef.current) {
        const on = focus > 0.55 && mode === "travel" && !openNode;
        exploreRef.current.style.opacity = on ? "1" : "0";
        exploreRef.current.style.pointerEvents = on ? "auto" : "none";
      }
      if (briefBtnRef.current) {
        const on = p > 0.9 && mode === "travel";
        briefBtnRef.current.style.opacity = on ? "1" : "0";
        briefBtnRef.current.style.transform = `translateY(${on ? 0 : 14}px)`;
        briefBtnRef.current.style.pointerEvents = on ? "auto" : "none";
      }

      if (node.index !== idxRef.current) {
        idxRef.current = node.index;
        setActive(node.index);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [entered, mode, openNode]);

  const goTo = (n: OSNode) => {
    const l = lenisRef.current;
    if (l) l.scrollTo(n.p * (document.body.scrollHeight - window.innerHeight));
  };

  const replay = () => {
    setMode("travel");
    const l = lenisRef.current;
    if (l) l.scrollTo(0, { immediate: false });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ---------- static fallback (no WebGL / reduced motion) ---------- */
  if (reduced || ready === false) {
    return (
      <div className="osx-static">
        <div className="in">
          <MartenMark size={44} />
          <h1>{COPY.systemName}</h1>
          <div className="verbs">
            {NODES.map((n) => (
              <span key={n.id}>{n.title}</span>
            ))}
          </div>
          <p className="lede">
            Connect any data. Create autonomous intelligence. Let AI execute the
            work — while every action stays permissioned and auditable.
          </p>
          <div className="osx-brief-label">
            This morning · thousands of signals became three decisions
          </div>
          <div className="osx-brief-list plain">
            {BRIEF.map((r) => (
              <article key={r.n}>
                <span className="n">{r.n}</span>
                <div className="body">
                  <span className="dom">{r.domain}</span>
                  <h3>{r.title}</h3>
                  <p>{r.detail}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="final">
            {COPY.finalHead} <span className="em">{COPY.finalHeadEm}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* the living world */}
      {budgets && ready && (
        <Canvas
          className="osx-gl"
          style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh" }}
          dpr={[1, 1.75]}
          gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
          camera={{ position: [-2, 4, 40], fov: 46, near: 0.1, far: 260 }}
        >
          <World feeds={feeds} budget={budgets} />
        </Canvas>
      )}

      {/* tall spacer — gives the document its scrollable height */}
      <div className="osx-scroll" aria-hidden />

      {/* --------------------------- HUD --------------------------- */}
      <div className="osx-hud">
        <div className="osx-brand">
          <MartenMark size={20} />
          <b>Red Marten</b>
          <span>Autonomous OS</span>
        </div>

        <Pulse frozen={mode === "brief"} />

        {/* the arriving-node headline, centre stage */}
        <div className="osx-caption" ref={captionRef}>
          <span className="num">
            {NODES[active].numeral} / {String(NODES.length).padStart(2, "0")}
          </span>
          <h2>{NODES[active].headline}</h2>
          <p>{NODES[active].line}</p>
          <button
            ref={exploreRef}
            className="osx-explore"
            onClick={() => setOpenNode(NODES[active])}
            style={{ ["--accent" as string]: NODES[active].accent }}
          >
            Enter the {NODES[active].title} universe →
          </button>
        </div>

        {/* chapter marker, bottom-left */}
        <div className="osx-chapter">
          <span className="idx" style={{ color: NODES[active].accent }}>
            Node {NODES[active].numeral} / VI
          </span>
          <span className="nm">{NODES[active].title}</span>
        </div>

        {/* node map, bottom-centre — click to enter any universe */}
        <nav className="osx-map" aria-label="System nodes">
          {NODES.map((n) => (
            <button
              key={n.id}
              className={`osx-map-node ${n.index === active ? "on" : ""}`}
              style={{ ["--accent" as string]: n.accent }}
              onClick={() => setOpenNode(n)}
              onDoubleClick={() => goTo(n)}
            >
              <i />
              <span>{n.title}</span>
            </button>
          ))}
        </nav>

        {/* Generate Brief — appears at the end of the journey */}
        <div className="osx-brief-btn" ref={briefBtnRef}>
          <button className="osx-btn glow" onClick={() => setMode("brief")}>
            Generate brief
          </button>
        </div>

        {/* scroll hint */}
        <div className="osx-hint">
          <span>Scroll to travel</span>
          <i />
        </div>

        {/* progress rail */}
        <div className="osx-rail">
          <div ref={railRef} />
        </div>
      </div>

      {/* node universe */}
      <AnimatePresence>
        {openNode && (
          <Universe node={openNode} onClose={() => setOpenNode(null)} />
        )}
      </AnimatePresence>

      {/* signature moment */}
      <AnimatePresence>
        {mode === "brief" && (
          <motion.div
            className="osx-brief-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <BriefStage onReplay={replay} onEnter={replay} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* --------------------------- gate / opening scene -------------- */}
      <AnimatePresence>
        {!entered && (
          <motion.div
            className="osx-gate"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease }}
          >
            <div className="osx-gate-in">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.9, ease }}
              >
                <MartenMark size={46} motion={ready ? "leap" : undefined} />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 1, ease }}
              >
                {COPY.systemName}
              </motion.h1>

              <motion.div
                className="osx-gate-verbs"
                initial="hide"
                animate="show"
                variants={{ show: { transition: { delayChildren: 1.4, staggerChildren: 0.12 } } }}
              >
                {NODES.map((n) => (
                  <motion.span
                    key={n.id}
                    variants={{ hide: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                  >
                    {n.title}
                  </motion.span>
                ))}
              </motion.div>

              <motion.div
                className="osx-gate-go"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.4, duration: 0.8 }}
              >
                <button
                  className="osx-btn glow"
                  disabled={!ready}
                  onClick={() => setEntered(true)}
                >
                  {ready ? "Enter the system" : "Waking the organism…"}
                </button>
                <p className="hint">
                  Connect any data. Create autonomous intelligence. Let it execute.
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
