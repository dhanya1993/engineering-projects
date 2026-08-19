import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Permission } from "../types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** If set, the route also requires this permission — otherwise redirects to /unauthorized. */
  requiredPermission?: Permission;
}

/**
 * Wraps a page so it (a) requires a logged-in user and (b) optionally
 * requires a specific permission. This is the route-level half of RBAC;
 * the API enforces the same rule server-side so a client-only bypass
 * can never actually reach protected data.
 */
export function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
  const { user, loading, hasPermission } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-ink-400">
        Checking your session…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
