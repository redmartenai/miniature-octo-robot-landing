"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRIEF, COPY } from "@/lib/os/system";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * The emotional climax.
 *
 * The world has already begun to implode (the parent drives the WebGL
 * collapse). Here the DOM tells the human story of it: silence, the system
 * thinking, and then millions of events resolving to three decisions —
 * followed by the closing line and the single call to action.
 */
export function BriefStage({
  onReplay,
  onEnter,
}: {
  onReplay: () => void;
  onEnter: () => void;
}) {
  // 0 thinking · 1 decisions · 2 final line
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 2200);
    const t2 = setTimeout(() => setStep(2), 2200 + BRIEF.length * 700 + 900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="osx-brief-stage">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="think"
            className="osx-thinking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="osx-thinking-dot"
              animate={{ scale: [1, 1.6, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <p>The system is thinking</p>
          </motion.div>
        )}

        {step >= 1 && (
          <motion.div
            key="brief"
            className="osx-brief-in"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease }}
          >
            <div className="osx-brief-label">
              Millions of events · resolved to three decisions
            </div>

            <div className="osx-brief-list">
              {BRIEF.map((r, i) => (
                <motion.article
                  key={r.n}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.7, duration: 0.7, ease }}
                >
                  <span className="n">{r.n}</span>
                  <div className="body">
                    <span className="dom">{r.domain}</span>
                    <h3>{r.title}</h3>
                    <p>{r.detail}</p>
                  </div>
                </motion.article>
              ))}
            </div>

            <AnimatePresence>
              {step === 2 && (
                <motion.div
                  className="osx-final"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease }}
                >
                  <p>
                    {COPY.finalHead}
                    <br />
                    <span className="em">{COPY.finalHeadEm}</span>
                  </p>
                  <div className="row">
                    <button className="osx-btn" onClick={onEnter}>
                      {COPY.cta}
                    </button>
                    <button className="osx-btn ghost" onClick={onReplay}>
                      Replay the journey
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
