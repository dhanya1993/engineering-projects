import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { DashboardSummary } from "../types";
import { ROLE_LABELS } from "../types";

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-ink-100 bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-ink-900">{value}</p>
    </div>
  );
}

export function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<DashboardSummary>("/dashboard/summary")
      .then((res) => setSummary(res.data))
      .catch(() => setError("Couldn't load dashboard summary."));
  }, []);

  return (
    <div className="p-6">
      <h1 className="font-display text-xl font-semibold text-ink-900">
        Welcome back, {user?.name.split(" ")[0]}
      </h1>
      <p className="mt-1 text-sm text-ink-500">
        Signed in as <span className="font-medium text-ink-700">{user && ROLE_LABELS[user.role]}</span>
        {user?.region && user.region !== "ALL" ? ` · ${user.region} region` : ""}
      </p>

      {error && <p className="mt-4 text-sm text-danger-600">{error}</p>}

      {summary && (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Total users" value={summary.userCount} />
          <StatCard label="Active users" value={summary.activeUserCount} />
          <StatCard label="Open tickets" value={summary.openTickets} />
          <StatCard label="Resolved tickets" value={summary.resolvedTickets} />
        </div>
      )}

      <div className="mt-8 rounded-lg border border-dashed border-ink-200 p-5 text-sm text-ink-500">
        <p className="font-medium text-ink-700">How the RBAC in this demo works</p>
        <p className="mt-1">
          Every role sees the same dashboard shell, but the data returned by the API — and which
          nav links even appear — changes based on your permission set. Try signing in as a{" "}
          <strong>Field Agent</strong> vs. a <strong>National Manager</strong> and compare the Tickets
          and Users pages.
        </p>
      </div>
    </div>
  );
}
