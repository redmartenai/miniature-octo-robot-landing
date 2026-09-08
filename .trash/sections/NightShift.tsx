import { NIGHT } from "@/lib/content";

/* The signature section: the night's work, already done, before you open the laptop. */
export default function NightShift() {
  return (
    <section className="sec night" id="night">
      <div className="wrap">
        <div className="head">
          <span className="eyebrow">While you slept · last night</span>
          <h2>What happened <span className="em">between 2 and 7 AM.</span></h2>
          <p>Nobody was awake. Nothing was queued for the morning.</p>
        </div>
        <ol className="night-list">
          {NIGHT.map((n) => (
            <li className="night-row" key={n.time}>
              <span className="t">{n.time} AM</span>
              <span className="l">{n.label}</span>
              <span className="a">{n.agent}</span>
            </li>
          ))}
        </ol>
        <div className="night-foot">
          <p>You woke up to four meetings and one decision.</p>
          <a className="btn btn--line" href="#pricing">See a full night <i aria-hidden="true">→</i></a>
        </div>
      </div>
    </section>
  );
}
