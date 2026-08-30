"use client";

import { useEffect, useRef, useState } from "react";
import { MartenMark } from "@/brand/MartenLogo";
import { useSite } from "./SiteChrome";

// 01 Briefing · 02 Platform · 03 Canvas · 04 The desk · 05 The record · 06 In practice · 07 Pricing
const INDEX: [string, string, string][] = [
  ["01", "#briefing", "Briefing"],
  ["02", "#platform", "Platform"],
  ["03", "#canvas", "Canvas"],
  ["04", "#desk", "The desk"],
  ["05", "#record", "The record"],
  ["06", "#practice", "In practice"],
  ["07", "#pricing", "Pricing"],
];

export function Nav() {
  const { theme, toggleTheme, openAuth } = useSite();
  const [active, setActive] = useState<string>("#briefing");
  const navRef = useRef<HTMLElement>(null);

  // Active section drives the sliding underline + aria-current.
  // Same IntersectionObserver grammar that feeds the Scent Trail.
  useEffect(() => {
    const ids = INDEX.map(([, href]) => href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive("#" + visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div className="strip">
        <div className="strip-in">
          <span>Red Marten®</span>
          <span className="mid">The AI Operating System for Revenue Teams</span>
          <span>MMXXVI</span>
        </div>
      </div>
      <header className="mast">
        <div className="mast-in">
          <a className="lock" href="#top" aria-label="Red Marten home">
            <MartenMark size={30} motion="leap" />
            <span className="wordmark">
              Red Marten <sup>®</sup>
            </span>
          </a>
          <nav className="mast-idx" aria-label="Sections" ref={navRef}>
            {INDEX.map(([n, href, label]) => (
              <a
                href={href}
                key={href}
                aria-current={active === href ? "true" : undefined}
              >
                <i>{n}</i>
                {label}
              </a>
            ))}
          </nav>
          <div className="mast-rt">
            <button
              className="iconbtn"
              onClick={toggleTheme}
              title="Toggle theme"
              aria-label="Toggle colour theme"
            >
              {theme === "dark" ? "◑" : "◐"}
            </button>
            <button className="login" onClick={() => openAuth("login")}>
              Login
            </button>
            <button className="btn btn-red btn-sm" onClick={() => openAuth("signup")}>
              Start free
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
