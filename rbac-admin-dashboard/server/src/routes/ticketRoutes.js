import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requirePermission } from "../middleware/rbac.js";
import { PERMISSIONS } from "../utils/permissions.js";
import { listTickets, createTicket, updateTicket } from "../controllers/ticketController.js";

const router = Router();

router.use(requireAuth);

router.get("/", requirePermission(PERMISSIONS.VIEW_DASHBOARD), listTickets);
router.post("/", requirePermission(PERMISSIONS.MANAGE_TICKETS), createTicket);
router.patch("/:id", requirePermission(PERMISSIONS.MANAGE_TICKETS), updateTicket);

export default router;
