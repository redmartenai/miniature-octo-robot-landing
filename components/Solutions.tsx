"use client";

import { SOLUTIONS } from "@/lib/site";
import { SectionHead } from "./SectionHead";
import { RevealGroup } from "./Reveal";

export function Solutions() {
  return (
    <section className="sec" id="solutions">
      <div className="wrap">
        <SectionHead
          n="—"
          kicker="Solutions"
          title={
            <>
              Built for whoever <span className="em">owns the number.</span>
            </>
          }
          dek="The modules are the same. What changes is the ICP, the signals worth watching, and which agent does the talking."
        />

        <RevealGroup className="roster">
          {SOLUTIONS.map(([title, body], i) => (
            <div className="rperson" key={title}>
              <span className="rav" style={{ color: "var(--color-fg)" }}>
                <span
                  style={{ font: "500 12px/1 var(--font-mono)", color: "var(--color-accent)" }}
                >
                  0{i + 1}
                </span>
              </span>
              <div>
                <div className="rname">
                  <b>{title}</b>
                </div>
                <p>{body}</p>
              </div>
            </div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
