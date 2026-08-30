"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { MartenMark } from "@/brand/MartenLogo";
import { LEDGER } from "@/lib/site";

const LINES = LEDGER.filter((e) => !e.stamp);
const STAMP = LEDGER.find((e) => e.stamp)!;

const fmtClock = (p: number) => {
  const m = (1380 + Math.round(p * 540)) % 1440; // 23:00 + p*540min
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};

/* THE NIGHT LEDGER — a compact overnight work-ledger beside the hero
   copy. The clock runs 23:00 -> 08:00 and eight entries print in order,
   then the stamp lands and the perforation tears toward the Briefing.
   It plays its timeline once when it scrolls into view (native scroll,
   no pinning). Under reduced motion it renders the completed state. */
export function NightLedger({ children }: { children: ReactNode }) {
  const bandRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLLIElement | null)[]>([]);
  const stampRef = useRef<HTMLAnchorElement>(null);
  const perfRef = useRef<HTMLDivElement>(null);
  const printed = useRef<Set<number>>(new Set());
  const stamped = useRef(false);
  const rafRef = useRef(0);

  const apply = useCallback((p: number) => {
    if (clockRef.current) clockRef.current.textContent = fmtClock(p);
    for (let i = 0; i < LINES.length; i++) {
      if (p >= LINES[i].p && !printed.current.has(i)) {
        printed.current.add(i);
        lineRefs.current[i]?.classList.add("in");
      }
    }
    if (p >= 0.98 && !stamped.current) {
      stamped.current = true;
      stampRef.current?.classList.add("in");
      perfRef.current?.classList.add("in");
    }
  }, []);

  const ramp = useCallback(
    (durationMs: number) => {
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs);
        apply(t);
        if (t < 1) rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [apply],
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply(1); // completed state, static, at 08:00
      return;
    }
    const band = bandRef.current;
    if (!band) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          ramp(2600);
        }
      },
      { threshold: 0.3 },
    );
    io.observe(band);
    return () => {
      io.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [apply, ramp]);

  return (
    <div className="nl-band" ref={bandRef}>
      <div className="nl-grid">
        <div className="nl-copy">{children}</div>

        <div className="nl-figwrap">
          <figure className="nl-fig figure">
            <div className="figure-bar">
              <span className="nl-head">
                <MartenMark size={16} /> Overnight run
              </span>
              <span className="chip">
                <i /> Autonomous · always on
              </span>
            </div>

            <div className="nl-clock" aria-hidden ref={clockRef}>
              23:00
            </div>

            <ol className="ledger nl-lines">
              {LINES.map((e, i) => (
                <li
                  key={e.time}
                  className="ledger-line"
                  data-anim="print"
                  ref={(el) => {
                    lineRefs.current[i] = el;
                  }}
                >
                  <span className="ll-time">{e.time}</span>
                  <span className="ll-leader" aria-hidden />
                  <span className="ll-text">{e.text}</span>
                </li>
              ))}
            </ol>

            <a
              href="#briefing"
              className="nl-stamp nocturne-stamp"
              ref={stampRef}
              aria-label="Briefing ready — 3 decisions need you"
            >
              <span className="ink-ring" aria-hidden />
              <span className="nl-stamp-k">Briefing ready</span>
              <b>{STAMP.text.replace("BRIEFING READY — ", "")}</b>
            </a>

            <div className="nl-perf nocturne-perf" ref={perfRef} aria-hidden>
              <span className="tear" />
            </div>

            <figcaption className="figure-cap">
              <b>Fig. 00</b> — Overnight run, 23:00–08:00
            </figcaption>
          </figure>

          {/* Real content, never gated behind motion. */}
          <p className="sr-only">
            Overnight, Red Marten enriched 604 accounts, drafted outreach, completed
            calls, reconciled the CRM and prepared 3 decisions for 08:00.
          </p>
        </div>
      </div>
    </div>
  );
}
