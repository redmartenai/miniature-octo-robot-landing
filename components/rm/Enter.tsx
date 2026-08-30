"use client";

import { useEffect, useRef, useState } from "react";
import { MartenMark } from "@/brand/MartenLogo";
import { useRm, type EnterView } from "./Shell";
import { NightField } from "./NightField";
import { useScrollLock } from "@/lib/rm/motion";

/* ============================================================
   ENTER — connecting to the operating system
   Not a modal on top of a website. The site goes dark, the core
   stays lit, and you are asked how you want to come in. Three
   ways, one question, nothing else on the screen.

   NOTE FOR DEPLOYMENT: submit() is intentionally inert. Wire it
   to your auth endpoint / CRM before this page goes live — the
   confirmation copy below assumes the request was received.
   ============================================================ */

const COPY: Record<Exclude<EnterView, "choose">, { h: string; p: string; cta: string; fields: [string, string, string][] }> = {
  login: {
    h: "Enter your workspace.",
    p: "Single sign-on is available on every plan.",
    cta: "Enter workspace",
    fields: [
      ["email", "Work email", "email"],
      ["password", "Password", "password"],
    ],
  },
  create: {
    h: "Create a workspace.",
    p: "Connect one system of record and the first workflow runs today.",
    cta: "Create workspace",
    fields: [
      ["name", "Full name", "text"],
      ["email", "Work email", "email"],
      ["company", "Company", "text"],
    ],
  },
  demo: {
    h: "Book a demo.",
    p: "Thirty minutes, your stack, a real workflow running by the end of it.",
    cta: "Request a time",
    fields: [
      ["name", "Full name", "text"],
      ["email", "Work email", "email"],
      ["company", "Company", "text"],
    ],
  },
};

export function Enter() {
  const { enter, openEnter, closeEnter } = useRm();
  const [sent, setSent] = useState<null | string>(null);
  const panel = useRef<HTMLDivElement>(null);

  useScrollLock(enter !== null);

  useEffect(() => {
    if (!enter) {
      setSent(null);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeEnter();
      if (e.key !== "Tab") return;
      const root = panel.current;
      if (!root) return;
      const f = root.querySelectorAll<HTMLElement>(
        'button, input, [href], [tabindex]:not([tabindex="-1"])',
      );
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => {
      panel.current?.querySelector<HTMLElement>("button, input")?.focus();
    }, 260);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [enter, closeEnter]);

  if (!enter) return null;

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement | null)?.value ?? "";
    setSent(email);
  };

  const view = enter === "choose" ? null : COPY[enter];

  return (
    <div className="rm-enter" role="dialog" aria-modal="true" aria-label="Connect to Red Marten">
      <NightField density={40} intensity={0.72} />

      <button className="rm-enter-x" onClick={closeEnter} aria-label="Close">
        ✕
      </button>

      <div className="rm-enter-in" ref={panel}>
        <div className="rm-enter-core" aria-hidden>
          <Core />
        </div>

        {sent ? (
          <>
            <h2 className="rm-enter-h">
              Request received. <em>Welcome in.</em>
            </h2>
            <p className="rm-enter-p">
              A solutions engineer will confirm at {sent || "your work email"} within one
              business day.
            </p>
            <div className="rm-enter-opts">
              <button className="rm-enter-opt" data-pri="1" onClick={closeEnter}>
                <span className="no">01</span>
                Back to the site
                <span className="go">Close</span>
              </button>
            </div>
          </>
        ) : !view ? (
          <>
            <h2 className="rm-enter-h">
              Welcome.
              <em>How would you like to enter?</em>
            </h2>
            <p className="rm-enter-p">
              The operating system is already running. Choose the door.
            </p>
            <div className="rm-enter-opts">
              <button className="rm-enter-opt" data-pri="1" onClick={() => openEnter("create")}>
                <span className="no">01</span>
                Create Workspace
                <span className="go">Start free</span>
              </button>
              <button className="rm-enter-opt" onClick={() => openEnter("login")}>
                <span className="no">02</span>
                Login
                <span className="go">SSO available</span>
              </button>
              <button className="rm-enter-opt" onClick={() => openEnter("demo")}>
                <span className="no">03</span>
                Book Demo
                <span className="go">30 minutes</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="rm-enter-h">{view.h}</h2>
            <p className="rm-enter-p">{view.p}</p>
            <form className="rm-enter-form rm-enter-opts" onSubmit={submit}>
              <div>
                {view.fields.map(([id, label, type]) => (
                  <div key={id}>
                    <label htmlFor={`rm_${id}`}>{label}</label>
                    <input id={`rm_${id}`} name={id} type={type} required autoComplete="on" />
                  </div>
                ))}
              </div>
              <button className="rm-enter-opt" data-pri="1" type="submit">
                <span className="no">→</span>
                {view.cta}
                <span className="go">Enter</span>
              </button>
            </form>
            <button className="rm-enter-back" onClick={() => openEnter("choose")}>
              ← All ways in
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* the core keeps running while you decide */
function Core() {
  return (
    <span className="rm-core">
      <span className="ring r1" />
      <span className="ring r2" />
      <span className="ring r3" />
      <MartenMark size={30} />
    </span>
  );
}
