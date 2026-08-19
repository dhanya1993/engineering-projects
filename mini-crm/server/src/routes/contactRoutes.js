import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  listContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact
} from "../controllers/contactController.js";

const router = Router();
router.use(requireAuth);

router.get("/", listContacts);
router.post("/", createContact);
router.get("/:id", getContact);
router.patch("/:id", updateContact);
router.delete("/:id", deleteContact);

export default router;
