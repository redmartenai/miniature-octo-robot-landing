/* ============================================================
   RED MARTEN — CONTENT
   One file for every word and number on the landing surface, so
   copy can be edited without touching behaviour.
   ============================================================ */

export type Verb = "observe" | "understand" | "plan" | "execute" | "learn" | "govern";

export const VERBS: { id: Verb; label: string }[] = [
  { id: "observe", label: "Observe" },
  { id: "understand", label: "Understand" },
  { id: "plan", label: "Plan" },
  { id: "execute", label: "Execute" },
  { id: "learn", label: "Learn" },
  { id: "govern", label: "Govern" },
];

/* ---------- 01 · hero: the chains the system keeps re-forming ---------- */
export type Chain = {
  src: [string, string];   // [system, what arrived]
  mid: [string, string];   // [kind, what it does]
  kind: "agent" | "workflow" | "voice";
  dst: [string, string];   // [system, what was written]
};

export const CHAINS: Chain[] = [
  { src: ["Slack", "#inbound"], mid: ["Agent", "Triage intent"], kind: "agent", dst: ["Salesforce", "Lead scored"] },
  { src: ["Gmail", "Reply received"], mid: ["Voice", "Qualify call"], kind: "voice", dst: ["HubSpot", "Meeting booked"] },
  { src: ["Stripe", "Payment failed"], mid: ["Workflow", "Recover revenue"], kind: "workflow", dst: ["Notion", "Case opened"] },
  { src: ["Zendesk", "Ticket #4417"], mid: ["Agent", "Resolve & reply"], kind: "agent", dst: ["Jira", "Bug filed"] },
  { src: ["Gong", "Call ended"], mid: ["Agent", "Extract signals"], kind: "agent", dst: ["Snowflake", "Model updated"] },
  { src: ["Website", "Intent spike"], mid: ["Workflow", "Enrich & route"], kind: "workflow", dst: ["Salesforce", "Owner assigned"] },
  { src: ["LinkedIn", "Role posted"], mid: ["Agent", "Source & rank"], kind: "agent", dst: ["Greenhouse", "Shortlist ready"] },
  { src: ["NetSuite", "Invoice due"], mid: ["Voice", "Collections call"], kind: "voice", dst: ["Xero", "Promise logged"] },
  { src: ["Intercom", "Churn signal"], mid: ["Agent", "Draft save play"], kind: "agent", dst: ["Slack", "Owner alerted"] },
];

export const HERO_STATS = [
  { k: "Signals observed", v: 12480, suffix: "" },
  { k: "Actions executed", v: 3126, suffix: "" },
  { k: "Systems in sync", v: 41, suffix: "" },
  { k: "Escalated to a human", v: 3, suffix: "" },
];

/* ---------- 02 · product: the capability network ---------- */
export type Cap = {
  id: string;
  name: string;
  cat: string;
  color: string;
  h: string;
  p: string;
  facts: string[];
  rel: string[];
};

export const CAPS: Cap[] = [
  {
    id: "data",
    name: "Data",
    cat: "Connect",
    color: "var(--gov)",
    h: "Every system, one graph.",
    p: "Warehouses, CRMs, billing, product events and inboxes resolve into a single entity graph — the same account means the same account everywhere.",
    facts: ["340+ connectors, two-way", "Entity resolution across systems", "Streams and batch on one schema"],
    rel: ["knowledge", "agents", "actions"],
  },
  {
    id: "knowledge",
    name: "Knowledge",
    cat: "Understand",
    color: "var(--learn)",
    h: "Context the company already has.",
    p: "Policies, playbooks, contracts, past decisions and outcomes become retrievable context, versioned and attributed — so reasoning is grounded in your business, not the open web.",
    facts: ["Versioned, cited, permission-aware", "Learns from every executed run", "Sources attached to every answer"],
    rel: ["data", "agents", "voice"],
  },
  {
    id: "agents",
    name: "AI Agents",
    cat: "Reason",
    color: "var(--exec)",
    h: "Digital coworkers with a job description.",
    p: "Each agent has a role, a memory, a tool set and a manager. They hold accounts, decide inside their mandate, and escalate the moment judgement is needed.",
    facts: ["Role, mandate, budget, manager", "Tool use inside a permission model", "Escalates rather than guesses"],
    rel: ["knowledge", "workflows", "voice", "actions"],
  },
  {
    id: "workflows",
    name: "Workflows",
    cat: "Plan",
    color: "var(--growth)",
    h: "Deterministic where it must be.",
    p: "Agents reason; workflows guarantee. Branch on conditions, run steps in parallel, retry with policy, and keep the parts of the business that cannot improvise exactly reproducible.",
    facts: ["Visual graph, versioned and diffable", "Parallel steps, typed retries", "Deterministic replay of any run"],
    rel: ["agents", "actions", "data"],
  },
  {
    id: "voice",
    name: "Voice",
    cat: "Speak",
    color: "var(--amber)",
    h: "Conversations that reach the record.",
    p: "Inbound and outbound calls with sub-second turn-taking, transcripts, sentiment and objection tracking — written back to the same graph the agents reason over.",
    facts: ["Native telephony, 31 languages", "Transcript and outcome per call", "Hand-off to a human mid-call"],
    rel: ["agents", "knowledge", "actions"],
  },
  {
    id: "actions",
    name: "Actions",
    cat: "Execute",
    color: "var(--copper)",
    h: "The work actually gets done.",
    p: "Write to the CRM, send the sequence, move the ticket, issue the refund, update the forecast. Every action is checked against one permission model and written to one log.",
    facts: ["One permission model, one audit trail", "Approval gates where you set them", "Reversible, with evidence attached"],
    rel: ["workflows", "agents", "data"],
  },
];

