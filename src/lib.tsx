import { useState } from "react";
import type { ReactNode } from "react";

type Props = {
  onReport: () => void;
  onDashboard: () => void;
  onCampus: () => void;
  onWorksite: () => void;
  onKiosk: () => void;
  onSignIn: () => void;
  languageSwitcher?: ReactNode;
};

/* ---------- content ---------- */

const DOES = [
  { icon: "📝", title: "Collects heat reports", text: "From phones, shared kiosks, calls and texts." },
  { icon: "📊", title: "Tracks every fix", text: "Reported, Assigned, Fixed, then Verified." },
  { icon: "🚨", title: "Flags emergencies", text: "High risk reports are seen first on the dashboard." },
];

const ROLES = [
  { id: "worker", icon: "👷", name: "Worker", tip: "Have a smartphone? Report in three taps.", steps: [["📱", "Open the site"], ["📍", "Pick the problem"], ["✅", "Send"]] },
  { id: "nophone", icon: "📵", name: "No smartphone", tip: "No phone needed. Tap your ID, then tap how you feel. Or call or text the heat line.", steps: [["🔢", "Enter your ID"], ["👆", "Tap how you feel"], ["🔊", "Hear the advice"]] },
  { id: "school", icon: "🎓", name: "School or college", tip: "Spot a hot room? Report it. Staff fix it.", steps: [["🏫", "Report"], ["🔧", "Fix"], ["✔️", "Verify"]] },
  { id: "ngo", icon: "🤝", name: "NGO or organisation", tip: "One dashboard for every site. Handle emergencies first.", steps: [["📊", "Watch"], ["👤", "Assign"], ["🏁", "Track"]] },
];

const STAGES = [
  ["Reported", "Someone reports a heat problem."],
  ["Assigned", "A person is picked to fix it."],
  ["Fixed", "The problem is repaired."],
  ["Verified", "Someone checks it is really gone."],
];

/* ---------- styles ---------- */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Figtree:wght@400;600;700&display=swap');

/* undo Vite starter styles that squeeze the page into the middle */
html,body,#root{margin:0 !important;padding:0 !important;width:100% !important;max-width:none !important;min-height:100% !important;display:block !important;text-align:left !important;place-items:initial !important;border:0 !important}
.hp-hero,.hp-sec,.hp-foot,.hp-nav{display:block;width:100% !important;max-width:none !important;margin:0 !important}
.hp .hp-wrap{width:100% !important;max-width:1440px !important;margin:0 auto !important}
.hp .hp-hero-grid{width:100%}

