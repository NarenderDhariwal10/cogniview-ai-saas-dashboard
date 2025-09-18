// server/controllers/organizationController.js
import Organization from "../models/Organization.js";
import User from "../models/User.js";

export const createOrganization = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user._id;

    // Create new org
    const organization = await Organization.create({
      name,
      owner: userId,
      members: [{ user: userId, role: "Admin" }],
    });

    // Set this as user's active organization + add to orgs array
    await User.findByIdAndUpdate(userId, {
      $addToSet: { organizations: organization._id },
      organization: organization._id, // active org
    });

    res.status(201).json({ success: true, organization });
  } catch (error) {
    console.error("Create org error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const inviteMember = async (req, res) => {
  try {
    const { orgId, email, role = "Member" } = req.body;

    if (!orgId || !email) {
      return res
        .status(400)
        .json({ success: false, message: "orgId and email are required" });
    }

    const org = await Organization.findById(orgId);
    if (!org)
      return res
        .status(404)
        .json({ success: false, message: "Organization not found" });

    // Only owner/admin can invite
    if (!org.owner.equals(req.user._id)) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to invite members" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please send invite instead.",
      });
    }

    // Add to org if not already
    await Organization.findByIdAndUpdate(
      orgId,
      { $addToSet: { members: { user: user._id, role } } },
      { new: true }
    );

    // Add org to user’s list (but don’t overwrite active org)
    await User.findByIdAndUpdate(user._id, {
      $addToSet: { organizations: orgId },
    });

    res.json({ success: true, message: "Member added successfully" });
  } catch (error) {
    console.error("Invite member error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { orgId, userId } = req.body;
    if (!orgId || !userId)
      return res
        .status(400)
        .json({ success: false, message: "orgId and userId required" });

    await Organization.findByIdAndUpdate(orgId, {
      $pull: { members: { user: userId } },
    });
    await User.findByIdAndUpdate(userId, {
  $addToSet: { organizations: organization._id },
  organization: organization._id, // ✅ set active org
});


    res.json({ success: true, message: "Member removed successfully" });
  } catch (error) {
    console.error("Remove member error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
