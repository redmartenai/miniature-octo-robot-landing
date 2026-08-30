"use client";

import dynamic from "next/dynamic";

// The experience is a WebGL world — client-only, no SSR.
const OSExperience = dynamic(
  () => import("@/components/os/OSExperience").then((m) => m.OSExperience),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#F5EFE6",
          display: "grid",
          placeItems: "center",
          color: "rgba(22,21,20,0.45)",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.34em",
          textTransform: "uppercase",
        }}
      >
        Waking the organism…
      </div>
    ),
  },
);

export default function OSPage() {
  return <OSExperience />;
}
