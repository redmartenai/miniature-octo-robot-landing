"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SectionHead } from "./SectionHead";
import { AppFrame } from "./AppFrame";
import { LedgerLine } from "./LedgerLine";

type RunState = "idle" | "queued" | "running" | "done";
type Node = {
  id: string;
  code: string;
  name: string;
  cat: string;
  x: number;
  y: number;
  model?: string;
  prompt?: string;
  inputs?: string;
};

const W = 760;
const H = 380;
const NODE_W = 176; // .cv-node width, in CSS px
const NODE_MID = 32; // vertical centre of a node, in CSS px

const INIT_NODES: Node[] = [
  { id: "n1", code: "MT", name: "Manual trigger", cat: "Triggers", x: 40, y: 156, inputs: "604 accounts on the list" },
  { id: "n2", code: "EN", name: "Enrich & score", cat: "Enrichment", x: 250, y: 60, model: "internal", inputs: "38 attributes / record" },
  { id: "n3", code: "RM", name: "Marten reason", cat: "AI", x: 250, y: 250, model: "claude-opus-4-8", prompt: "Classify intent; escalate only what needs a human." },
  { id: "n4", code: "SD", name: "Draft outreach", cat: "Agents", x: 480, y: 156, model: "claude-sonnet-4-6", prompt: "Write a 3-touch sequence. Stop on reply." },
  { id: "n5", code: "SL", name: "Notify revenue", cat: "Notify", x: 660, y: 156, inputs: "#revenue-alerts" },
];

const EDGES: [string, string][] = [
  ["n1", "n2"],
  ["n1", "n3"],
  ["n2", "n4"],
  ["n3", "n4"],
  ["n4", "n5"],
];

const RUN_ORDER = ["n1", "n2", "n3", "n4", "n5"];

const LIBRARY: [string, string[]][] = [
  ["Triggers", ["Manual", "Schedule", "Webhook"]],
  ["Data", ["Query", "Filter"]],
  ["Enrichment", ["Enrich", "Score"]],
  ["AI", ["Reason", "Classify"]],
  ["Agents", ["SDR", "Researcher"]],
  ["Voice", ["Call", "Transcribe"]],
  ["CRM", ["Read", "Write"]],
  ["Email", ["Draft", "Send"]],
  ["Logic", ["Branch", "Merge"]],
  ["Search", ["Web", "Company"]],
  ["Analytics", ["Track", "Attribute"]],
  ["Notify", ["Slack", "Teams"]],
  ["Storage", ["Save", "Export"]],
  ["Utilities", ["HTTP", "Delay"]],
];

/* The graph lives in a 760x380 coordinate space that is stretched to the
   surface width, but nodes keep a fixed pixel width. So x maps onto the
   span that is actually available to a node's left edge (surface - node),
   and wire anchors convert back into the stretched space with k. */
const mapX = (x: number, span: number) => (x / W) * span;
const anchor = (n: Node, side: "in" | "out", span: number, k: number) => ({
  x: (mapX(n.x, span) + (side === "out" ? NODE_W : 0)) * k,
  y: n.y + NODE_MID * k,
});

const wirePath = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const dx = Math.max(40, (b.x - a.x) * 0.5);
  return `M ${a.x} ${a.y} C ${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`;
};