/* ---------- 03 · solutions: one platform, infinite use cases ---------- */
export type Scenario = {
  id: string;
  label: string;
  h: string;
  p: string;
  lane: { k: string; n: string; kind: "system" | "agent" | "flow" }[];
  steps: string[];
  out: { v: string; k: string }[];
};

export const SCENARIOS: Scenario[] = [
  {
    id: "sales",
    label: "Sales",
    h: "A pipeline that works overnight.",
    p: "Intent arrives at 02:00. By 08:00 the account is enriched, scored, sequenced and — if it answers — already spoken to.",
    lane: [
      { k: "Signal", n: "Intent spike", kind: "system" },
      { k: "Agent", n: "Researcher", kind: "agent" },
      { k: "Agent", n: "SDR · Nadia", kind: "agent" },
      { k: "Workflow", n: "3-touch sequence", kind: "flow" },
      { k: "System", n: "Salesforce", kind: "system" },
    ],
    steps: [
      "Enrich the account on 38 attributes and score intent against closed-won patterns.",
      "Draft the sequence in the voice of the rep who owns the territory.",
      "Call the ones that open twice, book the meeting, write the outcome back.",
    ],
    out: [{ v: "1,247", k: "Meetings / quarter" }, { v: "+22%", k: "Closed-won revenue" }],
  },
  {
    id: "marketing",
    label: "Marketing",
    h: "Campaigns that read the market.",
    p: "Competitor movement, review sentiment and paid performance are watched continuously — and the plan adapts before the quarter is lost.",
    lane: [
      { k: "Signal", n: "Market shift", kind: "system" },
      { k: "Agent", n: "Analyst", kind: "agent" },
      { k: "Workflow", n: "Reallocate spend", kind: "flow" },
      { k: "Agent", n: "Copy · Sable", kind: "agent" },
      { k: "System", n: "HubSpot", kind: "system" },
    ],
    steps: [
      "Read competitor pricing, hiring and review sentiment every morning.",
      "Move budget to the segments converting this week, not last quarter.",
      "Rewrite the assets that lost, and log why they lost.",
    ],
    out: [{ v: "3.5×", k: "Faster campaign cycles" }, { v: "−31%", k: "Cost per qualified lead" }],
  },
  {
    id: "ops",
    label: "Operations",
    h: "The back office runs itself.",
    p: "Exceptions are the only thing a human sees. Everything reconcilable reconciles, everything routable routes.",
    lane: [
      { k: "Signal", n: "Order exception", kind: "system" },
      { k: "Workflow", n: "Reconcile", kind: "flow" },
      { k: "Agent", n: "Ops · Colter", kind: "agent" },
      { k: "Voice", n: "Supplier call", kind: "agent" },
      { k: "System", n: "NetSuite", kind: "system" },
    ],
    steps: [
      "Match the order, the invoice and the delivery across three systems.",
      "Resolve what is resolvable; call the supplier for what is not.",
      "Escalate only the exceptions that carry real money.",
    ],
    out: [{ v: "94%", k: "Exceptions auto-cleared" }, { v: "11 hrs", k: "Returned weekly" }],
  },
  {
    id: "cs",
    label: "Customer Success",
    h: "Churn is a signal, not a surprise.",
    p: "Usage, tickets, sentiment and invoices are read together, so the save play is drafted while the account can still be saved.",
    lane: [
      { k: "Signal", n: "Usage drop", kind: "system" },
      { k: "Agent", n: "Health monitor", kind: "agent" },
      { k: "Knowledge", n: "Save playbook", kind: "flow" },
      { k: "Agent", n: "CSM · Wren", kind: "agent" },
      { k: "System", n: "Intercom", kind: "system" },
    ],
    steps: [
      "Watch product usage against the account's own baseline, not an average.",
      "Assemble the evidence: tickets, calls, invoices, roadmap promises.",
      "Draft the save play, book the call, brief the human who takes it.",
    ],
    out: [{ v: "−38%", k: "Logo churn" }, { v: "6 days", k: "Earlier warning" }],
  },
  {
    id: "recruiting",
    label: "Recruiting",
    h: "A shortlist before the stand-up.",
    p: "The role opens, the market is searched, candidates are ranked against the people who actually succeeded in the role.",
    lane: [
      { k: "Signal", n: "Role opened", kind: "system" },
      { k: "Agent", n: "Sourcer", kind: "agent" },
      { k: "Workflow", n: "Rank & screen", kind: "flow" },
      { k: "Voice", n: "Screening call", kind: "agent" },
      { k: "System", n: "Greenhouse", kind: "system" },
    ],
    steps: [
      "Search the market against the profile of your top performers in that role.",
      "Screen by voice in the candidate's language, on their schedule.",
      "Hand the hiring manager a ranked shortlist with the evidence.",
    ],
    out: [{ v: "−52%", k: "Time to shortlist" }, { v: "4.1×", k: "Screens per recruiter" }],
  },
  {
    id: "finance",
    label: "Finance",
    h: "Close that never waits on people.",
    p: "Collections, reconciliation and forecast run continuously — the month-end is a report, not a scramble.",
    lane: [
      { k: "Signal", n: "Invoice overdue", kind: "system" },
      { k: "Agent", n: "Collections", kind: "agent" },
      { k: "Voice", n: "Payment call", kind: "agent" },
      { k: "Workflow", n: "Post & reconcile", kind: "flow" },
      { k: "System", n: "Xero", kind: "system" },
    ],
    steps: [
      "Chase on the schedule each customer actually responds to.",
      "Take the promise to pay by voice, log it against the invoice.",
      "Reconcile on receipt and update the forecast the same hour.",
    ],
    out: [{ v: "−19 days", k: "Days sales outstanding" }, { v: "99.4%", k: "Reconciled without a human" }],
  },
];

