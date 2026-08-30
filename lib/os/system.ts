/**
 * The operating system, described as data.
 *
 * This is the content layer. The WebGL engine (components/os/*) and the
 * DOM overlay both read from here — nothing about the story is hard-coded
 * inside a shader or a component. Change a headline, a node position, or a
 * signal source here and the whole world re-choreographs around it.
 *
 * The world is one continuous horizontal filament. The camera travels
 * along +X as the viewer scrolls. Every node owns a slice of that axis and
 * a slice of scroll progress; the two are kept in lockstep by `nodeAt()`.
 */

/* -- Palette -------------------------------------------------------------
   Warm, earthen, human. Sourced from the brief, not the blue-AI cliché.
   Kept as plain numbers so shaders and canvas 2D can consume them without
   re-parsing hex on every frame. */
export const PALETTE = {
  bg: "#F5EFE6", // warm paper — the void the organism lives in
  sand: "#E8DCCB",
  clay: "#D7C2A8",
  copper: "#B07A45",
  earth: "#4A3423", // the spine, the dark tissue
  ink: "#161514",
  glow: "#E3A15D", // amber — a signal, a synapse firing
} as const;

/** Normalised linear-ish RGB triplets for GLSL uniforms (0–1). */
export const RGB = {
  bg: [0.961, 0.937, 0.902],
  clay: [0.843, 0.761, 0.659],
  copper: [0.69, 0.478, 0.271],
  earth: [0.29, 0.204, 0.137],
  ink: [0.086, 0.082, 0.078],
  glow: [0.89, 0.631, 0.365],
} as const;

/* -- The spine geometry, in world units ---------------------------------
   Everything downstream derives its X from these two numbers, so the
   spacing of nodes and the reach of the camera never drift apart. */
export const WORLD = {
  start: -6, // world-x where the filament begins, ahead of node 0
  span: 132, // total travelled distance from first node to last
  nodeGap: 0, // computed below
} as const;

export type Phase =
  | "observe"
  | "understand"
  | "plan"
  | "execute"
  | "learn"
  | "govern";

export interface OSNode {
  id: Phase;
  index: number;
  /** Roman numeral shown in the HUD. */
  numeral: string;
  /** One verb — the node's name in the nervous system. */
  title: string;
  /** The scene headline, revealed as the camera arrives. */
  headline: string;
  /** A single editorial line of sub-copy. */
  line: string;
  /** World-space X where this node's core sits. */
  x: number;
  /** Scroll progress (0–1) at which the camera is centred on this node. */
  p: number;
  /** Accent used for this node's core glow and its panel. */
  accent: string;
  /** The click-to-enter micro-experience. */
  universe: NodeUniverse;
}

export interface NodeUniverse {
  /** Overline shown above the panel title. */
  kicker: string;
  /** What the viewer is looking at, in one breath. */
  intro: string;
  /** The living entities / streams inside this node. */
  entities: { name: string; meta: string }[];
  /** The visualisation the panel renders. */
  viz: "signals" | "graph" | "branches" | "agents" | "loop" | "ledger";
}

/* The six systems of the organism. Ordered as the camera meets them. */
const RAW: Omit<OSNode, "x" | "p" | "index">[] = [
  {
    id: "observe",
    numeral: "I",
    title: "Observe",
    headline: "Every signal enters one system.",
    line: "Mail, chat, records, revenue, documents, voice — the organism has no blind side.",
    accent: PALETTE.glow,
    universe: {
      kicker: "The intake",
      intro:
        "Ten thousand signals a minute arrive from the tools your teams already live in. Nothing is normalised into a dashboard. It is simply seen.",
      entities: [
        { name: "Gmail", meta: "threads · intent" },
        { name: "Slack", meta: "channels · urgency" },
        { name: "Salesforce", meta: "records · stage" },
        { name: "HubSpot", meta: "contacts · lifecycle" },
        { name: "Stripe", meta: "revenue · risk" },
        { name: "Notion", meta: "docs · context" },
        { name: "Postgres", meta: "events · state" },
        { name: "Voice", meta: "calls · sentiment" },
      ],
      viz: "signals",
    },
  },
  {
    id: "understand",
    numeral: "II",
    title: "Understand",
    headline: "Data becomes understanding.",
    line: "Signals find each other. Relationships surface. Noise resolves into context.",
    accent: "#C98A4E",
    universe: {
      kicker: "The comprehension",
      intro:
        "The system does not store rows. It forms a graph — a living memory where an email, a payment, and a call about the same account become one understood entity.",
      entities: [
        { name: "Entities linked", meta: "1.2M edges" },
        { name: "Accounts unified", meta: "94% coverage" },
        { name: "Patterns surfaced", meta: "live" },
        { name: "Context depth", meta: "18 sources" },
      ],
      viz: "graph",
    },
  },
  {
    id: "plan",
    numeral: "III",
    title: "Plan",
    headline: "Intelligence chooses what happens next.",
    line: "Many futures are simulated. Weak paths dim. One becomes the decision.",
    accent: "#B07A45",
    universe: {
      kicker: "The reasoning",
      intro:
        "For every situation the system imagines several possible next actions, weighs their expected outcome against your goals and policy, and lets the strongest path win.",
      entities: [
        { name: "Escalate to owner", meta: "confidence 0.71" },
        { name: "Auto-draft response", meta: "confidence 0.88" },
        { name: "Hold for review", meta: "confidence 0.34" },
        { name: "Trigger workflow", meta: "confidence 0.92" },
      ],
      viz: "branches",
    },
  },
  {
    id: "execute",
    numeral: "IV",
    title: "Execute",
    headline: "The work happens on its own.",
    line: "Agents act. Workflows flow. Voice speaks. Records change without a human in the loop.",
    accent: "#A85D2E",
    universe: {
      kicker: "The autonomy",
      intro:
        "This is the largest chamber of the organism. Agents, workflows, and voice run in parallel — each a living worker, not a card on a board.",
      entities: [
        { name: "Research Agent", meta: "enriching 41 accounts" },
        { name: "Outreach Agent", meta: "12 sequences live" },
        { name: "Support Agent", meta: "resolving 8 tickets" },
        { name: "Analyst Agent", meta: "reconciling revenue" },
        { name: "Operations Agent", meta: "syncing systems" },
        { name: "Voice Agent", meta: "3 calls in progress" },
      ],
      viz: "agents",
    },
  },
  {
    id: "learn",
    numeral: "V",
    title: "Learn",
    headline: "Every outcome improves the system.",
    line: "Results return to the tissue. The organism rewires itself around what worked.",
    accent: "#8F7A57",
    universe: {
      kicker: "The adaptation",
      intro:
        "Nothing the system does is thrown away. Each result — won, lost, ignored — flows back and reshapes the weights that decide the next action.",
      entities: [
        { name: "Feedback loops", meta: "closing continuously" },
        { name: "Model of you", meta: "refined hourly" },
        { name: "Playbooks", meta: "self-editing" },
        { name: "Precision", meta: "▲ 6% this week" },
      ],
      viz: "loop",
    },
  },
  {
    id: "govern",
    numeral: "VI",
    title: "Govern",
    headline: "Autonomy without losing control.",
    line: "Every action is permissioned, traceable, and reversible. Nothing happens in the dark.",
    accent: "#5F6B5E",
    universe: {
      kicker: "The trust layer",
      intro:
        "Autonomy is only safe when it is accountable. Every decision the system takes is scoped by policy, logged in full, and open to inspection or reversal.",
      entities: [
        { name: "Policy engine", meta: "enforced pre-action" },
        { name: "Audit trail", meta: "immutable · complete" },
        { name: "Permissions", meta: "role-scoped" },
        { name: "Human override", meta: "one click, always" },
      ],
      viz: "ledger",
    },
  },
];

