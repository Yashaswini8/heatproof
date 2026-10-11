import { useEffect, useState } from "react";
import Lib from "./lib.tsx";
import { Campus, Worksite, Dashboard } from "./Pages.tsx";
import Kiosk from "./Kiosk.tsx";
import SignIn from "./SignIn.tsx";
import type { Account, Role } from "./SignIn.tsx";
import { LangContext, LangSwitch } from "./i18n.tsx";
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
const USER_KEY = "heatproof-user";

/* ---------- access control (demo only) ---------- */

type Session = { role: Role; name: string; label: string };

// Which account each page needs. "any" means any signed-in account.
const REQUIRED: Record<string, Role | "any"> = {
  "/campus": "campus",
  "/worksite": "worksite",
  "/kiosk": "nophone",
  "/dashboard": "any",
};
const ROLE_HOME: Record<Role, string> = { campus: "/campus", worksite: "/worksite", nophone: "/kiosk" };
const ROLE_NAME: Record<Role, string> = { campus: "Campus", worksite: "Worksite", nophone: "No smartphone" };

function loadUser(): Session | null {
  try {
    const raw = sessionStorage.getItem(USER_KEY);
    if (raw) return JSON.parse(raw) as Session;
  } catch {
    /* ignore */
  }
  return null;
}

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
  const [path, setPath] = useState<string>(readPath());
  const [reports, setReports] = useState<Report[]>(API_ON ? [] : loadReports);
  const [apiError, setApiError] = useState(false);
  const [signIn, setSignIn] = useState(false);
  const [signInRole, setSignInRole] = useState<Role | undefined>(undefined);
  const [user, setUser] = useState<Session | null>(loadUser);

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

  const openSignIn = (role?: Role) => {
    setSignInRole(role);
    setSignIn(true);
  };

  const onSignedIn = (acc: Account) => {
    const session: Session = { role: acc.role, name: acc.name, label: acc.label };
    setUser(session);
    try {
      sessionStorage.setItem(USER_KEY, JSON.stringify(session));
    } catch {
      /* ignore */
    }
    setSignIn(false);
    // stay on the page they wanted if this account may open it, otherwise go to their own mode
    const need = REQUIRED[path];
    go(need === "any" || need === acc.role ? path : ROLE_HOME[acc.role]);
  };

  const signOut = () => {
    setUser(null);
    try {
      sessionStorage.removeItem(USER_KEY);
    } catch {
      /* ignore */
    }
    go("/");
  };

  const addReport = async (r: NewReport): Promise<string> => {
    if (API_ON) {
      const saved = await createReport(r);
      setReports((prev) => [{ ...saved, time: "Just now" }, ...prev]);
      return saved.id;
    }
    // functional update so two quick reports never overwrite each other
    let id = "";
    setReports((prev) => {
      const max = prev.reduce((m, x) => Math.max(m, Number(x.id.replace("HP-", "")) || 0), 0);
      id = "HP-" + String(max + 1).padStart(4, "0");
      return [{ ...r, id, status: "Reported", time: "Just now" }, ...prev];
    });
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

  /* ---------- pick the page ---------- */

  const need = REQUIRED[path];
  const blocked = !!need && !(user && (need === "any" || user.role === need));

  let page;
  if (blocked) {
    const wanted = need === "any" ? "the dashboard" : `${ROLE_NAME[need as Role]} mode`;
    page = (
      <div style={{ maxWidth: 420, margin: "80px auto", padding: 24, textAlign: "center", fontFamily: "sans-serif" }}>
        <div style={{ fontSize: 48 }}>🔒</div>
        <h2>{user ? "This account cannot open this page" : "Sign in to continue"}</h2>
        <p style={{ color: "#475569" }}>
          {user
            ? `You are signed in as ${user.label}. Sign out and use the ${ROLE_NAME[need as Role] ?? "right"} account to open ${wanted}.`
            : `You need an account to open ${wanted}. Use the demo credentials in the sign-in box.`}
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          {user ? (
            <button type="button" className="pg-btn" onClick={signOut}>Sign out</button>
          ) : (
            <button type="button" className="pg-btn" onClick={() => openSignIn(need === "any" ? undefined : (need as Role))}>Sign in</button>
          )}
          <button type="button" className="pg-btn pg-btn-ghost" onClick={() => go("/")}>Back to home</button>
        </div>
      </div>
    );
  } else if (path === "/campus") page = <Campus go={go} path={path} addReport={addReport} />;
  else if (path === "/worksite") page = <Worksite go={go} path={path} addReport={addReport} reports={reports} />;
  else if (path === "/dashboard") page = <Dashboard go={go} path={path} reports={reports} advance={advance} reset={API_ON ? undefined : reset} apiError={apiError} />;
  else if (path === "/kiosk") page = <Kiosk go={go} addReport={addReport} />;
  else
    page = (
      <Lib
        onReport={() => go("/campus")}
        onDashboard={() => go("/dashboard")}
        onCampus={() => go("/campus")}
        onWorksite={() => go("/worksite")}
        onKiosk={() => go("/kiosk")}
        onSignIn={() => openSignIn()}
        languageSwitcher={<LangSwitch />}
      />
    );

  return (
    <>
      {page}

      {user && (
        <div
          style={{
            position: "fixed", left: 12, bottom: 12, zIndex: 40, display: "flex", alignItems: "center", gap: 10,
            background: "#0f172a", color: "#fff", padding: "8px 14px", borderRadius: 999, fontSize: 14,
            boxShadow: "0 8px 24px rgba(0,0,0,.25)",
          }}
        >
          <span>👤 {user.name} · {user.label}</span>
          <button
            type="button"
            onClick={signOut}
            style={{ background: "transparent", border: "1px solid #64748b", color: "#fff", borderRadius: 999, padding: "4px 12px", cursor: "pointer" }}
          >
            Sign out
          </button>
        </div>
      )}

      {signIn && <SignIn initialRole={signInRole} onClose={() => setSignIn(false)} onSuccess={onSignedIn} />}
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
