import { roleHasPermission, canManageRole } from "../utils/permissions.js";

/**
 * Route-level permission gate. Usage:
 *   router.get("/reports", requireAuth, requirePermission(PERMISSIONS.VIEW_REPORTS), handler)
 *
 * Kept as a single, reusable middleware factory rather than one
 * hand-rolled check per route — this is what keeps permission logic
 * consistent as new resources get added.
 */
export function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      return next(new Error("Not authenticated."));
    }
    if (!roleHasPermission(req.user.role, permission)) {
      res.status(403);
      return next(
        new Error(`Role "${req.user.role}" does not have the "${permission}" permission.`)
      );
    }
    next();
  };
}

/**
 * Guards user-management actions specifically: an actor can only
 * create/edit/deactivate a user whose target role sits below their own
 * in the hierarchy. Prevents privilege escalation (a Regional Manager
 * granting someone National Manager access, for example).
 */
export function requireCanManageRole(getTargetRole) {
  return (req, res, next) => {
    const targetRole = getTargetRole(req);
    if (!canManageRole(req.user.role, targetRole)) {
      res.status(403);
      return next(
        new Error(
          `Role "${req.user.role}" is not permitted to manage users at the "${targetRole}" level.`
        )
      );
    }
    next();
  };
}
