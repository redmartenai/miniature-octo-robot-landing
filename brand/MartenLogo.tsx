/**
 * Red Marten logo — single source component.
 * Requires brand/tokens.css to be imported once at the app root.
 *
 *   <MartenMark size={26} />                      // static, inherits currentColor
 *   <MartenMark motion="leap" size={74} />        // splash / hero / auth
 *   <MartenMark motion="trail" size={56} />       // route + data loading
 *   <MartenMark motion="scent" size={28} />       // an agent is reasoning
 *   <MartenMark motion="sprint" size={20} />      // a workflow is executing
 *   <MartenLockup orientation="horizontal" />     // mark + wordmark
 *
 * GEOMETRY (brand book §02): two closed paths and one counter on a 120-unit
 * grid — the body (with the eye cut out, fill-rule evenodd) and the trail.
 * Mark is 112 x 103.4 u, centred on 60,60. Leap axis 43deg, lower-left to
 * upper-right. The marten NEVER mirrors: it always leaps right.
 *
 * Vectored from test.png (199x192) at 96.06% pixel overlap: cream/red field
 * separated, contour traced at 6x with sub-pixel smoothing, fitted to 41
 * cubic Beziers. Swap BODY/TAIL for the master vector when it arrives; keep
 * the .body / .tail / .wiper class names so the motion system still binds.
 */
"use client";

import * as React from "react";

export type MarkMotion = "leap" | "trail" | "scent" | "sprint";

/** Body outline, then the eye as a counter. Requires fill-rule="evenodd". */
const BODY =
  "M115.81 39C115.14 41.12 111.85 43.19 109.75 43.9C103.11 43.67 96.45 37.8 89.67 41.98C85.44 44.6 84.64 50 82.46 54.12C79.03 60.6 73.39 67.15 66.49 70.02C64.03 71.04 59.09 73.2 56.7 71.71C57.24 70.15 58.89 69.57 60.14 68.48C62.4 66.52 64.25 63.92 64.6 60.89C65.38 54.24 58.2 52.73 53.56 51.6C49.59 50.64 46.64 51.38 42.73 51.73C37.37 52.21 31.14 53.52 26.27 56.07C22.7 57.93 18.46 61.54 14.65 62.44C14.43 61.19 15.51 60.19 16.27 59.09C18.16 56.34 20.49 53.92 22.75 51.48C29.28 44.46 38.15 38.52 47.34 35.73C51.95 34.34 57.56 33.27 62.38 34.51C67.2 35.75 72.44 38.77 75.02 43.17C76.15 45.08 76.28 48.56 77.79 49.86C78.97 48 78.48 44.51 77.8 42.44C75.91 36.72 71.21 32.23 65.06 31.23C62.81 30.87 57.13 31.18 55.76 29.75C56.84 28.07 59.16 27.1 60.89 26.07C65.92 23.05 71.2 20.96 76.84 19.49C79.25 18.87 81.89 19.27 84.13 18.13C85.65 15.03 83.94 11.76 84.84 8.66C90.2 8.32 93.59 15.86 96 19.5C97.29 21.43 100.76 22.77 102.55 24.39C105.06 26.65 105.78 30.09 107.96 32.5C110.23 35.02 113.78 36.37 115.81 39Z";
const EYE =
  "M100.83 31.1C99.96 31.42 97.11 30.38 97.32 29.18C97.99 28.69 100.93 30.18 100.83 31.1Z";
const TAIL =
  "M54.73 56.1C54.62 57.25 53.44 57.58 52.45 58.13C50.55 59.18 48.68 60.54 46.85 61.72C39.88 66.25 33.21 72.04 27.39 77.96C20.96 84.52 15.31 92.04 10.68 99.96C9.11 102.65 8.13 105.58 6.76 108.36C6.17 109.54 6.42 110.69 5.32 111.57C4.12 110.79 4.18 107.84 4.04 106.41C3.52 101.14 4.7 95.25 6.25 90.27C11.22 74.22 22.86 61.45 39.36 57.09C43.04 56.12 46.64 55.59 50.48 55.59C51.88 55.59 53.59 55.28 54.73 56.1Z";

