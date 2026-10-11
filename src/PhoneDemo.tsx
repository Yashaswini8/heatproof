// @ts-nocheck
import { useEffect, useRef, useState } from "react";

const act = (m) => (m === "call" ? "Press" : "Reply");
const yn = (m) => `${act(m)} 1 for yes, 2 for no.`;

const Q = [
  { k: "consent", t: (m) => (m === "call" ? "Welcome to HeatLine. Press 1 if you agree to share this heat report, or 2 to stop." : "HeatLine: reply 1 to agree to share this heat report, or 2 to stop."), ty: "c", max: 2 },
  { k: "workType", t: (m) => `What work do you do? ${act(m)} 1 construction, 2 delivery, 3 waste, 4 street vending, 5 agriculture, 6 factory, 7 other.`, ty: "c", max: 7 },
  { k: "temperature", t: (m) => (m === "call" ? "Enter the temperature in degrees, then press OK." : "Reply with the temperature in degrees C."), ty: "n", min: 20, max: 55 },
  { k: "humidity", t: (m) => (m === "call" ? "Enter the humidity percent, then press OK." : "Reply with the humidity percent."), ty: "n", min: 0, max: 100 },
  { k: "water", t: (m) => `Is clean drinking water available? ${yn(m)}`, ty: "c", max: 2 },
  { k: "shade", t: (m) => `Is there shade or a rest area? ${yn(m)}`, ty: "c", max: 2 },
  { k: "restBreak", t: (m) => `Did you take a rest break recently? ${yn(m)}`, ty: "c", max: 2 },
  { k: "symptoms", t: (m) => `Do you feel dizzy, very tired or unwell? ${yn(m)}`, ty: "c", max: 2 },
];

const WT = ["", "Construction", "Delivery", "Waste collection", "Street vending", "Agriculture", "Factory work", "Other"];

const NODES = [
  ["Basic phone", "No internet needed"],
  ["", ""],
  ["Bridge Lambda", "Turns keypad answers into a report"],
  ["heatline-api", "Validates and scores the risk"],
  ["DynamoDB", "Stores the report"],
  ["SNS email alert", "Only for High or Extreme risk"],
];

