import type { Metadata, Viewport } from "next";

// `/` is the static page public/auralis.html (rewritten in next.config.mjs), which
// carries its own head, fonts and styles. This layout only wraps Next's own pages,
// such as the 404.
export const metadata: Metadata = {
  title: "Red Marten — Your company runs itself",
  description:
    "An autonomous business operating system. AI agents run growth, outbound, CRM, finance, reporting and customer success — you wake up to decisions, not tasks.",
};

export const viewport: Viewport = {
  themeColor: "#0E1210",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
