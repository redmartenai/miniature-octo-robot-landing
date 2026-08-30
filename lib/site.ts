// Single source of content for the Red Marten marketing site.

export const NAV_LINKS = [
  ["Platform", "#platform"],
  ["Briefing", "#briefing"],
  ["Agents", "#agents"],
  ["Customers", "#customers"],
  ["Pricing", "#pricing"],
  ["FAQ", "#faq"],
] as const;

export const TRUSTED = [
  "Northwind Logistics",
  "Kestrel Analytics",
  "Brightpath Health",
  "Halden Systems",
  "Corvus Payments",
  "Vantage Freight",
  "Harbourline Ports",
];

export type Decision = {
  n: string;
  tag: string;
  title: string;
  body: string;
  bar: number;
  signal: "ok" | "warn" | "info";
  action: string;
  kind: "approve" | "share";
};

export const DECISIONS: Decision[] = [
  {
    n: "01",
    tag: "Buying signals",
    title: "7 high-value accounts are showing intent",
    body: "Prioritise for outreach today. Workflows are staged and ready to run.",
    bar: 82,
    signal: "ok",
    action: "Approve · launch outreach",
    kind: "approve",
  },
  {
    n: "02",
    tag: "Stalled deals",
    title: "12 opportunities inactive for 14 days",
    body: "Likely cause identified. A recovery campaign is drafted and waiting.",
    bar: 58,
    signal: "warn",
    action: "Approve · launch recovery",
    kind: "approve",
  },
  {
    n: "03",
    tag: "Forecast risk",
    title: "Q4 coverage shortfall projected",
    body: "Contributing factors explained, with suggested actions to close the gap.",
    bar: 41,
    signal: "info",
    action: "Share with sales leadership",
    kind: "share",
  },
];

export type Product = {
  icon: string;
  name: string;
  body: string;
  stats: [string, string][];
};

export const PRODUCTS: Product[] = [
  {
    icon: "▤",
    name: "Data Studio",
    body: "Ask in plain English, get a filtered list. 38 attributes per company, intent scored daily, enrichment that fills the gaps.",
    stats: [["604", "Companies tracked"], ["38", "Attributes each"]],
  },
  {
    icon: "◇",
    name: "AI Workflows",
    body: "A visual canvas with branches, parallel steps and live execution. Build it once, then watch every run.",
    stats: [["494", "Nodes"], ["14", "Categories"]],
  },
  {
    icon: "◈",
    name: "AI Agents",
    body: "Agents with a prompt, memory, tools and a manager. They work the list and escalate the moment judgement is needed.",
    stats: [["190", "Agents"], ["99.2%", "Uptime"]],
  },
  {
    icon: "◕",
    name: "Voice AI",
    body: "Outbound and inbound calling with transcripts, sentiment and objection tracking wired straight back to the record.",
    stats: [["38,902", "Minutes / qtr"], ["41%", "Booking rate"]],
  },
  {
    icon: "◫",
    name: "AI Analytics",
    body: "Revenue intelligence across pipeline, attribution, forecasting and per-agent contribution — with the evidence attached.",
    stats: [["61%", "Agent-sourced"], ["$4.28M", "Pipeline"]],
  },
  {
    icon: "✦",
    name: "Brand Intelligence",
    body: "Competitor movement, review sentiment, hiring and funding signals — read continuously, summarised every morning.",
    stats: [["18,402", "Signals live"], ["24/7", "Watching"]],
  },
];

export const WORKFLOW = [
  { code: "MT", name: "Manual Trigger", meta: "412 TODAY", state: "ok" },
  { code: "EN", name: "Enrich & score", meta: "38 ATTRIBUTES", state: "ok" },
  { code: "RM", name: "Marten reason", meta: "CLASSIFYING", state: "run" },
  { code: "SL", name: "Notify revenue", meta: "#REVENUE-ALERTS", state: "idle" },
] as const;

export const AGENTS: [string, string, string][] = [
  ["Nadia", "OUTBOUND SDR", "Researches, writes, sends and books straight into your calendar."],
  ["Idris", "ACCOUNT INTELLIGENCE", "Enriches every company on 38 attributes and keeps them fresh."],
  ["Sable", "ICP TRACKER", "Rebuilds your ideal profile from closed-won and flags who now fits."],
  ["Wren", "COMPETITOR WATCH", "Reads reviews, job boards and funding news for movement."],
  ["Oskar", "LINKEDIN PROSPECTOR", "Tracks champions changing jobs and opens the warm door."],
  ["Juno", "SEO CONTENT", "Writes briefs grounded in what actually ranks in your category."],
  ["Priya", "MEETING ASSISTANT", "Preps the brief, joins the call, writes the recap to the CRM."],
  ["Rafi", "SUPPORT TRIAGE", "Answers the easy tickets, escalates the rest with full context."],
];

