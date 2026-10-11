import type { ReactNode } from "react";
import { useT } from "./i18n.tsx";

type LibProps = {
  onReport?: () => void;
  onDashboard?: () => void;
  onCampus?: () => void;
  onWorksite?: () => void;
  onSignIn?: () => void;
  /** Optional: put your existing language dropdown here */
  languageSwitcher?: ReactNode;
};

/* ---------- small icons ---------- */
const Shield = () => (
  <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
    <path d="M16 2 4 6.5v8.2c0 7.2 5 12.6 12 15.3 7-2.7 12-8.1 12-15.3V6.5L16 2Z" fill="#2a4a9b" />
    <path d="M16 2 4 6.5v8.2c0 7.2 5 12.6 12 15.3V2Z" fill="#1d3a82" />
    <path d="M16 8c3 3.4 4.6 5.7 4.6 8a4.6 4.6 0 0 1-9.2 0c0-2.3 1.6-4.6 4.6-8Z" fill="#f7931e" />
    <path d="M16 13c1.5 1.7 2.3 2.9 2.3 4a2.3 2.3 0 0 1-4.6 0c0-1.1.8-2.3 2.3-4Z" fill="#ffd08a" />
  </svg>
);

const Drop = ({ c = "#2d8cf0" }: { c?: string }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.5C8 8 5.5 11.2 5.5 14.6a6.5 6.5 0 0 0 13 0C18.5 11.2 16 8 12 2.5Z" fill={c} />
    <path d="M9 14.5a3.2 3.2 0 0 0 2.6 3.1" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity=".8" />
  </svg>
);

const Sun = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
    <g stroke="#f7931e" strokeWidth="1.8" strokeLinecap="round">
      <path d="M12 1.8v3M12 19.2v3M1.8 12h3M19.2 12h3M4.8 4.8l2.1 2.1M17.1 17.1l2.1 2.1M4.8 19.2l2.1-2.1M17.1 6.9l2.1-2.1" />
    </g>
    <circle cx="12" cy="12" r="5" fill="#ffb42e" />
  </svg>
);

const Fan = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
    <g fill="#2d8cf0">
      <path d="M12 11c-.2-3.8 1-7 3.6-7 2 0 2.6 2 1.2 3.8C15.6 9.4 13.8 10.4 12 11Z" />
      <path d="M13 12.2c3.3-1.9 6.7-2 7.7.3.8 1.8-.8 3.1-3 2.8-1.7-.2-3.6-1.4-4.7-3.1Z" />
      <path d="M11.4 13.3c.6 3.7-.9 6.7-3.5 6.4-2-.3-2.3-2.3-.7-3.8 1.4-1.2 2.7-2.1 4.2-2.6Z" />
    </g>
    <circle cx="12" cy="12" r="2" fill="#1d3a82" />
  </svg>
);

const Hat = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 16a8 8 0 0 1 16 0v1.5H4V16Z" fill="#ffb42e" />
    <rect x="10.4" y="5.5" width="3.2" height="6" rx="1.4" fill="#f7931e" />
    <rect x="2.5" y="16.5" width="19" height="2.6" rx="1.3" fill="#e8830f" />
  </svg>
);

const GradCap = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 4 1.5 9.2 12 14.4l10.5-5.2L12 4Z" fill="#1d3a82" />
    <path d="M6 12v4.2c0 1.4 2.7 2.8 6 2.8s6-1.4 6-2.8V12l-6 3-6-3Z" fill="#2a4a9b" />
    <path d="M21 10v6" stroke="#f7931e" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const Shade = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M2 11a10 10 0 0 1 20 0H2Z" fill="#f7931e" />
    <path d="M12 11v9" stroke="#8a5a2b" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="19" cy="4.5" r="2" fill="#ffb42e" />
  </svg>
);

const Bench = () => (
  <svg width="28" height="26" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="9" width="3.6" height="7" rx="1.2" fill="#2d8cf0" />
    <rect x="5" y="13" width="14" height="3.4" rx="1.2" fill="#f7931e" />
    <path d="M7 16.5V20M17 16.5V20" stroke="#8a5a2b" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="14" cy="7.2" r="2" fill="#ffb42e" />
  </svg>
);

