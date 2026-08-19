import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { RoleGate } from "./RoleGate";
import { ROLE_LABELS } from "../types";

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  [
    "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
    isActive ? "bg-ink-800 text-white" : "text-ink-600 hover:bg-ink-100"
  ].join(" ");

export function Sidebar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-ink-100 bg-white">
      <div className="border-b border-ink-100 px-5 py-4">
        <p className="font-display text-lg font-semibold text-ink-900">Fleet Admin</p>
        <p className="text-xs text-ink-400">Role-hierarchy demo console</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        <NavLink to="/" end className={linkClasses}>
          Dashboard
        </NavLink>
        <NavLink to="/tickets" className={linkClasses}>
          Tickets
        </NavLink>
        <RoleGate permission="manage_users">
          <NavLink to="/users" className={linkClasses}>
            Users
          </NavLink>
        </RoleGate>
      </nav>

      <div className="border-t border-ink-100 px-5 py-4">
        <p className="text-sm font-medium text-ink-800">{user.name}</p>
        <p className="text-xs text-ink-400">{ROLE_LABELS[user.role]}</p>
        <button
          onClick={logout}
          className="mt-3 text-xs font-medium text-ink-500 underline underline-offset-2 hover:text-ink-800"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
