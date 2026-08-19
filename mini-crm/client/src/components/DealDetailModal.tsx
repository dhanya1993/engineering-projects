import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { api } from "../api/client";
import type { Activity, ActivityType, Deal } from "../types";
import { formatCurrency, formatDate, formatRelativeTime } from "../utils/format";

interface DealDetailModalProps {
  deal: Deal;
  onClose: () => void;
  onDeleted: () => void;
}

const ACTIVITY_TYPES: ActivityType[] = ["note", "call", "email", "meeting"];

const TYPE_LABEL: Record<ActivityType, string> = {
  note: "Note",
  call: "Call",
  email: "Email",
  meeting: "Meeting",
  stage_change: "Stage change"
};

function contactLabel(contactId: Deal["contactId"]) {
  if (!contactId || typeof contactId === "string") return "No contact linked";
  return `${contactId.name}${contactId.company ? ` · ${contactId.company}` : ""}`;
}

export function DealDetailModal({ deal, onClose, onDeleted }: DealDetailModalProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<ActivityType>("note");
  const [content, setContent] = useState("");

  function load() {
    setLoading(true);
    api
      .get<Activity[]>("/activities", { params: { dealId: deal._id } })
      .then((res) => setActivities(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(load, [deal._id]);

  async function handleAddActivity(e: FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    await api.post("/activities", { dealId: deal._id, contactId: deal.contactId, type, content });
    setContent("");
    load();
  }

  async function handleDelete() {
    if (!confirm("Delete this deal? This can't be undone.")) return;
    await api.delete(`/deals/${deal._id}`);
    onDeleted();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white shadow-[0_4px_24px_rgba(13,17,23,0.2)]"
      >
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-semibold text-slate-900">{deal.title}</h2>
              <p className="mt-0.5 text-sm text-slate-500">{contactLabel(deal.contactId)}</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-sm p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="mt-3 flex items-center gap-4 text-sm">
            <span className="font-display text-lg font-semibold text-brass-600">
              {formatCurrency(deal.value, deal.currency)}
            </span>
            <span className="text-slate-400">Expected close: {formatDate(deal.expectedCloseDate)}</span>
          </div>
        </div>

        <div className="px-5 py-4">
          <h3 className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Activity timeline
          </h3>

          <form onSubmit={handleAddActivity} className="mt-3 flex flex-col gap-2">
            <div className="flex gap-2">
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ActivityType)}
                className="rounded-md border border-slate-200 px-2 py-1.5 text-sm"
              >
                {ACTIVITY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {TYPE_LABEL[t]}
                  </option>
                ))}
              </select>
              <input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Log a call, email, or note…"
                className="flex-1 rounded-md border border-slate-200 px-3 py-1.5 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/30"
              />
              <button
                type="submit"
                className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
              >
                Add
              </button>
            </div>
          </form>

          <div className="mt-4 flex flex-col gap-3">
            {loading && <p className="text-sm text-slate-400">Loading timeline…</p>}
            {!loading && activities.length === 0 && (
              <p className="text-sm text-slate-400">No activity logged yet.</p>
            )}
            {activities.map((a) => (
              <div key={a._id} className="border-l-2 border-slate-100 pl-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                    {TYPE_LABEL[a.type]}
                  </span>
                  <span className="text-xs text-slate-400">{formatRelativeTime(a.createdAt)}</span>
                </div>
                <p className="mt-1 text-sm text-slate-700">{a.content}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-100 px-5 py-3.5">
          <button
            onClick={handleDelete}
            className="text-sm font-medium text-rose-600 hover:text-rose-700"
          >
            Delete deal
          </button>
        </div>
      </div>
    </div>
  );
}