export function Canvas() {
  const [nodes, setNodes] = useState<Node[]>(INIT_NODES);
  const [state, setState] = useState<Record<string, RunState>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [tab, setTab] = useState<"build" | "runs" | "logs">("build");
  const [logs, setLogs] = useState<{ time: string; text: string }[]>([]);
  const [running, setRunning] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const byId = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const run = useCallback(() => {
    clearTimers();
    setRunning(true);
    setLogs([]);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stepMs = reduce ? 0 : 620;
    const base = { ...Object.fromEntries(RUN_ORDER.map((id) => [id, "queued" as RunState])) };
    setState(base);
    const clock = ["07:58", "07:59", "08:00", "08:00", "08:00"];
    RUN_ORDER.forEach((id, i) => {
      const t1 = setTimeout(() => {
        setState((s) => ({ ...s, [id]: "running" }));
      }, i * stepMs);
      const t2 = setTimeout(() => {
        setState((s) => ({ ...s, [id]: "done" }));
        setLogs((l) => [...l, { time: clock[i], text: `${byId[id].code} · ${byId[id].name} · done` }]);
        if (i === RUN_ORDER.length - 1) setRunning(false);
      }, i * stepMs + stepMs * 0.7);
      timers.current.push(t1, t2);
    });
  }, [byId, clearTimers]);

  /* drag a node within bounds */
  const drag = useRef<{ id: string; dx: number; dy: number } | null>(null);
  const surfRef = useRef<HTMLDivElement>(null);

  /* Surface width drives the x mapping: nodes are a fixed pixel width, so
     the space a node's left edge can occupy is (surface - node), not the
     whole surface. Without this the right-hand node overflows the canvas
     on wide screens and collides with its neighbour on narrow ones. */
  const [surfW, setSurfW] = useState(W);
  useEffect(() => {
    const el = surfRef.current;
    if (!el) return;
    const measure = () => setSurfW(el.getBoundingClientRect().width || W);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const span = Math.max(1, surfW - NODE_W);
  const k = W / Math.max(1, surfW); // px -> stretched viewBox units

  const onPointerDown = (e: React.PointerEvent, id: string) => {
    const n = byId[id];
    const rect = surfRef.current?.getBoundingClientRect();
    if (!rect) return;
    drag.current = {
      id,
      dx: e.clientX - rect.left - mapX(n.x, span),
      dy: (e.clientY - rect.top) * (H / rect.height) - n.y,
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const rect = surfRef.current?.getBoundingClientRect();
    if (!d || !rect) return;
    const x = Math.max(0, Math.min(W, ((e.clientX - rect.left - d.dx) / span) * W));
    const yScale = H / rect.height;
    const y = Math.max(0, Math.min(H - 64 * yScale, (e.clientY - rect.top) * yScale - d.dy));
    setNodes((ns) => ns.map((n) => (n.id === d.id ? { ...n, x, y } : n)));
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  const sel = selected ? byId[selected] : null;

  return (
    <section className="sec" id="canvas">
      <div className="wrap">
        <SectionHead
          n="03"
          kicker="AI Workflows"
          title={
            <>
              Build it on a canvas, <span className="em">watch it run.</span>
            </>
          }
          dek="Drag from a library of 494 nodes across 14 categories. Branch on conditions, run steps in parallel, and watch tokens travel the wire as the graph executes."
        />

        <AppFrame
          url="acme-revops.redmarten.app/workflows/signal-to-outreach"
          status={
            <span className="af-live">
              <i /> {running ? "executing" : "ready"}
            </span>
          }
        >
          <div className="cv-tabs" role="tablist" aria-label="Workflow views">
            {(["build", "runs", "logs"] as const).map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                className={`cv-tab${tab === t ? " on" : ""}`}
                onClick={() => setTab(t)}
              >
                {t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
            <button className="cv-run" onClick={run} disabled={running}>
              {running ? "Running…" : "▶ Run"}
            </button>
          </div>

          {tab === "build" && (
            <div className="cv-shell">
              <aside className="cv-rail" aria-label="Node library">
                {LIBRARY.map(([cat, items]) => (
                  <div className="cv-cat" key={cat}>
                    <div className="cv-cat-h">{cat}</div>
                    {items.map((it) => (
                      <div className="cv-node-lib" key={it} draggable={false}>
                        {it}
                      </div>
                    ))}
                  </div>
                ))}
              </aside>

              <div
                className="cv-surface"
                ref={surfRef}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerUp}
              >
                <div className="cv-scale" style={{ aspectRatio: `${W} / ${H}` }}>
                  <svg className="cv-wires" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden>
                    {EDGES.map(([f, t]) => {
                      const active = state[f] === "done" && (state[t] === "running" || state[t] === "done");
                      return (
                        <path
                          key={f + t}
                          className={`cv-wire${active ? " flow" : ""}`}
                          d={wirePath(anchor(byId[f], "out", span, k), anchor(byId[t], "in", span, k))}
                        />
                      );
                    })}
                  </svg>

                  {nodes.map((n) => {
                    const st = state[n.id] ?? "idle";
                    return (
                      <button
                        key={n.id}
                        className={`cv-node ${st}${selected === n.id ? " sel" : ""}`}
                        style={{ left: `${mapX(n.x, span)}px`, top: `${(n.y / H) * 100}%` }}
                        onPointerDown={(e) => onPointerDown(e, n.id)}
                        onClick={() => setSelected(n.id)}
                      >
                        <span className="cv-node-h">
                          <span className="cv-pi">{n.code}</span>
                          <b>{n.name}</b>
                        </span>
                        <span className="cv-node-cat">{n.cat}</span>
                        {st !== "idle" && <span className={`cv-badge ${st}`}>{st}</span>}
                      </button>
                    );
                  })}
                </div>

                {sel && (
                  <aside className="cv-inspector" aria-label={`${sel.name} configuration`}>
                    <div className="cv-insp-h">
                      <span className="cv-pi">{sel.code}</span>
                      <b>{sel.name}</b>
                      <button className="cv-insp-x" onClick={() => setSelected(null)} aria-label="Close inspector">
                        ✕
                      </button>
                    </div>
                    <dl className="cv-insp-body">
                      <dt>Category</dt>
                      <dd>{sel.cat}</dd>
                      {sel.model && (
                        <>
                          <dt>Model</dt>
                          <dd>{sel.model}</dd>
                        </>
                      )}
                      {sel.inputs && (
                        <>
                          <dt>Inputs</dt>
                          <dd>{sel.inputs}</dd>
                        </>
                      )}
                      {sel.prompt && (
                        <>
                          <dt>Prompt</dt>
                          <dd className="cv-insp-prompt">{sel.prompt}</dd>
                        </>
                      )}
                    </dl>
                    <p className="cv-insp-note">Read-only preview</p>
                  </aside>
                )}
              </div>
            </div>
          )}

          {tab === "runs" && (
            <div className="cv-runs">
              {[
                ["08:00", "signal-to-outreach", "5 nodes · 412 accounts · succeeded"],
                ["Yesterday 08:00", "signal-to-outreach", "5 nodes · 388 accounts · succeeded"],
                ["Mon 08:00", "stalled-deal-recovery", "4 nodes · 12 opportunities · succeeded"],
              ].map(([when, wf, meta]) => (
                <div className="cv-run-row" key={when}>
                  <span className="cv-run-when">{when}</span>
                  <span className="cv-run-wf">{wf}</span>
                  <span className="cv-run-meta">{meta}</span>
                  <span className="cv-run-ok">✓</span>
                </div>
              ))}
            </div>
          )}

          {tab === "logs" && (
            <div className="cv-logs">
              {logs.length === 0 ? (
                <p className="cv-logs-empty">Run the workflow to see the log — every step is written to the record.</p>
              ) : (
                <ol className="ledger">
                  {logs.map((e, i) => (
                    <LedgerLine key={i} time={e.time}>
                      {e.text}
                    </LedgerLine>
                  ))}
                </ol>
              )}
            </div>
          )}
        </AppFrame>

        <figcaption className="figure-cap cv-cap">
          <b>Fig. 1</b> — A real workflow: drag a node, open its config, press Run and watch the
          graph light up. Every step lands in <b>Logs</b> — and in the record.
        </figcaption>
      </div>
    </section>
  );
}
