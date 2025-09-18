import Team from "../models/Team.js";
import User from "../models/User.js";
export const createTeam = async (req, res) => {
  try {
    const { name } = req.body;
    const orgId = req.user.orgId;

    if (!name) return res.status(400).json({ msg: "Team name required" });
if (!orgId) return res.status(400).json({ msg: "User has no organization" });


    const team = new Team({
      name,
      organization: orgId,
      members: [{ user: req.user._id, role: "Admin" }],
    });
    await team.save();

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { teams: team._id, organizations: orgId },
    });

    req.app.get("io").emit("teamCreated", team);

    res.status(201).json(team);
  } catch (err) {
    console.error("Create team error:", err);
    res.status(500).json({ error: err.message });
  }
};


export const addMember = async (req, res) => {
  try {
    const { teamId, userId, role } = req.body;
    const team = await Team.findById(teamId).populate("members.user", "name email");
    if (!team) return res.status(404).json({ msg: "Team not found" });

    team.members.push({ user: userId, role: role || "Viewer" });
    await team.save();

    await User.findByIdAndUpdate(userId, {
    $addToSet: { teams: team._id, organizations: team.organization },
 });


    //  Emit real-time event with updated team
    req.app.get("io").emit("memberAdded", team);

    res.json({ msg: "Member added", team });
  } catch (err) {
    console.error("Add member error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getTeamsByOrg = async (req, res) => {
  try {
    const { orgId } = req.params;
    const teams = await Team.find({ organization: orgId }).populate(
      "members.user",
      "name email"
    );
    res.json(teams);
  } catch (err) {
    console.error("Get teams error:", err);
    res.status(500).json({ error: err.message });
  }
};
