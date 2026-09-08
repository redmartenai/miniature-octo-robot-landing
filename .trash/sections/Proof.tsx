import { PROOF } from "@/lib/content";

export default function Proof() {
  return (
    <section className="sec" id="proof">
      <div className="wrap">
        <div className="proof">
          {PROOF.map((p) => (
            <div className="proof-item" key={p.label}>
              <b>{p.figure}</b>
              <span>{p.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
