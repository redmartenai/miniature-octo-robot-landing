"use client";

import { AFTER_STEPS, BEFORE_STEPS, METRICS, QUOTES } from "@/lib/site";
import { Reveal, RevealGroup } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { Analytics } from "./Analytics";

const q = QUOTES[0];

export function Customers() {
  return (
    <section className="sec" id="practice">
      <div className="wrap">
        <SectionHead
          n="06"
          kicker="In practice"
          title={
            <>
              What changes in the <span className="em">first quarter.</span>
            </>
          }
          dek="Averages across revenue teams running Red Marten for a full quarter on at least three live workflows."
        />

        {/* metrics figures */}
        <RevealGroup className="figures">
          {METRICS.map(([n, l]) => (
            <div className="fig" key={l}>
              <b>{n}</b>
              <span>{l}</span>
            </div>
          ))}
        </RevealGroup>

        {/* one real dashboard view — analytics as product surface */}
        <Reveal style={{ marginTop: 40 }}>
          <Analytics />
        </Reveal>

        {/* before / after */}
        <Reveal style={{ marginTop: 40 }}>
          <div className="compare">
            <div className="col before">
              <div className="clbl">◷ Before Red Marten · ~55 min</div>
              <h3>An hour gone before the first decision</h3>
              <div className="time">5 disconnected systems</div>
              <ol className="csteps">
                {BEFORE_STEPS.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
              <p className="verdict">
                Most of the morning went to gathering information rather than acting on it.
              </p>
            </div>
            <div className="col after">
              <div className="clbl">✦ After Red Marten · ~10 min</div>
              <h3>A briefing at 8:00 AM, not a dashboard</h3>
              <div className="time">one surface above everything</div>
              <ol className="csteps">
                {AFTER_STEPS.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
              <p className="verdict">
                The discovery, coordination and prep are already done. Sarah just decides.
              </p>
            </div>
          </div>
        </Reveal>

        {/* pull quote */}
        <Reveal style={{ marginTop: 56 }}>
          <div className="pullquote">
            <blockquote>
              “It found eighteen logistics accounts overnight we’d never have worked.{" "}
              <span className="em">Two closed inside the quarter.</span>”
            </blockquote>
            <div className="attr">
              <span className="av">{q[1]}</span>
              <div>
                <b>{q[2]}</b>
                <span>{q[3]}</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
