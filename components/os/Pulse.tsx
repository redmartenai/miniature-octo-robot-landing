"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PULSE } from "@/lib/os/system";

/**
 * The live system pulse — always visible, top-right.
 *
 * Not navigation. A vital sign. Numbers drift upward believably (small,
 * uneven ticks) rather than counting a straight line, so the platform reads
 * as *running* rather than *animating*. It freezes when the system "thinks"
 * during the Generate Brief moment.
 */
export function Pulse({ frozen = false }: { frozen?: boolean }) {
  const [vals, setVals] = useState(() => PULSE.map((m) => m.base));
  const frozenRef = useRef(frozen);
  frozenRef.current = frozen;

  useEffect(() => {
    const id = setInterval(() => {
      if (frozenRef.current) return;
      setVals((prev) =>
        prev.map((v, i) => {
          const [lo, hi] = PULSE[i].drift;
          const step = Math.round(lo + Math.random() * (hi - lo));
          // agents / workflows / recs breathe around their base; the big
          // cumulative counters only ever climb
          const cumulative = PULSE[i].key === "signals" || PULSE[i].key === "tasks";
          const next = cumulative ? v + Math.max(0, step) : v + step;
          return Math.max(0, next);
        }),
      );
    }, 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="osx-pulse" aria-hidden>
      <div className="osx-pulse-head">
        <i className={frozen ? "off" : ""} />
        <span>{frozen ? "System · thinking" : "Autonomous system · live"}</span>
      </div>
      <ul>
        {PULSE.map((m, i) => (
          <li key={m.key}>
            <span className="k">{m.label}</span>
            <span className="v">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.b
                  key={vals[i]}
                  initial={{ y: -9, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 9, opacity: 0 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                >
                  {vals[i].toLocaleString("en-US")}
                </motion.b>
              </AnimatePresence>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
