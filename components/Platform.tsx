"use client";

import { PRODUCTS } from "@/lib/site";
import { Reveal, RevealGroup } from "./Reveal";
import { SectionHead } from "./SectionHead";

export function Platform() {
  return (
    <section className="sec" id="platform">
      <div className="wrap">
        <SectionHead
          n="02"
          kicker="The platform"
          title={
            <>
              Six modules, <span className="em">one</span> system of record.
            </>
          }
          dek="Every module writes to the same graph, so an intent signal in Data Studio can start a workflow, brief a voice agent and land as pipeline in Analytics — without anyone copying a spreadsheet."
        />

        <Reveal as="p" className="platform-kicker">
          Six modules, one graph — and one record of what every module did.
        </Reveal>

        <RevealGroup className="index">
          {PRODUCTS.map((p, i) => (
            <a className="irow" key={p.name} href="#">
              <span className="in">0{i + 1}</span>
              <span className="iname">{p.name}</span>
              <span className="idesc">{p.body}</span>
              <span className="istat">
                {p.stats.map(([v, l]) => (
                  <span key={l}>
                    <b>{v}</b>
                    {l}
                  </span>
                ))}
              </span>
              <span className="iarw">→</span>
            </a>
          ))}
        </RevealGroup>

        {/* vs general automation — the category answer, promoted from FAQ */}
        <Reveal className="vs-strip">
          <p>
            General automation tools give you the primitives. Red Marten ships the revenue system
            already built — 604 accounts enriched on 38 attributes, 190 agents written for sales
            jobs, voice and CRM wired in. <span className="em">You configure a revenue system, not assemble one.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
