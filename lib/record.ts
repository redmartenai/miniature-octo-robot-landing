export type Entry = {
  time: string;
  entry: string;
  source?: string;
  decision?: boolean;
};

export const NIGHT = {
  label: "Night of 14 March",
  station: "Northwind Logistics",
  number: "0412",
  entries: [
    { time: "23:41", entry: "Spend rebalanced across 6 campaigns", source: "Meta · Google · LinkedIn" },
    { time: "01:18", entry: "32 accounts identified", source: "matched to closed-won pattern" },
    { time: "02:07", entry: "Sequences opened with 214 contacts" },
    { time: "03:52", entry: "514 records reconciled", source: "HubSpot" },
    { time: "05:14", entry: "Forecast regenerated", source: "Stripe · HubSpot" },
    { time: "06:02", entry: "2 renewals flagged" },
    { time: "06:30", entry: "One decision left for you", source: "overleaf", decision: true },
  ] satisfies Entry[],
} as const;
