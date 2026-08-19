import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import type { AuthUser, LoginResponse, Permission } from "../types";

interface AuthContextValue {
  user: AuthUser | null;
  permissions: Permission[];
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  // On mount, restore session from a stored token by re-validating
  // against /auth/me rather than trusting stale localStorage data.
  useEffect(() => {
    const token = localStorage.getItem("rbac_token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((res) => {
        setUser(res.data.user);
        setPermissions(res.data.permissions);
      })
      .catch(() => {
        localStorage.removeItem("rbac_token");
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const res = await api.post<LoginResponse>("/auth/login", { email, password });
    localStorage.setItem("rbac_token", res.data.token);
    setUser(res.data.user);
    setPermissions(res.data.permissions);
  }

  function logout() {
    localStorage.removeItem("rbac_token");
    setUser(null);
    setPermissions([]);
  }

  function hasPermission(permission: Permission) {
    return permissions.includes(permission);
  }

  const value = useMemo(
    () => ({ user, permissions, loading, login, logout, hasPermission }),
    [user, permissions, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
