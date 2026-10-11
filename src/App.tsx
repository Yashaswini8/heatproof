import { useEffect, useState } from "react";
import Lib from "./lib.tsx";
import { Campus, Worksite, Dashboard } from "./Pages.tsx";
import { LangContext, LangSwitch, useT } from "./i18n.tsx";
import type { Lang } from "./i18n.tsx";
import { API_ON, createReport, listReports, setStatus } from "./api.ts";

export type Status = "Reported" | "Assigned" | "Fixed" | "Verified";
export type Risk = "High" | "Medium" | "Low";
export type Gps = { lat: number; lng: number; acc?: number };
export type Report = {
  id: string;
  mode: "Campus" | "Worksite";
  title: string;
  place: string;
  risk: Risk;
  status: Status;
  time: string;
  createdAt?: string;
  notes?: string;
  gps?: Gps;
};
export type NewReport = Pick<Report, "mode" | "title" | "place" | "risk"> & { notes?: string; gps?: Gps };

export const STATUSES: Status[] = ["Reported", "Assigned", "Fixed", "Verified"];

const SEED: Report[] = [
  { id: "HP-0001", mode: "Campus", title: "Water cooler not working · Room 304", place: "Main Block, Floor 3", risk: "High", status: "Assigned", time: "2 min ago" },
  { id: "HP-0002", mode: "Worksite", title: "No shade at rest area · Site A12", place: "Delhi NCR", risk: "High", status: "Reported", time: "18 min ago" },
  { id: "HP-0003", mode: "Campus", title: "Fan not working · Room 112", place: "Science Block, Floor 1", risk: "Medium", status: "Fixed", time: "1 h ago" },
];

const KEY = "heatproof-reports";
const LANG_KEY = "heatproof-lang";

function loadReports(): Report[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Report[];
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch {
    /* storage can be blocked, fall back to demo data */
  }
  return SEED;
}

function loadLang(): Lang {
  try {
    const v = localStorage.getItem(LANG_KEY);
    if (v === "en" || v === "hi" || v === "ta") return v;
  } catch {
    /* ignore */
  }
  return "en";
}

function readPath(): string {
  const p = window.location.hash.replace(/^#/, "");
  return p === "" ? "/" : p;
}

function Router() {
  const t = useT();
  const [path, setPath] = useState<string>(readPath());
  const [reports, setReports] = useState<Report[]>(API_ON ? [] : loadReports);
  const [apiError, setApiError] = useState(false);
  const [signIn, setSignIn] = useState(false);

  const refresh = () =>
    listReports()
      .then((list) => {
        setReports(list.map((r) => ({ ...r, time: r.time || "Just now" })));
        setApiError(false);
      })
      .catch(() => setApiError(true));

  // With AWS connected: load from the cloud and refresh every 15 seconds
  useEffect(() => {
    if (!API_ON) return;
    refresh();
    const timer = window.setInterval(refresh, 15000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const onHash = () => {
      setPath(readPath());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (API_ON) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(reports));
    } catch {
      /* ignore */
    }
  }, [reports]);

  useEffect(() => {
    if (!signIn) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSignIn(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [signIn]);

  const go = (p: string) => {
    window.location.hash = p;
  };

  const addReport = async (r: NewReport): Promise<string> => {
    if (API_ON) {
      const saved = await createReport(r);
      setReports((prev) => [{ ...saved, time: "Just now" }, ...prev]);
      return saved.id;
    }
    const max = reports.reduce((m, x) => Math.max(m, Number(x.id.replace("HP-", "")) || 0), 0);
    const id = "HP-" + String(max + 1).padStart(4, "0");
    setReports([{ ...r, id, status: "Reported", time: "Just now" }, ...reports]);
    return id;
  };

  const advance = (id: string) => {
    const current = reports.find((r) => r.id === id);
    if (!current) return;
    const i = STATUSES.indexOf(current.status);
    if (i >= STATUSES.length - 1) return;
    const next = STATUSES[i + 1];
    setReports(reports.map((r) => (r.id === id ? { ...r, status: next } : r)));
    if (API_ON) setStatus(id, next).catch(() => refresh());
  };

  const reset = () => setReports(SEED);

  let page;
  if (path === "/campus") page = <Campus go={go} path={path} addReport={addReport} />;
  else if (path === "/worksite") page = <Worksite go={go} path={path} addReport={addReport} reports={reports} />;
  else if (path === "/dashboard") page = <Dashboard go={go} path={path} reports={reports} advance={advance} reset={API_ON ? undefined : reset} apiError={apiError} />;
  else
    page = (
      <Lib
        onReport={() => go("/campus")}
        onDashboard={() => go("/dashboard")}
        onCampus={() => go("/campus")}
        onWorksite={() => go("/worksite")}
        onSignIn={() => setSignIn(true)}
        languageSwitcher={<LangSwitch />}
      />
    );

  return (
    <>
      {page}
      {signIn && (
        <div className="pg-backdrop" onClick={() => setSignIn(false)}>
          <div className="pg-modal" role="dialog" aria-modal="true" aria-label={t("modal.title")} onClick={(e) => e.stopPropagation()}>
            <h2>{t("modal.title")}</h2>
            <p>{t("modal.text")}</p>
            <div className="pg-modal-actions">
              <button type="button" className="pg-btn" onClick={() => { setSignIn(false); go("/campus"); }}>{t("btn.report")}</button>
              <button type="button" className="pg-btn pg-btn-ghost" onClick={() => setSignIn(false)}>{t("modal.close")}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function App() {
  const [lang, setLangState] = useState<Lang>(loadLang);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <Router />
    </LangContext.Provider>
  );
}
