/* ============================================================
   RED MARTEN — THE WORKFLOW RUNTIME, AS DATA

   Everything the autonomous product actually does, extracted
   into one typed file: the node catalogue it can draw from, the
   integrations it reads and writes, and the real workflow graphs
   it executes. Frames 01 and 02 render this — no frame invents
   a capability that is not declared here.

   The model is deliberately the n8n / 11x shape:
     trigger → gather → reason → decide → act → record,
   with humans placed on the graph rather than around it.
   ============================================================ */

/* ------------------------------------------------------------
   1 · THE NODE CATALOGUE
   Fourteen categories, 494 nodes. This is the palette a builder
   drags from, and the left rail of the workflow canvas.
   ------------------------------------------------------------ */

export type CatId =
  | "trigger"
  | "integration"
  | "data"
  | "enrich"
  | "knowledge"
  | "agent"
  | "model"
  | "logic"
  | "voice"
  | "action"
  | "human"
  | "govern"
  | "code"
  | "observe";

export type Cat = {
  id: CatId;
  name: string;
  n: number;
  /* the swatch that identifies this category everywhere it appears */
  tone: "signal" | "reason" | "control" | "act" | "human";
  what: string;
  eg: string[];
};

export const CATS: Cat[] = [
  {
    id: "trigger",
    name: "Triggers",
    n: 26,
    tone: "signal",
    what: "What starts a run: a schedule, a webhook, a record change, a signal crossing a threshold, or a person pressing go.",
    eg: ["Schedule", "Webhook", "Record changed", "Threshold crossed", "Inbound email", "Manual"],
  },
  {
    id: "integration",
    name: "Integrations",
    n: 132,
    tone: "signal",
    what: "Two-way connectors to the systems you already run. Every one can be read from and written back to.",
    eg: ["Salesforce", "HubSpot", "NetSuite", "Zendesk", "Slack", "Stripe", "Snowflake", "Jira"],
  },
  {
    id: "data",
    name: "Data",
    n: 48,
    tone: "signal",
    what: "Resolve, shape and join records across systems so the same account means the same account everywhere.",
    eg: ["Entity resolve", "Transform", "Aggregate", "Dedupe", "Join", "Diff"],
  },
  {
    id: "enrich",
    name: "Enrichment",
    n: 24,
    tone: "signal",
    what: "Add the attributes the decision needs — firmographics, technographics, hiring, funding, usage, intent.",
    eg: ["Company profile", "Person profile", "Intent score", "Tech stack", "Hiring signal"],
  },
  {
    id: "knowledge",
    name: "Knowledge",
    n: 21,
    tone: "reason",
    what: "Retrieve the company's own context — policies, playbooks, contracts, past decisions — versioned and cited.",
    eg: ["Retrieve", "Cite sources", "Playbook", "Account memory", "Policy lookup"],
  },
  {
    id: "agent",
    name: "AI Agents",
    n: 38,
    tone: "reason",
    what: "A role, a mandate, a tool set and a manager. Agents decide inside their mandate and escalate rather than guess.",
    eg: ["Classify", "Extract", "Draft", "Research", "Qualify", "Decide", "Summarise"],
  },
  {
    id: "model",
    name: "Models",
    n: 19,
    tone: "reason",
    what: "Route a step to a specific model, private endpoint or fine-tune, with a cost and latency budget.",
    eg: ["Route by budget", "Private endpoint", "Embed", "Rerank", "Evaluate"],
  },
  {
    id: "logic",
    name: "Logic",
    n: 33,
    tone: "control",
    what: "The deterministic part. Branch on conditions, run steps in parallel, loop, wait, retry with policy.",
    eg: ["Branch", "Filter", "Merge", "Loop", "Parallel", "Wait", "Retry"],
  },
  {
    id: "voice",
    name: "Voice",
    n: 17,
    tone: "act",
    what: "Inbound and outbound calls with sub-second turn-taking, transcripts and outcomes written to the same graph.",
    eg: ["Outbound call", "Inbound handler", "Transcribe", "Detect objection", "Hand off"],
  },
  {
    id: "action",
    name: "Actions",
    n: 74,
    tone: "act",
    what: "The work itself: write the CRM, send the sequence, move the ticket, issue the refund, update the forecast.",
    eg: ["Write record", "Send sequence", "Post message", "Create ticket", "Issue refund"],
  },
  {
    id: "human",
    name: "Human in the loop",
    n: 12,
    tone: "human",
    what: "Approval gates, escalations and briefings placed on the graph, so a person is a step and not an afterthought.",
    eg: ["Approval gate", "Escalate", "Brief a human", "Ask for input", "Take over"],
  },
  {
    id: "govern",
    name: "Governance",
    n: 16,
    tone: "control",
    what: "Policy checks, permission model, redaction, retention and the single audit trail every action lands in.",
    eg: ["Policy check", "Permission scope", "Redact", "Audit write", "Legal hold"],
  },
  {
    id: "code",
    name: "Code & HTTP",
    n: 14,
    tone: "control",
    what: "The escape hatch. Run your own JavaScript or Python, call any HTTP endpoint, sign your own requests.",
    eg: ["Run JavaScript", "Run Python", "HTTP request", "Sign request", "Parse"],
  },
  {
    id: "observe",
    name: "Observability",
    n: 20,
    tone: "control",
    what: "Every run is recorded, replayable step by step, and reportable — including what evidence produced which action.",
    eg: ["Run log", "Replay", "Alert", "Report", "Cost meter", "Trace"],
  },
];

