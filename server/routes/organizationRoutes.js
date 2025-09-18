// server/routes/organizationRoutes.js
import express from "express";
import { createOrganization, inviteMember, removeMember } from "../controllers/organizationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { checkOrgRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/create", protect, createOrganization);
router.post("/invite", protect, checkOrgRole("Admin"), inviteMember);
router.post("/remove", protect, checkOrgRole("Admin"), removeMember);

export default router;
