"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

/**
 * Smooth scroll → a single normalised progress value (0–1).
 *
 * The page scrolls vertically (a tall, invisible spacer gives it height),
 * but the world reads that progress as *horizontal* travel — wheel down
 * moves the camera along +X. Lenis smooths the wheel so the journey glides
 * instead of stepping.
 *
 * `onProgress` is called on every scroll frame with the latest value; keep
 * it cheap (write to a ref, don't setState) so the render loop stays at 60.
 */
export function useScrollProgress(
  active: boolean,
  onProgress: (p: number) => void,
) {
  const lenisRef = useRef<Lenis | null>(null);
  const cb = useRef(onProgress);
  cb.current = onProgress;

  useEffect(() => {
    if (!active) return;

    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 1,
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;

    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    lenis.on("scroll", ({ scroll, limit }: { scroll: number; limit: number }) => {
      cb.current(limit > 0 ? scroll / limit : 0);
    });

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [active]);

  return lenisRef;
}
