"use client";

import { MartenMark } from "@/brand/MartenLogo";
import { Rise, useRm } from "./Shell";
import { useAnchorNav } from "@/lib/rm/motion";

/* ============================================================
   FRAME 08 — FINAL CALL
   Back to paper. One sentence, two doors, and the terms a buyer
   needs to see before they take either.
   ============================================================ */

const FOOT: [string, string][] = [
  ["product", "Products"],
  ["solutions", "Solutions"],
  ["customers", "Customers"],
  ["pricing", "Pricing"],
  ["faq", "FAQ"],
  ["about", "About"],
];

export function Final() {
  const { openEnter, reduced } = useRm();
  const go = useAnchorNav();

  return (
    <>
      <section className="rm-final">
        <div className="rm-final-in">
          <Rise>
            <span className="rm-eyebrow">
              <b>08</b>
              <i className="tick" />
              Execute · Start
            </span>
            <h2 className="rm-final-h">
              Stop managing tools.
              <em>Start operating intelligence.</em>
            </h2>
          </Rise>

          <Rise i={1}>
            <div className="rm-final-cta">
              <button className="rm-btn rm-btn-cop rm-btn-lg" onClick={() => openEnter("choose")}>
                <MartenMark size={17} motion={reduced ? undefined : "leap"} />
                Connect to Red Marten
              </button>
              <button className="rm-btn rm-btn-sec rm-btn-lg" onClick={() => openEnter("demo")}>
                Book Demo
              </button>
            </div>
          </Rise>

          <Rise className="rm-final-meta" i={2}>
            <span>Pilot free for 30 days</span>
            <span>EU (Frankfurt) or US residency</span>
            <span>SSO, SCIM, role-based mandates</span>
            <span>One audit trail for every action</span>
          </Rise>
        </div>
      </section>

      <footer className="rm-foot">
        <div className="rm-foot-in">
          <span className="rm-brand">
            <MartenMark size={20} />
            <b>Red Marten</b>
            <span>Autonomous OS</span>
          </span>
          <nav>
            {FOOT.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(id);
                }}
              >
                {label}
              </a>
            ))}
          </nav>
          <span className="cp">© MMXXVI Red Marten Technologies · Built in Europe · Runs wherever your data lives</span>
        </div>
      </footer>
    </>
  );
}
