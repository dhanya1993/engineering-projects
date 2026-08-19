import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requirePermission } from "../middleware/rbac.js";
import { PERMISSIONS } from "../utils/permissions.js";
import {
  listUsers,
  createUser,
  updateUser,
  deactivateUser
} from "../controllers/userController.js";

const router = Router();

router.use(requireAuth);

router.get("/", requirePermission(PERMISSIONS.MANAGE_USERS), listUsers);
router.post("/", requirePermission(PERMISSIONS.MANAGE_USERS), createUser);
router.patch("/:id", requirePermission(PERMISSIONS.MANAGE_USERS), updateUser);
router.delete("/:id", requirePermission(PERMISSIONS.MANAGE_USERS), deactivateUser);

export default router;