/** Below this the eye fills in and reads as a defect — drop it. */
const EYE_MIN_PX = 32;

export interface MartenMarkProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  /** Animation behaviour. Omit for a static mark. */
  motion?: MarkMotion;
  /** Accessible name. Defaults to decorative (aria-hidden). */
  title?: string;
}

export function MartenMark({
  size = 26,
  motion,
  title,
  className = "",
  ...rest
}: MartenMarkProps) {
  const clipId = React.useId();
  const numeric = typeof size === "number" ? size : parseFloat(String(size));
  const withEye = !numeric || numeric >= EYE_MIN_PX;
  const needsWipe = motion === "leap" || motion === "trail";

  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={`rm-mark ${className}`.trim()}
      data-motion={motion}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {needsWipe ? (
        <defs>
          <clipPath id={clipId}>
            {/* Only this rect is transformed — never the path, never a width
                attribute. Pure transform composites on the GPU. */}
            <rect className="wiper" x={-124} y={0} width={124} height={120} />
          </clipPath>
        </defs>
      ) : null}
      <path className="body" fillRule="evenodd" d={withEye ? `${BODY}${EYE}` : BODY} />
      <path className="tail" d={TAIL} clipPath={needsWipe ? `url(#${clipId})` : undefined} />
    </svg>
  );
}

export interface MartenLockupProps {
  orientation?: "horizontal" | "stacked";
  /** Show the "Autonomous GTM" descriptor. Dropped below 40mm / 200px. */
  descriptor?: boolean;
  motion?: MarkMotion;
  size?: number;
  className?: string;
}

export function MartenLockup({
  orientation = "horizontal",
  descriptor = false,
  motion,
  size = 46,
  className = "",
}: MartenLockupProps) {
  const stacked = orientation === "stacked";
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        flexDirection: stacked ? "column" : "row",
        gap: stacked ? 16 : size * 0.28,
      }}
    >
      <MartenMark size={size} motion={motion} />
      <span style={{ textAlign: stacked ? "center" : "left" }}>
        <span
          style={{
            display: "block",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            fontSize: size * 0.62,
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          Red Marten
        </span>
        {descriptor ? (
          <span
            style={{
              display: "block",
              marginTop: 7,
              fontFamily: "var(--font-mono)",
              fontSize: Math.max(8, size * 0.17),
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              opacity: 0.72,
            }}
          >
            Autonomous GTM
          </span>
        ) : null}
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------
   Loader — the only loading indicator in the product.
   Renders nothing for the first 400ms so short waits show no flash.
   ------------------------------------------------------------------ */
export function MartenLoader({
  label = "Loading…",
  size = 56,
  delay = 400,
  motion = "trail",
}: {
  label?: string;
  size?: number;
  delay?: number;
  motion?: MarkMotion;
}) {
  const [visible, setVisible] = React.useState(delay === 0);

  React.useEffect(() => {
    if (delay === 0) return;
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{ display: "grid", placeItems: "center", gap: 14, color: "var(--color-accent)" }}
    >
      <MartenMark size={size} motion={motion} />
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 12,
          lineHeight: "17px",
          color: "var(--color-fg-3)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------
   Thinking indicator — sits in the agent avatar slot during reasoning.
   Always names what the agent is doing; never a bare spinner.
   ------------------------------------------------------------------ */
export function MartenThinking({
  agent,
  activity,
  sources,
}: {
  agent: string;
  activity: string;
  sources?: string[];
}) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <MartenMark
        size={28}
        motion="scent"
        style={{ color: "var(--color-accent)", flex: "none", marginTop: 2 }}
      />
      <div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500, color: "var(--color-fg)" }}>
          {agent}
        </div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--color-fg-3)", marginTop: 3 }}>
          {activity}
        </div>
        {sources?.length ? (
          <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
            {sources.map((s) => (
              <span
                key={s}
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 10,
                  padding: "3px 9px",
                  borderRadius: 999,
                  background: "var(--color-surface-sunk)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-fg-2)",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