.hp,.hp *{box-sizing:border-box}
.hp{
  --shade:#0f766e; --shade-d:#0b5a54; --mint:#e6f6f3; --night:#12263a; --ink:#16212e; --mut:#51606f;
  --line:#dbe4e8; --paper:#fbfdfc;
  position:fixed !important; inset:0 !important; z-index:1; width:auto !important; max-width:none !important; margin:0 !important;
  overflow-y:auto !important; overflow-x:hidden !important; -webkit-overflow-scrolling:touch;
  font-family:'Figtree',system-ui,-apple-system,'Segoe UI',Roboto,'Noto Sans Devanagari','Noto Sans Tamil',sans-serif;
  color:var(--ink); background:var(--paper); line-height:1.55; overflow-x:hidden; text-align:left;
}
.hp h1,.hp h2,.hp h3{font-family:'Bricolage Grotesque','Figtree',system-ui,sans-serif;letter-spacing:-.02em;margin:0}
.hp button{font-family:inherit}
.hp :focus-visible{outline:3px solid #2563eb;outline-offset:2px}
.hp-wrap{width:100%;max-width:1440px;margin:0 auto;padding:0 clamp(20px,4vw,64px)}

/* nav */
.hp-nav{position:sticky;top:0;z-index:30;width:100%;background:rgba(251,253,252,.92);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}
.hp-nav-in{width:100%;max-width:1440px;margin:0 auto;padding:12px clamp(20px,4vw,64px);display:flex;align-items:center;justify-content:space-between;gap:12px}
.hp-logo{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:24px;display:flex;align-items:center;gap:8px;color:var(--night)}
.hp-nav-r{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.hp-link{background:none;border:0;font-size:15px;font-weight:600;color:var(--ink);padding:8px 14px;border-radius:8px;cursor:pointer;white-space:nowrap}
.hp-link:hover{background:var(--mint)}
.hp-link.solid{background:var(--shade);color:#fff}
.hp-link.solid:hover{background:var(--shade-d)}

/* hero */
.hp-hero{width:100%;padding:clamp(40px,7vw,96px) 0;background:
  radial-gradient(1100px 500px at 85% -10%, #d3efe9 0%, transparent 60%),
  var(--paper)}
.hp-hero-grid{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);gap:clamp(32px,5vw,80px);align-items:center}
.hp-hero h1{font-size:clamp(40px,6vw,76px);line-height:1.04;font-weight:800;color:var(--night)}
.hp-hero p.lead{font-size:clamp(17px,1.6vw,21px);color:var(--mut);margin:20px 0 28px;max-width:620px}
.hp-cta{display:flex;gap:12px;flex-wrap:wrap}
.hp-btn{padding:14px 26px;border-radius:12px;border:2px solid var(--shade);background:var(--shade);color:#fff;font-size:16px;font-weight:700;cursor:pointer;transition:background .15s,transform .15s}
.hp-btn:hover{background:var(--shade-d);transform:translateY(-2px)}
.hp-btn.ghost{background:transparent;color:var(--shade)}
.hp-btn.ghost:hover{background:var(--mint)}

.hp-does{background:#fff;border:1px solid var(--line);border-radius:24px;padding:clamp(22px,3vw,36px);box-shadow:0 30px 60px -28px rgba(18,38,58,.35)}
.hp-does h2{font-size:clamp(22px,2.2vw,28px);color:var(--night);margin-bottom:8px}
.hp-does-row{display:flex;gap:16px;align-items:flex-start;padding:16px 0;border-top:1px solid var(--line)}
.hp-does-row:first-of-type{border-top:0}
.hp-does-ic{width:52px;height:52px;border-radius:50%;background:var(--mint);display:flex;align-items:center;justify-content:center;font-size:26px;flex:none}
.hp-does-row b{display:block;font-size:18px;color:var(--night)}
.hp-does-row span{color:var(--mut);font-size:15px}

/* sections */
.hp-sec{width:100%;padding:clamp(48px,6vw,88px) 0}
.hp-sec.tint{background:var(--mint)}
.hp-head{max-width:640px;margin-bottom:32px}
.hp-head h2{font-size:clamp(28px,3.6vw,44px);color:var(--night)}
.hp-head p{margin:8px 0 0;color:var(--mut);font-size:18px}

/* mode cards */
.hp-modes{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}
.hp-mode{display:flex;flex-direction:column;align-items:flex-start;gap:14px;background:#fff;border:1px solid var(--line);border-top:8px solid var(--c);border-radius:18px;padding:28px;text-align:left;width:100%;cursor:pointer;color:inherit;transition:transform .2s,box-shadow .2s}
.hp-mode:hover{transform:translateY(-6px);box-shadow:0 18px 36px -16px rgba(18,38,58,.35)}
.hp-mode .ic{font-size:44px;width:76px;height:76px;border-radius:50%;background:var(--bg);display:flex;align-items:center;justify-content:center;flex:none}
.hp-mode h3{font-size:26px;color:var(--night)}
.hp-mode p{margin:0;color:var(--mut);font-size:17px;flex:1}
.hp-mode .act{font-weight:700;color:var(--c);font-size:16px}

/* who does what */
.hp-seg{display:inline-flex;flex-wrap:wrap;gap:6px;background:#fff;border:1px solid var(--line);border-radius:14px;padding:6px;margin-bottom:22px}
.hp-seg button{border:0;background:transparent;padding:10px 18px;border-radius:10px;font-size:15px;font-weight:700;color:var(--mut);cursor:pointer}
.hp-seg button.on{background:var(--shade);color:#fff}
.hp-seg button:not(.on):hover{background:var(--mint)}
.hp-role{display:grid;grid-template-columns:auto 1fr;gap:30px;align-items:center;background:#fff;border:1px solid var(--line);border-radius:22px;padding:clamp(22px,3vw,40px);animation:hpin .3s ease}
.hp-role .big{font-size:76px;line-height:1}
.hp-role p{margin:0 0 18px;font-size:clamp(18px,1.8vw,24px);font-weight:600;color:var(--night);max-width:760px}
.hp-path{display:flex;align-items:center;flex-wrap:wrap;gap:10px}
.hp-node{background:var(--mint);border-radius:12px;padding:12px 18px;text-align:center;min-width:120px}
.hp-node b{display:block;font-size:26px;font-weight:400}
.hp-node span{font-size:14px;font-weight:700;color:var(--shade-d)}
.hp-sep{color:var(--shade);font-weight:800}
@keyframes hpin{from{opacity:0;transform:scale(.98)}to{opacity:1;transform:none}}

/* stages */
.hp-track{position:relative;display:flex;justify-content:space-between;width:100%;margin:6px 0 26px}
.hp-track::before,.hp-track .fill{content:"";position:absolute;left:24px;top:24px;height:4px;border-radius:2px}
.hp-track::before{right:24px;background:#c9d9d6}
.hp-track .fill{background:var(--shade);transition:width .35s ease}
.hp-dot{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:8px;background:none;border:0;cursor:pointer;color:var(--night);font-weight:700;font-size:16px}
.hp-dot i{width:48px;height:48px;border-radius:50%;background:#fff;border:3px solid #c9d9d6;display:flex;align-items:center;justify-content:center;font-style:normal;font-size:18px;transition:all .25s}
.hp-dot.done i{border-color:var(--shade);color:var(--shade)}
.hp-dot.on i{background:var(--shade);border-color:var(--shade);color:#fff;transform:scale(1.12)}
.hp-say{font-size:22px;color:var(--night);font-weight:600;min-height:32px}

/* footer */
.hp-foot{width:100%;background:var(--night);color:#fff;padding:clamp(40px,5vw,72px) 0}
.hp-foot-in{display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap}
.hp-foot h2{font-size:clamp(26px,3.4vw,40px)}
.hp-foot p{margin:6px 0 0;color:#b6c4d1}
.hp-foot .hp-btn{background:#fff;color:var(--night);border-color:#fff}
.hp-foot .hp-btn.ghost{background:transparent;color:#fff;border-color:#6b8196}
.hp-foot .hp-btn.ghost:hover{background:rgba(255,255,255,.08)}

@media (max-width:980px){
  .hp-hero-grid{grid-template-columns:1fr}
  .hp-modes{grid-template-columns:1fr}
}
@media (max-width:640px){
  .hp-role{grid-template-columns:1fr}
  .hp-dot{font-size:13px}
  .hp-nav-r .hp-link.hide{display:none}
}
@media (prefers-reduced-motion:reduce){.hp *{animation:none!important;transition:none!important}}
`;

/* ---------- component ---------- */

export default function Lib({ onDashboard, onCampus, onWorksite, onKiosk, onSignIn, languageSwitcher }: Props) {
  const [role, setRole] = useState("worker");
  const [stage, setStage] = useState(0);

  const r = ROLES.find((x) => x.id === role)!;
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const MODES = [
    { icon: "🏫", name: "Campus", text: "Report hot rooms, broken fans and dead water coolers. Staff fix them and mark them done.", color: "#0f766e", bg: "#e6f6f3", act: "Open Campus mode →", go: onCampus },
    { icon: "👷", name: "Worksite", text: "Report no shade, no drinking water or unsafe heat at a work site. High risk goes to the top.", color: "#d97706", bg: "#fef3c7", act: "Open Worksite mode →", go: onWorksite },
    { icon: "📵", name: "No smartphone", text: "Tap your worker ID and how you feel, or try the call and text heat line demo.", color: "#2563eb", bg: "#dbeafe", act: "Open No smartphone mode →", go: onKiosk },
  ];

  return (
    <div className="hp">
      <style>{CSS}</style>

      {/* NAV */}
      <div className="hp-nav">
        <div className="hp-nav-in">
          <div className="hp-logo">
            <span aria-hidden="true">🌡️</span> HeatProof
          </div>
          <div className="hp-nav-r">
            <button className="hp-link hide" onClick={() => scrollTo("modes")}>Modes</button>
            <button className="hp-link hide" onClick={() => scrollTo("who")}>Who does what</button>
            <button className="hp-link hide" onClick={onDashboard}>Dashboard</button>
            {languageSwitcher}
            <button className="hp-link solid" onClick={onSignIn}>Sign in</button>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="hp-hero">
        <div className="hp-wrap">
          <div className="hp-hero-grid">
            <div>
              <h1>Heat problems get fixed when someone hears about them.</h1>
              <p className="lead">
                HeatProof lets students, workers and NGO teams report heat hazards such as no shade, no drinking
                water or a broken fan, even without a smartphone, and tracks each one until it is fixed.
              </p>
              <div className="hp-cta">
                <button className="hp-btn" onClick={() => scrollTo("modes")}>Choose a mode</button>
                <button className="hp-btn ghost" onClick={onDashboard}>Open dashboard</button>
              </div>
            </div>

            <div className="hp-does">
              <h2>What HeatProof does</h2>
              {DOES.map((d) => (
                <div className="hp-does-row" key={d.title}>
                  <div className="hp-does-ic" aria-hidden="true">{d.icon}</div>
                  <div>
                    <b>{d.title}</b>
                    <span>{d.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* THREE MODES */}
      <section className="hp-sec tint" id="modes">
        <div className="hp-wrap">
          <div className="hp-head">
            <h2>Pick your mode</h2>
            <p>Three ways to report. Each one feeds the same dashboard.</p>
          </div>
          <div className="hp-modes">
            {MODES.map((m) => (
              <button
                key={m.name}
                className="hp-mode"
                onClick={m.go}
                style={{ ["--c" as string]: m.color, ["--bg" as string]: m.bg }}
              >
                <span className="ic" aria-hidden="true">{m.icon}</span>
                <h3>{m.name}</h3>
                <p>{m.text}</p>
                <span className="act">{m.act}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* WHO DOES WHAT */}
      <section className="hp-sec" id="who">
        <div className="hp-wrap">
          <div className="hp-head">
            <h2>Who does what</h2>
            <p>Pick a person to see how they use HeatProof.</p>
          </div>
          <div className="hp-seg" role="group" aria-label="Choose a person">
            {ROLES.map((x) => (
              <button key={x.id} className={role === x.id ? "on" : ""} aria-pressed={role === x.id} onClick={() => setRole(x.id)}>
                {x.name}
              </button>
            ))}
          </div>
          <div className="hp-role" key={r.id}>
            <div className="big" aria-hidden="true">{r.icon}</div>
            <div>
              <p>{r.tip}</p>
              <div className="hp-path">
                {r.steps.map((s, i) => (
                  <span key={i} style={{ display: "contents" }}>
                    {i > 0 && <span className="hp-sep" aria-hidden="true">→</span>}
                    <div className="hp-node">
                      <b aria-hidden="true">{s[0]}</b>
                      <span>{s[1]}</span>
                    </div>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STAGES */}
      <section className="hp-sec tint">
        <div className="hp-wrap">
          <div className="hp-head">
            <h2>Every problem is tracked</h2>
            <p>Tap a step to see what it means.</p>
          </div>
          <div className="hp-track">
            <div className="fill" style={{ width: `calc((100% - 48px) * ${stage / (STAGES.length - 1)})` }} />
            {STAGES.map((s, i) => (
              <button
                key={s[0]}
                className={"hp-dot" + (i < stage ? " done" : "") + (i === stage ? " on" : "")}
                onClick={() => setStage(i)}
                aria-pressed={i === stage}
              >
                <i>{i < stage ? "✓" : i + 1}</i>
                {s[0]}
              </button>
            ))}
          </div>
          <div className="hp-say" aria-live="polite">{STAGES[stage][1]}</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="hp-foot">
        <div className="hp-wrap">
          <div className="hp-foot-in">
            <div>
              <h2>See every report in one place.</h2>
              <p>High risk reports show first, so emergencies are handled first.</p>
            </div>
            <div className="hp-cta">
              <button className="hp-btn" onClick={onDashboard}>Open dashboard</button>
              <button className="hp-btn ghost" onClick={onSignIn}>Sign in</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
