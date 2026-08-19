/**
 * Central definition of the role hierarchy and what each role can do.
 *
 * Modeled after a real multi-tier field-sales org (national manager ->
 * regional manager -> distributor -> field agent), collapsed here to
 * four roles so the pattern stays easy to read and demo, while still
 * being a genuine hierarchy (not just a flat permissions list).
 *
 * ROLE_LEVEL is used for "manage users below me" checks — a role can
 * only create/edit/deactivate users whose level is numerically greater
 * (i.e. lower in the org) than its own.
 */

export const ROLES = Object.freeze({
  SUPER_ADMIN: "SUPER_ADMIN",
  NATIONAL_MANAGER: "NATIONAL_MANAGER",
  REGIONAL_MANAGER: "REGIONAL_MANAGER",
  FIELD_AGENT: "FIELD_AGENT",
  VIEWER: "VIEWER"
});

// Lower number = higher up the org. Used to enforce "can only manage
// roles below my own level".
export const ROLE_LEVEL = Object.freeze({
  [ROLES.SUPER_ADMIN]: 0,
  [ROLES.NATIONAL_MANAGER]: 1,
  [ROLES.REGIONAL_MANAGER]: 2,
  [ROLES.FIELD_AGENT]: 3,
  [ROLES.VIEWER]: 4
});

export const PERMISSIONS = Object.freeze({
  MANAGE_USERS: "manage_users",
  MANAGE_ROLES: "manage_roles",
  VIEW_REPORTS: "view_reports",
  MANAGE_TICKETS: "manage_tickets",
  ASSIGN_DEVICES: "assign_devices",
  VIEW_DASHBOARD: "view_dashboard"
});

/**
 * Role -> permission set. This is the single source of truth the RBAC
 * middleware consults; add a permission here once and every route/UI
 * check that references it updates automatically.
 */
export const ROLE_PERMISSIONS = Object.freeze({
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [ROLES.NATIONAL_MANAGER]: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.MANAGE_TICKETS,
    PERMISSIONS.ASSIGN_DEVICES,
    PERMISSIONS.VIEW_DASHBOARD
  ],
  [ROLES.REGIONAL_MANAGER]: [
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.MANAGE_TICKETS,
    PERMISSIONS.ASSIGN_DEVICES,
    PERMISSIONS.VIEW_DASHBOARD
  ],
  [ROLES.FIELD_AGENT]: [
    PERMISSIONS.MANAGE_TICKETS,
    PERMISSIONS.VIEW_DASHBOARD
  ],
  [ROLES.VIEWER]: [PERMISSIONS.VIEW_DASHBOARD]
});

export function roleHasPermission(role, permission) {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function canManageRole(actingRole, targetRole) {
  const actingLevel = ROLE_LEVEL[actingRole];
  const targetLevel = ROLE_LEVEL[targetRole];
  if (actingLevel === undefined || targetLevel === undefined) return false;
  return actingLevel < targetLevel;
}