export const NODE_TOTAL = CATS.reduce((n, c) => n + c.n, 0); /* 494 */

/* ------------------------------------------------------------
   2 · WHAT THE RUNTIME GUARANTEES
   The claims a workflow canvas has to be able to back up.
   ------------------------------------------------------------ */

export const RUNTIME = [
  { k: "Deterministic replay", v: "Any run replays step by step, with the evidence attached to each decision." },
  { k: "Typed retries", v: "Retry policy per step: backoff, budget, and a fallback branch when it still fails." },
  { k: "Parallel by default", v: "Independent branches execute at once; merges wait only on what they depend on." },
  { k: "One permission model", v: "Every write is checked against the same mandate, whoever or whatever asked for it." },
  { k: "Versioned & diffable", v: "A workflow is a document. Change it, diff it, roll it back." },
  { k: "Escalation, not guessing", v: "When confidence falls under the mandate, the run stops at a human." },
];

/* ------------------------------------------------------------
   3 · BRANDS
   The systems the graph reads from and writes to.
   ------------------------------------------------------------ */

export type BrandId =
  | "linkedin"
  | "salesforce"
  | "slack"
  | "netsuite"
  | "intercom"
  | "hubspot"
  | "stripe"
  | "zendesk"
  | "gmail"
  | "notion"
  | "jira"
  | "snowflake"
  | "gong"
  | "greenhouse"
  | "xero";

/* ------------------------------------------------------------
   4 · FRAME 01 — THE LIVE CANVAS
   Three lanes: what arrived, what reasoned about it, what was
   written. The decks rotate so the topology stays put while the
   work moves through it.
   ------------------------------------------------------------ */

export type Lane = "signal" | "reason" | "record";

export type HeroSrc = { brand: BrandId; k: string; n: string };
export type HeroMid = { kind: "agent" | "voice" | "flow"; k: string; n: string };
export type HeroDst = { brand: BrandId; k: string; n: string };

export const HERO_SRC: HeroSrc[] = [
  { brand: "linkedin", k: "LinkedIn", n: "Role posted" },
  { brand: "netsuite", k: "NetSuite", n: "Invoice due" },
  { brand: "intercom", k: "Intercom", n: "Churn signal" },
  { brand: "stripe", k: "Stripe", n: "Payment failed" },
  { brand: "gong", k: "Gong", n: "Call ended" },
  { brand: "zendesk", k: "Zendesk", n: "Ticket #4417" },
  { brand: "gmail", k: "Gmail", n: "Reply received" },
  { brand: "hubspot", k: "HubSpot", n: "Form submitted" },
  { brand: "snowflake", k: "Snowflake", n: "Intent spike" },
];

export const HERO_MID: HeroMid[] = [
  { kind: "agent", k: "Agent", n: "Triage intent" },
  { kind: "agent", k: "Agent", n: "Draft save play" },
  { kind: "voice", k: "Voice", n: "Collections call" },
  { kind: "flow", k: "Workflow", n: "Enrich & route" },
  { kind: "agent", k: "Agent", n: "Source & rank" },
  { kind: "flow", k: "Workflow", n: "Recover revenue" },
];

