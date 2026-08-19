import { useEffect, useState } from "react";
import type { DragEvent, FormEvent } from "react";
import { api } from "../api/client";
import { DealCard } from "../components/DealCard";
import { DealDetailModal } from "../components/DealDetailModal";
import type { Deal, DealStage } from "../types";
import { DEAL_STAGES, STAGE_LABELS } from "../types";
import { formatCurrency } from "../utils/format";

export function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<DealStage | null>(null);

  function load() {
    setLoading(true);
    api
      .get<Deal[]>("/deals")
      .then((res) => setDeals(res.data))
      .catch(() => setError("Couldn't load deals."))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    await api.post("/deals", { title, value: Number(value) || 0 });
    setTitle("");
    setValue("");
    setShowForm(false);
    load();
  }

  function handleDragStart(e: DragEvent, dealId: string) {
    setDraggingId(dealId);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: DragEvent, stage: DealStage) {
    e.preventDefault();
    setDragOverStage(stage);
  }

  async function handleDrop(stage: DealStage) {
    setDragOverStage(null);
    if (!draggingId) return;

    const dealsInStage = deals.filter((d) => d.stage === stage && d._id !== draggingId);
    const newPosition = dealsInStage.length;

    // Optimistic update so the card moves instantly instead of waiting on the round-trip.
    setDeals((prev) =>
      prev.map((d) => (d._id === draggingId ? { ...d, stage, position: newPosition } : d))
    );
    setDraggingId(null);

    try {
      await api.patch(`/deals/${draggingId}`, { stage, position: newPosition });
    } catch {
      setError("Couldn't move the deal — refreshing.");
      load();
    }
  }

  const stageTotal = (stage: DealStage) =>
    deals.filter((d) => d.stage === stage).reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex h-screen flex-col p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold text-slate-900">Deals</h1>
          <p className="mt-1 text-sm text-slate-500">Drag a card between stages to update it.</p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          {showForm ? "Cancel" : "New deal"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mt-4 flex items-end gap-3 rounded-lg border border-slate-100 bg-white p-4"
        >
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-slate-500">Title</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Acme Corp — Annual plan"
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/30"
            />
          </div>
          <div className="w-32">
            <label className="mb-1 block text-xs font-medium text-slate-500">Value (USD)</label>
            <input
              type="number"
              min={0}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/30"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Create
          </button>
        </form>
      )}

      {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
      {loading && <p className="mt-3 text-sm text-slate-400">Loading deals…</p>}

      <div className="mt-5 flex flex-1 gap-4 overflow-x-auto pb-4">
        {DEAL_STAGES.map((stage) => (
          <div
            key={stage}
            onDragOver={(e) => handleDragOver(e, stage)}
            onDragLeave={() => setDragOverStage(null)}
            onDrop={() => handleDrop(stage)}
            className={[
              "flex w-64 shrink-0 flex-col rounded-lg border p-3 transition-colors",
              dragOverStage === stage ? "border-brass-400 bg-brass-100/40" : "border-slate-100 bg-slate-100/50"
            ].join(" ")}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <p className="text-sm font-semibold text-slate-700">{STAGE_LABELS[stage]}</p>
              <p className="text-xs text-slate-400">{formatCurrency(stageTotal(stage))}</p>
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto">
              {deals
                .filter((d) => d.stage === stage)
                .sort((a, b) => a.position - b.position)
                .map((deal) => (
                  <DealCard
                    key={deal._id}
                    deal={deal}
                    onDragStart={handleDragStart}
                    onClick={() => setSelectedDeal(deal)}
                  />
                ))}
              {deals.filter((d) => d.stage === stage).length === 0 && (
                <p className="px-1 text-xs text-slate-400">No deals here yet.</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedDeal && (
        <DealDetailModal
          deal={selectedDeal}
          onClose={() => setSelectedDeal(null)}
          onDeleted={() => {
            setSelectedDeal(null);
            load();
          }}
        />
      )}
    </div>
  );
}