export const BEFORE_STEPS = [
  "Open the CRM",
  "Check pipeline movement",
  "Review sales activity",
  "Look at email engagement",
  "Review call outcomes",
  "Compare reports across systems",
  "Write action items for the team",
];

export const AFTER_STEPS = [
  "Read the morning briefing",
  "Approve buying-signal outreach",
  "Approve stalled-deal recovery",
  "Share the forecast recommendation",
];

export const METRICS: [string, string][] = [
  ["+22%", "Closed-won revenue"],
  ["1,247", "Meetings booked / quarter"],
  ["−6 days", "Average sales cycle"],
  ["1,840", "Hours returned to the team"],
];

export const QUOTES: [string, string, string, string][] = [
  [
    "It found eighteen logistics accounts overnight that we would never have worked. Two of them closed inside the quarter.",
    "MR",
    "Marisol Reyes",
    "VP REVENUE OPERATIONS · NORTHWIND LOGISTICS",
  ],
  [
    "The voice agent booked a meeting at 22:14 on a Tuesday. I read the transcript over coffee and sent the proposal before standup.",
    "LH",
    "Lena Hofmann",
    "DIRECTOR OF DEMAND GEN · BRIGHTPATH HEALTH",
  ],
];

export const SOLUTIONS: [string, string][] = [
  ["Sales teams", "Outbound that researches before it writes, and stops the moment someone replies."],
  ["Marketing agencies", "Run every client from one workspace with separate data, branding and billing."],
  ["B2B SaaS", "Product-usage signals joined to firmographics, so expansion plays fire on their own."],
  ["Recruitment", "Track candidates and clients in the same graph; job-change signals open warm doors."],
  ["Consulting", "Turn partner networks and referral chains into a pipeline you can forecast."],
  ["Enterprise", "SSO, audit logs, regional data residency and white-label workspaces per business unit."],
];

export type Tier = {
  name: string;
  price: string;
  unit: string;
  sub: string;
  on: string[];
  off: string[];
  best?: boolean;
  cta: string;
};

export const TIERS: Tier[] = [
  {
    name: "Free",
    price: "$0",
    unit: " forever",
    sub: "For one person testing the water.",
    on: ["1 seat", "5,000 credits a month", "2 live workflows", "Community support"],
    off: ["Voice AI", "SSO and audit logs"],
    cta: "Start free",
  },
  {
    name: "Pro",
    price: "$79",
    unit: "/seat/mo",
    sub: "For a small team running real outbound.",
    on: ["Up to 5 seats", "50,000 credits a month", "Unlimited workflows", "500 voice minutes", "Email support"],
    off: ["SSO and audit logs"],
    cta: "Start 14-day trial",
  },
  {
    name: "Business",
    price: "$149",
    unit: "/seat/mo",
    sub: "For a revenue team that lives in it.",
    on: [
      "Up to 30 seats",
      "500,000 credits a month",
      "Unlimited workflows and agents",
      "5,000 voice minutes",
      "SSO, roles and audit logs",
      "Priority support",
    ],
    off: [],
    best: true,
    cta: "Start 14-day trial",
  },
  {
    name: "Enterprise",
    price: "Custom",
    unit: "",
    sub: "For multi-entity and regulated teams.",
    on: [
      "Unlimited seats",
      "Custom credit pool",
      "Regional data residency",
      "White-label workspaces",
      "Dedicated success manager",
      "99.9% uptime SLA",
    ],
    off: [],
    cta: "Talk to sales",
  },
];

