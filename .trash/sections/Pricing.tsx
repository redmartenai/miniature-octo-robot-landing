import Head from "@/components/Head";
import { PLANS } from "@/lib/content";

export default function Pricing() {
  return (
    <section className="sec" id="pricing">
      <div className="wrap">
        <Head
          center
          eyebrow="Pricing"
          title={<>Pay for work done, <span className="em">not seats parked.</span></>}
          lede="Credits meter the actual work — enrichment, model calls, messages, ad creative. A quiet month costs less."
        />
        <div className="plans">
          {PLANS.map((p) => (
            <div className={p.hot ? "plan plan--hot" : "plan"} key={p.name}>
              <span className="plan-name">{p.name}</span>
              <div className="plan-price">{p.price}{p.per && <small>/{p.per}</small>}</div>
              <span className="plan-agents">{p.agents}</span>
              <ul>{p.feats.map((f) => <li key={f}>{f}</li>)}</ul>
              <a className={p.hot ? "btn btn--fill" : "btn btn--line"} href="#mara">
                {p.name === "Enterprise" ? "Talk to sales" : "Start free"}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
