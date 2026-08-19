import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DEMO_ACCOUNTS = [
  { role: "Super Admin", email: "superadmin@demo.com" },
  { role: "National Manager", email: "national@demo.com" },
  { role: "Regional Manager (South)", email: "regional.south@demo.com" },
  { role: "Field Agent (South)", email: "agent.south@demo.com" },
  { role: "Viewer", email: "viewer@demo.com" }
];

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4">
      <div className="w-full max-w-sm rounded-lg border border-ink-100 bg-white p-6 shadow-[0_4px_16px_rgba(11,18,16,0.08)]">
        <h1 className="font-display text-xl font-semibold text-ink-900">Fleet Admin Console</h1>
        <p className="mt-1 text-sm text-ink-500">Sign in to continue.</p>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-800">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-ink-200 px-3 py-2 text-sm focus:border-ink-500 focus:outline-none focus:ring-2 focus:ring-ink-500/30"
              placeholder="you@demo.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-800">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-ink-200 px-3 py-2 text-sm focus:border-ink-500 focus:outline-none focus:ring-2 focus:ring-ink-500/30"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-danger-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 rounded-md bg-ink-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ink-700 disabled:bg-ink-300"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="mt-6 border-t border-ink-100 pt-4">
          <p className="mb-2 text-xs font-medium text-ink-500">
            Demo accounts (password: <code className="rounded bg-ink-50 px-1">Passw0rd!</code>)
          </p>
          <ul className="space-y-1">
            {DEMO_ACCOUNTS.map((acc) => (
              <li key={acc.email}>
                <button
                  type="button"
                  onClick={() => setEmail(acc.email)}
                  className="text-xs text-ink-500 hover:text-ink-800 hover:underline"
                >
                  {acc.role} — {acc.email}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
