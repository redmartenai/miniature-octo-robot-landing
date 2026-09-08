/* Single source of truth for landing page copy and data.
   Sections read from here so wording changes never require touching JSX. */

export const HERO = {
  eyebrow: "Autonomous Business Operating System",
  headline: "Your company runs itself.",
  sub: "AI agents find leads, run outreach, optimize campaigns, update CRMs, manage workflows and deliver results — while your team focuses on decisions.",
  primary: "Meet MARA",
  secondary: "See the system",
} as const;

/* Hero ecosystem. Geometry lives here so the SVG connectors, the cards and the
   travelling packets are all driven off one set of coordinates that cannot
   drift apart. Coordinates are in the hero viewBox: 1200 x 560. */
export type Agent = {
  id: string; name: string; task: string; status: string; output: string;
  side: "l" | "r"; x: number; y: number;
};

export const MARA_CORE = { x: 600, y: 268, r: 78 };

export const HERO_AGENTS: readonly Agent[] = [
  { id: "growth",    name: "Growth Agent",    task: "Finding ICP accounts",  status: "Active", output: "1,204 accounts scored", side: "l", x: 258, y: 86 },
  { id: "outbound",  name: "Outbound Agent",  task: "Launching sequence",    status: "Active", output: "312 messages sent",     side: "l", x: 258, y: 268 },
  { id: "crm",       name: "CRM Agent",       task: "Updating records",      status: "Active", output: "512 records synced",    side: "l", x: 258, y: 450 },
  { id: "finance",   name: "Finance Agent",   task: "Preparing forecast",    status: "Active", output: "Q3 model updated",      side: "r", x: 942, y: 150 },
  { id: "reporting", name: "Reporting Agent", task: "Generating summary",    status: "Active", output: "Morning brief ready",   side: "r", x: 942, y: 386 },
];

export const HERO_OUTCOMES = [
  "4 meetings booked",
  "$182,400 pipeline",
  "1 decision for you",
] as const;

export const WORKFORCE = [
  { name: "Growth",           status: "live",   tasks: "12,480", doing: "Ranking intent signals" },
  { name: "Ads",              status: "live",   tasks: "3,190",  doing: "Rebalancing spend" },
  { name: "Outbound",         status: "live",   tasks: "48,220", doing: "Sending 312 messages" },
  { name: "Inbound",          status: "live",   tasks: "9,745",  doing: "Answering 14 threads" },
  { name: "CRM",              status: "live",   tasks: "86,110", doing: "Deduplicating accounts" },
  { name: "Finance",          status: "idle",   tasks: "5,602",  doing: "Waiting on month close" },
  { name: "Operations",       status: "live",   tasks: "21,340", doing: "Routing 8 approvals" },
  { name: "Customer Success", status: "review", tasks: "7,918",  doing: "Escalating 2 accounts" },
] as const;

export const FLOW = [
  { step: "Lead found",   agent: "Growth" },
  { step: "Qualified",    agent: "Growth" },
  { step: "Personalized", agent: "Content" },
  { step: "Contacted",    agent: "Outbound" },
  { step: "Followed up",  agent: "Outbound" },
  { step: "CRM updated",  agent: "CRM" },
  { step: "Meeting booked", agent: "Success" },
] as const;

export const INTEGRATIONS = ["HubSpot","Salesforce","Meta","Google","LinkedIn","Slack","Stripe","Notion"] as const;
export const OUTPUTS = ["Meetings","Revenue","Reports","Insights","Forecasts"] as const;

export const NIGHT = [
  { time: "02:11", label: "34 leads discovered",          agent: "Growth Agent" },
  { time: "03:24", label: "17 conversations started",     agent: "Outbound Agent" },
  { time: "04:05", label: "CRM synchronized",             agent: "CRM Agent" },
  { time: "05:11", label: "4 meetings booked",            agent: "Success Agent" },
  { time: "06:35", label: "Performance report generated", agent: "Reporting Agent" },
] as const;

export const PROOF = [
  { figure: "14.2M", label: "tasks executed" },
  { figure: "38,400", label: "meetings booked" },
  { figure: "$412M", label: "pipeline generated" },
] as const;

export const MARKET = [
  { name: "Content Agent",   line: "Briefs, drafts and scheduling across seven channels.", meta: "1 day setup" },
  { name: "Ads Agent",       line: "Creative from real pain points, spend rebalanced daily.", meta: "2 networks" },
  { name: "Outbound Agent",  line: "Sequences that adapt to every reply, not a template.", meta: "30 min setup" },
  { name: "CRM Agent",       line: "Written back at every step, never at the end.", meta: "Realtime" },
  { name: "Finance Agent",   line: "Invoices matched, revenue recognised, close accelerated.", meta: "Month close" },
  { name: "Reporting Agent", line: "The brief on your desk before you open the laptop.", meta: "Daily 06:00" },
  { name: "Success Agent",   line: "Risk spotted early, escalated with the evidence.", meta: "Continuous" },
] as const;

export type Plan = {
  name: string; price: string; per: string; agents: string;
  feats: readonly string[]; hot?: boolean;
};
export const PLANS: readonly Plan[] = [
  { name: "Starter",    price: "$79",   per: "month", agents: "3 agents",   feats: ["25,000 credits monthly","3 seats","Email support"] },
  { name: "Growth",     price: "$349",  per: "month", agents: "All agents", feats: ["150,000 credits monthly","10 seats","API and webhooks","Priority support"], hot: true },
  { name: "Enterprise", price: "Custom", per: "",     agents: "Unlimited",  feats: ["Custom credit pool","EU or US residency","SSO, SCIM, audit logs","Named engineer"] },
] as const;
