"use client";

import { MartenMark } from "@/brand/MartenLogo";
import { Rise } from "./Shell";
import { ABOUT } from "@/lib/rm/data";
import { NightField } from "./NightField";

/* ============================================================
   FRAME 07 — ABOUT
   The page turns down here. Paper gives way to night, the type
   loosens, and the argument stops being about capability and
   starts being about what software is for.
   ============================================================ */

export function About() {
  return (
    <section className="rm-night" id="about">
      <NightField density={36} intensity={1} />
      <div className="rm-night-in">
        <Rise>
          <span className="rm-eyebrow">
            <b>07</b>
            <i className="tick" />
            Govern · About
          </span>
          <h2 className="rm-about-h">
            {ABOUT.h[0]}
            <em>{ABOUT.h[1]}</em>
          </h2>
        </Rise>

        <Rise i={1}>
          <p className="rm-about-lede">{ABOUT.lede}</p>
        </Rise>

        <Rise className="rm-about-cols" i={2}>
          {ABOUT.cols.map((c) => (
            <div className="rm-about-col" key={c.h}>
              <h3>{c.h}</h3>
              {c.p.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          ))}
        </Rise>

        <Rise className="rm-about-sig" i={3}>
          <MartenMark size={34} />
          <p>{ABOUT.sig}</p>
        </Rise>
      </div>
    </section>
  );
}