const CSS = `
.pd,.pd *{box-sizing:border-box}
.pd{--ink:#0a1640;--slate:#55627a;--line:#dde3f5;--card:#fff;--blue:#3b63f5;--peri:#e4eaff;--navy:#0a1640;--ok:#1b7f4b;--warn:#b93a09;--warnbg:#fdebe3;--lcd:#d8e1f2;color:var(--ink);font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.pd-note{color:var(--slate);line-height:1.55;margin:0 0 12px;font-size:15px}
.pd-badges{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}
.pd-b{font-size:12.5px;padding:5px 12px;border-radius:999px;border:1px solid var(--line);background:#fff}
.pd-b.live{border-color:#9ad6b4}.pd-b.sim{border-color:#f5c4a5}
.pd-tabs{display:inline-flex;gap:4px;padding:5px;border-radius:999px;background:#fff;border:1px solid var(--line);margin-bottom:16px}
.pd-tabs button{border:0;background:transparent;color:var(--slate);font:600 15px system-ui;padding:9px 20px;border-radius:999px;cursor:pointer}
.pd-tabs button.on{background:var(--navy);color:#fff}
.pd-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px;align-items:start}
.pd-phone{width:300px;max-width:100%;margin:0 auto;background:linear-gradient(180deg,#1b2f8f,#0a1640);border-radius:34px 34px 44px 44px;padding:20px 18px 22px;box-shadow:0 30px 60px -24px rgba(10,22,64,.7),inset 0 0 0 2px rgba(140,165,255,.25)}
.pd-brand{font:700 11px monospace;color:#9db4ff;text-align:center;letter-spacing:.14em;margin-bottom:10px}
.pd-screen{background:var(--lcd);color:var(--ink);border-radius:12px;height:300px;display:flex;flex-direction:column;overflow:hidden;box-shadow:inset 0 2px 8px rgba(0,0,0,.25)}
.pd-sbar{font:500 11px monospace;padding:6px 10px;border-bottom:1px solid rgba(10,22,64,.2);display:flex;justify-content:space-between}
.pd-log{flex:1;overflow-y:auto;padding:8px 10px;display:flex;flex-direction:column;gap:6px;font:400 12px/1.4 monospace}
.pd-m{max-width:88%;padding:5px 8px;border-radius:7px}
.pd-m.bot{background:rgba(10,22,64,.1);align-self:flex-start}
.pd-m.me{background:var(--navy);color:#fff;align-self:flex-end}
.pd-m.bot.call::before{content:"voice: ";opacity:.6}
.pd-compose{border-top:1px solid rgba(10,22,64,.2);padding:6px 10px;font:500 13px monospace;min-height:30px}
.pd-compose i{font-style:normal;animation:pdbl 1s steps(1) infinite}
@keyframes pdbl{50%{opacity:0}}
.pd-keys{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:14px}
.pd-keys button{height:42px;border:0;border-radius:10px;background:rgba(255,255,255,.14);color:#fff;font:500 17px system-ui;cursor:pointer}
.pd-keys button:hover{background:rgba(255,255,255,.24)}
.pd-keys button.ok{background:#1b7f4b;font-size:13px}
.pd-keys button:disabled{opacity:.35;cursor:default}
.pd :focus-visible{outline:3px solid #9db4ff;outline-offset:2px}
.pd-cta{display:block;margin:14px auto 0;width:300px;max-width:100%;border:0;border-radius:999px;padding:12px;font:700 15px system-ui;color:#fff;background:linear-gradient(180deg,#1b2f8f,#0a1640);box-shadow:inset 0 0 0 2px rgba(120,150,255,.55);cursor:pointer}
.pd-card{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:18px 20px;margin-bottom:16px}
.pd-card h3{font-size:16px;margin:0 0 4px}
.pd-card p.s{color:var(--slate);font-size:14px;margin:0 0 12px;line-height:1.5}
.pd-flow{display:flex;flex-direction:column;gap:8px}
.pd-node{display:flex;gap:12px;align-items:center;padding:10px 14px;border-radius:14px;border:1px solid var(--line);opacity:.55;transition:all .3s}
.pd-node.on{opacity:1;border-color:var(--blue);background:var(--peri)}
.pd-node.done{opacity:1}
.pd-node.skip{opacity:.4;border-style:dashed}
.pd-node .d{width:10px;height:10px;border-radius:50%;background:var(--line);flex:none}
.pd-node.on .d{background:var(--blue);box-shadow:0 0 0 4px rgba(59,99,245,.25)}
.pd-node.done .d{background:var(--ok)}
.pd-node b{display:block;font-size:14px}
.pd-node span{font-size:12.5px;color:var(--slate)}
.pd pre{margin:0;background:var(--navy);color:#b9c7f5;border-radius:14px;padding:12px 14px;font:400 12px/1.55 monospace;overflow-x:auto;max-width:100%}
.pd-score{display:flex;justify-content:space-between;font-size:14px;padding:5px 0;border-bottom:1px solid var(--line)}
.pd-score .p{font-family:monospace;color:var(--blue)}
.pd-tier{display:inline-block;font-weight:700;padding:3px 14px;border-radius:999px;background:var(--peri)}
.pd-tier.hi{background:var(--warnbg);color:var(--warn)}
.pd-small{font-size:13px;color:var(--slate);line-height:1.5}
@media (prefers-reduced-motion:reduce){.pd *{animation:none!important;transition:none!important}}
`;