/* ---------- 04 · customers ---------- */
export const METRICS = [
  { v: 42, suffix: "%", k: "Less manual work", note: "Measured against the same teams' pre-deployment baseline" },
  { v: 3.5, suffix: "×", k: "Faster execution", note: "Signal to completed action, median" },
  { v: 61, suffix: "%", k: "Higher productivity", note: "Output per operator, first two quarters" },
  { v: 11, suffix: " hrs", k: "Saved weekly, per operator", note: "Time returned to judgement work" },
];

export const LOGOS = ["Meridian Freight", "Coreline Systems", "Halden", "Vantage", "Harbourline", "Kestrel Analytics"];

export const QUOTES = [
  {
    q: "We stopped asking who is going to do this and started asking whether it should be done. That is a different company.",
    who: "VP Revenue Operations",
    at: "Coreline Systems",
  },
  {
    q: "It reads like an operating system, not a tool. Nothing happens off the record, and the record is the same one finance audits.",
    who: "Chief Operating Officer",
    at: "Meridian Freight",
  },
];

/* ---------- 05 · pricing ---------- */
export const PLAN = {
  name: "Operate",
  tag: "Recommended",
  price: "$2,400",
  per: "per month, billed annually · unlimited seats",
  note: "One workspace, every capability. Priced on the work the system does — not on how many people watch it work.",
  incl: [
    ["Agents", "Unlimited roles", "25 concurrent"],
    ["Executions", "40,000 / month", "then $0.04"],
    ["Voice", "5,000 minutes", "31 languages"],
    ["Integrations", "All 340 connectors", "two-way"],
    ["Governance", "Audit trail & SSO", "included"],
  ] as [string, string, string][],
};

