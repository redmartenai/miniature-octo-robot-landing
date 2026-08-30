"use client";

import {
  Children,
  cloneElement,
  createElement,
  isValidElement,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { observeReveal } from "@/lib/useScrollProgress";

type Tag = "div" | "section" | "li" | "figure" | "span" | "ul" | "ol" | "p";

/** Print-wipe entrance. Fires once when the element crosses the
 *  viewport threshold (shared IntersectionObserver). Vanilla — no
 *  animation library. `delay` is expressed in typewriter steps
 *  (60ms each) via the --i custom property. */
export function Reveal({
  children,
  delay = 0,
  as = "div",
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  as?: Tag;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => observeReveal(ref.current), []);
  return createElement(
    as,
    {
      ref,
      className,
      "data-anim": "print",
      "data-reveal": "",
      style: delay
        ? ({ ...style, ["--i"]: Math.round(delay / 0.06) } as CSSProperties)
        : style,
    },
    children,
  );
}

/** Staggered container — each direct child prints in sequence,
 *  capped at `cap` typewriter steps. */
export function RevealGroup({
  children,
  className,
  style,
  cap = 6,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  cap?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const kids = Array.from(root.children);
    const cleanups = kids.map((el) => observeReveal(el));
    return () => cleanups.forEach((c) => c());
  }, []);

  let i = 0;
  const mapped = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    const idx = Math.min(i++, cap - 1);
    const props = child.props as { style?: CSSProperties };
    return cloneElement(child as React.ReactElement<{ style?: CSSProperties; "data-anim"?: string }>, {
      "data-anim": "print",
      style: { ...(props.style || {}), ["--i"]: idx } as CSSProperties,
    });
  });

  return (
    <div ref={ref} className={className} style={style}>
      {mapped}
    </div>
  );
}
