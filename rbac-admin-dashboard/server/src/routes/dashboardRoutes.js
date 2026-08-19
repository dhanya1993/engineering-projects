import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requirePermission } from "../middleware/rbac.js";
import { PERMISSIONS } from "../utils/permissions.js";
import { getSummary } from "../controllers/dashboardController.js";

const router = Router();

router.get("/summary", requireAuth, requirePermission(PERMISSIONS.VIEW_DASHBOARD), getSummary);

export default router;
