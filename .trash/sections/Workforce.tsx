import Head from "@/components/Head";
import { WORKFORCE } from "@/lib/content";

/* Ring geometry is computed here, at build time — no layout maths in the browser. */
const R = 38;
const NODES = WORKFORCE.map((a, i) => {
  const angle = (i / WORKFORCE.length) * Math.PI * 2 - Math.PI / 2;
  return { ...a, x: Math.cos(angle) * R, y: Math.sin(angle) * R };
});

export default function Workforce() {
  return (
    <section className="sec" id="workforce">
      <div className="wrap">
        <Head
          eyebrow="Autonomous workforce"
          title={<>Eight agents. <span className="em">One operator.</span></>}
          lede="Every function of the company staffed and running. You sit at the centre, and only the decisions come to you."
        />
        <div className="wf">
          <div className="wf-ring" aria-hidden="true">
            <svg viewBox="-50 -50 100 100">
              {NODES.map((n) => <line key={n.name} x1="0" y1="0" x2={n.x} y2={n.y} />)}
            </svg>
            <div className="wf-core"><b>You</b><span>Decisions</span></div>
            {NODES.map((n) => (
              <div className="wf-node" key={n.name} data-status={n.status}
                   style={{ ["--nx" as string]: `${n.x / 50 * 210}px`, ["--ny" as string]: `${n.y / 50 * 210}px` }}>
                <span><i />{n.name}</span>
              </div>
            ))}
          </div>

          <ul className="wf-list">
            {WORKFORCE.map((a) => (
              <li className="wf-row" key={a.name}>
                <b>{a.name}</b>
                <span className="doing">{a.doing}</span>
                <span className="count">{a.tasks} tasks</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
