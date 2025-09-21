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
router.post("/create", protect,checkOrgRole("Admin"), createTeam);
// Add this route BEFORE "/:orgId"
router.get("/", protect,checkOrgRole("Admin", "Editor", "Viewer"), async (req, res) => {
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

    

    let teams;
    try {
      teams = await Team.find({ organization: orgId }).populate({
        path: "members.user",
        select: "name email",
        match: { _id: { $ne: null } },
      });
    } catch (err) {
     
      return res.status(500).json({ error: err.message, stack: err.stack });
    }

    

    res.json(Array.isArray(teams) ? teams : []);
  } catch (err) {
    
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

router.get("/team/:orgId", protect,checkOrgRole("Admin", "Editor", "Viewer"), getTeamsByOrg);
router.post("/add-member", protect,checkOrgRole("Admin"), addMember);

// Invites
router.post("/invite/send", checkOrgRole("Admin"), sendInvite);
router.post("/invite/accept", acceptInvite);

export default router;
