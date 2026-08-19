export type Role =
  | "SUPER_ADMIN"
  | "NATIONAL_MANAGER"
  | "REGIONAL_MANAGER"
  | "FIELD_AGENT"
  | "VIEWER";

export type Permission =
  | "manage_users"
  | "manage_roles"
  | "view_reports"
  | "manage_tickets"
  | "assign_devices"
  | "view_dashboard";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  managerId: string | null;
  region: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
  permissions: Permission[];
}

export interface Ticket {
  _id: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "resolved";
  region: string | null;
  createdBy: { _id: string; name: string; email: string; role: Role } | string;
  assignedTo: { _id: string; name: string; email: string; role: Role } | string | null;
  createdAt: string;
}

export interface DashboardSummary {
  userCount: number;
  activeUserCount: number;
  openTickets: number;
  resolvedTickets: number;
  viewerRole: Role;
}

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  NATIONAL_MANAGER: "National Manager",
  REGIONAL_MANAGER: "Regional Manager",
  FIELD_AGENT: "Field Agent",
  VIEWER: "Viewer"
};
