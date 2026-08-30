"use client";

import { useState } from "react";
import { MartenMark } from "@/brand/MartenLogo";
import { useRm } from "./Shell";
import { useActiveSection, useAnchorNav, useScrollRatio } from "@/lib/rm/motion";

const LINKS: [string, string][] = [
  ["product", "Products"],
  ["solutions", "Solutions"],
  ["customers", "Customers"],
  ["pricing", "Pricing"],
  ["faq", "FAQ"],
  ["about", "About"],
];

const IDS = LINKS.map(([id]) => id);

export function Nav() {
  const { openEnter } = useRm();
  const go = useAnchorNav();
  const p = useScrollRatio();
  const active = useActiveSection(IDS);
  const [open, setOpen] = useState(false);

  const jump = (id: string) => {
    setOpen(false);
    go(id);
  };

  return (
    <header className="rm-nav">
      <div className="rm-nav-in">
        <a
          className="rm-brand"
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <MartenMark size={22} />
          <b>Red Marten</b>
          <span>Autonomous OS</span>
        </a>

        <nav className="rm-links" aria-label="Sections">
          {LINKS.map(([id, label]) => (
            <a
              key={id}
              className="rm-link"
              href={`#${id}`}
              data-on={active === id ? "1" : "0"}
              onClick={(e) => {
                e.preventDefault();
                jump(id);
              }}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="rm-nav-rt">
          <button className="rm-nav-login" onClick={() => openEnter("login")}>
            Login
          </button>
          <button className="rm-btn rm-btn-pri" onClick={() => openEnter("choose")}>
            Connect to Red Marten
          </button>
          <button
            className="rm-nav-burger"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <i />
            <i />
          </button>
        </div>

        <span className="rm-progress" style={{ transform: `scaleX(${p})` }} aria-hidden />
      </div>

      {open && (
        <div className="rm-sheet">
          {LINKS.map(([id, label]) => (
            <button key={id} onClick={() => jump(id)}>
              {label}
            </button>
          ))}
          <button
            onClick={() => {
              setOpen(false);
              openEnter("login");
            }}
          >
            Login
          </button>
          <div className="rm-sheet-cta">
            <button
              className="rm-btn rm-btn-cop"
              onClick={() => {
                setOpen(false);
                openEnter("choose");
              }}
            >
              Connect to Red Marten
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
