"use client";

import { useEffect, useRef, useState } from "react";
import { usePageProgress } from "@/lib/useScrollProgress";

const H = 1000; // viewBox height; the path is a single vertical line

/* The Scent Trail — the software marks its route down the page.
   >=1200px: an inked gutter line that draws itself with scroll (two
   stacked strokes: a faint base and a bright drawn head). <1200px:
   a 2px top progress hairline. Reduced motion hides both. Decorative
   only: aria-hidden, pointer-events:none. */
export function ScentTrail() {
  const [mode, setMode] = useState<"gutter" | "hairline" | "off">("off");
  const hairRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const pick = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "off";
      return window.matchMedia("(min-width: 1200px)").matches ? "gutter" : "hairline";
    };
    setMode(pick() as typeof mode);
    const onResize = () => setMode(pick() as typeof mode);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  usePageProgress((p) => {
    if (hairRef.current) hairRef.current.style.transform = `scaleX(${p})`;
    if (headRef.current) headRef.current.style.strokeDashoffset = String(H * (1 - p));
  }, mode !== "off");

  if (mode === "off") return null;
  if (mode === "hairline") return <div ref={hairRef} className="scent-hairline" aria-hidden />;

  return (
    <svg
      className="scent-trail"
      aria-hidden
      viewBox={`0 0 48 ${H}`}
      preserveAspectRatio="none"
    >
      <path className="trail-base" d={`M24 0 L24 ${H}`} vectorEffect="non-scaling-stroke" strokeWidth={1.5} />
      <path
        ref={headRef}
        className="trail-head"
        d={`M24 0 L24 ${H}`}
        vectorEffect="non-scaling-stroke"
        strokeWidth={1.5}
        style={{ strokeDasharray: H, strokeDashoffset: H }}
      />
    </svg>
  );
}
