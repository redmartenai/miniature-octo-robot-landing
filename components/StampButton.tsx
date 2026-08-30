"use client";

import { useState } from "react";

/* Ink & Stamp — Briefing approve/share action.
   On click it presses (scale .97, via .nocturne-press), stamps an
   ink ring, and swaps its label to "Approved · running" for the
   demo. Reused in-product, so it lives on its own. */
export function StampButton({
  kind,
  label,
}: {
  kind: "approve" | "share";
  label: string;
}) {
  const [done, setDone] = useState(false);
  const glyph = kind === "approve" ? "✓" : "→";

  const onClick = () => {
    if (kind === "approve" && !done) setDone(true);
  };

  return (
    <button
      type="button"
      className={`dact ${kind} nocturne-press${done ? " done" : ""}`}
      onClick={onClick}
      aria-pressed={kind === "approve" ? done : undefined}
    >
      {done && <span className="dact-ring" aria-hidden />}
      <span className="dact-glyph" aria-hidden>
        {done ? "✓" : glyph}
      </span>{" "}
      {done ? "Approved · running" : label}
    </button>
  );
}
