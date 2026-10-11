import { useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { STATUSES } from "./App.tsx";
import type { Gps, NewReport, Report, Risk } from "./App.tsx";
import { LangContext, LangSwitch, useT } from "./i18n.tsx";

type Nav = { go: (p: string) => void; path: string };
type Add = { addReport: (r: NewReport) => Promise<string> };

const TEMP = 41;

const mapUrl = (g: Gps) => `https://www.google.com/maps?q=${g.lat},${g.lng}`;
const fmtGps = (g: Gps) =>
  `${Math.abs(g.lat).toFixed(5)}° ${g.lat >= 0 ? "N" : "S"}, ${Math.abs(g.lng).toFixed(5)}° ${g.lng >= 0 ? "E" : "W"}`;
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/* ---------- shared header ---------- */
function PageHeader({ go, path }: Nav) {
  const t = useT();
  const tabs: [string, string][] = [
    ["/", t("tab.home")],
    ["/campus", t("mode.campus")],
    ["/worksite", t("mode.work")],
    ["/dashboard", t("tab.dashboard")],
  ];
  return (
    <header className="pg-top">
      <button type="button" className="pg-logo" onClick={() => go("/")} aria-label="HeatProof">
        <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
          <path d="M16 2 4 6.5v8.2c0 7.2 5 12.6 12 15.3 7-2.7 12-8.1 12-15.3V6.5L16 2Z" fill="#0f5f58" />
          <path d="M16 8c3 3.4 4.6 5.7 4.6 8a4.6 4.6 0 0 1-9.2 0c0-2.3 1.6-4.6 4.6-8Z" fill="#fff" />
        </svg>
        <span>
          HeatProof<small>Beat the Heat</small>
        </span>
      </button>
      <div className="pg-top-right">
        <nav className="pg-tabs" aria-label="Pages">
          {tabs.map(([p, label]) => (
            <button
              key={p}
              type="button"
              className={"pg-tab" + (path === p ? " on" : "")}
              aria-current={path === p ? "page" : undefined}
              onClick={() => go(p)}
            >
              {label}
            </button>
          ))}
        </nav>
        <LangSwitch />
      </div>
    </header>
  );
}

function Shell({ nav, children }: { nav: Nav; children: ReactNode }) {
  return (
    <div className="pg">
      <div className="pg-card">
        <PageHeader {...nav} />
        {children}
      </div>
    </div>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <label className="pg-field">
      <span className="pg-sr">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

/* campus / worksite name + GPS */
function LocationBox(props: {
  label: string;
  placeholder: string;
  name: string;
  setName: (v: string) => void;
  gps: Gps | null;
  setGps: (g: Gps | null) => void;
}) {
  const t = useT();
  const { label, placeholder, name, setName, gps, setGps } = props;
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const locate = () => {
    if (!("geolocation" in navigator)) {
      setMsg(t("gps.unsupported"));
      return;
    }
    setBusy(true);
    setMsg("");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setGps({ lat: p.coords.latitude, lng: p.coords.longitude, acc: Math.round(p.coords.accuracy) });
        setBusy(false);
      },
      (e) => {
        setBusy(false);
        setMsg(e.code === 1 ? t("gps.denied") : t("gps.fail"));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  };

  return (
    <div className="pg-loc">
      <input className="pg-input pg-input-flat" value={name} placeholder={placeholder} aria-label={label} onChange={(e) => setName(e.target.value)} />
      <div className="pg-gps">
        <button type="button" className="pg-btn pg-btn-ghost pg-btn-sm" onClick={locate} disabled={busy}>
          📍 {busy ? t("gps.busy") : t("gps.btn")}
        </button>
        {gps && (
          <span className="pg-gps-val">
            <b>{t("gps.got")}:</b> {fmtGps(gps)}
            {gps.acc !== undefined && ` (${t("gps.acc")} ±${gps.acc} m)`}{" "}
            <a href={mapUrl(gps)} target="_blank" rel="noopener noreferrer">{t("gps.map")}</a>{" "}
            <button type="button" className="pg-link" onClick={() => setGps(null)}>{t("gps.clear")}</button>
          </span>
        )}
      </div>
      {msg && <p className="pg-error" role="alert">{msg}</p>}
    </div>
  );
}

function Success({ id, go, again, text }: { id: string; go: (p: string) => void; again: () => void; text: string }) {
  const t = useT();
  return (
    <div className="pg-success" role="status">
      <div className="pg-success-tick">✓</div>
      <h1>{t("ok.title")}</h1>
      <p>
        {text} {t("ok.id")} <b>{id}</b>.
      </p>
      <div className="pg-actions">
        <button type="button" className="pg-btn" onClick={() => go("/dashboard")}>{t("ok.dash")}</button>
        <button type="button" className="pg-btn pg-btn-ghost" onClick={again}>{t("ok.again")}</button>
        <button type="button" className="pg-btn pg-btn-ghost" onClick={() => go("/")}>{t("ok.home")}</button>
      </div>
    </div>
  );
}

/* ---------- Campus Mode ---------- */
const ISSUES = [
  { id: "nowater", icon: "💧" },
  { id: "cooler", icon: "🚰" },
  { id: "fan", icon: "🌀" },
  { id: "hot", icon: "🌡️" },
  { id: "flood", icon: "🌊" },
  { id: "other", icon: "＋" },
];

const AREAS = [
  { name: "Classroom", icon: "🏫" },
  { name: "Library", icon: "📚" },
  { name: "Laboratory", icon: "🔬" },
  { name: "Washroom", icon: "🚻" },
  { name: "Ground", icon: "⚽" },
  { name: "Canteen", icon: "🍽️" },
  { name: "Hostel", icon: "🛏️" },
  { name: "Auditorium", icon: "🎤" },
];

export function Campus({ go, path, addReport }: Nav & Add) {
  const t = useT();
  const [campusName, setCampusName] = useState("");
  const [gps, setGps] = useState<Gps | null>(null);
  const [block, setBlock] = useState("Main Block");
  const [floor, setFloor] = useState("Floor 3");
  const [area, setArea] = useState("Classroom");
  const [roomNo, setRoomNo] = useState("304");
  const [issueId, setIssueId] = useState("cooler");
  const [custom, setCustom] = useState("");
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState("");
  const [error, setError] = useState("");
  const [doneId, setDoneId] = useState("");
  const [sending, setSending] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => { if (photo) URL.revokeObjectURL(photo); }, [photo]);

  const pick = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError(t("err.image"));
    if (file.size > 10 * 1024 * 1024) return setError(t("err.size"));
    setError("");
    setPhoto(URL.createObjectURL(file));
  };

  const submit = async () => {
    if (!campusName.trim()) return setError(t("err.campus"));
    if (issueId === "other" && !custom.trim()) return setError(t("err.other"));
    const name = issueId === "other" ? custom.trim() : t("i." + issueId);
    const areaName = t("a." + area);
    const where = roomNo.trim() ? `${areaName} ${roomNo.trim()}` : areaName;
    const risk: Risk = TEMP >= 40 && ["nowater", "cooler", "hot"].includes(issueId) ? "High" : "Medium";
    setError("");
    setSending(true);
    try {
      setDoneId(await addReport({
        mode: "Campus",
        title: `${name} · ${where}`,
        place: `${campusName.trim()}, ${block}, ${floor}`,
        risk,
        notes: notes.trim() || undefined,
        gps: gps ?? undefined,
      }));
    } catch {
      setError(t("err.send"));
    } finally {
      setSending(false);
    }
  };

  const again = () => {
    setDoneId("");
    setPhoto("");
    setCustom("");
    setNotes("");
    setIssueId("cooler");
  };

  const nav = { go, path };
  if (doneId) {
    return (
      <Shell nav={nav}>
        <Success id={doneId} go={go} again={again} text={t("ok.maint")} />
      </Shell>
    );
  }

  return (
    <Shell nav={nav}>
      <h1>{t("mode.campus")}</h1>
      <p className="pg-sub">{t("campus.sub")}</p>
      <ol className="pg-steps">
        <li className="done">✓ {t("step.fill")}</li>
        <li className="on">{t("step.proof")}</li>
        <li>{t("step.submit")}</li>
      </ol>

      <div className="pg-cols">
        <div>
          <h2>{t("campus.name.label")} · {t("gps.label")}</h2>
          <LocationBox label={t("campus.name.label")} placeholder={t("campus.name.ph")} name={campusName} setName={setCampusName} gps={gps} setGps={setGps} />

          <h2>{t("where.title")}</h2>
          <div className="pg-grid3">
            <Select label="Block" value={block} onChange={setBlock} options={["Main Block", "Science Block", "Library Block", "Hostel Block", "Sports Complex", "Admin Block"]} />
            <Select label="Floor" value={floor} onChange={setFloor} options={["Ground floor", "Floor 1", "Floor 2", "Floor 3", "Floor 4", "Terrace"]} />
            <input className="pg-input pg-input-flat" placeholder={t("room.ph")} value={roomNo} onChange={(e) => setRoomNo(e.target.value)} aria-label={t("room.ph")} />
          </div>

          <h2>{t("area.title")}</h2>
          <div className="pg-areas" role="radiogroup" aria-label={t("area.title")}>
            {AREAS.map((a) => (
              <button
                key={a.name}
                type="button"
                role="radio"
                aria-checked={area === a.name}
                className={"pg-area" + (area === a.name ? " on" : "")}
                onClick={() => setArea(a.name)}
              >
                <span aria-hidden="true">{a.icon}</span>
                {t("a." + a.name)}
              </button>
            ))}
          </div>

          <h2>{t("issue.title")}</h2>
          <div className="pg-issues" role="radiogroup" aria-label={t("issue.title")}>
            {ISSUES.map((i) => (
              <button
                key={i.id}
                type="button"
                role="radio"
                aria-checked={issueId === i.id}
                className={"pg-issue" + (issueId === i.id ? " on" : "")}
                onClick={() => setIssueId(i.id)}
              >
                <i>{i.icon}</i>
                {t("i." + i.id)}
                <small>{t("i." + i.id + ".n")}</small>
              </button>
            ))}
          </div>
          {issueId === "other" && (
            <input className="pg-input" placeholder={t("issue.describe")} value={custom} onChange={(e) => setCustom(e.target.value)} aria-label={t("issue.describe")} />
          )}

          <h2>{t("notes.title")}</h2>
          <textarea
            className="pg-textarea"
            placeholder={t("notes.ph.campus")}
            value={notes}
            maxLength={300}
            onChange={(e) => setNotes(e.target.value)}
            aria-label={t("notes.title")}
          />
          <div className="pg-count">{notes.length}/300</div>
        </div>

        <div>
          <h2>{t("photo.title")}</h2>
          <div
            className="pg-drop"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              pick(e.dataTransfer.files[0]);
            }}
          >
            {photo ? (
              <>
                <img src={photo} alt="" />
                <button type="button" className="pg-link" onClick={() => setPhoto("")}>{t("photo.remove")}</button>
              </>
            ) : (
              <>
                <span aria-hidden="true" className="pg-drop-ico">📤</span>
                <p>
                  {t("photo.drop")}{" "}
                  <button type="button" className="pg-link" onClick={() => fileRef.current?.click()}>{t("photo.browse")}</button>
                </p>
                <small>{t("photo.hint")}</small>
              </>
            )}
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
          </div>

          <div className="pg-next pg-next-row">
            <h3>{t("next.title")}</h3>
            <ul>
              {["s.Reported", "next.assigned", "s.Fixed", "s.Verified"].map((k, n) => (
                <li key={k}><span className="pg-dot">{n + 1}</span>{t(k)}</li>
              ))}
            </ul>
          </div>

          {error && <p className="pg-error" role="alert">{error}</p>}

          <div className="pg-alert">
            <div className="pg-risk">{t("alert.high")} · {TEMP}°C {t("alert.today")}</div>
            <div className="pg-tip">{t("alert.tip")}</div>
          </div>
          <button type="button" className="pg-cta" onClick={submit} disabled={sending}>{sending ? t("cta.sending") : t("cta.submit")}</button>
          <div className="pg-foot">{t("foot")}</div>
        </div>
      </div>
    </Shell>
  );
}