/* Lay the nodes out along X and along scroll progress in one pass, so the
   camera and the labels can never disagree about where a node is. */
export const NODES: OSNode[] = RAW.map((n, i) => {
  const t = i / (RAW.length - 1);
  return {
    ...n,
    index: i,
    x: WORLD.start + 6 + t * WORLD.span,
    // Reserve the first ~10% for the opening breath, the last ~14% for the
    // signature moment. Nodes fill the middle, evenly spaced.
    p: 0.1 + t * 0.76,
  };
});

/** The world-x the camera looks at for a given global progress (0–1). */
export function cameraX(progress: number): number {
  const first = NODES[0].x;
  const last = NODES[NODES.length - 1].x;
  // Ease slightly past the last node so Govern isn't clipped at the edge.
  const p = Math.min(1, Math.max(0, progress));
  return WORLD.start + p * (last + 10 - WORLD.start) + (first - WORLD.start) * 0;
}

/** Which node the camera is nearest, plus how "arrived" it is (0–1). */
export function nodeAt(progress: number): { node: OSNode; focus: number } {
  let best = NODES[0];
  let bestD = Infinity;
  for (const n of NODES) {
    const d = Math.abs(n.p - progress);
    if (d < bestD) {
      bestD = d;
      best = n;
    }
  }
  // focus peaks at the node's own p, falls off across half the inter-node gap
  const gap = NODES.length > 1 ? NODES[1].p - NODES[0].p : 1;
  const focus = Math.max(0, 1 - bestD / (gap * 0.6));
  return { node: best, focus };
}

/* -- The live system pulse ----------------------------------------------
   Values drift upward believably rather than counting a straight line.
   `base` is where the number sits when the page loads; the HUD animates
   around it. */
export interface PulseMetric {
  key: string;
  label: string;
  base: number;
  /** Typical per-tick delta range. */
  drift: [number, number];
  format?: "int";
}

export const PULSE: PulseMetric[] = [
  { key: "signals", label: "Signals active", base: 8241, drift: [3, 48] },
  { key: "agents", label: "Agents running", base: 27, drift: [-1, 2] },
  { key: "workflows", label: "Workflows executing", base: 43, drift: [-2, 3] },
  { key: "tasks", label: "Tasks completed", base: 19402, drift: [1, 12] },
  { key: "recs", label: "Recommendations", base: 3, drift: [0, 1] },
];

/* -- The signature moment -----------------------------------------------
   Millions of events collapse to a handful of decisions. */
export interface Recommendation {
  n: string;
  domain: string;
  title: string;
  detail: string;
}

export const BRIEF: Recommendation[] = [
  {
    n: "01",
    domain: "Revenue",
    title: "Re-engage 17 stalled enterprise accounts",
    detail:
      "Buying signals returned on accounts marked dead. Outreach Agent has drafts staged for your approval.",
  },
  {
    n: "02",
    domain: "Risk",
    title: "Expansion risk detected in 3 top accounts",
    detail:
      "Sentiment and usage diverged from renewal patterns. A retention play is ready to run.",
  },
  {
    n: "03",
    domain: "Operations",
    title: "Forecast variance needs a human decision",
    detail:
      "Two paths reconcile the gap. The system has modelled both and needs you to choose.",
  },
];

export const COPY = {
  systemName: "The Autonomous Operating System",
  chapters: ["Observe", "Understand", "Plan", "Execute", "Learn"],
  finalHead: "Stop managing tools.",
  finalHeadEm: "Start operating intelligence.",
  cta: "Enter the operating system",
} as const;
