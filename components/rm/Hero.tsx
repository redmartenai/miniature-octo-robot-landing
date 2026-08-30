"use client";

import { useEffect, useMemo, useState } from "react";
import { MartenMark } from "@/brand/MartenLogo";
import { useRm, Rise } from "./Shell";
import { Glyph } from "./Glyph";
import { HERO_DST, HERO_IN, HERO_MID, HERO_OUT, HERO_SRC } from "@/lib/rm/workflow";
import { HERO_STATS, VERBS } from "@/lib/rm/data";
import { useBeat, useBox, useCountUp, useInView, useTicker } from "@/lib/rm/motion";

/* ============================================================
   FRAME 01 — HERO
   Left: what this is, in one breath. Right: the system doing it.

   The canvas is the product surface, not an illustration of it —
   the same dark board the workflow builder runs on. Three live
   systems fan into two reasoning steps and converge on two
   systems of record. Every few seconds one node retires and the
   next piece of work prints in its place, while a token runs a
   real path end to end. Nothing loops decoratively: each
   movement is one unit of work being carried out.
   ============================================================ */

const fmt = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

type Slots = { s: number[]; m: number[]; d: number[] };
const START: Slots = { s: [0, 1, 2], m: [0, 1], d: [0, 1] };

/* the order in which the system refreshes itself */
const CYCLE: [keyof Slots, number][] = [
  ["s", 0], ["m", 0], ["d", 0],
  ["s", 1], ["m", 1], ["d", 1],
  ["s", 2], ["m", 0], ["d", 0],
];

const NH = 54;

export function Hero() {
  const { openEnter, reduced } = useRm();
  const { ref: seenRef, seen } = useInView<HTMLDivElement>();

  return (
    <section className="rm-hero" id="top">
      <div className="rm-wrap">
        <div className="rm-hero-grid" ref={seenRef}>
          <div>
            <Rise>
              <span className="rm-eyebrow">
                <b>01</b>
                <i className="tick" />
                Observe · The autonomous operating system
              </span>
              <h1 className="rm-h1">
                The Autonomous Operating System
                <em>for modern teams.</em>
              </h1>
            </Rise>

            <Rise i={1}>
              <p className="rm-sub">
                Connect every system. Deploy AI agents. Run workflows. Automate execution.
                <b> Operate your business through one intelligent layer</b> — one that observes,
                understands, plans, executes, learns and stays governable.
              </p>
              <div className="rm-hero-cta">
                <button className="rm-btn rm-btn-cop rm-btn-lg" onClick={() => openEnter("choose")}>
                  <MartenMark size={17} motion={reduced ? undefined : "leap"} />
                  Connect to Red Marten
                </button>
                <button className="rm-btn rm-btn-sec rm-btn-lg" onClick={() => openEnter("demo")}>
                  Book Demo
                </button>
              </div>
            </Rise>

            <Rise i={2}>
              <VerbRail run={seen && !reduced} reduced={reduced} />
            </Rise>
          </div>

          <Rise i={1}>
            <LiveCanvas seen={seen} run={seen && !reduced} />
          </Rise>
        </div>
      </div>
    </section>
  );
}

/* ---------- the six verbs, lit in sequence: the OS loop ---------- */
function VerbRail({ run, reduced }: { run: boolean; reduced: boolean }) {
  const [i, setI] = useState(0);
  useBeat(1150, run, () => setI((n) => (n + 1) % VERBS.length));
  return (
    <div className="rm-verbs" aria-hidden>
      {VERBS.map((v, n) => (
        <span key={v.id} className="rm-verb" data-on={reduced || (run && n === i) ? "1" : "0"}>
          <i />
          {v.label}
        </span>
      ))}
    </div>
  );
}