export const HERO_DST: HeroDst[] = [
  { brand: "salesforce", k: "Salesforce", n: "Lead scored" },
  { brand: "slack", k: "Slack", n: "Owner alerted" },
  { brand: "greenhouse", k: "Greenhouse", n: "Shortlist ready" },
  { brand: "jira", k: "Jira", n: "Bug filed" },
  { brand: "xero", k: "Xero", n: "Promise logged" },
  { brand: "notion", k: "Notion", n: "Case opened" },
];

/* the fixed topology: three signals fan into two reasoners,
   which converge on two systems of record */
export const HERO_IN: [number, number][] = [
  [0, 0],
  [1, 0],
  [1, 1],
  [2, 1],
];
export const HERO_OUT: [number, number][] = [
  [0, 0],
  [0, 1],
  [1, 1],
];

/* ------------------------------------------------------------
   5 · FRAME 02 — THE WORKFLOW BUILDER
   Four real graphs. Each one builds on the canvas, then runs:
   nodes move queued → running → done, a token travels the wires,
   and the run log writes itself.
   ------------------------------------------------------------ */

export type NodeState = "idle" | "queued" | "running" | "done" | "skipped" | "held";

export type WfNode = {
  id: string;
  cat: CatId;
  brand?: BrandId;
  /** category label printed above the name */
  k: string;
  /** what this step does, in the product's own words */
  n: string;
  /** grid position — col is an integer lane, row is fractional */
  col: number;
  row: number;
  /** the line this node writes to the run log */
  log: string;
  /** how long the step takes, in the run's own clock (ms) */
  ms: number;
  /** real-world seconds the step waits on the world — a call
      being had, a queue being drained. Compute is not elapsed. */
  wait?: number;
  /** the inspector panel, when a node is selected */
  cfg: [string, string][];
};

export type WfEdge = {
  a: string;
  b: string;
  /** printed on the wire when the step branches */
  label?: string;
};

export type WfTemplate = {
  id: string;
  name: string;
  team: string;
  h: string;
  p: string;
  nodes: WfNode[];
  edges: WfEdge[];
  /** the order the runtime executes in; ids not listed are skipped */
  path: string[];
  /** the node the run stops at, if any */
  hold?: string;
  out: { v: string; k: string }[];
};

