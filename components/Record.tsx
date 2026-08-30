"use client";

import { PERMISSIONS, RECORD_LOG } from "@/lib/site";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { LedgerLine } from "./LedgerLine";

/* THE RECORD — the moat, promoted to a numbered section. One
   permission model, one audit trail: the part security teams check
   before a company buys. Left card is a policy matrix; the right
   card reuses the Night Ledger's line grammar so the hero pays off. */
export function Record() {
  return (
    <section className="sec" id="record">
      <div className="wrap">
        <SectionHead
          n="05"
          kicker="The record"
          title={
            <>
              One permission model. <span className="em">One audit trail.</span>
            </>
          }
          dek="Every agent action — read, write, send, call — is checked against a single permission model and written to a single log. It's what security teams ask about first, so it lives on the front page, not in settings."
        />

        <div className="record-cards">
          {/* Left — the policy matrix */}
          <Reveal>
            <figure className="figure record-card">
              <div className="figure-bar">
                <span>permissions · one model</span>
                <span className="live">
                  <i /> enforced
                </span>
              </div>
              <div className="perm">
                <div className="perm-row perm-head">
                  <span>Capability</span>
                  <span>Policy</span>
                </div>
                {PERMISSIONS.map((r) => (
                  <div
                    className={`perm-row${r.denied ? " denied" : ""}`}
                    key={r.cap}
                  >
                    <span className="perm-cap">{r.cap}</span>
                    <span className="perm-pol">{r.policy}</span>
                  </div>
                ))}
              </div>
            </figure>
          </Reveal>

          {/* Right — the log */}
          <Reveal delay={0.06}>
            <figure className="figure record-card record-log" id="record-log">
              <div className="figure-bar">
                <span>the log · today</span>
                <span className="live">
                  <i /> writing
                </span>
              </div>
              <ol className="ledger">
                {RECORD_LOG.map((e) => (
                  <LedgerLine key={e.time + e.text} time={e.time}>
                    {e.text}
                  </LedgerLine>
                ))}
              </ol>
              <div className="record-log-ft">
                <a href="#">Export the full trail →</a>
              </div>
            </figure>
            <figcaption className="figure-cap record-cap">
              <b>Fig. 3</b> — Every move leaves a track. The trail is the log.
            </figcaption>
          </Reveal>
        </div>

        <p className="record-trust">
          EU (Frankfurt) or US data residency · SSO &amp; SCIM · role-based access ·
          model allow-list
        </p>
        {/* add SOC 2 / ISO badges here only once actually held */}
      </div>
    </section>
  );
}
