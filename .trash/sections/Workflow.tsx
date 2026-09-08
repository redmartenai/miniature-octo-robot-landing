import Head from "@/components/Head";
import { FLOW } from "@/lib/content";

export default function Workflow() {
  return (
    <section className="sec sec--tight" id="flow">
      <div className="wrap">
        <Head
          eyebrow="How work flows"
          title={<>A lead becomes a meeting <span className="em">without being touched.</span></>}
          lede="Seven steps, each executed by a different agent, each written back as it happens."
        />
        <div className="flow">
          <div className="flow-track">
            {FLOW.map((f, i) => (
              <div className="flow-step" key={f.step}>
                <span className="n">{String(i + 1).padStart(2, "0")}</span>
                <b>{f.step}</b>
                <span>{f.agent} Agent</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
