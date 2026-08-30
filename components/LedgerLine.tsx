"use client";

import type { ReactNode } from "react";

/* One ledger row: timestamp · dotted leader · entry.
   The Night Ledger's grammar, reused across The Record log, the
   agent activity feed, and the canvas Logs tab so the whole page
   reads as one application. Render inside an <ol className="ledger">. */
export function LedgerLine({
  time,
  children,
  printed = true,
  className,
}: {
  time: string;
  children: ReactNode;
  /** When false, the row starts un-printed and prints via [data-anim]. */
  printed?: boolean;
  className?: string;
}) {
  return (
    <li
      className={`ledger-line${className ? " " + className : ""}`}
      {...(printed ? {} : { "data-anim": "print" })}
    >
      <span className="ll-time">{time}</span>
      <span className="ll-leader" aria-hidden />
      <span className="ll-text">{children}</span>
    </li>
  );
}
