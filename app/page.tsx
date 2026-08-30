import "./rm.css";
import "./rm-frames.css";

import { RmShell } from "@/components/rm/Shell";
import { Nav } from "@/components/rm/Nav";
import { Hero } from "@/components/rm/Hero";
import { Product } from "@/components/rm/Product";
import { Solutions } from "@/components/rm/Solutions";
import { Customers } from "@/components/rm/Customers";
import { Pricing } from "@/components/rm/Pricing";
import { Ask } from "@/components/rm/Ask";
import { About } from "@/components/rm/About";
import { Autonomous } from "@/components/rm/Autonomous";
import { Final } from "@/components/rm/Final";
import { Enter } from "@/components/rm/Enter";

/* ============================================================
   RED MARTEN — THE AUTONOMOUS OPERATING SYSTEM
   Eight frames. Paper for the argument, night for the belief,
   and one moment in the middle where the product explains
   itself without a sentence.
   ============================================================ */

export default function Page() {
  return (
    <RmShell>
      <div className="rm-root">
        <Nav />
        <main>
          <Hero />
          <Product />
          <Solutions />
          <Customers />
          <Pricing />
          <Ask />
          <About />
          <Autonomous />
          <Final />
        </main>
      </div>
      <Enter />
    </RmShell>
  );
}