export default function PhoneDemo({ addReport }) {
  const [mode, setMode] = useState("call");
  const [step, setStep] = useState(-1);
  const [buf, setBuf] = useState("");
  const [ans, setAns] = useState({});
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(true);
  const [logs, setLogs] = useState([]);
  const [flow, setFlow] = useState({});
  const [result, setResult] = useState(null);
  const timers = useRef([]);
  const logRef = useRef(null);

  const later = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  };
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = 1e5;
  }, [logs]);

  const addLog = (who, text) => setLogs((l) => [...l, { who, text }]);
  const say = (text) => {
    setBusy(true);
    later(() => {
      addLog("bot", text);
      setBusy(false);
    }, 450);
  };

  function reset() {
    clearTimers();
    setStep(-1);
    setBuf("");
    setAns({});
    setOver(true);
    setBusy(false);
    setLogs([]);
    setResult(null);
    setFlow({});
  }

  function begin() {
    clearTimers();
    setAns({});
    setBuf("");
    setResult(null);
    setFlow({ 0: "on" });
    setOver(false);
    setStep(0);
    setLogs([{ who: "me", text: mode === "sms" ? "HEAT" : "(dials the number)" }]);
    say(Q[0].t(mode));
  }

  function changeMode(m) {
    setMode(m);
    reset();
  }

  function submitValue(str) {
    if (over || busy || !str) return;
    const q = Q[step];
    const v = parseInt(str, 10);
    addLog("me", str);
    setBuf("");
    const bad = q.ty === "c" ? !(v >= 1 && v <= q.max) : !(v >= q.min && v <= q.max);
    if (bad) {
      say(`Sorry, that did not work. ${q.t(mode)}`);
      return;
    }
    if (q.k === "consent" && v === 2) {
      setOver(true);
      setStep(Q.length);
      say("No problem. Nothing was saved. Goodbye.");
      return;
    }
    const next = { ...ans, [q.k]: v };
    setAns(next);
    const ns = step + 1;
    setStep(ns);
    if (ns < Q.length) say(Q[ns].t(mode));
    else finish(next);
  }

  function press(d) {
    if (over || busy) return;
    const q = Q[step];
    if (mode === "call" && q.ty === "c") {
      submitValue(d);
      return;
    }
    if (buf.length < 3) setBuf(buf + d);
  }

  function finish(a) {
    setOver(true);
    setStep(Q.length);
    const t = a.temperature;
    const h = a.humidity;
    const pts = [
      [`Temperature ${t}°C`, t >= 40 ? 40 : t >= 37 ? 30 : t >= 34 ? 20 : 0],
      [`Humidity ${h}%`, h >= 70 ? 20 : h >= 55 ? 10 : 0],
      ["No drinking water", a.water === 2 ? 20 : 0],
      ["No shade or rest area", a.shade === 2 ? 15 : 0],
      ["No recent rest break", a.restBreak === 2 ? 10 : 0],
      ["Reports symptoms", a.symptoms === 1 ? 25 : 0],
    ];
    const total = pts.reduce((s, p) => s + p[1], 0);
    const lvl = total >= 75 ? "Extreme" : total >= 55 ? "High" : total >= 35 ? "Moderate" : "Low";
    const alert = total >= 55;
    const body = {
      channel: mode === "call" ? "ivr" : "sms",
      workerPhone: "(from caller ID)",
      consentConfirmed: true,
      workType: WT[a.workType],
      temperature: t,
      humidity: h,
      waterAvailable: a.water === 1,
      shadeAvailable: a.shade === 1,
      restBreakTaken: a.restBreak === 1,
      symptoms: a.symptoms === 1,
    };
    setResult({ pts, total, lvl, alert, body });

    // animate the "behind the scenes" flow
    const order = [0, 1, 2, 3, 4, 5];
    order.forEach((n, i) =>
      later(() => {
        const st = {};
        order.slice(0, i).forEach((j) => (st[j] = "done"));
        st[n] = n === 5 && !alert ? "skip" : "on";
        setFlow(st);
        if (i === order.length - 1) {
          later(() => {
            const fin = {};
            order.slice(0, 5).forEach((j) => (fin[j] = "done"));
            fin[5] = alert ? "done" : "skip";
            setFlow(fin);
          }, 500);
        }
      }, i * 550)
    );

    // send to the same dashboard as every other report
    const risk = lvl === "Extreme" || lvl === "High" ? "High" : lvl === "Moderate" ? "Medium" : "Low";
    try {
      if (addReport) {
        Promise.resolve(
          addReport({
            mode: "Worksite",
            title: `${mode === "call" ? "Call" : "SMS"} report · ${WT[a.workType]} · ${lvl} (${total})`,
            place: mode === "call" ? "Phone call line (simulated)" : "SMS line (simulated)",
            risk,
            notes: `channel=${body.channel}; score=${total}; temp=${t}C; humidity=${h}%`,
          })
        ).catch(() => {});
      }
    } catch {
      /* ignore */
    }

    const msg =
      `Your report is saved. Risk level: ${lvl}.` +
      (alert ? " Drink water, move to shade and rest now. An alert has been sent." : "");
    later(() => say(msg), 2100);
  }

  // computer keyboard works like the phone keypad
  useEffect(() => {
    const h = (e) => {
      const tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (/^[0-9]$/.test(e.key)) press(e.key);
      else if (e.key === "Enter") {
        if (tag === "BUTTON") return;
        submitValue(buf);
      } else if (e.key === "Backspace") setBuf((b) => b.slice(0, -1));
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  const startLabel =
    over && step >= Q.length ? "Run it again" : over ? (mode === "call" ? "Start the call" : 'Send "HEAT"') : "Restart";

  return (
    <div className="pd">
      <style>{CSS}</style>

      <p className="pd-note">
        A worker with a basic phone can report by calling a number or sending a text. No app, no data plan.
        Press the keys like a real phone.
      </p>
      <div className="pd-badges">
        <span className="pd-b live">Reports reach your Dashboard</span>
        <span className="pd-b sim">Simulated here: call and SMS lines</span>
      </div>

      <div className="pd-tabs" role="group" aria-label="Channel">
        <button className={mode === "call" ? "on" : ""} aria-pressed={mode === "call"} onClick={() => changeMode("call")}>Call a number</button>
        <button className={mode === "sms" ? "on" : ""} aria-pressed={mode === "sms"} onClick={() => changeMode("sms")}>Send a text</button>
      </div>

      <div className="pd-grid">
        <div>
          <div className="pd-phone">
            <div className="pd-brand">BASIC PHONE</div>
            <div className="pd-screen">
              <div className="pd-sbar">
                <span>{mode === "call" ? "Call" : "Messages"}</span>
                <span>{over ? (step >= Q.length ? "ended" : "idle") : mode === "call" ? "in call" : "chat"}</span>
              </div>
              <div className="pd-log" ref={logRef} aria-live="polite">
                {logs.map((m, i) => (
                  <div key={i} className={"pd-m " + m.who + (m.who === "bot" && mode === "call" ? " call" : "")}>
                    {m.text}
                  </div>
                ))}
              </div>
              <div className="pd-compose">
                {over ? "" : (mode === "call" ? "Keypad: " : "Message: ") + buf}
                {!over && <i>_</i>}
              </div>
            </div>
            <div className="pd-keys">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <button key={n} aria-label={String(n)} disabled={over || busy} onClick={() => press(String(n))}>{n}</button>
              ))}
              <button aria-label="Delete" disabled={over || busy} onClick={() => setBuf((b) => b.slice(0, -1))}>⌫</button>
              <button aria-label="0" disabled={over || busy} onClick={() => press("0")}>0</button>
              <button className="ok" disabled={over || busy} onClick={() => submitValue(buf)}>{mode === "call" ? "OK" : "Send"}</button>
            </div>
          </div>
          <button className="pd-cta" onClick={begin}>{startLabel}</button>
        </div>

        <div>
          <div className="pd-card">
            <h3>What happens behind the scenes</h3>
            <p className="s">Each answer you key in is collected, then sent through the same backend as the web app.</p>
            <div className="pd-flow">
              {NODES.map((n, i) => {
                const tt =
                  i === 1
                    ? mode === "call"
                      ? ["Amazon Connect", "Answers the call and runs the menu"]
                      : ["AWS End User Messaging", "Receives the text and replies"]
                    : n;
                const st = flow[i] || "";
                return (
                  <div key={i} className={"pd-node " + st}>
                    <i className="d" />
                    <div>
                      <b>{tt[0]}</b>
                      <span>{st === "skip" ? "Not triggered: risk is below High" : tt[1]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {result && (
            <div className="pd-card">
              <h3>The report</h3>
              <p className="s">
                Score {result.total} · <span className={"pd-tier" + (result.alert ? " hi" : "")}>{result.lvl}</span> ·{" "}
                {result.alert ? "alert sent to the team" : "saved, no alert needed"}
              </p>
              {result.pts.map((p, i) => (
                <div className="pd-score" key={i}>
                  <span>{p[0]}</span>
                  <span className="p">+{p[1]}</span>
                </div>
              ))}
              <pre style={{ marginTop: 12 }}>
                {JSON.stringify(result.body, null, 2) +
                  "\n// response: " +
                  JSON.stringify({ riskScore: result.total, riskLevel: result.lvl, alertSent: result.alert })}
              </pre>
            </div>
          )}

          <p className="pd-small">
            This is a simulation. A real call line needs Amazon Connect and a claimed number, and SMS needs a
            registered sender in the worker's country. The caller's number would be captured automatically from
            caller ID.
          </p>
        </div>
      </div>
    </div>
  );
}
