import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./landing.css";

// Satoshi and General Sans are Fontshare families, loaded by <link> below.
// JetBrains Mono comes through next/font so it is self-hosted and preloaded.
const mono = JetBrains_Mono({
  subsets: ["latin"], weight: ["400", "500"],
  display: "swap", variable: "--font-mono",
});

const title = "Red Marten — Your company runs itself";
const description =
  "An autonomous business operating system. AI agents run growth, outbound, CRM, finance, reporting and customer success — you wake up to decisions, not tasks.";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL("https://redmarten.ai"),
  openGraph: { title, description, type: "website", siteName: "Red Marten" },
  twitter: { card: "summary_large_image", title, description },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0E1210",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={mono.variable}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@700,500,400&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=general-sans@600,500,400&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
