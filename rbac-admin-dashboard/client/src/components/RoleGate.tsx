import React from "react";
import { useAuth } from "../context/AuthContext";
import type { Permission } from "../types";

interface RoleGateProps {
  permission: Permission;
  children: React.ReactNode;
  /** Rendered instead when the permission is missing. Defaults to nothing. */
  fallback?: React.ReactNode;
}

/**
 * Hides/shows a piece of UI (a button, a nav link, a whole section)
 * based on the current user's permissions — e.g. only render the
 * "Create user" button for roles with manage_users. This is a UX
 * convenience only; the API is the real enforcement boundary.
 */
export function RoleGate({ permission, children, fallback = null }: RoleGateProps) {
  const { hasPermission } = useAuth();
  return <>{hasPermission(permission) ? children : fallback}</>;
}
