"use client";
import { useEffect, useRef, type ReactNode } from "react";

/* The only client-side JS on the page. One observer, shared by every element
   that opts in, toggling a class that animates opacity and transform only. */
export default function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) { el.classList.add("in"); return; }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } },
      { rootMargin: "0px 0px -12% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className="rise" style={delay ? { transitionDelay: `${delay}ms` } : undefined}>{children}</div>;
}
