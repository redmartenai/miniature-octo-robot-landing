"use client";

import type { ReactNode } from "react";
import { MartenMark } from "@/brand/MartenLogo";

/* A restrained app-window chrome that wraps every product surface,
   so the reader assembles one coherent application. Quiet by design:
   hairline borders, muted dots, theme-aware, no shadow theatrics. */
export function AppFrame({
  url = "acme-revops.redmarten.app",
  status,
  children,
  className,
}: {
  url?: string;
  status?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`appframe${className ? " " + className : ""}`}>
      <div className="af-bar">
        <span className="af-dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="af-brand" aria-hidden>
          <MartenMark size={13} />
        </span>
        <span className="af-url">{url}</span>
        {status ? <span className="af-status">{status}</span> : null}
      </div>
      <div className="af-body">{children}</div>
    </div>
  );
}
