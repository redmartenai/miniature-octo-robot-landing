"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MartenMark } from "@/brand/MartenLogo";
import { Head, Rise } from "./Shell";
import { Glyph } from "./Glyph";
import {
  CAP_ORDER,
  CAPABILITY,
  CATS,
  NODE_TOTAL,
  RUNTIME,
  TEMPLATES,
  catOf,
  type NodeState,
  type WfNode,
  type WfTemplate,
} from "@/lib/rm/workflow";
import { useBox, useInView, useReduced } from "@/lib/rm/motion";

/* ============================================================
   FRAME 02 — PRODUCT · THE WORKFLOW BUILDER

   The previous frame claimed six capabilities and drew a ring.
   This one shows the thing itself: the same dark board the hero
   runs on, with the library on the left and the run log on the
   right. Pick a template and the graph draws itself node by
   node, then executes — steps move queued → running → done, the
   token marches the wire it is actually on, the untaken branch
   greys out, and the run stops at the human when the mandate
   says it must. Click any node to read its configuration.

   Nothing here is decorative: every node, every log line and
   every count comes from lib/rm/workflow.ts.
   ============================================================ */

type Phase = "idle" | "build" | "run" | "done";

const NH = 54;
const CLOCK0 = 2 * 3600 + 14 * 60 + 7; /* 02:14:07 — the night shift */