/* ---------- the canvas ---------- */
function LiveCanvas({ run, seen }: { run: boolean; seen: boolean }) {
  const [ref, box] = useBox<HTMLDivElement>();
  const [slots, setSlots] = useState<Slots>(START);
  const [leaving, setLeaving] = useState<string | null>(null);
  const [entering, setEntering] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [path, setPath] = useState<[number, number, number] | null>(null);
  const [tok, setTok] = useState(0);

  /* --- the system reorganises: one node retires, the next prints --- */
  useBeat(2600, run, () => {
    const [group, idx] = CYCLE[step % CYCLE.length];
    const key = `${group}${idx}`;
    setLeaving(key);
    setStep((s) => s + 1);
    setTimeout(() => {
      setSlots((prev) => {
        const deck = group === "s" ? HERO_SRC.length : group === "m" ? HERO_MID.length : HERO_DST.length;
        const used = new Set(prev[group]);
        let next = (prev[group][idx] + 3) % deck;
        let guard = 0;
        while (used.has(next) && guard++ < deck) next = (next + 1) % deck;
        return { ...prev, [group]: prev[group].map((v, i) => (i === idx ? next : v)) };
      });
      setLeaving(null);
      setEntering(key);
      setTimeout(() => setEntering(null), 620);
    }, 400);
  });

  /* --- a unit of work runs the graph end to end --- */
  useBeat(3100, run, () => {
    const e = HERO_IN[(step + 1) % HERO_IN.length];
    const o = HERO_OUT.find((x) => x[0] === e[1]) ?? HERO_OUT[0];
    setPath([e[0], e[1], o[1]]);
    setTok(0);
  });

  useTicker(run && path !== null, (_t, dt) => {
    setTok((v) => {
      const n = v + dt / 1500;
      if (n >= 1) {
        setPath(null);
        return 0;
      }
      return n;
    });
  });

  const geo = useMemo(() => {
    const { w, h } = box;
    if (!w || !h) return null;
    /* a card takes about a quarter of the width, which leaves the
       wires a real horizontal run — a bezier with no room to travel
       reads as a vertical drop, not a connection */
    const pad = 6;
    const nw = Math.min(206, Math.max(96, Math.min(0.27 * w, (w - pad * 2 - 34) / 3)));
    const cx = [pad + nw / 2, w / 2, w - pad - nw / 2];
    const top = h * 0.14;
    const usable = h - top - h * 0.11;
    const sy = [top + usable * 0.05, top + usable * 0.5, top + usable * 0.95];
    const my = [top + usable * 0.27, top + usable * 0.73];
    const dy = [top + usable * 0.27, top + usable * 0.73];
    return { w, h, nw, cx, sy, my, dy };
  }, [box]);

  /* a wire leaves its port horizontally and arrives horizontally, so
     every junction meets the card square-on — the way a patch cable does */
  const wire = (x1: number, y1: number, x2: number, y2: number) => {
    const dx = Math.max(30, (x2 - x1) * 0.52);
    return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
  };
  const at = (x1: number, y1: number, x2: number, y2: number, t: number) => {
    const dx = Math.max(30, (x2 - x1) * 0.52);
    const u = 1 - t;
    return {
      x: u * u * u * x1 + 3 * u * u * t * (x1 + dx) + 3 * u * t * t * (x2 - dx) + t * t * t * x2,
      y: u * u * u * y1 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y2,
    };
  };

  const hotS = path?.[0];
  const hotM = path?.[1];
  const hotD = path?.[2];

  let token: { x: number; y: number } | null = null;
  if (geo && path) {
    const half = geo.nw / 2;
    const leg = tok < 0.5 ? 0 : 1;
    const lt = leg === 0 ? tok * 2 : (tok - 0.5) * 2;
    token =
      leg === 0
        ? at(geo.cx[0] + half, geo.sy[path[0]], geo.cx[1] - half, geo.my[path[1]], lt)
        : at(geo.cx[1] + half, geo.my[path[1]], geo.cx[2] - half, geo.dy[path[2]], lt);
  }

  return (
    <figure className="rm-cv">
      <figcaption className="rm-cv-bar">
        <MartenMark size={14} />
        Intelligence canvas
        <span className="live">
          <i /> Running
        </span>
      </figcaption>

      {/* the same rule as the builder: a canvas scrolls, it does not
          squash — below its natural width the board slides sideways */}
      <div className="rm-cv-scroll">
      <div className="rm-cv-stage" ref={ref}>
        <div className="rm-cv-cols" aria-hidden>
          <div className="rm-cv-col" data-lane="signal">
            <span>Signals</span>
          </div>
          <div className="rm-cv-col" data-lane="reason">
            <span>Intelligence</span>
          </div>
          <div className="rm-cv-col" data-lane="record">
            <span>Systems of record</span>
          </div>
        </div>

        {geo && (
          <svg className="rm-cv-wires" aria-hidden>
            {HERO_IN.map(([s, m]) => (
              <path
                key={`e${s}${m}`}
                className={`rm-cv-wire${hotS === s && hotM === m ? " on" : ""}`}
                data-lane="signal"
                d={wire(geo.cx[0] + geo.nw / 2, geo.sy[s], geo.cx[1] - geo.nw / 2, geo.my[m])}
              />
            ))}
            {HERO_OUT.map(([m, d]) => (
              <path
                key={`o${m}${d}`}
                className={`rm-cv-wire${hotM === m && hotD === d ? " on" : ""}`}
                data-lane="reason"
                d={wire(geo.cx[1] + geo.nw / 2, geo.my[m], geo.cx[2] - geo.nw / 2, geo.dy[d])}
              />
            ))}

            {/* ports — one dot per card edge, where every wire on that
                side converges, exactly as a real canvas draws them */}
            {geo.sy.map((y, i) => (
              <circle key={`ps${i}`} className="rm-cv-port" data-lane="signal" cx={geo.cx[0] + geo.nw / 2} cy={y} r={3.4} />
            ))}
            {geo.my.map((y, i) => (
              <g key={`pm${i}`}>
                <circle className="rm-cv-port" data-lane="signal" cx={geo.cx[1] - geo.nw / 2} cy={y} r={3.4} />
                <circle className="rm-cv-port" data-lane="reason" cx={geo.cx[1] + geo.nw / 2} cy={y} r={3.4} />
              </g>
            ))}
            {geo.dy.map((y, i) => (
              <circle key={`pd${i}`} className="rm-cv-port" data-lane="reason" cx={geo.cx[2] - geo.nw / 2} cy={y} r={3.4} />
            ))}

            {token && (
              <>
                <circle className="rm-cv-tok-halo" cx={token.x} cy={token.y} r={9} />
                <circle className="rm-cv-tok" cx={token.x} cy={token.y} r={3.6} />
              </>
            )}
          </svg>
        )}

        {geo &&
          slots.s.map((deckIdx, i) => {
            const d = HERO_SRC[deckIdx];
            return (
              <CvNode
                key={`s${i}`}
                x={geo.cx[0]}
                y={geo.sy[i]}
                w={geo.nw}
                lane="signal"
                glyph={d.brand}
                k={d.k}
                n={d.n}
                on={hotS === i}
                cls={leaving === `s${i}` ? "leave" : entering === `s${i}` ? "enter" : ""}
              />
            );
          })}

        {geo &&
          slots.m.map((deckIdx, i) => {
            const d = HERO_MID[deckIdx];
            return (
              <CvNode
                key={`m${i}`}
                x={geo.cx[1]}
                y={geo.my[i]}
                w={geo.nw}
                lane="reason"
                glyph={d.kind}
                k={d.k}
                n={d.n}
                on={hotM === i}
                cls={leaving === `m${i}` ? "leave" : entering === `m${i}` ? "enter" : ""}
              />
            );
          })}

        {geo &&
          slots.d.map((deckIdx, i) => {
            const d = HERO_DST[deckIdx];
            return (
              <CvNode
                key={`d${i}`}
                x={geo.cx[2]}
                y={geo.dy[i]}
                w={geo.nw}
                lane="record"
                glyph={d.brand}
                k={d.k}
                n={d.n}
                on={hotD === i}
                cls={leaving === `d${i}` ? "leave" : entering === `d${i}` ? "enter" : ""}
              />
            );
          })}
      </div>
      </div>

      <div className="rm-cv-foot">
        {HERO_STATS.map((s, i) => (
          <Stat key={s.k} label={s.k} value={s.v} run={seen} live={run && i < 2} />
        ))}
      </div>
    </figure>
  );
}

