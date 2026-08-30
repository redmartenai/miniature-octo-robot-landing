"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import type { OSNode } from "@/lib/os/system";

/* ================================================================== *
 * Signature visualisations — one per node. Each is deliberately small
 * and 2D (SVG / DOM), so entering a universe is instant and never spins
 * up a second WebGL context. They read as *systems at work*, not charts.
 * ================================================================== */

const VB = "0 0 400 240";
const ease = [0.22, 1, 0.36, 1] as const;

/* -- Observe: signals converging into one intake ------------------- */
function VizSignals({ node }: { node: OSNode }) {
  const src = node.universe.entities.slice(0, 8);
  return (
    <svg viewBox={VB} className="osx-svg">
      <circle cx={330} cy={120} r={26} fill={node.accent} opacity={0.12} />
      <motion.circle
        cx={330}
        cy={120}
        r={13}
        fill={node.accent}
        animate={{ r: [12, 16, 12], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
      {src.map((s, i) => {
        const y = 26 + (i * (188 - 26)) / (src.length - 1);
        return (
          <g key={s.name}>
            <line x1={70} y1={y} x2={330} y2={120} stroke={node.accent} strokeOpacity={0.14} strokeWidth={1} />
            <circle cx={62} cy={y} r={3} fill={node.accent} />
            <text x={54} y={y + 3.5} textAnchor="end" className="osx-svg-t">
              {s.name}
            </text>
            <motion.circle
              r={2.6}
              fill={node.accent}
              initial={{ cx: 62, cy: y, opacity: 0 }}
              animate={{ cx: [62, 330], cy: [y, 120], opacity: [0, 1, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.22, ease: "easeIn" }}
            />
          </g>
        );
      })}
    </svg>
  );
}

/* -- Understand: a graph knitting itself together ------------------ */
function VizGraph({ node }: { node: OSNode }) {
  const N = 9;
  const pts = Array.from({ length: N }, (_, i) => {
    const a = (i / N) * Math.PI * 2 - Math.PI / 2;
    return { x: 200 + Math.cos(a) * 88, y: 120 + Math.sin(a) * 84 };
  });
  const edges: [number, number][] = [
    [0, 2], [2, 4], [4, 6], [6, 8], [8, 1], [1, 3], [3, 5], [5, 7], [7, 0],
    [0, 4], [2, 6], [1, 5], [3, 7],
  ];
  return (
    <svg viewBox={VB} className="osx-svg">
      {edges.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={pts[a].x} y1={pts[a].y} x2={pts[b].x} y2={pts[b].y}
          stroke={node.accent} strokeWidth={1} strokeOpacity={0.4}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.4 }}
          transition={{ duration: 1.1, delay: 0.2 + i * 0.09, ease }}
        />
      ))}
      {pts.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x} cy={p.y} fill={node.accent}
          initial={{ r: 0 }}
          animate={{ r: [4, 5.5, 4] }}
          transition={{ duration: 2 + (i % 3) * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
        />
      ))}
    </svg>
  );
}

