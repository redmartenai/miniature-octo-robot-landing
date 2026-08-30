"use client";

import { useState } from "react";
import { MartenMark } from "@/brand/MartenLogo";
import { AGENTS } from "@/lib/site";
import { SectionHead } from "./SectionHead";
import { AppFrame } from "./AppFrame";
import { Reveal } from "./Reveal";
import { LedgerLine } from "./LedgerLine";

type Status = "working" | "idle" | "escalated";

// status + feed + metadata layered on the shared roster
const META: Record<
  string,
  { status: Status; tools: string; manager: string; memory: string; feed: [string, string][] }
> = {
  Nadia: {
    status: "working",
    tools: "CRM · Email · Sequencer · Calendar",
    manager: "Head of SDR (human)",
    memory: "7 open sequences · 41% booking rate",
    feed: [
      ["07:12", "drafted email · Meridian Freight · auto-approved (P-114)"],
      ["07:26", "booked meeting · Coreline Systems · Thu 15:00"],
      ["07:41", "paused sequence · Halden Systems · reply received"],
      ["07:58", "staged 3-touch sequence · awaiting your approval"],
    ],
  },
  Idris: {
    status: "working",
    tools: "Enrichment · Web search · CRM",
    manager: "RevOps (human)",
    memory: "604 companies · 38 attributes each",
    feed: [
      ["06:40", "refreshed 38 attributes · Coreline Systems"],
      ["07:03", "flagged funding round · Vantage Freight"],
    ],
  },
  Priya: {
    status: "escalated",
    tools: "Calendar · Transcription · CRM",
    manager: "AE team (human)",
    memory: "12 recaps written this week",
    feed: [
      ["07:44", "wrote call recap to CRM · approved by S. Okafor"],
      ["07:59", "escalated · contract question needs Legal"],
    ],
  },
};

export function AgentDesk() {
  const [active, setActive] = useState("Nadia");
  const meta = META[active] ?? {
    status: "idle" as Status,
    tools: "CRM · Web",
    manager: "RevOps (human)",
    memory: "idle · waiting for the list",
    feed: [["—", "no activity in the last hour"]] as [string, string][],
  };
  const role = AGENTS.find(([n]) => n === active)?.[1] ?? "";

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

        <Reveal>
          <AppFrame
            url="acme-revops.redmarten.app/agents"
            status={<span className="af-live"><i /> 190 agents on shift</span>}
          >
            <div className="ad">
              <aside className="ad-side" aria-label="Agents">
                {AGENTS.map(([name, r]) => {
                  const s = META[name]?.status ?? "idle";
                  return (
                    <button
                      key={name}
                      className={`ad-agent${active === name ? " on" : ""}`}
                      onClick={() => setActive(name)}
                      aria-current={active === name ? "true" : undefined}
                    >
                      <span className="ad-av">
                        <MartenMark size={15} />
                      </span>
                      <span className="ad-id">
                        <b>{name}</b>
                        <span className="ad-role">{r}</span>
                      </span>
                      <span className={`ad-dot ${s}`} title={s} />
                    </button>
                  );
                })}
              </aside>

              <div className="ad-main">
                <div className="ad-head">
                  <div>
                    <b>{active}</b>
                    <span className="ad-role">{role}</span>
                  </div>
                  <span className={`ad-status ${meta.status}`}>{meta.status}</span>
                </div>

                <div className="ad-meta">
                  <div>
                    <dt>Memory</dt>
                    <dd>{meta.memory}</dd>
                  </div>
                  <div>
                    <dt>Tools</dt>
                    <dd>{meta.tools}</dd>
                  </div>
                  <div>
                    <dt>Manager</dt>
                    <dd>{meta.manager}</dd>
                  </div>
                </div>

                <div className="ad-feed-h">Activity · written to the record</div>
                <ol className="ledger ad-feed">
                  {meta.feed.map(([time, text], i) => (
                    <LedgerLine key={i} time={time}>
                      {text}
                    </LedgerLine>
                  ))}
                </ol>
              </div>
            </div>
          </AppFrame>
        </Reveal>

        <Reveal as="p" className="desk-close">
          Every one of them works on the record. <a href="#record">→ See how</a>
        </Reveal>
      </div>
    </section>
  );
}
