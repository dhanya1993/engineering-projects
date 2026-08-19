import type { DragEvent } from "react";
import type { Deal } from "../types";
import { formatCurrency, formatDate } from "../utils/format";

interface DealCardProps {
  deal: Deal;
  onDragStart: (e: DragEvent, dealId: string) => void;
  onClick: () => void;
}

function contactLabel(contactId: Deal["contactId"]) {
  if (!contactId) return null;
  if (typeof contactId === "string") return null;
  return contactId.name;
}

export function DealCard({ deal, onDragStart, onClick }: DealCardProps) {
  const contactName = contactLabel(deal.contactId);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, deal._id)}
      onClick={onClick}
      className="cursor-grab rounded-lg border border-slate-100 bg-white p-3.5 shadow-[0_1px_2px_rgba(13,17,23,0.06)] transition-shadow hover:shadow-[0_2px_8px_rgba(13,17,23,0.1)] active:cursor-grabbing"
    >
      <p className="text-sm font-medium text-slate-900 line-clamp-2">{deal.title}</p>
      <p className="mt-1.5 font-display text-base font-semibold text-brass-600">
        {formatCurrency(deal.value, deal.currency)}
      </p>
      <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
        <span>{contactName ?? "No contact"}</span>
        <span>{formatDate(deal.expectedCloseDate)}</span>
      </div>
    </div>
  );
}
