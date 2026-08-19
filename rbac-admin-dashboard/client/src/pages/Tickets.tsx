import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import { RoleGate } from "../components/RoleGate";
import type { Ticket } from "../types";

const STATUS_STYLES: Record<Ticket["status"], string> = {
  open: "bg-danger-100 text-danger-600",
  in_progress: "bg-signal-100 text-signal-600",
  resolved: "bg-ink-100 text-ink-700"
};

function personLabel(value: Ticket["assignedTo"]) {
  if (!value) return "Unassigned";
  if (typeof value === "string") return value;
  return value.name;
}

export function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function load() {
    setLoading(true);
    api
      .get<Ticket[]>("/tickets")
      .then((res) => setTickets(res.data))
      .catch(() => setError("Couldn't load tickets."))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await api.post("/tickets", { title, description });
    setTitle("");
    setDescription("");
    setShowForm(false);
    load();
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold text-ink-900">Tickets</h1>
          <p className="mt-1 text-sm text-ink-500">
            Scoped to what your role can see — field agents see only tickets assigned to them.
          </p>
        </div>
        <RoleGate permission="manage_tickets">
          <button
            onClick={() => setShowForm((s) => !s)}
            className="rounded-md bg-ink-800 px-4 py-2 text-sm font-medium text-white hover:bg-ink-700"
          >
            {showForm ? "Cancel" : "New ticket"}
          </button>
        </RoleGate>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mt-4 flex flex-col gap-3 rounded-lg border border-ink-100 bg-white p-4"
        >
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ticket title"
            className="rounded-md border border-ink-200 px-3 py-2 text-sm focus:border-ink-500 focus:outline-none focus:ring-2 focus:ring-ink-500/30"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={2}
            className="rounded-md border border-ink-200 px-3 py-2 text-sm focus:border-ink-500 focus:outline-none focus:ring-2 focus:ring-ink-500/30"
          />
          <button
            type="submit"
            className="w-fit rounded-md bg-ink-800 px-4 py-2 text-sm font-medium text-white hover:bg-ink-700"
          >
            Create ticket
          </button>
        </form>
      )}

      {error && <p className="mt-4 text-sm text-danger-600">{error}</p>}
      {loading && <p className="mt-4 text-sm text-ink-400">Loading tickets…</p>}

      {!loading && tickets.length === 0 && !error && (
        <p className="mt-6 text-sm text-ink-500">No tickets to show for your role.</p>
      )}

      <div className="mt-4 flex flex-col gap-2">
        {tickets.map((t) => (
          <div key={t._id} className="rounded-lg border border-ink-100 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-ink-900">{t.title}</p>
                {t.description && <p className="mt-0.5 text-sm text-ink-500">{t.description}</p>}
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[t.status]}`}
              >
                {t.status.replace("_", " ")}
              </span>
            </div>
            <p className="mt-2 text-xs text-ink-400">
              {t.region ?? "No region"} · Assigned to {personLabel(t.assignedTo)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
