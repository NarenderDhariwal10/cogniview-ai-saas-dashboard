// server/routes/inviteRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { sendInvite, acceptInvite } from "../controllers/inviteController.js";

const router = express.Router();

router.post("/send", protect, sendInvite);
router.post("/accept", protect, acceptInvite);

export default router;
