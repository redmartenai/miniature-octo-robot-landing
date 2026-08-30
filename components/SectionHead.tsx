"use client";

import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function SectionHead({
  n,
  kicker,
  title,
  dek,
}: {
  n: string;
  kicker: string;
  title: ReactNode;
  dek?: ReactNode;
}) {
  return (
    <Reveal className="sec-top">
      <div className="idx">
        <span className="n">{n}</span>
        <span className="dash" />
        <span>{kicker}</span>
      </div>
      <h2>{title}</h2>
      {dek ? <p className="dek">{dek}</p> : null}
    </Reveal>
  );
}
