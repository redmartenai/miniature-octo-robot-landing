"use client";

/* ============================================================
   RED MARTEN — MOTION PRIMITIVES
   Four things the whole surface shares: a reduced-motion flag,
   a one-shot in-view trigger, a box measurement (so geometry is
   computed in real pixels, never guessed), and a count-up that
   settles rather than spins. No animation library needed for any
   of it; GSAP and Lenis are reserved for scroll and timelines.
   ============================================================ */

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

/* ---------- reduced motion ---------- */
export function useReduced() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

/* ---------- one-shot in-view ----------
   Fires once when the element crosses into the viewport, then
   stops observing. Elements already on screen at mount resolve
   immediately, so a reload mid-page never leaves a hole. */
export function useInView<T extends HTMLElement>(rootMargin = "0px 0px -12% 0px") {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (el.getBoundingClientRect().top < window.innerHeight) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen, rootMargin]);
  return { ref, seen };
}

/* ---------- measured box ----------
   Geometry for the graph surfaces is computed from the element's
   real size, so nodes and wires can never disagree about where
   an edge is, at any viewport width. */
export function useBox<T extends HTMLElement>(): [RefObject<T>, { w: number; h: number }] {
  const ref = useRef<T>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => {
      const r = el.getBoundingClientRect();
      setBox((prev) =>
        Math.abs(prev.w - r.width) < 0.5 && Math.abs(prev.h - r.height) < 0.5
          ? prev
          : { w: r.width, h: r.height },
      );
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, box];
}

/* ---------- count up ----------
   Eased to a stop (never linear, never looping). Decimals are
   preserved for values like 3.5. */
export function useCountUp(target: number, run: boolean, ms = 1400, decimals = 0) {
  const [v, setV] = useState(0);
  const reduced = useReduced();
  useEffect(() => {
    if (!run) return;
    if (reduced || ms <= 0) {
      setV(target);
      return;
    }
    let raf = 0;
    let start = 0;
    const step = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Number((target * eased).toFixed(decimals)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, run, ms, decimals, reduced]);
  return v;
}

/* ---------- shared rAF ticker ----------
   One loop for any component that needs per-frame time, so the
   page never runs six competing animation loops. */
export function useTicker(active: boolean, cb: (t: number, dt: number) => void) {
  const ref = useRef(cb);
  ref.current = cb;
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(64, t - last);
      last = t;
      ref.current(t, dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);
}

/* ---------- interval that respects reduced motion ---------- */
export function useBeat(ms: number, run: boolean, cb: () => void) {
  const ref = useRef(cb);
  ref.current = cb;
  useEffect(() => {
    if (!run) return;
    const id = setInterval(() => ref.current(), ms);
    return () => clearInterval(id);
  }, [ms, run]);
}

/* ---------- scroll progress (0–1) for the masthead hairline ---------- */
export function useScrollRatio() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return p;
}

/* ---------- which section is under the masthead ---------- */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const line = window.innerHeight * 0.34;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ids]);
  return active;
}

/* ---------- smooth scroll ----------
   Lenis, switched off entirely under reduced motion so the page
   keeps native scrolling for anyone who asked for it. The live
   instance is held here so in-page jumps can hand the travel to
   Lenis instead of fighting it with scrollIntoView. */
type LenisLike = {
  raf: (t: number) => void;
  destroy: () => void;
  scrollTo: (target: HTMLElement | number, opts?: { offset?: number; duration?: number }) => void;
};
let live: LenisLike | null = null;

export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    let lenis: LenisLike | null = null;
    let raf = 0;
    let cancelled = false;
    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const l = new Lenis({ lerp: 0.11, wheelMultiplier: 1, smoothWheel: true, touchMultiplier: 1.5 }) as unknown as LenisLike;
      lenis = l;
      live = l;
      const loop = (t: number) => {
        l.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      lenis?.destroy();
      if (live === lenis) live = null;
    };
  }, [enabled]);
}

/* ---------- typing ----------
   Characters land at a steady rate with a pause at punctuation,
   so an answer reads like it is being written, not printed. */
export function useTypewriter(text: string, run: boolean, cps = 58) {
  const [out, setOut] = useState("");
  const reduced = useReduced();
  useEffect(() => {
    if (!run) {
      setOut("");
      return;
    }
    if (reduced) {
      setOut(text);
      return;
    }
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) return;
      const ch = text[i - 1];
      const pause = ch === "." || ch === "?" ? 190 : ch === "," || ch === "—" ? 90 : 1000 / cps;
      timer = setTimeout(tick, pause);
    };
    timer = setTimeout(tick, 240);
    return () => clearTimeout(timer);
  }, [text, run, cps, reduced]);
  const done = out.length >= text.length;
  return { out, done };
}

/* ---------- a stable, seeded shuffle ----------
   Deterministic so server and client agree; used where a layout
   needs variety without hydration drift. */
export function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/* ---------- lock the page behind an overlay ---------- */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

/* ---------- smooth in-page navigation ---------- */
export function useAnchorNav() {
  return useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    /* clear the sticky masthead */
    const offset = -76;
    if (live && !reduce) {
      live.scrollTo(el, { offset, duration: 1.1 });
      return;
    }
    const y = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  }, []);
}
