import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { listDeals, createDeal, updateDeal, deleteDeal } from "../controllers/dealController.js";

const router = Router();
router.use(requireAuth);

router.get("/", listDeals);
router.post("/", createDeal);
router.patch("/:id", updateDeal);
router.delete("/:id", deleteDeal);

export default router;
