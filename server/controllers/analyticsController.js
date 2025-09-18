import Analytics from "../models/Analytics.js";

export const logEvent = async (req, res) => {
  try {
    const { event, metadata } = req.body;

    const entry = await Analytics.create({
      user: req.user.id,
      team: req.user.team || null,
      event,
      metadata,
    });

    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTeamAnalytics = async (req, res) => {
  try {
    const { teamId } = req.params;
    const logs = await Analytics.find({ team: teamId }).sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await Analytics.countDocuments({ event: "signup" });
    const totalLogins = await Analytics.countDocuments({ event: "login" });

    res.json({ totalUsers, totalLogins });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
