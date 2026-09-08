export default function Head({ eyebrow, title, lede, center }:
  { eyebrow: string; title: React.ReactNode; lede?: string; center?: boolean }) {
  return (
    <div className={center ? "head head--center" : "head"}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {lede && <p>{lede}</p>}
    </div>
  );
}
