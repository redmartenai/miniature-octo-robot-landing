import Head from "@/components/Head";
import { MARKET } from "@/lib/content";

export default function Marketplace() {
  return (
    <section className="sec" id="agents">
      <div className="wrap">
        <Head
          eyebrow="Agent marketplace"
          title={<>Hire the ones you need. <span className="em">Turn off the rest.</span></>}
          lede="Each agent is a job description you can read, with a manager, a memory and a tool set."
        />
        <div className="market">
          {MARKET.map((a) => (
            <article className="agent" key={a.name}>
              <b>{a.name}</b>
              <p>{a.line}</p>
              <div className="meta">
                <span className="mono">{a.meta}</span>
                <i aria-hidden="true">↗</i>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
