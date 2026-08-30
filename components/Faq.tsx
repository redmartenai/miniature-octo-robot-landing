"use client";

import { FAQ } from "@/lib/site";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

export function Faq() {
  return (
    <section className="sec" id="faq">
      <div className="wrap">
        <SectionHead
          n="—"
          kicker="FAQ"
          title={
            <>
              The questions we <span className="em">actually</span> get asked.
            </>
          }
        />

        <Reveal className="qa">
          {FAQ.map(([question, answer], i) => (
            <details key={question} open={i === 0}>
              <summary>
                <span className="qn">Q.{String(i + 1).padStart(2, "0")}</span>
                <span className="qt">{question}</span>
                <span className="x">＋</span>
              </summary>
              <div className="ans">{answer}</div>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
