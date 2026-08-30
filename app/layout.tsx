import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Familjen_Grotesk, Instrument_Serif } from "next/font/google";
import "../brand/tokens.css";
import "./globals.css";
import "../styles/motion.css";
import "../styles/surfaces.css";

const editorial = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const display = Familjen_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-familjen",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://redmarten.com"),
  title: "Red Marten — The Autonomous Operating System",
  description:
    "Connect any data. Create autonomous intelligence. Let AI execute the work. A living operating system that observes, understands, plans, executes, learns and governs across every department — autonomy that never loses control.",
  keywords: [
    "autonomous operating system",
    "AI agents",
    "AI workflows",
    "voice AI",
    "autonomous intelligence",
    "enterprise AI governance",
  ],
  openGraph: {
    title: "Red Marten — The Autonomous Operating System",
    description:
      "Stop managing tools. Start operating intelligence. Step inside a living autonomous AI operating system.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FCF8F5" },
    { media: "(prefers-color-scheme: dark)", color: "#111010" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} ${display.variable} ${editorial.variable}`}
    >
      <head>
        {/* Set theme before paint to avoid a flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var d=document.documentElement;d.classList.add('js');try{var t=localStorage.getItem('rm-theme');if(t){d.setAttribute('data-theme',t);}}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <div className="grain" aria-hidden />
        {children}
      </body>
    </html>
  );
}
