export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export type DealStage = "lead" | "contacted" | "proposal" | "negotiation" | "won" | "lost";

export const DEAL_STAGES: DealStage[] = [
  "lead",
  "contacted",
  "proposal",
  "negotiation",
  "won",
  "lost"
];

export const STAGE_LABELS: Record<DealStage, string> = {
  lead: "Lead",
  contacted: "Contacted",
  proposal: "Proposal",
  negotiation: "Negotiation",
  won: "Won",
  lost: "Lost"
};

export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  tags: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  _id: string;
  title: string;
  value: number;
  currency: string;
  stage: DealStage;
  position: number;
  contactId: { _id: string; name: string; company: string } | string | null;
  expectedCloseDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ActivityType = "note" | "call" | "email" | "meeting" | "stage_change";

export interface Activity {
  _id: string;
  contactId: string | null;
  dealId: string | null;
  type: ActivityType;
  content: string;
  createdAt: string;
}

export interface Task {
  _id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  contactId: { _id: string; name: string } | string | null;
  dealId: { _id: string; title: string } | string | null;
  createdAt: string;
}

export interface DashboardSummary {
  contactCount: number;
  openDealCount: number;
  openPipelineValue: number;
  wonDealCount: number;
  wonValue: number;
  tasksDueToday: number;
  overdueTasks: number;
}
