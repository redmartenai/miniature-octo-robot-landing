"use client";

import Link from "next/link";
import { MartenMark } from "@/brand/MartenLogo";
import { FOOTER } from "@/lib/site";
import { Reveal } from "./Reveal";
import { useSite } from "./SiteChrome";

export function CtaFooter() {
  const { openAuth, toast } = useSite();
  return (
    <>
      {/* how you actually run it — SaaS onboarding, made concrete */}
      <section className="sec runflow-sec" aria-label="How you run it">
        <div className="wrap">
          <Reveal className="runflow">
            <div className="runflow-h">How you actually run it</div>
            <ol className="runflow-steps">
              <li>
                <span className="rf-n">01</span> Connect your CRM
              </li>
              <li>
                <span className="rf-n">02</span> Open a template or draw a workflow
              </li>
              <li>
                <span className="rf-n">03</span> Approve the first run — most teams have something
                live before end of day one.
              </li>
            </ol>
          </Reveal>
        </div>
      </section>

      {/* colophon — deep red closing spread */}
      <section className="colophon" id="start">
        <div className="colo-in">
          <Reveal>
            <MartenMark size={52} motion="scent" />
            <h2>
              Wake up to decisions.
              <br />
              <span className="em">Let the OS handle the rest.</span>
            </h2>
            <p>
              Connect your systems of record and let the operating system run a night shift. Most
              teams wake up to their first briefing within a day.
            </p>
            <div className="colo-cta">
              <button className="btn btn-lg btn-cream" onClick={() => openAuth("signup")}>
                Start free
              </button>
              <button
                className="tlink tlink-cream"
                onClick={() =>
                  toast("Demo request sent", "A solutions engineer will reach out within one business day.")
                }
              >
                Book a demo <span className="arw">→</span>
              </button>
            </div>
          </Reveal>
          <div className="colo-line">
            <span>Red Marten® — The AI Operating System for Revenue Teams</span>
            {/* add SOC 2 / ISO badges here only once actually held */}
            <span>EU (Frankfurt) or US data residency</span>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="foot">
        <div className="wrap">
          <div className="foot-mast">
            <span className="big">Red Marten</span>
            <p className="said">
              The AI Operating System for Revenue Teams. Built in Europe, run wherever your data
              lives.
            </p>
          </div>

          <div className="foot-grid">
            {(Object.keys(FOOTER) as (keyof typeof FOOTER)[]).map((group) => (
              <div key={group}>
                <h4>{group}</h4>
                <ul>
                  {FOOTER[group].map((item) => (
                    <li key={item}>
                      {item === "Press kit" ? (
                        <Link href="/brand-book">Brand book</Link>
                      ) : (
                        <a href="#">{item}</a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="foot-btm">
            <MartenMark size={20} />
            <span>© MMXXVI Red Marten Technologies</span>
            <span className="sp" />
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Security</a>
            <a href="#">DPA</a>
            <Link href="/brand-book">Brand book</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
