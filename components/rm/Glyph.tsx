import type { ReactElement } from "react";
import type { BrandId, CatId } from "@/lib/rm/workflow";

/* ============================================================
   GLYPHS
   Two alphabets on the canvas. Integration marks carry their own
   colour, because a Slack node should look like Slack — that is
   the whole point of an integration surface. Runtime marks
   (agent, voice, branch, gate) are drawn in currentColor so they
   inherit the lane they sit in.
   ============================================================ */

const BRAND: Record<BrandId, ReactElement> = {
  linkedin: (
    <>
      <rect width="24" height="24" rx="4.4" fill="#0A66C2" />
      <circle cx="7" cy="7.1" r="1.78" fill="#fff" />
      <rect x="5.35" y="9.9" width="3.3" height="9.1" fill="#fff" />
      <path
        d="M10.6 9.9h3.16v1.26a3.63 3.63 0 0 1 3.06-1.5c2.28 0 3.58 1.45 3.58 4.04V19h-3.34v-4.5c0-1.18-.45-1.87-1.5-1.87-1.09 0-1.7.73-1.7 1.87V19H10.6z"
        fill="#fff"
      />
    </>
  ),
  salesforce: (
    <path
      d="M10.14 6.35a3.62 3.62 0 0 1 5.9.98 3.98 3.98 0 0 1 5.3 3.76 3.9 3.9 0 0 1-4.6 3.83 3.06 3.06 0 0 1-4.03 1.24 3.44 3.44 0 0 1-6.36-.55A3.15 3.15 0 0 1 2 12.5a3.1 3.1 0 0 1 1.9-2.85 3.86 3.86 0 0 1 6.24-3.3z"
      fill="#00A1E0"
    />
  ),
  slack: (
    <>
      <path d="M5.1 14.6a2.05 2.05 0 1 1-2.05-2.05H5.1zm1.03 0a2.05 2.05 0 0 1 4.1 0v5.13a2.05 2.05 0 1 1-4.1 0z" fill="#E01E5A" />
      <path d="M9.18 5.1a2.05 2.05 0 1 1 2.05-2.05V5.1zm0 1.04a2.05 2.05 0 0 1 0 4.1H4.05a2.05 2.05 0 1 1 0-4.1z" fill="#36C5F0" />
      <path d="M18.9 9.18a2.05 2.05 0 1 1 2.05 2.05H18.9zm-1.03 0a2.05 2.05 0 0 1-4.1 0V4.05a2.05 2.05 0 1 1 4.1 0z" fill="#2EB67D" />
      <path d="M14.82 18.9a2.05 2.05 0 1 1-2.05 2.05V18.9zm0-1.03a2.05 2.05 0 0 1 0-4.1h5.13a2.05 2.05 0 1 1 0 4.1z" fill="#ECB22E" />
    </>
  ),
  netsuite: (
    <>
      <rect width="24" height="24" rx="4.4" fill="#3E9E4F" />
      <path d="M6.9 17.6V6.4h2.72l4.72 6.96V6.4h2.77v11.2h-2.7L9.66 10.6v7z" fill="#fff" />
    </>
  ),
  intercom: (
    <>
      <rect width="24" height="24" rx="4.4" fill="#1F8DED" />
      <rect x="5.4" y="6.2" width="1.75" height="9.1" rx=".87" fill="#fff" />
      <rect x="8.9" y="5.1" width="1.75" height="11" rx=".87" fill="#fff" />
      <rect x="12.4" y="5.1" width="1.75" height="11" rx=".87" fill="#fff" />
      <rect x="15.9" y="6.2" width="1.75" height="9.1" rx=".87" fill="#fff" />
      <path d="M5.6 17.1a12.6 12.6 0 0 0 12.8 0" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" fill="none" />
    </>
  ),
  hubspot: (
    <>
      <path
        d="M17.9 9.3V7.1a1.75 1.75 0 1 0-1.9 0v2.2a5.1 5.1 0 0 0-2.3.98L7.6 5.9a2 2 0 1 0-1 1.6l6 4.5a5.1 5.1 0 1 0 5.3-2.7zm-1 8.3a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2z"
        fill="#FF7A59"
      />
    </>
  ),
  stripe: (
    <>
      <rect width="24" height="24" rx="4.4" fill="#635BFF" />
      <path
        d="M11.5 10.2c0-.6.5-.83 1.3-.83 1.14 0 2.6.35 3.75.97V6.9a9.9 9.9 0 0 0-3.74-.7c-3.06 0-5.1 1.6-5.1 4.27 0 4.16 5.7 3.49 5.7 5.28 0 .71-.61.94-1.46.94-1.25 0-2.85-.52-4.11-1.21v3.5c1.4.6 2.81.85 4.1.85 3.14 0 5.3-1.55 5.3-4.26 0-4.49-5.74-3.69-5.74-5.37z"
        fill="#fff"
      />
    </>
  ),
  /* Zendesk's mark is near-black; on a dark canvas it needs the
     reverse lockup, the same way the brand ships it */
  zendesk: (
    <g fill="#DCD6CB">
      <path d="M11.2 7.4v13.2H1.4z" />
      <path d="M11.2 3.4a4.9 4.9 0 0 1-9.8 0z" />
      <path d="M12.8 16.6V3.4h9.8z" />
      <path d="M12.8 20.6a4.9 4.9 0 0 1 9.8 0z" />
    </g>
  ),
  gmail: (
    <>
      <path d="M2.4 19V8.2l9.6 6.3 9.6-6.3V19a1.6 1.6 0 0 1-1.6 1.6h-2.6v-8.1L12 16.9l-5.4-3.4v8.1H4a1.6 1.6 0 0 1-1.6-1.6z" fill="#E8EAED" />
      <path d="M2.4 8.2 12 14.5l9.6-6.3V6.6A2.2 2.2 0 0 0 19.4 4.4H4.6A2.2 2.2 0 0 0 2.4 6.6z" fill="#EA4335" />
      <path d="M4 20.6h2.6v-8.1L2.4 9.4V19A1.6 1.6 0 0 0 4 20.6z" fill="#4285F4" />
      <path d="M17.4 20.6H20a1.6 1.6 0 0 0 1.6-1.6V9.4l-4.2 3.1z" fill="#34A853" />
    </>
  ),
  notion: (
    <>
      <rect width="24" height="24" rx="4.4" fill="#F4ECE1" />
      <path d="M7 17.4V6.6h2.3l5.2 7.4V6.6h2v10.8h-2.2L9 9.9v7.5z" fill="#15130F" />
    </>
  ),
  jira: (
    <>
      <path d="M12 2.4 21.6 12 12 21.6 8.9 18.5 12 15.4l3.4-3.4L12 8.6 8.9 5.5z" fill="#2684FF" />
      <path d="M12 8.6 8.6 12 12 15.4l-3.1 3.1L2.4 12l6.5-6.5z" fill="#2684FF" opacity=".62" />
    </>
  ),
  snowflake: (
    <g stroke="#29B5E8" strokeWidth="1.9" strokeLinecap="round">
      <path d="M12 3.4v17.2M4.55 7.7l14.9 8.6M4.55 16.3l14.9-8.6" />
      <path d="M9.5 5.6 12 3.4l2.5 2.2M9.5 18.4 12 20.6l2.5-2.2" />
    </g>
  ),
  gong: (
    <>
      <circle cx="12" cy="12" r="9.3" fill="#8039DF" />
      <circle cx="12" cy="12" r="5" fill="none" stroke="#fff" strokeWidth="1.9" />
      <circle cx="12" cy="12" r="1.5" fill="#fff" />
    </>
  ),
  greenhouse: (
    <>
      <rect width="24" height="24" rx="4.4" fill="#24A47F" />
      <path d="M12 5.2c2.1 1.6 3.2 3.4 3.2 5.3 0 1.4-.6 2.5-1.7 3.4l.6 4.9h-4.2l.6-4.9c-1.1-.9-1.7-2-1.7-3.4 0-1.9 1.1-3.7 3.2-5.3z" fill="#fff" />
    </>
  ),
  xero: (
    <>
      <circle cx="12" cy="12" r="9.4" fill="#13B5EA" />
      <g stroke="#fff" strokeWidth="1.9" strokeLinecap="round">
        <path d="M8.4 8.6 14 15.4M14 8.6 8.4 15.4" />
      </g>
      <circle cx="17" cy="12" r="1.3" fill="#fff" />
    </>
  ),
};