/* ---------- Worksite Mode ---------- */
type Q = { id: string; good: boolean };
const QUESTIONS: Q[] = [
  { id: "water", good: true },
  { id: "shade", good: true },
  { id: "break", good: true },
  { id: "stress", good: false },
  { id: "aid", good: true },
];

export function Worksite({ go, path, addReport, reports }: Nav & Add & { reports: Report[] }) {
  const t = useT();
  const [siteName, setSiteName] = useState("");
  const [gps, setGps] = useState<Gps | null>(null);
  const [type, setType] = useState("Construction Site");
  const [region, setRegion] = useState("Delhi NCR");
  const [site, setSite] = useState("Site · A12");
  const [ans, setAns] = useState<Record<string, boolean>>({ water: true, shade: false, break: true, stress: false, aid: true });
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [doneId, setDoneId] = useState("");
  const [sending, setSending] = useState(false);

  const problems = QUESTIONS.filter((q) => ans[q.id] !== q.good);
  const risk: Risk = ans.stress || !ans.water ? "High" : problems.length ? "Medium" : "Low";

  const message = problems.length === 0
    ? t("msg.clear")
    : cap(`${problems.map((q) => t("p." + q.id)).join(", ")} ${t("msg.tail")}`);

  const submit = async () => {
    if (!siteName.trim()) return setError(t("err.work"));
    setError("");
    const title = problems.length
      ? `${cap(t("p." + problems[0].id))}${problems.length > 1 ? ` +${problems.length - 1}` : ""} · ${site}`
      : `${t("risk.clear")} · ${site}`;
    setSending(true);
    try {
      setDoneId(await addReport({
        mode: "Worksite",
        title,
        place: `${siteName.trim()}, ${type}, ${region}`,
        risk,
        notes: notes.trim() || undefined,
        gps: gps ?? undefined,
      }));
    } catch {
      setError(t("err.send"));
    } finally {
      setSending(false);
    }
  };

  const nav = { go, path };
  if (doneId) {
    return (
      <Shell nav={nav}>
        <Success id={doneId} go={go} again={() => { setDoneId(""); setNotes(""); }} text={problems.length ? t("ok.super") : t("ok.daily")} />
      </Shell>
    );
  }

  const latest = reports.find((r) => r.mode === "Worksite");
  const stage = latest ? STATUSES.indexOf(latest.status) : 0;

  return (
    <Shell nav={nav}>
      <h1>{t("mode.work")}</h1>
      <p className="pg-sub">{t("work.sub")}</p>

      <h2>{t("work.name.label")} · {t("gps.label")}</h2>
      <LocationBox label={t("work.name.label")} placeholder={t("work.name.ph")} name={siteName} setName={setSiteName} gps={gps} setGps={setGps} />

      <h2>{t("work.type")}</h2>
      <Select label={t("work.type")} value={type} onChange={setType} options={["Construction Site", "Factory", "Road Work", "Farm", "Mine"]} />

      <h2>{t("work.loc")}</h2>
      <div className="pg-grid3">
        <Select label="Country" value="India" onChange={() => {}} options={["India"]} />
        <Select label="Region" value={region} onChange={setRegion} options={["Delhi NCR", "Mumbai", "Chennai", "Hyderabad", "Kolkata", "Bengaluru", "Pune"]} />
        <Select label="Site" value={site} onChange={setSite} options={["Site · A12", "Site · B07", "Site · C03"]} />
      </div>

      <h2>{t("work.check")}</h2>
      <div className="pg-two pg-two-w">
        <div>
          {QUESTIONS.map((q) => (
            <div className="pg-check" key={q.id}>
              <span>{t("q." + q.id)}</span>
              <span className="pg-toggle" role="group" aria-label={t("q." + q.id)}>
                <button type="button" className={!ans[q.id] ? (q.good ? "bad" : "ok") : ""} aria-pressed={!ans[q.id]} onClick={() => setAns({ ...ans, [q.id]: false })}>{t("no")}</button>
                <button type="button" className={ans[q.id] ? (q.good ? "ok" : "bad") : ""} aria-pressed={ans[q.id]} onClick={() => setAns({ ...ans, [q.id]: true })}>{t("yes")}</button>
              </span>
            </div>
          ))}
          <div className="pg-temp"><b>{TEMP}°C</b><small>{t("case.heat")}</small></div>
        </div>
        <aside className="pg-dash">
          <h3>{t("dash.card")}</h3>
          <div className="pg-who"><span className="pg-av">RS</span><span><b>Rahul Sharma</b><br />{t("work.role")}</span></div>
          <div className="pg-mini" aria-hidden="true" />
          <ol className="pg-tl">
            {STATUSES.map((s, i) => (
              <li key={s} className={i <= stage ? "on" : ""}>{t("s." + s)}</li>
            ))}
          </ol>
          <button type="button" className="pg-link" onClick={() => go("/dashboard")}>{t("dash.open")}</button>
        </aside>
      </div>

      <h2>{t("notes.title")}</h2>
      <textarea
        className="pg-textarea"
        placeholder={t("notes.ph.work")}
        value={notes}
        maxLength={300}
        onChange={(e) => setNotes(e.target.value)}
        aria-label={t("notes.title")}
      />
      <div className="pg-count">{notes.length}/300</div>

      <div className={"pg-hr" + (problems.length ? "" : " clear")} role="status">
        <b>{problems.length ? (risk === "High" ? t("risk.high") : t("risk.attn")) : t("risk.clear")}</b>
        {message}
      </div>
      {error && <p className="pg-error" role="alert">{error}</p>}
      <button type="button" className={"pg-cta" + (problems.length ? " red" : "")} onClick={submit} disabled={sending}>
        {sending ? t("cta.sending") : problems.length ? t("cta.urgent") : t("cta.daily")}
      </button>
      <div className="pg-foot">{t("foot")}</div>
    </Shell>
  );
}

