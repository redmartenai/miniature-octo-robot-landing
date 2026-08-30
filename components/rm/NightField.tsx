"use client";

import { useEffect, useRef } from "react";
import { useReduced } from "@/lib/rm/motion";

/* ============================================================
   NIGHT FIELD
   The atmosphere for the dark half of the page. Not particles:
   a fixed lattice — the systems the OS is holding — lit by two
   slow lights passing underneath it. Nothing drifts at random;
   the lights travel a fixed path, so the field reads as
   something being watched over rather than decoration.
   ============================================================ */

export function NightField({
  density = 34,
  intensity = 1,
  className,
}: {
  density?: number;
  intensity?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReduced();

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;

    const size = () => {
      const r = cv.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      /* two lights on fixed, slow paths */
      const a = t / 24000;
      const b = t / 31000;
      const lights = [
        { x: w * (0.5 + 0.34 * Math.cos(a * Math.PI * 2)), y: h * (0.5 + 0.3 * Math.sin(a * Math.PI * 2 * 0.8)), r: Math.max(w, h) * 0.42 },
        { x: w * (0.5 + 0.3 * Math.cos(-b * Math.PI * 2 + 1.6)), y: h * (0.5 + 0.26 * Math.sin(-b * Math.PI * 2)), r: Math.max(w, h) * 0.34 },
      ];

      for (const l of lights) {
        const g = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r);
        g.addColorStop(0, `rgba(201,125,60,${0.15 * intensity})`);
        g.addColorStop(0.45, `rgba(145,83,42,${0.055 * intensity})`);
        g.addColorStop(1, "rgba(21,20,19,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      /* the lattice, lit by proximity */
      const step = density;
      for (let y = step * 0.5; y < h; y += step) {
        for (let x = step * 0.5; x < w; x += step) {
          let v = 0;
          for (const l of lights) {
            const d = Math.hypot(x - l.x, y - l.y) / l.r;
            v += Math.max(0, 1 - d * d);
          }
          const alpha = Math.min(0.5, 0.045 + v * 0.34) * intensity;
          const s = v > 0.55 ? 1.8 : 1.2;
          ctx.fillStyle =
            v > 0.72 ? `rgba(228,161,84,${alpha})` : `rgba(244,236,225,${alpha * 0.62})`;
          ctx.fillRect(x - s / 2, y - s / 2, s, s);
        }
      }
    };

    size();
    if (reduced) {
      draw(9000);
      const onResize = () => {
        size();
        draw(9000);
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const onResize = () => size();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [density, intensity, reduced]);

  return <canvas ref={ref} className={className} aria-hidden />;
}
