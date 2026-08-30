"use client";

import { MartenMark } from "@/brand/MartenLogo";
import { AGENTS } from "@/lib/site";
import { SectionHead } from "./SectionHead";
import { Reveal, RevealGroup } from "./Reveal";

export function Agents() {
  return (
    <section className="sec" id="desk">
      <div className="wrap">
        <SectionHead
          n="04"
          kicker="The desk"
          title={
            <>
              Digital coworkers with a <span className="em">job description.</span>
            </>
          }
          dek="Each agent has a prompt, a memory, a tool set and a manager. They work an account list, log everything they do, and escalate the moment judgement is needed."
        />

        <RevealGroup className="roster">
          {AGENTS.map(([name, role, body]) => (
            <div className="rperson" key={name}>
              <span className="rav">
                <MartenMark size={18} />
              </span>
              <div>
                <div className="rname">
                  <b>{name}</b>
                  <span className="role">{role}</span>
                </div>
                <p>{body}</p>
              </div>
            </div>
          ))}
        </RevealGroup>

        <Reveal as="p" className="desk-close">
          Every one of them works on the record.{" "}
          <a href="#record">→ See how</a>
        </Reveal>
      </div>
    </section>
  );
}
