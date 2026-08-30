"use client";

import { TIERS } from "@/lib/site";
import { RevealGroup } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { useSite } from "./SiteChrome";

export function Pricing() {
  const { openAuth, toast } = useSite();
  return (
    <section className="sec" id="pricing">
      <div className="wrap">
        <SectionHead
          n="07"
          kicker="Pricing"
          title={
            <>
              Pay for work done, <span className="em">not seats parked.</span>
            </>
          }
          dek="Every plan includes the full product. Credits meter the actual work — enrichment, model calls, voice minutes — so a quiet month costs less."
        />

        <RevealGroup className="plans">
            {TIERS.map((t) => (
              <div className={`plan ${t.best ? "best" : ""}`} key={t.name}>
                <div className="ph">
                  <span className="pname">{t.name}</span>
                  {t.best && <span className="ptag">Most popular</span>}
                </div>
                <div className="price">
                  {t.price}
                  <small>{t.unit}</small>
                </div>
                <p className="psub">{t.sub}</p>
                <ul>
                  {t.on.map((f) => (
                    <li key={f}>
                      <i>✓</i>
                      {f}
                    </li>
                  ))}
                  {t.off.map((f) => (
                    <li className="off" key={f}>
                      <i>—</i>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`btn ${t.best ? "btn-red" : "btn-sec"}`}
                  onClick={() =>
                    t.name === "Enterprise"
                      ? toast("Thanks — we’ll be in touch", "Our team will reach out to scope your rollout.")
                      : openAuth("signup")
                  }
                >
                  {t.cta}
                </button>
              </div>
            ))}
        </RevealGroup>

        <p className="pnote">
          Credits cover enrichment, model calls and voice minutes. Unused credits roll over one
          month. Annual billing saves 20%.
        </p>
      </div>
    </section>
  );
}