const Tick = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true">
    <circle cx="8" cy="8" r="8" fill="#2f9e5b" />
    <path d="m4.6 8.3 2.3 2.3 4.5-4.8" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Pin = ({ color = "#2a4a9b" }: { color?: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 22s7-6.3 7-12a7 7 0 0 0-14 0c0 5.7 7 12 7 12Z" fill={color} />
    <circle cx="12" cy="10" r="2.6" fill="#fff" />
  </svg>
);

const Clipboard = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="4.5" y="4" width="15" height="17" rx="2.5" fill="#fff" stroke="#e8830f" strokeWidth="1.5" />
    <rect x="8.5" y="2" width="7" height="4" rx="1.5" fill="#f7931e" />
    <path d="M8 11h8M8 14.5h8M8 18h5" stroke="#e8830f" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const Bell = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6Z" fill="#f7931e" />
    <path d="M10 19a2 2 0 0 0 4 0" stroke="#e8830f" strokeWidth="1.6" strokeLinecap="round" fill="none" />
  </svg>
);

const CheckBox = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="4" fill="#2f9e5b" />
    <path d="m7.5 12.3 3 3 6-6.6" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ---------- the "photo": water cooler in a corridor ---------- */
const CoolerPhoto = () => (
  <svg viewBox="0 0 520 190" preserveAspectRatio="xMidYMid slice" className="hp-photo-svg" role="img" aria-label="A water cooler in a college corridor">
    <defs>
      <linearGradient id="wall" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#c9c2b8" />
        <stop offset="1" stopColor="#efe9df" />
      </linearGradient>
      <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#cfc8bd" />
        <stop offset="1" stopColor="#a8a196" />
      </linearGradient>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#bfe3f7" />
        <stop offset="1" stopColor="#f6fbff" />
      </linearGradient>
      <linearGradient id="body" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#dfe6ee" />
        <stop offset="1" stopColor="#f8fafc" />
      </linearGradient>
      <linearGradient id="jug" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#7cc4f5" />
        <stop offset="1" stopColor="#d6efff" />
      </linearGradient>
    </defs>
    <rect width="520" height="190" fill="url(#wall)" />
    {/* corridor depth on the left */}
    <path d="M0 0h120l-30 40v110L0 190Z" fill="#a9a196" opacity=".55" />
    {/* ceiling lights */}
    <rect x="150" y="6" width="90" height="8" rx="4" fill="#fffdf6" />
    <rect x="300" y="6" width="90" height="8" rx="4" fill="#fffdf6" />
    {/* windows */}
    <rect x="180" y="30" width="110" height="90" fill="url(#sky)" stroke="#8f887d" strokeWidth="4" />
    <path d="M235 30v90M180 75h110" stroke="#8f887d" strokeWidth="3" />
    <rect x="315" y="30" width="110" height="90" fill="url(#sky)" stroke="#8f887d" strokeWidth="4" />
    <path d="M370 30v90M315 75h110" stroke="#8f887d" strokeWidth="3" />
    {/* door */}
    <rect x="445" y="26" width="60" height="124" fill="#9b7650" />
    <rect x="453" y="36" width="44" height="50" fill="#b08a62" />
    <circle cx="456" cy="102" r="3" fill="#e9d9a8" />
    {/* floor */}
    <rect y="150" width="520" height="40" fill="url(#floor)" />
    <ellipse cx="300" cy="170" rx="95" ry="12" fill="#6b655b" opacity=".35" />
    {/* water cooler */}
    <rect x="248" y="38" width="76" height="66" rx="30" fill="url(#jug)" stroke="#8fc5ea" strokeWidth="2" />
    <rect x="262" y="30" width="48" height="14" rx="6" fill="#4aa3df" />
    <path d="M260 60c14 8 38 8 52 0" stroke="#fff" strokeWidth="3" fill="none" opacity=".7" strokeLinecap="round" />
    <rect x="240" y="100" width="92" height="64" rx="8" fill="url(#body)" stroke="#b7c2cf" strokeWidth="2" />
    <rect x="252" y="112" width="30" height="8" rx="3" fill="#2d8cf0" />
    <rect x="290" y="112" width="30" height="8" rx="3" fill="#ef6a4c" />
    <rect x="258" y="134" width="56" height="18" rx="4" fill="#cfd8e2" />
    <rect x="272" y="140" width="28" height="4" rx="2" fill="#8895a5" />
    {/* out of order tag */}
    <rect x="152" y="96" width="62" height="40" fill="#fff8e1" stroke="#e0b24a" strokeWidth="2" transform="rotate(-6 183 116)" />
    <text x="183" y="112" textAnchor="middle" fontSize="9" fontWeight="700" fill="#b4361f" transform="rotate(-6 183 116)">NOT</text>
    <text x="183" y="126" textAnchor="middle" fontSize="9" fontWeight="700" fill="#b4361f" transform="rotate(-6 183 116)">WORKING</text>
    {/* plant */}
    <path d="M70 150c-4-24 2-40 10-56 6 14 8 34 4 56Z" fill="#4f8a4b" />
    <path d="M62 150c-12-16-14-30-10-44 10 10 16 28 14 44Z" fill="#6aa862" />
    <rect x="58" y="146" width="34" height="22" rx="4" fill="#8a5a2b" />
  </svg>
);