function CvNode({
  x,
  y,
  w,
  lane,
  glyph,
  k,
  n,
  on,
  cls,
}: {
  x: number;
  y: number;
  w: number;
  lane: "signal" | "reason" | "record";
  glyph: string;
  k: string;
  n: string;
  on?: boolean;
  cls?: string;
}) {
  return (
    <div
      className={`rm-cv-node${cls ? ` ${cls}` : ""}`}
      data-lane={lane}
      data-on={on ? "1" : "0"}
      style={{ left: x, top: y, width: w, height: NH }}
    >
      <span className="ic">
        <Glyph id={glyph as never} size={lane === "reason" ? 19 : 22} />
      </span>
      <span className="tx">
        <span className="k">{k}</span>
        <span className="n">{n}</span>
      </span>
    </div>
  );
}

/* counters settle on the real number, then keep breathing:
   the two live ones climb, the escalation count does not */
function Stat({ label, value, run, live }: { label: string; value: number; run: boolean; live: boolean }) {
  const base = useCountUp(value, run, 1600);
  const [drift, setDrift] = useState(0);
  useBeat(1400, live, () => setDrift((d) => d + 3 + ((d % 7) | 0)));
  useEffect(() => {
    if (!run) setDrift(0);
  }, [run]);
  return (
    <div className="rm-cv-stat">
      <b>{fmt(base + (base >= value ? drift : 0))}</b>
      <span>{label}</span>
    </div>
  );
}