export const TIERS = [
  {
    id: "pilot",
    name: "Pilot",
    p: "Two workflows, one agent, thirty days. Connect a system of record and watch a real night shift run before anyone signs anything.",
    cols: [] as { h: string; li: string[] }[],
    cta: "Free for 30 days",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    p: "Dedicated capacity, your data residency, your governance model, and an engineer who knows your deployment by name.",
    cta: "Talk to us",
    cols: [
      { h: "Governance", li: ["Model allow-list", "Role-based mandates", "Approval gates per action", "Retention & legal hold"] },
      { h: "Deployment", li: ["EU (Frankfurt) or US", "VPC or on-prem gateway", "SSO, SCIM, SAML", "Private model routing"] },
      { h: "Support", li: ["Named solutions engineer", "99.95% uptime SLA", "Quarterly capability review", "Migration from legacy RPA"] },
    ],
  },
];

/* ---------- 06 · ask red marten ---------- */
export const QA: { q: string; a: string }[] = [
  {
    q: "What is Red Marten, in one sentence?",
    a: "An autonomous operating system: it observes every system you run on, understands what is happening, plans the work, executes it inside your permissions, learns from the outcome, and keeps a governable record of all of it.",
  },
  {
    q: "How is this different from an AI agent platform?",
    a: "Agent platforms give you primitives and leave the system design to you. Red Marten ships the operating system: the data graph, the knowledge layer, the agents, the deterministic workflows, voice and the permission model are one product. You configure a revenue system rather than assemble one.",
  },
  {
    q: "What happens when the system is wrong?",
    a: "Every action is bounded by a mandate and written to a single audit trail. Agents escalate instead of guessing, approval gates sit wherever you place them, and any run can be replayed step by step to see exactly which evidence produced which action.",
  },
  {
    q: "How long does deployment take?",
    a: "Connect a system of record and the first workflow runs the same day. Most teams have an autonomous night shift running in under two weeks — the limit is usually your approval policy, not the integration.",
  },
  {
    q: "Where does our data live?",
    a: "EU (Frankfurt) or US residency, your choice at workspace creation. Data is never used to train shared models. Enterprise deployments can route to private model endpoints inside your own cloud.",
  },
  {
    q: "Do we have to replace our current stack?",
    a: "No. Red Marten sits above the systems you already run — Salesforce, HubSpot, NetSuite, Zendesk, Snowflake, Slack — and writes back into them. It is the intelligence layer, not another destination for your data.",
  },
  {
    q: "What does it cost?",
    a: "Operate is $2,400 a month with unlimited seats: you pay for the work the system does, not for how many people watch it work. Pilot is free for thirty days. Enterprise is priced on dedicated capacity and residency.",
  },
];

export const ASK_FALLBACK =
  "I can answer on capabilities, deployment, governance, data residency, pricing and how Red Marten differs from an agent platform. Ask me one of those, or book a demo and a human will take it from here.";

/* ---------- 07 · about ---------- */
export const ABOUT = {
  h: ["Software should execute.", "Not just inform."],
  lede:
    "For forty years, business software has been a place to record what people did. Dashboards told you what happened. Reports told you what happened more slowly. The work itself stayed with the people.",
  cols: [
    {
      h: "Mission",
      p: [
        "Give every company an operating system that can do the work, not just describe it.",
        "Software that observes, decides and executes — and can be held to account for all three.",
      ],
    },
    {
      h: "Vision",
      p: [
        "A company where the operators set direction and the system runs the execution.",
        "Where the night shift is autonomous, the audit trail is complete, and the humans arrive to three decisions that actually need judgement.",
      ],
    },
    {
      h: "Story",
      p: [
        "Red Marten was built by operators who spent years wiring tools together and calling it a stack.",
        "We named it after an animal that hunts at night, moves alone, and leaves a clean track. That is the standard: autonomous, precise, and always on the record.",
      ],
    },
  ],
  sig: "Built in Europe. Run wherever your data lives. Named for an animal that works while you sleep and leaves a track you can follow.",
};

/* ---------- signature moment ---------- */
export const AUTO_CLUSTERS = [
  { k: "Data", n: "signals" },
  { k: "Knowledge", n: "documents" },
  { k: "Agents", n: "agents" },
  { k: "Workflows", n: "runs" },
  { k: "Voice", n: "calls" },
  { k: "Actions", n: "writes" },
];

export const AUTO_ACTIONS = [
  { n: "Approve the Meridian Freight renewal at the discount the model recommends", m: "$412k · expires Friday" },
  { n: "Sign off the 7 outbound sequences staged for regulated accounts", m: "Policy P-114 · needs a human" },
  { n: "Decide whether to hold Q3 pricing for the logistics segment", m: "Forecast impact ±$1.1M" },
];