/* ---------- component ---------- */
export default function Lib({
  onReport,
  onDashboard,
  onCampus,
  onWorksite,
  onSignIn,
  languageSwitcher,
}: LibProps) {
  const t = useT();
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const timeline = [
    { label: "s.Reported", state: "done" },
    { label: "s.Assigned", state: "done" },
    { label: "s.Fixed", state: "done" },
    { label: "s.verify", state: "active" },
  ];

  return (
    <div className="hp-page">
      {/* header */}
      <header className="hp-header">
        <a className="hp-logo" href="#/" aria-label="HeatProof home">
          <Shield />
          <span>HeatProof</span>
        </a>
        <nav className="hp-nav" aria-label="Main">
          <button type="button" onClick={() => go("how")}>{t("nav.how")}</button>
          <button type="button" onClick={onCampus ?? onReport}>{t("nav.campuses")}</button>
          <button type="button" onClick={onWorksite ?? onReport}>{t("nav.worksites")}</button>
          <button type="button" onClick={onSignIn}>{t("nav.signin")}</button>
        </nav>
        <div className="hp-header-right">
          {languageSwitcher}
          <button type="button" className="hp-btn hp-btn-orange hp-btn-sm" onClick={onReport}>
            {t("btn.report")}
          </button>
        </div>
      </header>

      {/* hero */}
      <section className="hp-hero">
        <div className="hp-hero-copy">
          <h1>{t("hero.title")}</h1>
          <p>
            {t("hero.sub")}
          </p>
          <div className="hp-hero-actions">
            <button type="button" className="hp-btn hp-btn-orange" onClick={onReport}>{t("btn.report")}</button>
            <button type="button" className="hp-btn hp-btn-ghost" onClick={onDashboard}>{t("btn.dashboard")}</button>
          </div>
        </div>

        <aside className="hp-case" aria-label="Example issue">
          <div className="hp-case-top">
            <span className="hp-issue-id">Issue ID: A0204-0512-001</span>
            <span className="hp-temp">
              <Sun />
              <span><b>41°C</b><small>{t("case.heat")}</small></span>
            </span>
          </div>
          <h2>{t("case.title")}</h2>
          <span className="hp-risk">♥ {t("case.risk")}</span>

          <div className="hp-case-meta">
            <span className="hp-where"><Pin /> Rajiv Gandhi Block, Mechanical Engineering Dept, Delhi</span>
            <span className="hp-who">
              <i className="hp-avatar" aria-hidden="true">R</i>
              <span>{t("case.by")} <b>Riya Verma</b><small>{t("case.ago")}</small></span>
            </span>
          </div>

          <div className="hp-photo">
            <CoolerPhoto />
            <span className="hp-photo-check"><Tick size={22} /></span>
          </div>

          <div className="hp-status">
            <b>{t("case.timeline")}</b>
            <ol>
              {timeline.map((step) => (
                <li key={step.label} className={step.state}>
                  {step.state === "done" ? <Tick size={14} /> : <i className="hp-spin" aria-hidden="true" />}
                  <span>{t(step.label)}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="hp-live">
            <span><Pin color="#2a4a9b" /> <b>{t("case.live")}</b><br /><small>Rajiv Gandhi Block, Mechanical Engineering Dept, Delhi</small></span>
            <button
              type="button"
              className="hp-link"
              onClick={() =>
                window.open(
                  "https://www.google.com/maps/search/?api=1&query=Mechanical+Engineering+Department+Delhi",
                  "_blank",
                  "noopener,noreferrer",
                )
              }
            >
              {t("case.map")} ›
            </button>
          </div>
        </aside>
      </section>

      {/* built for india */}
      <p className="hp-kicker">{t("home.kicker")}</p>

      <section className="hp-band" id="modes">
        <div className="hp-tile-india">
          <svg width="56" height="56" viewBox="0 0 64 64" aria-hidden="true">
            <path d="M30 6c4 2 6 6 10 8s6 4 4 8c-1 3 3 4 2 8-1 3-5 3-6 6s1 6-2 9-6 4-8 9c-1 2-3 2-4 0-2-5-6-8-6-14 0-4-4-6-4-10s4-6 6-9 4-8 8-15Z" fill="#fbd9a8" stroke="#f0b46a" strokeWidth="1.5" />
            <path d="M32 30c4 0 7 3 7 6.5 0 4.5-7 11-7 11s-7-6.5-7-11c0-3.5 3-6.5 7-6.500Z" fill="#f7931e" />
            <circle cx="32" cy="36" r="2.6" fill="#fff" />
          </svg>
          <h3>{t("home.tile.h")}</h3>
          <p>{t("home.tile.p")}</p>
        </div>

        <button type="button" className="hp-mode" onClick={onCampus ?? onReport}>
          <span className="hp-mode-head"><GradCap /> {t("mode.campus")}</span>
          <small>{t("mode.campus.for")}</small>
          <span className="hp-chips">
            <span><Drop /><em>{t("chip.water")}</em></span>
            <span><Shade /><em>{t("chip.shade")}</em></span>
            <span><Fan /><em>{t("chip.vent")}</em></span>
          </span>
        </button>

        <button type="button" className="hp-mode" onClick={onWorksite ?? onReport}>
          <span className="hp-mode-head"><Hat /> {t("mode.work")}</span>
          <small>{t("mode.work.for")}</small>
          <span className="hp-chips">
            <span><Drop /><em>{t("chip.wwater")}</em></span>
            <span><Sun /><em>{t("chip.wshade")}</em></span>
            <span><Bench /><em>{t("chip.breaks")}</em></span>
          </span>
        </button>

        <div className="hp-how" id="how">
          <h3>{t("how.title")}</h3>
          <div className="hp-how-steps">
            <span><i className="c1"><Clipboard /></i><b>{t("how.report")}</b><small>{t("how.report.d")}</small></span>
            <span className="hp-arrow" aria-hidden="true">›</span>
            <span><i className="c2"><Bell /></i><b>{t("how.respond")}</b><small>{t("how.respond.d")}</small></span>
            <span className="hp-arrow" aria-hidden="true">›</span>
            <span><i className="c3"><CheckBox /></i><b>{t("how.verify")}</b><small>{t("how.verify.d")}</small></span>
          </div>
        </div>
      </section>

      {/* bottom strip */}
      <section className="hp-strip">
        <div className="hp-strip-lead">
          <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
            <path d="M8 4v32" stroke="#8a5a2b" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M8 6h22c-2 4-2 7 0 11H8Z" fill="#ff9933" />
            <path d="M8 11h23c-.6 1.8-.6 3.6 0 5.500H8Z" fill="#fff" />
            <path d="M8 16.500h21c-1.6 2-1.6 3.5 0 5.500H8Z" fill="#138808" />
            <circle cx="19" cy="14" r="1.7" fill="none" stroke="#1d3a82" strokeWidth=".9" />
          </svg>
          <b>{t("strip.lead")}</b>
        </div>
        <div className="hp-strip-item">
          <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="13" r="8" fill="none" stroke="#2a4a9b" strokeWidth="1.8" /><path d="M12 8.500V13l3 2M9.5 3h5" stroke="#2a4a9b" strokeWidth="1.8" strokeLinecap="round" fill="none" /></svg>
          <span><b>{t("strip.fast")}</b><small>{t("strip.fast.d")}</small></span>
        </div>
        <div className="hp-strip-item">
          <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 4 5v6c0 5 3.4 9 8 11 4.6-2 8-6 8-11V5l-8-3Z" fill="#e3ebff" stroke="#2a4a9b" strokeWidth="1.6" /><circle cx="12" cy="10" r="2.6" fill="#2a4a9b" /><path d="M7.5 17c.8-2.4 2.6-3.5 4.5-3.500s3.7 1.1 4.5 3.5" fill="#2a4a9b" /></svg>
          <span><b>{t("strip.own")}</b><small>{t("strip.own.d")}</small></span>
        </div>
        <div className="hp-strip-item">
          <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.5" fill="#e6f6ec" stroke="#2f9e5b" strokeWidth="1.8" /><path d="m7.5 12.3 3 3 6-6.6" stroke="#2f9e5b" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span><b>{t("strip.proof")}</b><small>{t("strip.proof.d")}</small></span>
        </div>
      </section>
    </div>
  );
}
