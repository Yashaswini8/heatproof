import { useState } from "react";

export type Role = "campus" | "worksite" | "nophone";

export type Account = {
  role: Role;
  label: string;
  icon: string;
  name: string;
  user: string;
  pass: string;
};

// Demo accounts for the prototype. Replace with real sign-in (for example Amazon Cognito) on AWS.
export const ACCOUNTS: Account[] = [
  { role: "campus", label: "Campus", icon: "🏫", name: "Campus Admin", user: "campus@heatproof.demo", pass: "Campus@123" },
  { role: "worksite", label: "Worksite", icon: "👷", name: "Site Supervisor", user: "worker@heatproof.demo", pass: "Worksite@123" },
  { role: "nophone", label: "No smartphone", icon: "📵", name: "Worker 482", user: "482", pass: "1234" },
];

export default function SignIn({
  initialRole,
  onClose,
  onSuccess,
}: {
  initialRole?: Role;
  onClose: () => void;
  onSuccess: (a: Account) => void;
}) {
  const first = ACCOUNTS.find((a) => a.role === initialRole);
  const [user, setUser] = useState(first ? first.user : "");
  const [pass, setPass] = useState(first ? first.pass : "");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const acc = ACCOUNTS.find((a) => a.user.toLowerCase() === user.trim().toLowerCase() && a.pass === pass);
    if (!acc) {
      setError("Wrong ID or password. Tap Use on one of the demo accounts below.");
      return;
    }
    setError("");
    onSuccess(acc);
  }

  const input = { width: "100%", fontSize: 16, padding: 10, borderRadius: 8, border: "1px solid #cbd5e1", marginTop: 4, marginBottom: 12 } as const;

  return (
    <div className="pg-backdrop" onClick={onClose}>
      <div
        className="pg-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Sign in"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 440, width: "92%" }}
      >
        <h2 style={{ marginTop: 0 }}>Sign in</h2>

        <form onSubmit={submit}>
          <label style={{ fontWeight: 600, fontSize: 14 }}>
            Email or Worker ID
            <input value={user} onChange={(e) => setUser(e.target.value)} style={input} autoComplete="username" />
          </label>
          <label style={{ fontWeight: 600, fontSize: 14 }}>
            Password or PIN
            <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} style={input} autoComplete="current-password" />
          </label>
          {error && <p style={{ color: "#dc2626", margin: "0 0 10px", fontSize: 14 }}>{error}</p>}
          <div className="pg-modal-actions">
            <button type="submit" className="pg-btn">Sign in</button>
            <button type="button" className="pg-btn pg-btn-ghost" onClick={onClose}>Close</button>
          </div>
        </form>

        <div style={{ marginTop: 18, borderTop: "1px solid #e2e8f0", paddingTop: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Demo accounts</div>
          {ACCOUNTS.map((a) => (
            <div
              key={a.role}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}
            >
              <span style={{ fontSize: 24 }}>{a.icon}</span>
              <div style={{ flex: 1, fontSize: 13, lineHeight: 1.4 }}>
                <b>{a.label}</b>
                <div style={{ fontFamily: "monospace" }}>{a.user} / {a.pass}</div>
              </div>
              <button
                type="button"
                className="pg-btn pg-btn-ghost"
                onClick={() => {
                  setUser(a.user);
                  setPass(a.pass);
                  setError("");
                }}
              >
                Use
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
