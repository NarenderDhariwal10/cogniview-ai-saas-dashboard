// server/controllers/inviteController.js
import crypto from "crypto";
import Invite from "../models/Invite.js";
import User from "../models/User.js";
import Team from "../models/Team.js";
import { sendInviteEmail } from "../services/emailService.js";

export const sendInvite = async (req, res) => {
  try {
    const { email, organizationId, teamId, role } = req.body;
    if (!email || !organizationId) {
      return res.status(400).json({ message: "Email and organizationId required" });
    }

    const token = crypto.randomBytes(20).toString("hex");

    const invite = await Invite.create({
      email,
      organization: organizationId,
      team: teamId || null,
      role,
      token,
    });

    const inviteLink = `${process.env.FRONTEND_URL}/accept-invite?token=${token}`;
    await sendInviteEmail(email, inviteLink, role);
//  Emit socket event so all admins see it in real-time
   req.app.get("io").emit("inviteSent", {
     email,
     organizationId,
     teamId,
    role,
   });

   res.status(201).json({ success: true, message: "Invite sent", invite });
  } catch (err) {
    console.error("Invite error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const acceptInvite = async (req, res) => {
  try {
    const { token, userId } = req.body;

    const invite = await Invite.findOne({ token, status: "Pending" });
    if (!invite) return res.status(400).json({ message: "Invalid or expired invite" });

    if (invite.expiresAt < Date.now()) {
      invite.status = "Expired";
      await invite.save();
      return res.status(400).json({ message: "Invite expired" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Attach to team if provided
    if (invite.team) {
      await Team.findByIdAndUpdate(invite.team, {
        $addToSet: { members: { user: user._id, role: invite.role } },
      });
    }

    // Attach to organization
    if (!user.organizations.includes(invite.organization)) {
      user.organizations.push(invite.organization);
    }

    await user.save();

    invite.status = "Accepted";
    await invite.save();

    res.json({ success: true, message: "Invite accepted successfully" });
  } catch (err) {
    console.error("Accept invite error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
