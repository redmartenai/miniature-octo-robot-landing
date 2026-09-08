import Mark from "./Mark";

export default function Footer() {
  return (
    <footer className="wrap">
      <div className="foot">
        <span className="nav-brand"><Mark /> Red Marten</span>
        <span className="sp" />
        <a href="#pricing">Pricing</a>
        <a href="#agents">Agents</a>
        <a href="/blogs">Blogs</a>
        <span>© 2026 Red Marten Pvt Ltd</span>
      </div>
    </footer>
  );
}
