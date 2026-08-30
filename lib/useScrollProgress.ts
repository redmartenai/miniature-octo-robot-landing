"use client";

/* ============================================================
   NOCTURNE SCROLL ENGINE — one shared, passive, rAF-throttled
   loop for the whole page. No dependencies. Native scroll only:
   we never intercept wheel/touch, never hijack scroll.

   - useScrollProgress(ref, cb): band traversal -> p in [0,1].
     Runs only while the band intersects (IntersectionObserver).
   - usePageProgress(cb): whole-document scroll -> p in [0,1].
   - observeReveal(el): add "in" once when el crosses threshold.

   Geometry is cached on register + resize; the per-frame path
   reads only window.scrollY (no layout reads, no thrash).
   ============================================================ */

import { useEffect, useRef, type RefObject } from "react";

type Mode = "band" | "page";
type Scrubber = {
  el: HTMLElement | null;
  cb: (p: number) => void;
  mode: Mode;
  top: number;
  range: number;
  active: boolean;
};

const scrubbers = new Set<Scrubber>();
const byEl = new WeakMap<Element, Scrubber>();
let io: IntersectionObserver | null = null;
let listening = false;
let ticking = false;

const clamp = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const docHeight = () =>
  Math.max(
    document.documentElement.scrollHeight,
    document.body ? document.body.scrollHeight : 0,
  );

function measure(s: Scrubber) {
  if (s.mode !== "band" || !s.el) return;
  const rect = s.el.getBoundingClientRect();
  const y = window.scrollY || window.pageYOffset;
  s.top = rect.top + y;
  s.range = Math.max(1, s.el.offsetHeight - window.innerHeight);
}

function tick() {
  ticking = false;
  const y = window.scrollY || window.pageYOffset;
  scrubbers.forEach((s) => {
    if (s.mode === "band") {
      if (!s.active) return;
      s.cb(clamp((y - s.top) / s.range));
    } else {
      const range = Math.max(1, docHeight() - window.innerHeight);
      s.cb(clamp(y / range));
    }
  });
}

function requestTick() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(tick);
}

function onResize() {
  scrubbers.forEach(measure);
  requestTick();
}

function getIO() {
  if (io) return io;
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const s = byEl.get(e.target);
        if (!s) continue;
        s.active = e.isIntersecting;
        if (s.active) measure(s);
      }
      requestTick();
    },
    { threshold: 0, rootMargin: "0px" },
  );
  return io;
}

function startListening() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
}

function stopListeningIfIdle() {
  if (listening && scrubbers.size === 0) {
    listening = false;
    window.removeEventListener("scroll", requestTick);
    window.removeEventListener("resize", onResize);
  }
}

function register(s: Scrubber) {
  scrubbers.add(s);
  startListening();
  if (s.mode === "band" && s.el) {
    byEl.set(s.el, s);
    getIO().observe(s.el);
    measure(s);
  } else {
    s.active = true;
  }
  requestTick();
  return () => {
    scrubbers.delete(s);
    if (s.mode === "band" && s.el) {
      byEl.delete(s.el);
      io?.unobserve(s.el);
    }
    stopListeningIfIdle();
  };
}

/** Map a band element's traversal (as it scrolls past under a
 *  sticky child) to progress in [0,1]. Active only while visible. */
export function useScrollProgress(
  ref: RefObject<HTMLElement>,
  cb: (p: number) => void,
  enabled = true,
) {
  const cbRef = useRef(cb);
  cbRef.current = cb;
  useEffect(() => {
    if (!enabled || typeof window === "undefined" || !ref.current) return;
    return register({
      el: ref.current,
      cb: (p) => cbRef.current(p),
      mode: "band",
      top: 0,
      range: 1,
      active: false,
    });
  }, [ref, enabled]);
}

/** Map whole-document scroll to progress in [0,1]. */
export function usePageProgress(cb: (p: number) => void, enabled = true) {
  const cbRef = useRef(cb);
  cbRef.current = cb;
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    return register({
      el: null,
      cb: (p) => cbRef.current(p),
      mode: "page",
      top: 0,
      range: 1,
      active: true,
    });
  }, [enabled]);
}

/* ---- shared reveal observer: adds "in" once, then unobserves ---- */
/* Reveal controller — adds "in" once an element is in (or near) the
   viewport, then stops tracking it. Bulletproof by design: content is
   hidden until revealed, so a missed reveal would leave a blank-but-
   space-occupying section. Three independent triggers guarantee that
   never happens: (1) synchronous reveal if already in/above the
   viewport at observe time; (2) an IntersectionObserver for the normal
   scroll-in animation; (3) a scroll + timeout "flush" that sweeps any
   element the observer missed (flaky IO, wrong innerHeight at hydration,
   headless capture, reload mid-page). */
const pending = new Set<Element>();
let revealIO: IntersectionObserver | null = null;
let flushArmed = false;

function reveal(el: Element) {
  el.classList.add("in");
  pending.delete(el);
  revealIO?.unobserve(el);
}

function flush() {
  if (!pending.size) return;
  const limit = window.innerHeight * 1.3;
  for (const el of Array.from(pending)) {
    if (el.getBoundingClientRect().top < limit) reveal(el);
  }
}

function armFlush() {
  if (flushArmed || typeof window === "undefined") return;
  flushArmed = true;
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      flush();
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  // catch the first fold even if IO / innerHeight were unreliable at mount
  setTimeout(flush, 400);
  setTimeout(flush, 1200);
}

function getRevealIO() {
  if (revealIO) return revealIO;
  revealIO = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) reveal(e.target);
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
  );
  return revealIO;
}

export function observeReveal(el: Element | null) {
  if (!el || typeof window === "undefined") return () => {};
  // Already in or above the viewport → reveal now (covers the initial
  // fold and reload-mid-page, where the element sits above the scroll).
  if (el.getBoundingClientRect().top < window.innerHeight) {
    el.classList.add("in");
    return () => {};
  }
  pending.add(el);
  getRevealIO().observe(el);
  armFlush();
  return () => {
    pending.delete(el);
    revealIO?.unobserve(el);
  };
}