export const FAQ: [string, string][] = [
  [
    "What is Red Marten, in one sentence?",
    "A revenue platform where AI agents do the repetitive work — finding accounts, enriching them, writing outreach, making calls — on a visual canvas you control, with every action logged against the CRM record.",
  ],
  [
    "How is this different from n8n or Zapier?",
    "Those are general automation tools you point at anything. Red Marten ships with the revenue graph already built: 604 companies enriched on 38 attributes, intent scored daily, 190 agents written for sales and marketing jobs, and a voice stack. You are configuring a revenue system, not assembling one from primitives.",
  ],
  [
    "Do the agents run without supervision?",
    "They run continuously, but they escalate. Every morning Red Marten writes a briefing with the two or three decisions that genuinely need you, each with the evidence behind it. Everything else it handles and logs — see The record.",
  ],
  [
    "What are credits and how fast do they burn?",
    "Credits meter real work: an enrichment, a model call, a minute of voice. A team of 24 on Business typically uses about 14,000 a day, and voice is usually the largest share. Your balance and burn rate sit in the sidebar at all times.",
  ],
  [
    "Which systems does it connect to?",
    "HubSpot, Salesforce, Zoho, Pipedrive, Gmail, Outlook, Slack, Teams, Notion, Airtable, Google Sheets and Drive, Apollo, Clay, Instantly, Stripe, LinkedIn, GitHub, Linear and more — 494 nodes in total, plus HTTP and webhook nodes for anything not on the list.",
  ],
  [
    "Where is my data stored?",
    "You choose EU (Frankfurt) or US at workspace creation. Data does not leave the region. Enterprise plans can pin specific business units to specific regions.",
  ],
  [
    "Can I bring my own model?",
    "Yes. Claude, GPT, Gemini, Grok, Llama and Mistral are supported out of the box, and you can point a model node at your own endpoint. Prompts, temperature and token limits are configurable per node.",
  ],
  [
    "What happens when a workflow fails?",
    "The run halts before anything is written downstream, the failing node turns red with the error and retry count, and the failure appears in your morning briefing with a recommended fix. Nothing partially writes to your CRM.",
  ],
];

export const RESOURCES: [string, string][] = [
  ["Documentation", "Every node, every field, with worked examples."],
  ["Node reference", "All 494 nodes and their parameters."],
  ["Template gallery", "15 workflows you can run today."],
  ["Changelog", "What shipped, every week."],
];

// The Night Ledger — nine timestamped entries the overnight run
// prints as the hero scrolls (p in [0,1] -> clock 23:00 -> 08:00).
export type LedgerEntry = { p: number; time: string; text: string; stamp?: boolean };
export const LEDGER: LedgerEntry[] = [
  { p: 0.0, time: "23:00", text: "Night shift begins · 604 accounts on the list" },
  { p: 0.12, time: "00:05", text: "Enrichment refreshed · 38 attributes per record" },
  { p: 0.26, time: "01:20", text: "Intent spike · 7 accounts crossed threshold" },
  { p: 0.4, time: "02:36", text: "Outreach drafted · 7 sequences staged for approval" },
  { p: 0.54, time: "03:51", text: "Voice agent · 14 calls completed, transcripts logged" },
  { p: 0.68, time: "05:07", text: "CRM reconciled · 0 conflicts, 0 duplicates" },
  { p: 0.82, time: "06:23", text: "Recovery drafted · 12 stalled opportunities" },
  { p: 0.94, time: "07:44", text: "Evidence attached · every action written to the record" },
  { p: 1.0, time: "08:00", text: "BRIEFING READY — 3 decisions need you", stamp: true },
];

// The Record — one permission model. The last row is the message.
export type Permission = { cap: string; policy: string; denied?: boolean };
export const PERMISSIONS: Permission[] = [
  { cap: "Read CRM records", policy: "All agents" },
  { cap: "Write CRM records", policy: "With approval · policy P-114" },
  { cap: "Send email", policy: "Nadia · sequences you approved" },
  { cap: "Place calls", policy: "Voice agents · business hours only" },
  { cap: "Spend credits", policy: "Capped per workflow" },
  { cap: "Touch anything else", policy: "Denied by default", denied: true },
];

// The Record — the log. Reuses the ledger-line grammar.
export const RECORD_LOG: { time: string; text: string }[] = [
  { time: "07:12", text: "Nadia · drafted email · Meridian Freight · auto-approved (P-114)" },
  { time: "07:31", text: "Idris · updated 38 attributes · Coreline Systems" },
  { time: "07:44", text: "Priya · wrote call recap to CRM · approved by S. Okafor" },
  { time: "07:52", text: "System · export requested · full trail · S. Okafor" },
  { time: "08:00", text: "Marten · briefing compiled · 3 decisions escalated" },
];

export const FOOTER = {
  Product: ["Data Studio", "AI Workflows", "AI Agents", "Voice AI", "Analytics", "Integrations"],
  Solutions: ["Sales teams", "Agencies", "B2B SaaS", "Recruitment", "Enterprise"],
  Resources: ["Documentation", "Node reference", "Templates", "Changelog", "Status"],
  Company: ["About", "Careers", "Blog", "Contact", "Press kit"],
} as const;
