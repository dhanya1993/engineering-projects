import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { DashboardSummary } from "../types";
import { formatCurrency } from "../utils/format";

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p
        className={`mt-1 font-display text-2xl font-semibold ${
          accent ? "text-brass-600" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export function DashboardPage() {
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
      <h1 className="font-display text-xl font-semibold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">Your pipeline and follow-ups at a glance.</p>

      {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}

      {summary && (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard label="Open pipeline" value={formatCurrency(summary.openPipelineValue)} accent />
            <StatCard label="Open deals" value={String(summary.openDealCount)} />
            <StatCard label="Won this period" value={formatCurrency(summary.wonValue)} />
            <StatCard label="Contacts" value={String(summary.contactCount)} />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div
              className={`rounded-lg border p-5 ${
                summary.overdueTasks > 0 ? "border-rose-200 bg-rose-100/40" : "border-slate-100 bg-white"
              }`}
            >
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Overdue tasks
              </p>
              <p
                className={`mt-1 font-display text-2xl font-semibold ${
                  summary.overdueTasks > 0 ? "text-rose-600" : "text-slate-900"
                }`}
              >
                {summary.overdueTasks}
              </p>
            </div>
            <StatCard label="Due today" value={String(summary.tasksDueToday)} />
          </div>
        </>
      )}
    </div>
  );
}