export const TEMPLATES: WfTemplate[] = [
  {
    id: "inbound",
    name: "Inbound lead",
    team: "Sales",
    h: "A form fill, qualified and called before anyone opens a laptop.",
    p: "The trigger fires at 02:14. The account is enriched on 38 attributes, an agent qualifies it against closed-won patterns, and the hot branch books the meeting by voice while the rest go to nurture.",
    nodes: [
      {
        id: "t",
        cat: "trigger",
        brand: "hubspot",
        k: "Trigger",
        n: "Form submitted",
        col: 0,
        row: 1,
        log: "Run started · demo request from meridian-freight.com",
        ms: 320,
        cfg: [["Event", "form.submitted"], ["Source", "HubSpot · Request a demo"], ["Concurrency", "unbounded"]],
      },
      {
        id: "e",
        cat: "enrich",
        k: "Enrich",
        n: "38 attributes",
        col: 1,
        row: 1,
        log: "Company + person resolved · 38/38 attributes filled",
        ms: 780,
        cfg: [["Providers", "3, in priority order"], ["Cache", "14 days"], ["On miss", "continue with partial"]],
      },
      {
        id: "a",
        cat: "agent",
        k: "Agent",
        n: "Qualify intent",
        col: 2,
        row: 1,
        log: "Scored 87/100 · matches 4 closed-won patterns",
        ms: 1240,
        cfg: [["Mandate", "Qualify and route only"], ["Escalates when", "confidence < 0.7"], ["Tools", "Knowledge, Data, Score"]],
      },
      {
        id: "v",
        cat: "voice",
        k: "Voice",
        n: "Book the meeting",
        col: 3,
        row: 0.15,
        log: "Called +49 · answered in 6s · meeting booked Thu 14:00",
        ms: 1450,
        wait: 243,
        cfg: [["Language", "Detected from the record"], ["Max attempts", "2, then sequence"], ["Hand-off", "to the territory rep"]],
      },
      {
        id: "s",
        cat: "action",
        brand: "gmail",
        k: "Sequence",
        n: "3-touch nurture",
        col: 3,
        row: 1.85,
        log: "Branch not taken · score below threshold",
        ms: 640,
        cfg: [["Cadence", "Day 0, 3, 9"], ["Voice", "The rep who owns the territory"], ["Stops on", "any reply"]],
      },
      {
        id: "w",
        cat: "action",
        brand: "salesforce",
        k: "Salesforce",
        n: "Lead written",
        col: 4,
        row: 0.15,
        log: "Wrote lead, score, owner and call outcome · audit id 4c1f",
        ms: 410,
        cfg: [["Object", "Lead → Opportunity on book"], ["Fields", "12 written, 0 overwritten"], ["Reversible", "Yes, with evidence"]],
      },
      {
        id: "n",
        cat: "action",
        brand: "slack",
        k: "Slack",
        n: "Owner alerted",
        col: 4,
        row: 1.85,
        log: "Posted to #revenue-alerts with the transcript attached",
        ms: 260,
        cfg: [["Channel", "#revenue-alerts"], ["Includes", "Transcript, score, evidence"], ["Quiet hours", "Respected"]],
      },
    ],
    edges: [
      { a: "t", b: "e" },
      { a: "e", b: "a" },
      { a: "a", b: "v", label: "score ≥ 80" },
      { a: "a", b: "s", label: "nurture" },
      { a: "v", b: "w" },
      { a: "v", b: "n" },
      { a: "s", b: "n" },
    ],
    path: ["t", "e", "a", "v", "w", "n"],
    out: [
      { v: "4m 12s", k: "Signal to booked meeting" },
      { v: "0", k: "Humans involved" },
    ],
  },
  {
    id: "churn",
    name: "Churn save",
    team: "Customer Success",
    h: "Churn is a signal, not a surprise.",
    p: "Usage, tickets and invoices are read together against the account's own baseline. The save play is drafted while the account can still be saved — and the CSM approves it rather than writes it.",
    nodes: [
      {
        id: "t",
        cat: "trigger",
        brand: "intercom",
        k: "Signal",
        n: "Usage drop 41%",
        col: 0,
        row: 1,
        log: "Threshold crossed · Halden Systems, 41% under its own baseline",
        ms: 300,
        cfg: [["Watches", "Each account's own baseline"], ["Window", "Rolling 14 days"], ["Sensitivity", "2σ"]],
      },
      {
        id: "d1",
        cat: "data",
        brand: "snowflake",
        k: "Data",
        n: "Usage baseline",
        col: 1,
        row: 0.15,
        log: "Read 90 days of product events · seats down 9",
        ms: 520,
        cfg: [["Source", "Snowflake · events"], ["Grain", "Daily, per seat"], ["Joins on", "Resolved account id"]],
      },
      {
        id: "d2",
        cat: "data",
        brand: "zendesk",
        k: "Data",
        n: "Open tickets",
        col: 1,
        row: 1.85,
        log: "4 open tickets, 2 aged past SLA, sentiment falling",
        ms: 480,
        cfg: [["Source", "Zendesk"], ["Filter", "Open or reopened"], ["Adds", "Sentiment, age, breach"]],
      },
      {
        id: "a1",
        cat: "agent",
        k: "Agent",
        n: "Health monitor",
        col: 2,
        row: 1,
        log: "Risk 0.78 · cause is the failed migration, not price",
        ms: 1180,
        cfg: [["Mandate", "Diagnose, never contact"], ["Reads", "Usage, tickets, calls, invoices"], ["Escalates when", "risk > 0.7"]],
      },
      {
        id: "k",
        cat: "knowledge",
        k: "Knowledge",
        n: "Save playbook",
        col: 3,
        row: 1,
        log: "Retrieved 3 plays that worked on migration-caused risk",
        ms: 660,
        cfg: [["Corpus", "Playbooks, past saves, contracts"], ["Cited", "Every claim, with a source"], ["Permissions", "Honoured per document"]],
      },
      {
        id: "h",
        cat: "human",
        k: "Approval",
        n: "CSM signs off",
        col: 4,
        row: 0.15,
        log: "Held for a human · credit offer exceeds the agent mandate",
        ms: 0,
        cfg: [["Gate", "Any concession over $5k"], ["Shown", "Draft, evidence, risk, precedent"], ["Times out to", "The account's manager"]],
      },
      {
        id: "o",
        cat: "action",
        brand: "slack",
        k: "Slack",
        n: "CSM briefed",
        col: 4,
        row: 1.85,
        log: "Briefed the owner with the draft and the evidence trail",
        ms: 240,
        cfg: [["Channel", "DM to the account owner"], ["Includes", "Draft, risk, three precedents"], ["Action", "Approve or edit in place"]],
      },
    ],
    edges: [
      { a: "t", b: "d1" },
      { a: "t", b: "d2" },
      { a: "d1", b: "a1" },
      { a: "d2", b: "a1" },
      { a: "a1", b: "k" },
      { a: "k", b: "h", label: "needs a human" },
      { a: "k", b: "o" },
    ],
    path: ["t", "d1", "d2", "a1", "k", "o", "h"],
    hold: "h",
    out: [
      { v: "6 days", k: "Earlier than the old alert" },
      { v: "1", k: "Decision left for a person" },
    ],
  },
  {
    id: "collections",
    name: "Collections",
    team: "Finance",
    h: "Chased, spoken to, and reconciled — before the close.",
    p: "Overdue invoices are worked on the schedule each customer actually responds to. Voice takes the promise to pay, an agent logs it against the invoice, and the ledger reconciles the same hour.",
    nodes: [
      {
        id: "t",
        cat: "trigger",
        k: "Schedule",
        n: "Daily · 07:00",
        col: 0,
        row: 1,
        log: "Run started · 118 invoices in scope",
        ms: 240,
        cfg: [["Cron", "0 7 * * 1-5"], ["Timezone", "Per customer, not per office"], ["Overlap", "Skipped if still running"]],
      },
      {
        id: "s",
        cat: "integration",
        brand: "netsuite",
        k: "NetSuite",
        n: "Overdue invoices",
        col: 1,
        row: 1,
        log: "Pulled 118 open invoices · $2.41M outstanding",
        ms: 540,
        cfg: [["Direction", "Read and write"], ["Page size", "500"], ["Rate limit", "Backs off automatically"]],
      },
      {
        id: "f",
        cat: "logic",
        k: "Filter",
        n: "Past 30 days",
        col: 2,
        row: 1,
        log: "41 invoices past 30 days · 12 with a callable contact",
        ms: 180,
        cfg: [["Condition", "age > 30d AND value > $2k"], ["Else", "Continue to the email branch"], ["Parallel", "12 at a time"]],
      },
      {
        id: "v",
        cat: "voice",
        k: "Voice",
        n: "Payment call",
        col: 3,
        row: 1,
        log: "9 answered · 6 promises to pay · 1 dispute raised",
        ms: 1560,
        cfg: [["Languages", "31, detected on answer"], ["Objections", "Tracked and reported"], ["Hand-off", "Live, on dispute"]],
      },
      {
        id: "a",
        cat: "agent",
        k: "Agent",
        n: "Log the promise",
        col: 4,
        row: 0.15,
        log: "Wrote 6 promises with dates against their invoices",
        ms: 420,
        cfg: [["Writes", "Promise date, amount, transcript"], ["Confidence", "0.94 median"], ["Escalates when", "amount disputed"]],
      },
      {
        id: "x",
        cat: "action",
        brand: "xero",
        k: "Xero",
        n: "Reconciled",
        col: 4,
        row: 1.85,
        log: "3 paid on the call · posted and reconciled",
        ms: 380,
        cfg: [["Posting", "On receipt, same hour"], ["Forecast", "Updated in the same run"], ["Audit", "One trail, finance-readable"]],
      },
    ],
    edges: [
      { a: "t", b: "s" },
      { a: "s", b: "f" },
      { a: "f", b: "v" },
      { a: "v", b: "a", label: "promise to pay" },
      { a: "v", b: "x", label: "paid now" },
    ],
    path: ["t", "s", "f", "v", "a", "x"],
    out: [
      { v: "−19 days", k: "Days sales outstanding" },
      { v: "99.4%", k: "Reconciled without a human" },
    ],
  },
  {
    id: "support",
    name: "Support triage",
    team: "Operations",
    h: "Answered from your docs, bounded by your policy.",
    p: "A ticket is classified, grounded in the company's own documentation, checked against the refund policy, then answered. What turns out to be a defect is filed as one.",
    nodes: [
      {
        id: "t",
        cat: "trigger",
        brand: "zendesk",
        k: "Zendesk",
        n: "Ticket #4417",
        col: 0,
        row: 1,
        log: "Run started · billing question, priority normal",
        ms: 260,
        cfg: [["Event", "ticket.created"], ["Queue", "Tier 1, all brands"], ["SLA", "First reply in 15m"]],
      },
      {
        id: "c",
        cat: "agent",
        k: "Agent",
        n: "Classify & route",
        col: 1,
        row: 1,
        log: "Billing · duplicate charge · confidence 0.91",
        ms: 720,
        cfg: [["Taxonomy", "Yours, not a generic one"], ["Multi-label", "Yes"], ["Escalates when", "confidence < 0.75"]],
      },
      {
        id: "k",
        cat: "knowledge",
        k: "Knowledge",
        n: "Docs + past cases",
        col: 2,
        row: 0.15,
        log: "Grounded in 2 doc sections and 5 resolved cases",
        ms: 610,
        cfg: [["Corpus", "Docs, macros, resolved tickets"], ["Citations", "Attached to the reply"], ["Freshness", "Reindexed hourly"]],
      },
      {
        id: "g",
        cat: "govern",
        k: "Policy",
        n: "Refund limits",
        col: 2,
        row: 1.85,
        log: "Refund $84 is inside the $150 auto-approve limit",
        ms: 210,
        cfg: [["Policy", "P-114 · refunds"], ["Auto-approve", "Up to $150"], ["Above that", "Human gate"]],
      },
      {
        id: "r",
        cat: "agent",
        k: "Agent",
        n: "Resolve & reply",
        col: 3,
        row: 1,
        log: "Refunded $84, replied with the citation, ticket solved",
        ms: 980,
        wait: 211,
        cfg: [["Tone", "Matched to your macros"], ["Actions", "Refund, reply, tag, close"], ["Reversible", "Yes, for 30 days"]],
      },
      {
        id: "j",
        cat: "action",
        brand: "jira",
        k: "Jira",
        n: "Bug filed",
        col: 4,
        row: 0.15,
        log: "Filed BILL-2891 · 4th duplicate charge this week",
        ms: 340,
        cfg: [["Files when", "Third repeat of a cause"], ["Links", "All source tickets"], ["Owner", "The billing squad"]],
      },
      {
        id: "z",
        cat: "action",
        brand: "zendesk",
        k: "Zendesk",
        n: "Ticket closed",
        col: 4,
        row: 1.85,
        log: "Closed in 3m 41s · CSAT survey sent",
        ms: 220,
        cfg: [["Writes", "Reply, tags, resolution code"], ["Audit", "Evidence attached to the ticket"], ["Reopen", "Returns to the same agent"]],
      },
    ],
    edges: [
      { a: "t", b: "c" },
      { a: "c", b: "k" },
      { a: "c", b: "g" },
      { a: "k", b: "r" },
      { a: "g", b: "r" },
      { a: "r", b: "j", label: "repeat cause" },
      { a: "r", b: "z" },
    ],
    path: ["t", "c", "k", "g", "r", "j", "z"],
    out: [
      { v: "3m 41s", k: "Ticket to resolution" },
      { v: "94%", k: "Closed without a human" },
    ],
  },
];

