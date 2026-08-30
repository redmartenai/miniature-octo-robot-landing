"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { MartenMark } from "@/brand/MartenLogo";
import { ScentTrail } from "./ScentTrail";

type AuthView = "login" | "signup" | "forgot";
type Toast = { id: number; title: string; body: string };

type Ctx = {
  theme: "light" | "dark";
  toggleTheme: () => void;
  openAuth: (v: AuthView) => void;
  toast: (title: string, body: string) => void;
};

const SiteCtx = createContext<Ctx | null>(null);
export const useSite = () => {
  const c = useContext(SiteCtx);
  if (!c) throw new Error("useSite must be used inside <SiteChrome>");
  return c;
};

const VIEWS: Record<
  AuthView,
  {
    h: string;
    s: string;
    fields: [string, string, string, string][]; // id, label, type, placeholder
    cta: string;
    alt?: string;
    ft: ReactNode;
  }
> = {
  login: {
    h: "Welcome back",
    s: "Sign in to your Red Marten workspace.",
    fields: [
      ["email", "Work email", "email", "marisol@northwind.io"],
      ["password", "Password", "password", ""],
    ],
    cta: "Sign in",
    alt: "Continue with Okta SSO",
    ft: null,
  },
  signup: {
    h: "Start free",
    s: "No card required. 5,000 credits a month, forever.",
    fields: [
      ["name", "Full name", "text", ""],
      ["email", "Work email", "email", ""],
      ["company", "Company", "text", ""],
      ["password", "Password", "password", ""],
    ],
    cta: "Create workspace",
    alt: "Sign up with Google",
    ft: null,
  },
  forgot: {
    h: "Reset your password",
    s: "We will email a link that expires in 30 minutes.",
    fields: [["email", "Work email", "email", ""]],
    cta: "Send reset link",
    ft: null,
  },
};

export function SiteChrome({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [view, setView] = useState<AuthView | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toasts, setToasts] = useState<Toast[]>([]);

  // sync theme with what the pre-paint script set
  useEffect(() => {
    const attr = document.documentElement.getAttribute("data-theme");
    if (attr === "dark" || attr === "light") setTheme(attr);
    else {
      const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(dark ? "dark" : "light");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem("rm-theme", next);
      } catch {}
      return next;
    });
  }, []);

  const toast = useCallback((title: string, body: string) => {
    const id = Date.now() + Math.floor(performance.now());
    setToasts((t) => [...t, { id, title, body }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  const openAuth = useCallback((v: AuthView) => {
    setErrors({});
    setView(v);
  }, []);
  const closeAuth = useCallback(() => setView(null), []);

  // lock scroll + ESC while modal open
  useEffect(() => {
    if (!view) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeAuth();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [view, closeAuth]);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!view) return;
    const cfg = VIEWS[view];
    const form = e.currentTarget;
    const next: Record<string, string> = {};
    cfg.fields.forEach(([id, label, type]) => {
      const el = form.elements.namedItem(id) as HTMLInputElement | null;
      const val = (el?.value || "").trim();
      if (!val) next[id] = `${label} is required`;
      else if (type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val))
        next[id] = "That does not look like an email address";
      else if (id === "password" && val.length < 8)
        next[id] = "Use at least 8 characters";
    });
    setErrors(next);
    if (Object.keys(next).length) return;

    if (view === "forgot") {
      const email = (form.elements.namedItem("email") as HTMLInputElement).value;
      closeAuth();
      toast("Reset link sent", `Check ${email} — the link expires in 30 minutes.`);
      return;
    }
    closeAuth();
    toast(
      "Welcome to Red Marten",
      "Your workspace is ready — 3 decisions are waiting in today’s briefing.",
    );
  };

  const cfg = view ? VIEWS[view] : null;

  return (
    <SiteCtx.Provider value={{ theme, toggleTheme, openAuth, toast }}>
      {children}
      <ScentTrail />

      {view && cfg && (
        <div
          className="scrim"
          onMouseDown={(e) => e.target === e.currentTarget && closeAuth()}
        >
          <div className="authcard" role="dialog" aria-modal="true" aria-label={cfg.h}>
              <button className="iconbtn authx" aria-label="Close" onClick={closeAuth}>
                ✕
              </button>
              <MartenMark size={42} motion="leap" />
              <h3>{cfg.h}</h3>
              <p className="asub">{cfg.s}</p>
              <form onSubmit={submit} noValidate>
                {cfg.fields.map(([id, label, type, ph]) => (
                  <div className={`fld ${errors[id] ? "bad" : ""}`} key={id}>
                    <label htmlFor={`i_${id}`}>{label}</label>
                    <input
                      id={`i_${id}`}
                      name={id}
                      type={type}
                      defaultValue={ph}
                      autoComplete={type === "password" ? "current-password" : "on"}
                    />
                    {errors[id] && <p className="err">✕ {errors[id]}</p>}
                  </div>
                ))}
                <button className="btn btn-pri" style={{ width: "100%", marginTop: 6 }} type="submit">
                  {cfg.cta}
                </button>
              </form>
              {cfg.alt && (
                <>
                  <div className="auth-alt">OR</div>
                  <button
                    className="btn btn-sec"
                    style={{ width: "100%" }}
                    onClick={() => {
                      closeAuth();
                      toast("Welcome to Red Marten", "Your workspace is ready.");
                    }}
                  >
                    {cfg.alt}
                  </button>
                </>
              )}
              <p className="auth-ft">
                {view === "signup" ? (
                  <>
                    Already have an account?{" "}
                    <a href="#" onClick={(e) => (e.preventDefault(), openAuth("login"))}>
                      Sign in
                    </a>
                  </>
                ) : view === "login" ? (
                  <>
                    New to Red Marten?{" "}
                    <a href="#" onClick={(e) => (e.preventDefault(), openAuth("signup"))}>
                      Create an account
                    </a>
                    <br />
                    <a href="#" onClick={(e) => (e.preventDefault(), openAuth("forgot"))}>
                      Forgot your password?
                    </a>
                  </>
                ) : (
                  <>
                    Remembered it?{" "}
                    <a href="#" onClick={(e) => (e.preventDefault(), openAuth("login"))}>
                      Back to sign in
                    </a>
                  </>
                )}
              </p>
          </div>
        </div>
      )}

      <div className="toasts">
        {toasts.map((t) => (
          <div key={t.id} className="toast" role="status">
            <MartenMark size={18} />
            <div>
              <b>{t.title}</b>
              <p>{t.body}</p>
            </div>
          </div>
        ))}
      </div>
    </SiteCtx.Provider>
  );
}