/* runtime marks — currentColor, so they take the lane's colour */
const RUNTIME: Record<string, ReactElement> = {
  /* an agent: a mind held inside a mandate */
  agent: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="12" cy="12" r="8.4" opacity=".38" />
      <circle cx="12" cy="12" r="4.6" />
      <path d="M12 7.4v-2.6M12 19.2v-2.6M7.4 12H4.8M19.2 12h-2.6" opacity=".55" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </g>
  ),
  /* voice: a waveform mid-sentence */
  voice: (
    <g stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
      <path d="M4.6 10.6v2.8M8.3 7.6v8.8M12 4.9v14.2M15.7 8.4v7.2M19.4 10.9v2.2" />
    </g>
  ),
  /* a workflow: three steps that always run the same way */
  flow: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="9.4" width="5.2" height="5.2" rx="1.4" />
      <rect x="15.8" y="4.4" width="5.2" height="5.2" rx="1.4" />
      <rect x="15.8" y="14.4" width="5.2" height="5.2" rx="1.4" />
      <path d="M8.2 12h3.4V7h4.2M11.6 12v5h4.2" strokeLinecap="round" />
    </g>
  ),
  /* logic: the condition that splits the run */
  logic: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M4 12h4.2l3.4-5h8.4M11.6 17h8.4" />
      <circle cx="12" cy="12" r="0" />
      <path d="M17.8 4.6 20.6 7l-2.8 2.4M17.8 14.6l2.8 2.4-2.8 2.4" />
    </g>
  ),
  /* knowledge: the company's own record */
  knowledge: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M4.4 5.4h5.2c1.3 0 2.4.9 2.4 2v11c0-1.1-1.1-2-2.4-2H4.4z" />
      <path d="M19.6 5.4h-5.2c-1.3 0-2.4.9-2.4 2v11c0-1.1 1.1-2 2.4-2h5.2z" />
    </g>
  ),
  /* data: resolved records */
  data: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6">
      <ellipse cx="12" cy="6.4" rx="7" ry="2.8" />
      <path d="M5 6.4v11.2c0 1.55 3.13 2.8 7 2.8s7-1.25 7-2.8V6.4M5 12c0 1.55 3.13 2.8 7 2.8s7-1.25 7-2.8" />
    </g>
  ),
  /* enrichment: an attribute added to a record */
  enrich: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="10.6" cy="10.6" r="5.6" />
      <path d="M14.8 14.8 20 20M10.6 8.2v4.8M8.2 10.6h4.8" />
    </g>
  ),
  /* a human step on the graph */
  human: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="12" cy="8.2" r="3.4" />
      <path d="M5.4 19.6a6.6 6.6 0 0 1 13.2 0" />
    </g>
  ),
  /* governance: the mandate every action is checked against */
  govern: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M12 3.4 19.4 6v6c0 4.2-3 7.3-7.4 8.6C7.6 19.3 4.6 16.2 4.6 12V6z" />
      <path d="m9 12 2.2 2.2L15.4 10" strokeLinecap="round" />
    </g>
  ),
  /* actions: the write that actually happens */
  action: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13.2 3.4 5.4 13.4h5.4l-.6 7.2 8-10h-5.4z" />
    </g>
  ),
  trigger: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="12" cy="12" r="3.1" />
      <path d="M12 3.6v3.2M12 17.2v3.2M3.6 12h3.2M17.2 12h3.2" />
      <path d="M6.1 6.1 8.4 8.4M15.6 15.6l2.3 2.3M17.9 6.1l-2.3 2.3M8.4 15.6l-2.3 2.3" opacity=".5" />
    </g>
  ),
  integration: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="6.6" cy="12" r="3" />
      <circle cx="17.4" cy="6.8" r="3" />
      <circle cx="17.4" cy="17.2" r="3" />
      <path d="m9.3 10.7 5.4-2.6M9.3 13.3l5.4 2.6" />
    </g>
  ),
  model: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M12 3.6 20 8v8l-8 4.4L4 16V8z" />
      <path d="M12 12v8.4M12 12 4 8M12 12l8-4" />
    </g>
  ),
  code: (
    <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="m8.4 8.6-4.4 3.4 4.4 3.4M15.6 8.6l4.4 3.4-4.4 3.4M13.6 4.8l-3.2 14.4" />
    </g>
  ),
  observe: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.4 12s3.2-5.8 8.6-5.8S20.6 12 20.6 12s-3.2 5.8-8.6 5.8S3.4 12 3.4 12z" />
      <circle cx="12" cy="12" r="2.4" />
    </g>
  ),
};

export type GlyphId = BrandId | CatId | "agent" | "voice" | "flow";

export function Glyph({ id, size = 20 }: { id: GlyphId; size?: number }) {
  const art = (BRAND as Record<string, ReactElement>)[id] ?? RUNTIME[id] ?? RUNTIME.action;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
      style={{ display: "block", flex: "none" }}
    >
      {art}
    </svg>
  );
}

export const isBrand = (id: string): id is BrandId => id in BRAND;
