import Head from "@/components/Head";
import { INTEGRATIONS, OUTPUTS } from "@/lib/content";

export default function Mara() {
  return (
    <section className="sec" id="mara">
      <div className="wrap">
        <Head
          center
          eyebrow="MARA intelligence layer"
          title={<>Everything the company knows, <span className="em">in one mind.</span></>}
          lede="MARA reads every system you already run, decides what matters, and directs the agents accordingly."
        />
        <div className="mara">
          <div className="mara-col" aria-label="Sources">
            {INTEGRATIONS.map((n) => <div className="mara-chip" key={n}>{n}</div>)}
          </div>
          <div className="mara-core"><div><b>MARA</b><span>Orchestrator</span></div></div>
          <div className="mara-col mara-col--out" aria-label="Outputs">
            {OUTPUTS.map((n) => <div className="mara-chip" key={n}>{n}</div>)}
          </div>
        </div>
      </div>
    </section>
  );
}
