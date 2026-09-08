import { HERO, HERO_AGENTS, HERO_OUTCOMES } from "@/lib/content";

/* The system is shown as terrain, not as a graph. The photograph carries the
   idea — quiet, wide, nothing announcing itself — and the agents read as a
   field log written over it: work happening out there, while you sleep. */
export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="wrap">
        <span className="eyebrow">{HERO.eyebrow}</span>
        <h1>{HERO.headline}</h1>
        <p>{HERO.sub}</p>
        <div className="hero-cta">
          <a className="btn btn--fill" href="#mara">{HERO.primary} <i aria-hidden="true">→</i></a>
          <a className="btn btn--line" href="#workforce">{HERO.secondary}</a>
        </div>
      </div>

      <div className="wrap">
        <figure className="land">
          <span className="land-photo" aria-hidden="true" />
          <span className="land-veil" aria-hidden="true" />

          <div className="land-in">
            <header className="land-top">
              <span className="land-mara">
                <i className="pulse" aria-hidden="true" />MARA
                <em>Intelligence layer</em>
              </span>
              <span className="mono land-clock">03:24 · RUNNING</span>
            </header>

            <ul className="land-log">
              {HERO_AGENTS.map((a) => (
                <li key={a.id}>
                  <i className="dot" aria-hidden="true" />
                  <b>{a.name}</b>
                  <span className="task">{a.task}</span>
                  <span className="out">{a.output}</span>
                </li>
              ))}
            </ul>
          </div>
        </figure>

        <figcaption className="land-out">
          <span className="mono">WHILE YOU SLEPT</span>
          <ul>{HERO_OUTCOMES.map((o) => <li key={o}>{o}</li>)}</ul>
        </figcaption>
      </div>
    </header>
  );
}
