import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  [
    "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
    isActive ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-100"
  ].join(" ");

export function Sidebar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-slate-100 bg-white">
      <div className="border-b border-slate-100 px-5 py-4">
        <p className="font-display text-lg font-semibold text-slate-900">Mini CRM</p>
        <p className="text-xs text-brass-600">Pipeline & relationships</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        <NavLink to="/" end className={linkClasses}>
          Dashboard
        </NavLink>
        <NavLink to="/deals" className={linkClasses}>
          Deals
        </NavLink>
        <NavLink to="/contacts" className={linkClasses}>
          Contacts
        </NavLink>
        <NavLink to="/tasks" className={linkClasses}>
          Tasks
        </NavLink>
      </nav>

      <div className="border-t border-slate-100 px-5 py-4">
        <p className="text-sm font-medium text-slate-800">{user.name}</p>
        <p className="text-xs text-slate-400">{user.email}</p>
        <button
          onClick={logout}
          className="mt-3 text-xs font-medium text-slate-500 underline underline-offset-2 hover:text-slate-800"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