/* -- Plan: futures branch, one path wins --------------------------- */
function VizBranches({ node }: { node: OSNode }) {
  const paths = node.universe.entities.slice(0, 4);
  const winner = 3; // matches the highest-confidence entity in the data
  return (
    <svg viewBox={VB} className="osx-svg">
      <circle cx={44} cy={120} r={6} fill={node.accent} />
      {paths.map((p, i) => {
        const y = 40 + (i * 160) / (paths.length - 1);
        const win = i === winner;
        const d = `M44 120 C 150 120, 190 ${y}, 320 ${y}`;
        return (
          <g key={p.name}>
            <motion.path
              d={d} fill="none"
              stroke={node.accent}
              strokeWidth={win ? 2.4 : 1}
              strokeOpacity={win ? 0.95 : 0.22}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.2 + i * 0.15, ease }}
            />
            <circle cx={320} cy={y} r={win ? 5 : 3} fill={node.accent} fillOpacity={win ? 1 : 0.3} />
            <text x={330} y={y + 3.5} className="osx-svg-t" fill={win ? node.accent : undefined} opacity={win ? 1 : 0.5}>
              {p.name}
            </text>
            {win && (
              <motion.circle
                r={3} fill="#fff"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0], offsetDistance: ["0%", "100%"] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: 1.2, ease: "easeInOut" }}
                style={{ offsetPath: `path("${d}")` } as React.CSSProperties}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* -- Execute: agents as living workers ----------------------------- */
function VizAgents({ node }: { node: OSNode }) {
  return (
    <div className="osx-agents">
      {node.universe.entities.map((a, i) => (
        <motion.div
          key={a.name}
          className="osx-agent"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08, ease }}
        >
          <span className="dot" style={{ background: node.accent }}>
            <motion.i
              animate={{ opacity: [1, 0.25, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.3 }}
            />
          </span>
          <span className="nm">{a.name}</span>
          <span className="track">
            <motion.span
              className="fill"
              style={{ background: node.accent }}
              animate={{ width: ["8%", "92%", "40%", "78%"] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
            />
          </span>
          <span className="mt">{a.meta}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* -- Learn: outcomes loop back and reshape the system -------------- */
function VizLoop({ node }: { node: OSNode }) {
  const d = "M200 40 A 80 80 0 1 1 199 40";
  return (
    <svg viewBox={VB} className="osx-svg">
      <circle cx={200} cy={120} r={80} fill="none" stroke={node.accent} strokeOpacity={0.16} strokeWidth={1} />
      <motion.path
        d={d} fill="none" stroke={node.accent} strokeWidth={2} strokeOpacity={0.6}
        strokeDasharray="6 10"
        animate={{ strokeDashoffset: [0, -160] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      <circle cx={200} cy={120} r={30} fill={node.accent} opacity={0.1} />
      <motion.circle
        cx={200} cy={120} r={18} fill={node.accent}
        animate={{ r: [16, 21, 16], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      {[0, 1, 2, 3].map((i) => (
        <motion.circle
          key={i} r={3.4} fill={node.accent}
          animate={{ offsetDistance: ["0%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: i * 0.75 }}
          style={{ offsetPath: `path("${d}")` } as React.CSSProperties}
        />
      ))}
    </svg>
  );
}

/* -- Govern: every action becomes an auditable record ------------- */
function VizLedger({ node }: { node: OSNode }) {
  const rows = node.universe.entities;
  return (
    <div className="osx-ledger">
      {rows.map((r, i) => (
        <motion.div
          key={r.name}
          className="osx-ledger-row"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + i * 0.12, ease }}
        >
          <span className="lk" style={{ borderColor: node.accent, color: node.accent }}>✓</span>
          <span className="nm">{r.name}</span>
          <span className="mt">{r.meta}</span>
          <span className="hash">0x{(0xa11ce + i * 0x1f3d).toString(16)}</span>
        </motion.div>
      ))}
    </div>
  );
}

function Viz({ node }: { node: OSNode }) {
  switch (node.universe.viz) {
    case "signals": return <VizSignals node={node} />;
    case "graph": return <VizGraph node={node} />;
    case "branches": return <VizBranches node={node} />;
    case "agents": return <VizAgents node={node} />;
    case "loop": return <VizLoop node={node} />;
    case "ledger": return <VizLedger node={node} />;
  }
}

/* ================================================================== */
export function Universe({ node, onClose }: { node: OSNode; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      className="osx-universe"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease }}
      onClick={onClose}
    >
      <motion.div
        className="osx-universe-in"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 26, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 18, opacity: 0 }}
        transition={{ duration: 0.6, ease }}
      >
        <button className="osx-universe-x" onClick={onClose} aria-label="Exit universe">
          ✕ <span>Exit</span>
        </button>

        <div className="osx-universe-grid">
          <div className="osx-universe-copy">
            <span className="kick" style={{ color: node.accent }}>
              {node.numeral} · {node.universe.kicker}
            </span>
            <h2>{node.title}</h2>
            <p className="head">{node.headline}</p>
            <p className="intro">{node.universe.intro}</p>
            {node.universe.viz !== "agents" && node.universe.viz !== "ledger" && (
              <div className="osx-chips">
                {node.universe.entities.map((e) => (
                  <span key={e.name} className="chip">
                    {e.name}
                    <i>{e.meta}</i>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="osx-universe-viz" style={{ ["--accent" as string]: node.accent }}>
            <Viz node={node} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
