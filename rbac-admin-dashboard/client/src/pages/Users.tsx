import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { AuthUser, Role } from "../types";
import { ROLE_LABELS } from "../types";

// Mirrors server/src/utils/permissions.js ROLE_LEVEL — kept as a small
// duplicated constant here since the client is a separate deployable;
// in a monorepo this would live in a shared package instead.
const ROLE_LEVEL: Record<Role, number> = {
  SUPER_ADMIN: 0,
  NATIONAL_MANAGER: 1,
  REGIONAL_MANAGER: 2,
  FIELD_AGENT: 3,
  VIEWER: 4
};

function assignableRoles(actingRole: Role): Role[] {
  const actingLevel = ROLE_LEVEL[actingRole];
  return (Object.keys(ROLE_LEVEL) as Role[]).filter((r) => ROLE_LEVEL[r] > actingLevel);
}

export function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "" as Role | "" });

  const roleOptions = currentUser ? assignableRoles(currentUser.role) : [];

  function load() {
    setLoading(true);
    api
      .get<AuthUser[]>("/users")
      .then((res) => setUsers(res.data))
      .catch(() => setError("Couldn't load users."))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api.post("/users", form);
      setForm({ name: "", email: "", password: "", role: "" });
      setShowForm(false);
      load();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Couldn't create user.");
    }
  }

  async function toggleActive(u: AuthUser) {
    try {
      await api.patch(`/users/${u.id}`, { isActive: !u.isActive });
      load();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Couldn't update user.");
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold text-ink-900">Users</h1>
          <p className="mt-1 text-sm text-ink-500">
            You can only create or modify roles below your own level in the hierarchy.
          </p>
        </div>
        {roleOptions.length > 0 && (
          <button
            onClick={() => setShowForm((s) => !s)}
            className="rounded-md bg-ink-800 px-4 py-2 text-sm font-medium text-white hover:bg-ink-700"
          >
            {showForm ? "Cancel" : "New user"}
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mt-4 grid grid-cols-1 gap-3 rounded-lg border border-ink-100 bg-white p-4 md:grid-cols-2"
        >
          <input
            required
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-md border border-ink-200 px-3 py-2 text-sm focus:border-ink-500 focus:outline-none focus:ring-2 focus:ring-ink-500/30"
          />
          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-md border border-ink-200 px-3 py-2 text-sm focus:border-ink-500 focus:outline-none focus:ring-2 focus:ring-ink-500/30"
          />
          <input
            required
            type="password"
            placeholder="Temporary password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="rounded-md border border-ink-200 px-3 py-2 text-sm focus:border-ink-500 focus:outline-none focus:ring-2 focus:ring-ink-500/30"
          />
          <select
            required
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
            className="rounded-md border border-ink-200 px-3 py-2 text-sm focus:border-ink-500 focus:outline-none focus:ring-2 focus:ring-ink-500/30"
          >
            <option value="" disabled>
              Select a role…
            </option>
            {roleOptions.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="w-fit rounded-md bg-ink-800 px-4 py-2 text-sm font-medium text-white hover:bg-ink-700 md:col-span-2"
          >
            Create user
          </button>
        </form>
      )}

      {error && <p className="mt-4 text-sm text-danger-600">{error}</p>}
      {loading && <p className="mt-4 text-sm text-ink-400">Loading users…</p>}

      {!loading && (
        <div className="mt-4 overflow-hidden rounded-lg border border-ink-100 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink-100 bg-ink-50 text-xs uppercase tracking-wide text-ink-400">
              <tr>
                <th className="px-4 py-2.5 font-medium">Name</th>
                <th className="px-4 py-2.5 font-medium">Role</th>
                <th className="px-4 py-2.5 font-medium">Region</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const canManage = currentUser && ROLE_LEVEL[currentUser.role] < ROLE_LEVEL[u.role];
                return (
                  <tr key={u.id} className="border-b border-ink-50 last:border-0">
                    <td className="px-4 py-2.5">
                      <p className="font-medium text-ink-800">{u.name}</p>
                      <p className="text-xs text-ink-400">{u.email}</p>
                    </td>
                    <td className="px-4 py-2.5 text-ink-600">{ROLE_LABELS[u.role]}</td>
                    <td className="px-4 py-2.5 text-ink-600">{u.region ?? "—"}</td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          u.isActive ? "bg-ink-100 text-ink-700" : "bg-danger-100 text-danger-600"
                        }`}
                      >
                        {u.isActive ? "Active" : "Deactivated"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      {canManage ? (
                        <button
                          onClick={() => toggleActive(u)}
                          className="text-xs font-medium text-ink-600 underline underline-offset-2 hover:text-ink-900"
                        >
                          {u.isActive ? "Deactivate" : "Reactivate"}
                        </button>
                      ) : (
                        <span className="text-xs text-ink-300">No permission</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
