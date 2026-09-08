import { NIGHT } from "@/lib/record";

export default function Record() {
  return (
    <section className="scene scene--record" id="record">
      <div className="wrap">
        <figure className="sheet">
          <figcaption className="sheet-head">
            <span className="sheet-label">{NIGHT.label}</span>
            <span className="sheet-station">{NIGHT.station}</span>
            <span className="sheet-no" aria-label={`Night number ${NIGHT.number}`}>
              {NIGHT.number}
            </span>
          </figcaption>

          <table className="ledger">
            <caption className="vh">
              {`Record of the night of 14 March at ${NIGHT.station}`}
            </caption>
            <thead>
              <tr>
                <th scope="col">Time</th>
                <th scope="col">Entry</th>
                <th scope="col">Source</th>
              </tr>
            </thead>
            <tbody>
              {NIGHT.entries.map((e) => (
                <tr key={e.time} className={e.decision ? "is-decision" : undefined}>
                  <th scope="row" className="c-time">{e.time}</th>
                  <td className="c-entry">
                    {e.entry}
                    {e.decision && <span className="mark">Decision</span>}
                  </td>
                  <td className="c-source">{e.source ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <span className="seal" aria-hidden="true" />
        </figure>
      </div>
    </section>
  );
}