const clock = (s: number) =>
  [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");

export function Product() {
  const reduced = useReduced();
  const { ref: seenRef, seen } = useInView<HTMLDivElement>();
  const [tplId, setTplId] = useState(TEMPLATES[0].id);
  const [runKey, setRunKey] = useState(0);
  const [pick, setPick] = useState<string | null>(null);

  const tpl = useMemo(() => TEMPLATES.find((t) => t.id === tplId)!, [tplId]);

  /* ---- the run itself ---- */
  const [phase, setPhase] = useState<Phase>("idle");
  const [built, setBuilt] = useState(0);
  const [cursor, setCursor] = useState(-1);
  const [logs, setLogs] = useState<{ t: string; k: string; m: string; hold?: boolean }[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  const byId = useCallback((id: string) => tpl.nodes.find((n) => n.id === id)!, [tpl]);

  useEffect(() => {
    if (!seen) return;
    setPhase("build");
    setBuilt(0);
    setCursor(-1);
    setLogs([]);
    setPick(null);

    /* everyone who asked for less motion gets the finished run */
    if (reduced) {
      let s = CLOCK0;
      setBuilt(tpl.nodes.length);
      setCursor(tpl.path.length);
      setLogs(
        tpl.path.map((id) => {
          const n = byId(id);
          s += Math.round(n.ms / 1000) + 1 + (n.wait ?? 0);
          return { t: clock(s), k: n.k, m: n.log, hold: id === tpl.hold };
        }),
      );
      setPhase("done");
      return;
    }

    let alive = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) =>
      new Promise<void>((res) => {
        timers.push(setTimeout(res, ms));
      });

    (async () => {
      /* 1 — the graph draws itself, left to right */
      for (let i = 0; i < tpl.nodes.length; i++) {
        await wait(i === 0 ? 240 : 96);
        if (!alive) return;
        setBuilt(i + 1);
      }
      await wait(460);
      if (!alive) return;

      /* 2 — and then it runs, on its own clock */
      setPhase("run");
      let s = CLOCK0;
      for (let i = 0; i < tpl.path.length; i++) {
        setCursor(i);
        const n = byId(tpl.path[i]);
        await wait(Math.max(420, Math.round(n.ms * 0.5)));
        if (!alive) return;
        s += Math.round(n.ms / 1000) + 1 + (n.wait ?? 0);
        setLogs((l) => [...l, { t: clock(s), k: n.k, m: n.log, hold: tpl.path[i] === tpl.hold }]);
      }
      await wait(300);
      if (!alive) return;
      setCursor(tpl.path.length);
      setPhase("done");
    })();

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
    };
  }, [tpl, seen, reduced, runKey, byId]);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [logs, phase]);

  /* ---- what state is each node in, right now ---- */
  const stateOf = useCallback(
    (id: string): NodeState => {
      const pi = tpl.path.indexOf(id);
      if (phase === "idle" || phase === "build") return "idle";
      if (pi === -1) return "skipped";
      if (cursor > pi) return id === tpl.hold ? "held" : "done";
      if (cursor === pi) return "running";
      return "queued";
    },
    [tpl, phase, cursor],
  );

  const usedCats = useMemo(() => new Set(tpl.nodes.map((n) => n.cat)), [tpl]);
  const usedCaps = useMemo(
    () => new Set(tpl.nodes.map((n) => CAPABILITY[n.cat])),
    [tpl],
  );
  const picked = pick ? tpl.nodes.find((n) => n.id === pick) ?? null : null;

  const done = tpl.path.filter((_, i) => cursor > i).length;
  const pct = Math.round((done / tpl.path.length) * 100);

  return (
    <section className="rm-sec" id="product">
      <div className="rm-wrap" ref={seenRef}>
        <Head
          n="02"
          verb="Understand"
          frame="Product"
          title={
            <>
              Build it on a canvas. <em>Watch it run.</em>
            </>
          }
          dek={
            <>
              {NODE_TOTAL} nodes across {CATS.length} categories — triggers, integrations,
              agents, logic, voice, actions and the humans you place between them.{" "}
              <b>Pick a workflow</b> and watch the graph assemble itself, then execute.
            </>
          }
        />

        <Rise className="rm-wb">
          {/* ---------- window chrome ---------- */}
          <header className="rm-wb-bar">
            <span className="rm-wb-mark">
              <MartenMark size={14} />
            </span>
            <div className="rm-wb-tabs" role="tablist" aria-label="Workflow templates">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={t.id === tplId}
                  className="rm-wb-tab"
                  data-on={t.id === tplId ? "1" : "0"}
                  onClick={() => setTplId(t.id)}
                >
                  {t.name}
                  <i>{t.team}</i>
                </button>
              ))}
            </div>
            <span className="rm-wb-state" data-phase={phase === "done" && tpl.hold ? "held" : phase}>
              <i />
              {phase === "build"
                ? "Assembling"
                : phase === "run"
                  ? `Executing · ${pct}%`
                  : phase === "done"
                    ? tpl.hold
                      ? "Held for a human"
                      : "Completed"
                    : "Standing by"}
            </span>
            <button
              className="rm-wb-replay"
              onClick={() => setRunKey((k) => k + 1)}
              disabled={phase === "build" || phase === "run"}
            >
              Replay
            </button>
          </header>

          <div className="rm-wb-body">
            {/* ---------- left: the node library ---------- */}
            <aside className="rm-wb-lib">
              <h4>
                Node library <b>{NODE_TOTAL}</b>
              </h4>
              <ul>
                {CATS.map((c) => (
                  <li key={c.id} data-tone={c.tone} data-used={usedCats.has(c.id) ? "1" : "0"}>
                    <span className="g">
                      <Glyph id={c.id} size={14} />
                    </span>
                    <span className="nm">{c.name}</span>
                    <span className="ct">{c.n}</span>
                  </li>
                ))}
              </ul>
              <p className="rm-wb-lib-f">Drag any node onto the canvas. Two-way, always.</p>
            </aside>

            {/* ---------- centre: the canvas ---------- */}
            <Canvas
              tpl={tpl}
              built={built}
              stateOf={stateOf}
              pick={pick}
              onPick={setPick}
              phase={phase}
            />

            {/* ---------- right: run log, or the node you clicked ---------- */}
            <aside className="rm-wb-side">
              {picked ? (
                <>
                  <header className="rm-wb-side-h">
                    <span>{catOf(picked.cat).name}</span>
                    <button onClick={() => setPick(null)}>Run log</button>
                  </header>
                  <div className="rm-wb-insp">
                    <div className="rm-wb-insp-t">
                      <span className="g" data-tone={catOf(picked.cat).tone}>
                        <Glyph id={picked.brand ?? picked.cat} size={20} />
                      </span>
                      <div>
                        <b>{picked.n}</b>
                        <span>{picked.k}</span>
                      </div>
                    </div>
                    <p>{catOf(picked.cat).what}</p>
                    <dl>
                      {picked.cfg.map(([k, v]) => (
                        <div key={k}>
                          <dt>{k}</dt>
                          <dd>{v}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="rm-wb-insp-f">
                      <span>{stateOf(picked.id)}</span>
                      <span>{picked.ms ? `${picked.ms} ms` : "waits on a person"}</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <header className="rm-wb-side-h">
                    <span>Run log</span>
                    <button className="rm-wb-side-id">#4c1f · live</button>
                  </header>
                  <div className="rm-wb-log" ref={logRef} aria-live="polite">
                    {logs.length === 0 && <p className="rm-wb-log-0">Waiting for the trigger…</p>}
                    {logs.map((l, i) => (
                      <p key={`${l.t}-${i}`} className="rm-wb-line" data-hold={l.hold ? "1" : "0"}>
                        <i>{l.t}</i>
                        <b>{l.k}</b>
                        {l.m}
                      </p>
                    ))}
                    {phase === "done" && (
                      <div className="rm-wb-done" data-hold={tpl.hold ? "1" : "0"}>
                        <b>{tpl.hold ? "1 decision left for a person" : "Run completed"}</b>
                        <span>
                          {done} of {tpl.path.length} steps · every write on one audit trail
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="rm-wb-out">
                    {tpl.out.map((o) => (
                      <div key={o.k}>
                        <b>{o.v}</b>
                        <span>{o.k}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </aside>
          </div>

          {/* ---------- status bar: which capabilities this run touched ---------- */}
          <footer className="rm-wb-foot">
            <span className="rm-wb-foot-l">Capabilities in this run</span>
            <div className="rm-wb-caps">
              {CAP_ORDER.map((c) => (
                <span key={c.id} data-on={usedCaps.has(c.id) ? "1" : "0"}>
                  <i />
                  {c.name}
                </span>
              ))}
            </div>
            <span className="rm-wb-foot-r">{tpl.nodes.length} nodes · one runtime</span>
          </footer>
        </Rise>

        {/* ---------- what the runtime guarantees ---------- */}
        <Rise className="rm-wb-why" i={1}>
          {RUNTIME.map((r) => (
            <div key={r.k}>
              <b>{r.k}</b>
              <p>{r.v}</p>
            </div>
          ))}
        </Rise>
      </div>
    </section>
  );
}

/* ============================================================
   THE CANVAS
   Geometry is measured, never guessed: nodes and wires read the
   same box, so a port is always exactly on the edge of its card.
   ============================================================ */

function Canvas({
  tpl,
  built,
  stateOf,
  pick,
  onPick,
  phase,
}: {
  tpl: WfTemplate;
  built: number;
  stateOf: (id: string) => NodeState;
  pick: string | null;
  onPick: (id: string | null) => void;
  phase: Phase;
}) {
  const [ref, box] = useBox<HTMLDivElement>();

  const geo = useMemo(() => {
    const { w, h } = box;
    if (!w || !h) return null;
    const cols = Math.max(...tpl.nodes.map((n) => n.col)) + 1;
    const padX = 10;
    const padY = 24;
    const nw = Math.max(108, Math.min((w - padX * 2) / cols - 30, 156));
    const spanX = w - padX * 2 - nw;
    /* The board is as tall as the run log beside it, which has
       nothing to do with the graph. Cap the vertical spread and
       centre it — three rows 300px apart turn every wire into a
       vertical pipe, and a pipe does not read as a connection. */
    const room = h - padY * 2 - NH;
    const spanY = Math.min(room, 248);
    const top = padY + NH / 2 + (room - spanY) / 2;
    const x = (col: number) => padX + nw / 2 + (cols === 1 ? 0 : (col / (cols - 1)) * spanX);
    const y = (row: number) => top + (row / 2) * spanY;
    return { w, h, nw, x, y };
  }, [box, tpl]);

  const wire = (x1: number, y1: number, x2: number, y2: number) => {
    const dx = Math.max(30, (x2 - x1) * 0.6, Math.abs(y2 - y1) * 0.46);
    return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
  };

  const edgeState = (a: string, b: string) => {
    const sa = stateOf(a);
    const sb = stateOf(b);
    if (sa === "skipped" || sb === "skipped") return "off";
    if (sb === "running" && (sa === "done" || sa === "held")) return "live";
    if ((sa === "done" || sa === "held") && (sb === "done" || sb === "held")) return "done";
    return "idle";
  };

  const shown = new Set(tpl.nodes.slice(0, built).map((n) => n.id));

  return (
    /* the board scrolls rather than squashes: a canvas that
       compresses its own geometry stops being a canvas */
    <div className="rm-wb-board">
    <div className="rm-wb-canvas" ref={ref}>
      <div className="rm-wb-grid" aria-hidden />

      {geo && (
        /* No viewBox: the SVG user unit is the CSS pixel, so the wires
           live in the same coordinate space as the absolutely placed
           cards. A viewBox rescales whenever the measured box is a
           frame behind, and the wires drift off their ports. */
        <svg className="rm-wb-wires" aria-hidden>
          {tpl.edges.map((e) => {
            const a = tpl.nodes.find((n) => n.id === e.a)!;
            const b = tpl.nodes.find((n) => n.id === e.b)!;
            if (!shown.has(a.id) || !shown.has(b.id)) return null;
            const x1 = geo.x(a.col) + geo.nw / 2;
            const y1 = geo.y(a.row);
            const x2 = geo.x(b.col) - geo.nw / 2;
            const y2 = geo.y(b.row);
            const d = wire(x1, y1, x2, y2);
            const st = edgeState(e.a, e.b);
            return (
              <g key={`${e.a}-${e.b}`}>
                <path className="rm-wb-wire" data-state={st} d={d} />
                {st === "live" && <path className="rm-wb-wire-flow" d={d} />}
                {e.label && (
                  <text className="rm-wb-wlabel" data-state={st} x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 7}>
                    {e.label}
                  </text>
                )}
              </g>
            );
          })}

          {tpl.nodes.map((n) => {
            if (!shown.has(n.id)) return null;
            const hasIn = tpl.edges.some((e) => e.b === n.id);
            const hasOut = tpl.edges.some((e) => e.a === n.id);
            const st = stateOf(n.id);
            return (
              <g key={`p${n.id}`}>
                {hasIn && (
                  <circle className="rm-wb-port" data-state={st} cx={geo.x(n.col) - geo.nw / 2} cy={geo.y(n.row)} r={3.2} />
                )}
                {hasOut && (
                  <circle className="rm-wb-port" data-state={st} cx={geo.x(n.col) + geo.nw / 2} cy={geo.y(n.row)} r={3.2} />
                )}
              </g>
            );
          })}
        </svg>
      )}

      {geo &&
        tpl.nodes.map((n, i) => (
          <WfCard
            key={n.id}
            n={n}
            x={geo.x(n.col)}
            y={geo.y(n.row)}
            w={geo.nw}
            shown={i < built}
            state={stateOf(n.id)}
            picked={pick === n.id}
            onPick={() => onPick(pick === n.id ? null : n.id)}
          />
        ))}

      {phase === "build" && <span className="rm-wb-hint">Assembling {tpl.nodes.length} nodes…</span>}
    </div>
    </div>
  );
}

function WfCard({
  n,
  x,
  y,
  w,
  shown,
  state,
  picked,
  onPick,
}: {
  n: WfNode;
  x: number;
  y: number;
  w: number;
  shown: boolean;
  state: NodeState;
  picked: boolean;
  onPick: () => void;
}) {
  const cat = catOf(n.cat);
  return (
    <button
      className="rm-wb-node"
      type="button"
      data-tone={cat.tone}
      data-state={state}
      data-shown={shown ? "1" : "0"}
      data-picked={picked ? "1" : "0"}
      style={{ left: x, top: y, width: w, height: NH }}
      onClick={onPick}
      aria-pressed={picked}
    >
      <span className="ic">
        <Glyph id={n.brand ?? n.cat} size={n.brand ? 20 : 17} />
      </span>
      <span className="tx">
        <span className="k">{n.k}</span>
        <span className="n">{n.n}</span>
      </span>
      <span className="st" aria-hidden />
    </button>
  );
}
