import type { NewReport, Report, Status } from "./App.tsx";

// Set VITE_API_URL to your API Gateway URL (no slash at the end).
// When it is empty the app keeps working with browser storage only.
const BASE = (((import.meta as unknown as { env: Record<string, string | undefined> }).env.VITE_API_URL) ?? "").replace(/\/$/, "");

export const API_ON = BASE !== "";

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, { ...init, headers: { "Content-Type": "application/json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}

export const listReports = () => call<Report[]>("/reports");
export const createReport = (r: NewReport) => call<Report>("/reports", { method: "POST", body: JSON.stringify(r) });
export const setStatus = (id: string, status: Status) =>
  call<Report>(`/reports/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify({ status }) });
