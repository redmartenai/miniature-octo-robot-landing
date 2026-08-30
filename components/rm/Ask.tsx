"use client";

import { useEffect, useRef, useState } from "react";
import { MartenMark } from "@/brand/MartenLogo";
import { Head, Rise, useRm } from "./Shell";
import { ASK_FALLBACK, QA } from "@/lib/rm/data";
import { useInView, useTypewriter } from "@/lib/rm/motion";

/* ============================================================
   FRAME 06 — FAQ
   An accordion hides answers behind a click and makes the
   reader work. This asks the system instead: questions land in
   the console, answers are written out, and anything typed is
   matched against what Red Marten can actually speak to.
   ============================================================ */

type Turn = { q: string; a: string };

const OPENING: Turn[] = [QA[0], QA[1]].map((t) => ({ q: t.q, a: t.a }));

/* keyword overlap — enough to route a real question to the right
   answer without pretending to be a model */
function answerFor(input: string): string {
  const words = input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3);
  if (!words.length) return ASK_FALLBACK;

  let best = { score: 0, a: ASK_FALLBACK };
  for (const item of QA) {
    const hay = `${item.q} ${item.a}`.toLowerCase();
    let score = 0;
    for (const w of words) if (hay.includes(w)) score += hay.includes(` ${w} `) ? 2 : 1;
    if (score > best.score) best = { score, a: item.a };
  }
  return best.score >= 2 ? best.a : ASK_FALLBACK;
}

export function Ask() {
  const { openEnter } = useRm();
  const { ref, seen } = useInView<HTMLDivElement>();
  const [turns, setTurns] = useState<Turn[]>(OPENING);
  const [live, setLive] = useState<Turn | null>(null);
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const [asked, setAsked] = useState(2);
  const body = useRef<HTMLDivElement>(null);

  const { out, done } = useTypewriter(live?.a ?? "", live !== null);

  /* settle a finished answer into the transcript */
  useEffect(() => {
    if (live && done) {
      const t = setTimeout(() => {
        setTurns((prev) => [...prev, live]);
        setLive(null);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [live, done]);

  /* while nobody has typed, the system keeps the conversation going */
  useEffect(() => {
    if (!seen || touched || live || asked >= 4) return;
    const t = setTimeout(() => {
      const next = QA[asked];
      if (!next) return;
      setLive({ q: next.q, a: next.a });
      setAsked((n) => n + 1);
    }, 3400);
    return () => clearTimeout(t);
  }, [seen, touched, live, asked]);

  useEffect(() => {
    const el = body.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [out, turns.length]);

  const ask = (q: string) => {
    if (!q.trim() || live) return;
    setTouched(true);
    setValue("");
    setLive({ q: q.trim(), a: answerFor(q) });
  };

  return (
    <section className="rm-sec" id="faq">
      <div className="rm-wrap" ref={ref}>
        <Head
          n="06"
          verb="Learn"
          frame="FAQ"
          title={
            <>
              Ask it directly. <em>It answers.</em>
            </>
          }
          dek={
            <>
              The questions enterprise buyers actually ask — about governance, residency,
              deployment and what happens when the system is wrong. Type your own, or take
              one of the standing questions.
            </>
          }
        />

        <Rise className="rm-ask">
          <div className="rm-term">
            <div className="rm-term-bar">
              <MartenMark size={14} />
              Ask Red Marten
              <span className="st">
                <i /> Online
              </span>
            </div>

            <div className="rm-term-body" ref={body}>
              {turns.map((t, i) => (
                <div key={`${t.q}-${i}`}>
                  <div className="rm-term-q">
                    <i>You</i>
                    <p>{t.q}</p>
                  </div>
                  <div className="rm-term-a">
                    <i>RM</i>
                    <p>{t.a}</p>
                  </div>
                </div>
              ))}

              {live && (
                <div>
                  <div className="rm-term-q">
                    <i>You</i>
                    <p>{live.q}</p>
                  </div>
                  <div className="rm-term-a">
                    <i>RM</i>
                    <p>
                      {out}
                      {!done && <span className="caret" />}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <form
              className="rm-term-form"
              onSubmit={(e) => {
                e.preventDefault();
                ask(value);
              }}
            >
              <span className="pr">Ask</span>
              <input
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setTouched(true);
                }}
                placeholder="How is this different from an agent platform?"
                aria-label="Ask Red Marten a question"
              />
              <button className="rm-btn rm-btn-pri" type="submit" disabled={live !== null}>
                Send
              </button>
            </form>
          </div>

          <aside className="rm-ask-side">
            <h4>Standing questions</h4>
            <div className="rm-chips">
              {QA.slice(1).map((item) => (
                <button key={item.q} className="rm-chip" onClick={() => ask(item.q)}>
                  {item.q}
                </button>
              ))}
            </div>
            <p className="note">
              Answers here are the same ones our solutions engineers give. If you need one
              that is specific to your stack, a human is faster.
            </p>
            <div style={{ marginTop: 16 }}>
              <button className="rm-btn rm-btn-sec" onClick={() => openEnter("demo")}>
                Book Demo
              </button>
            </div>
          </aside>
        </Rise>
      </div>
    </section>
  );
}
