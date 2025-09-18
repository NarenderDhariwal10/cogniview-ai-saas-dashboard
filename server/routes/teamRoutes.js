import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createTeam, addMember, getTeamsByOrg } from "../controllers/teamController.js";
import { sendInvite, acceptInvite } from "../controllers/inviteController.js";
import { checkOrgRole } from "../middleware/roleMiddleware.js";
import Team from "../models/Team.js";
import mongoose from "mongoose";

const router = express.Router();

router.use(protect);

// Team CRUD
router.post("/create", checkOrgRole("Admin"), createTeam);
// Add this route BEFORE "/:orgId"
router.get("/", checkOrgRole("Admin", "Editor", "Viewer"), async (req, res) => {
  try {
   if (!req.user.orgId) {
      console.warn("⚠️ User has no organization");
      return res.status(400).json({
        error: "NO_ORG",
        message: "You must belong to an organization to access teams",
      });
    }


    const orgId = new mongoose.Types.ObjectId(
      req.user.orgId._id ? req.user.orgId._id : req.user.orgId
    );

    console.log("📂 Looking for teams in orgId:", orgId.toString());

    let teams;
    try {
      teams = await Team.find({ organization: orgId }).populate({
        path: "members.user",
        select: "name email",
        match: { _id: { $ne: null } },
      });
    } catch (err) {
      console.error("❌ Team.find/populate error:", err);   // <-- log stack trace
      return res.status(500).json({ error: err.message, stack: err.stack });
    }

    console.log("📊 Teams found:", teams?.length || 0);

    res.json(Array.isArray(teams) ? teams : []);
  } catch (err) {
    console.error("❌ Outer catch /api/teams:", err);  // <-- log stack trace
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

router.get("/team/:orgId", checkOrgRole("Admin", "Editor", "Viewer"), getTeamsByOrg);
router.post("/add-member", checkOrgRole("Admin"), addMember);

// Invites
router.post("/invite/send", checkOrgRole("Admin"), sendInvite);
router.post("/invite/accept", acceptInvite);

export default router;