/* ---------- Dashboard ---------- */
export function Dashboard({ go, path, reports, advance, reset, apiError }: Nav & { reports: Report[]; advance: (id: string) => void; reset?: () => void; apiError?: boolean }) {
  const t = useT();
  const { lang } = useContext(LangContext);
  const [filter, setFilter] = useState<"All" | "Campus" | "Worksite">("All");
  const shown = reports.filter((r) => filter === "All" || r.mode === filter);
  const count = (s: string) => reports.filter((r) => r.status === s).length;
  const when = (r: Report) => {
    if (!r.createdAt) {
      const v = t("time:" + r.time);
      return v.startsWith("time:") ? r.time : v;
    }
    const mins = Math.round((Date.now() - new Date(r.createdAt).getTime()) / 60000);
    if (mins < 1) return t("time:Just now");
    const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
    if (mins < 60) return rtf.format(-mins, "minute");
    if (mins < 1440) return rtf.format(-Math.round(mins / 60), "hour");
    return rtf.format(-Math.round(mins / 1440), "day");
  };
  const filterLabel = { All: t("f.all"), Campus: t("f.campus"), Worksite: t("f.work") };

  return (
    <Shell nav={{ go, path }}>
      <h1>{t("dash.title")}</h1>
      <p className="pg-sub">{t("dash.sub")}</p>

      <div className="pg-stats">
        <div><b>{reports.length}</b><small>{t("stat.total")}</small></div>
        <div><b>{count("Reported") + count("Assigned")}</b><small>{t("stat.open")}</small></div>
        <div><b>{count("Fixed")}</b><small>{t("stat.fixed")}</small></div>
        <div><b>{count("Verified")}</b><small>{t("stat.ver")}</small></div>
      </div>

      <div className="pg-filters" role="group" aria-label={t("tab.dashboard")}>
        {(["All", "Campus", "Worksite"] as const).map((f) => (
          <button key={f} type="button" className={"pg-tab" + (filter === f ? " on" : "")} aria-pressed={filter === f} onClick={() => setFilter(f)}>{filterLabel[f]}</button>
        ))}
      </div>

      {apiError && <p className="pg-error" role="alert">{t("dash.loaderr")}</p>}
      {shown.length === 0 && !apiError && <p className="pg-sub">{t("dash.empty")}</p>}
      <ul className="pg-list">
        {shown.map((r) => (
          <li key={r.id}>
            <div>
              <b>{r.title}</b>
              <small>{r.id} · {r.mode === "Campus" ? t("f.campus") : t("f.work")} · {r.place} · {when(r)}</small>
              {r.gps && (
                <small>
                  📍 {fmtGps(r.gps)} ·{" "}
                  <a href={mapUrl(r.gps)} target="_blank" rel="noopener noreferrer">{t("dash.viewmap")}</a>
                </small>
              )}
              {r.notes && <small className="pg-note">{t("dash.note")} {r.notes}</small>}
            </div>
            <span className={"pg-badge " + r.risk.toLowerCase()}>{t("r." + r.risk)}</span>
            <span className="pg-status">{t("s." + r.status)}</span>
            {r.status === "Verified" ? (
              <span className="pg-done">{t("dash.done")}</span>
            ) : (
              <button type="button" className="pg-btn pg-btn-sm" onClick={() => advance(r.id)}>
                {t("dash.mark")} {t("s." + STATUSES[STATUSES.indexOf(r.status) + 1])}
              </button>
            )}
          </li>
        ))}
      </ul>

      <div className="pg-actions">
        <button type="button" className="pg-btn" onClick={() => go("/campus")}>{t("dash.rc")}</button>
        <button type="button" className="pg-btn pg-btn-ghost" onClick={() => go("/worksite")}>{t("dash.rw")}</button>
        {reset && <button type="button" className="pg-btn pg-btn-ghost" onClick={reset}>{t("dash.reset")}</button>}
      </div>
    </Shell>
  );
}
