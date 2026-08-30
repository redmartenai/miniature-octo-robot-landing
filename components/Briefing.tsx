"use client";

import { DECISIONS } from "@/lib/site";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { StampButton } from "./StampButton";

export function Briefing() {
  return (
    <section className="sec" id="briefing">
      <div className="wrap">
        <SectionHead
          n="01"
          kicker="The morning briefing"
          title={
            <>
              Every morning, <span className="em">three decisions.</span> Nothing else.
            </>
          }
          dek="Sarah leads Revenue Operations at a growing B2B company. Mornings used to mean an hour of opening dashboards. Now the work is already done — Red Marten hands her only what needs judgement."
        />

        <div className="sec-split">
          <Reveal>
            <p className="brief-lede">
              She logs in at 8:00&nbsp;AM to a briefing, <span className="em">not a dashboard.</span>
            </p>
            <div className="brief-meta">
              <div className="row">
                <span className="k">✓</span> 604 accounts scanned overnight
              </div>
              <div className="row">
                <span className="k">✓</span> Pipeline movement reconciled
              </div>
              <div className="row">
                <span className="k">✓</span> 3 decisions escalated to a human
              </div>
            </div>
          </Reveal>

          <ol className="decisions">
            {DECISIONS.map((d, i) => (
              <Reveal as="li" className="decision" key={d.n} delay={i * 0.06}>
                <span className="dn">{d.n}</span>
                <div>
                  <div className="dtag">{d.tag}</div>
                  <h4>{d.title}</h4>
                  <p>{d.body}</p>
                  <StampButton kind={d.kind} label={d.action} />
                  <EvidenceDisclosure decision={d.n} />
                </div>
                <span className={`dsig ${d.signal}`} />
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* A quiet "Show the evidence" disclosure — which signals, which
   accounts — matching the brief's "each with the evidence behind it". */
const EVIDENCE: Record<string, string[]> = {
  "01": [
    "Signals: 7 accounts crossed the intent threshold overnight (pricing-page visits + hiring for SDRs).",
    "Accounts: Meridian Freight, Coreline Systems, Halden Systems +4 — sequences staged, awaiting approval.",
  ],
  "02": [
    "Signals: 12 opportunities with 0 activity for 14 days; champion went quiet after a reorg.",
    "Accounts: recovery drafts reference the last positive thread; nothing sends until you approve.",
  ],
  "03": [
    "Signals: forecast coverage at 41% vs 3.1× target; two late-stage deals slipping to next quarter.",
    "Suggested: pull two mid-stage deals forward, reallocate 6 hours of voice to logistics segment.",
  ],
};

function EvidenceDisclosure({ decision }: { decision: string }) {
  const rows = EVIDENCE[decision] ?? [];
  if (!rows.length) return null;
  return (
    <details className="evidence">
      <summary>
        Show the evidence <span className="ev-arw">↓</span>
      </summary>
      <div className="evidence-body">
        {rows.map((r) => (
          <p key={r}>{r}</p>
        ))}
      </div>
    </details>
  );
}
