"use client";

import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useInView, useReduced, useSmoothScroll } from "@/lib/rm/motion";

/* ============================================================
   SHELL — one context for the two things every frame needs:
   the way into the operating system, and whether motion is
   welcome. Smooth scroll is installed here, once.
   ============================================================ */

export type EnterView = "choose" | "login" | "create" | "demo";

type Ctx = {
  enter: EnterView | null;
  openEnter: (v?: EnterView) => void;
  closeEnter: () => void;
  reduced: boolean;
};

const RmCtx = createContext<Ctx | null>(null);

export function useRm() {
  const c = useContext(RmCtx);
  if (!c) throw new Error("useRm must be used inside <RmShell>");
  return c;
}

export function RmShell({ children }: { children: ReactNode }) {
  const [enter, setEnter] = useState<EnterView | null>(null);
  const reduced = useReduced();
  useSmoothScroll(!reduced && enter === null);

  /* the flag the whole surface reads when it powers down */
  useEffect(() => {
    const el = document.documentElement;
    if (enter) el.dataset.rmEnter = "1";
    else delete el.dataset.rmEnter;
    return () => {
      delete el.dataset.rmEnter;
    };
  }, [enter]);

  const openEnter = useCallback((v: EnterView = "choose") => setEnter(v), []);
  const closeEnter = useCallback(() => setEnter(null), []);

  const value = useMemo(
    () => ({ enter, openEnter, closeEnter, reduced }),
    [enter, openEnter, closeEnter, reduced],
  );

  return <RmCtx.Provider value={value}>{children}</RmCtx.Provider>;
}

/* ---------- Rise — the only entrance on the page ----------
   Content settles 10px into place, once, staggered by index.
   Under reduced motion it is simply there. */
export function Rise({
  children,
  i = 0,
  as = "div",
  className = "",
  ...rest
}: {
  children: ReactNode;
  i?: number;
  as?: "div" | "section" | "li" | "p" | "figure" | "header" | "aside";
  className?: string;
} & Record<string, unknown>) {
  const { ref, seen } = useInView<HTMLDivElement>();
  return createElement(
    as,
    {
      ref,
      className: `rm-in${seen ? " on" : ""}${className ? ` ${className}` : ""}`,
      style: { ["--i" as string]: i },
      ...rest,
    },
    children,
  );
}

/* ---------- section head — the page reads like a spec ---------- */
export function Head({
  n,
  verb,
  frame,
  title,
  dek,
}: {
  n: string;
  verb: string;
  frame: string;
  title: ReactNode;
  dek: ReactNode;
}) {
  return (
    <header className="rm-sec-head">
      <Rise>
        <span className="rm-eyebrow">
          <b>{n}</b>
          <i className="tick" />
          {verb} · {frame}
        </span>
        <h2 className="rm-h2">{title}</h2>
      </Rise>
      <Rise i={1}>
        <p className="rm-dek">{dek}</p>
      </Rise>
    </header>
  );
}