/* the tone each category paints with on the canvas */
export const TONE: Record<Cat["tone"], string> = {
  signal: "var(--wf-signal)",
  reason: "var(--wf-reason)",
  control: "var(--wf-control)",
  act: "var(--wf-act)",
  human: "var(--wf-human)",
};

export const catOf = (id: CatId) => CATS.find((c) => c.id === id)!;

/* ------------------------------------------------------------
   6 · WHICH CAPABILITY A NODE BELONGS TO
   Fourteen build-time categories collapse into the six runtime
   capabilities the platform is sold as, so a running graph can
   show you which parts of the system it just used.
   ------------------------------------------------------------ */

export const CAPABILITY: Record<CatId, string> = {
  trigger: "data",
  integration: "data",
  data: "data",
  enrich: "data",
  knowledge: "knowledge",
  agent: "agents",
  model: "agents",
  logic: "workflows",
  code: "workflows",
  observe: "workflows",
  voice: "voice",
  action: "actions",
  human: "actions",
  govern: "actions",
};

export const CAP_ORDER = [
  { id: "data", name: "Data" },
  { id: "knowledge", name: "Knowledge" },
  { id: "agents", name: "AI Agents" },
  { id: "workflows", name: "Workflows" },
  { id: "voice", name: "Voice" },
  { id: "actions", name: "Actions" },
];
