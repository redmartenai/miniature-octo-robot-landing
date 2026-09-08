import Mark from "./Mark";

const LINKS = [
  { href: "#workforce", label: "Workforce" },
  { href: "#flow", label: "How it works" },
  { href: "#mara", label: "MARA" },
  { href: "#agents", label: "Agents" },
  { href: "#pricing", label: "Pricing" },
];

export default function Nav() {
  return (
    <nav className="nav" aria-label="Primary">
      <div className="nav-in">
        <a className="nav-brand" href="#top"><Mark /> Red Marten</a>
        <ul className="nav-links">
          {LINKS.map((l) => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}
        </ul>
        <a className="nav-cta" href="#mara">Meet MARA</a>
      </div>
    </nav>
  );
}
