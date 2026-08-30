"use client";

import { Head, Rise } from "./Shell";
import { LOGOS, METRICS, QUOTES } from "@/lib/rm/data";
import { useCountUp, useInView } from "@/lib/rm/motion";

/* ============================================================
   FRAME 04 — CUSTOMERS
   Outcomes first, at the scale of the claim. Logos are a
   footnote to the numbers, and the testimonials are set as
   editorial pull quotes rather than cards with avatars.
   ============================================================ */

export function Customers() {
  const { ref, seen } = useInView<HTMLDivElement>();

  return (
    <section className="rm-sec" id="customers">
      <div className="rm-wrap" ref={ref}>
        <Head
          n="04"
          verb="Execute"
          frame="Customers"
          title={
            <>
              The work that stopped <em>needing a person.</em>
            </>
          }
          dek={
            <>
              Teams do not measure an operating system in features. They measure it in the
              hours that came back, the cycles that got shorter, and the decisions that
              arrived already prepared.
            </>
          }
        />

        <Rise className="rm-metrics">
          {METRICS.map((m, i) => (
            <Metric key={m.k} {...m} run={seen} delay={i} />
          ))}
        </Rise>

        <Rise className="rm-logos" i={1}>
          <span className="lbl">Operating on</span>
          {LOGOS.map((l) => (
            <b key={l}>{l}</b>
          ))}
        </Rise>

        <Rise className="rm-quotes" i={2}>
          {QUOTES.map((q) => (
            <blockquote className="rm-quote" key={q.at}>
              <p>{q.q}</p>
              <footer>
                <i />
                {q.who} · {q.at}
              </footer>
            </blockquote>
          ))}
        </Rise>
      </div>
    </section>
  );
}

function Metric({
  v,
  suffix,
  k,
  note,
  run,
  delay,
}: {
  v: number;
  suffix: string;
  k: string;
  note: string;
  run: boolean;
  delay: number;
}) {
  const decimals = v % 1 !== 0 ? 1 : 0;
  const n = useCountUp(v, run, 1500 + delay * 120, decimals);
  return (
    <div className="rm-metric">
      <b>
        {decimals ? n.toFixed(1) : Math.round(n)}
        {suffix}
      </b>
      <span>{k}</span>
      <i>{note}</i>
    </div>
  );
}
