// controllers/dashboardController.js
import User from "../models/User.js";
import Organization from "../models/Organization.js";
import Team from "../models/Team.js";
import Project from "../models/Project.js";
import Subscription from "../models/Subscription.js";
import Analytics from "../models/Analytics.js";
import Task from "../models/Task.js";
import stripe from "../config/stripe.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
dayjs.extend(relativeTime);

export const getDashboard = async (req, res, next) => {
  try {
    const role = req.user.globalRole;
    let stats = { totalProjects: 0, activeTeams: 0, aiQueries: 0, revenue: 0 };
    let activities = [];
    let tasks = [];

    // --- role-based stats ---
    if (role === "super_admin") {
      const totalUsers = await User.countDocuments();
      const totalOrgs = await Organization.countDocuments();
      const totalTeams = await Team.countDocuments();
      const totalProjects = await Project.countDocuments();
      const activeSubs = await Subscription.countDocuments({ status: "active" });
      const balance = await stripe.balance.retrieve();
      const revenue = (balance.available.reduce((acc, curr) => acc + curr.amount, 0) )/ 100;


      stats = { ...stats, totalProjects, activeTeams: totalTeams, revenue, totalUsers, totalOrgs, activeSubs };

      activities = await Analytics.find().sort({ createdAt: -1 }).limit(10);
      tasks = await Task.find().sort({ dueDate: 1 }).limit(10);

    } else if (role === "org_admin") {
      const orgId = req.user.organizations[0];
      const totalProjects = await Project.countDocuments({ organization: orgId });
      const activeTeams = await Team.countDocuments({ organization: orgId });
      const aiQueries = await Analytics.countDocuments({ team: { $in: req.user.teams }, event: "ai_query" });

      stats = { ...stats, totalProjects, activeTeams, aiQueries };
      activities = await Analytics.find({ team: { $in: req.user.teams } }).sort({ createdAt: -1 }).limit(10);
      tasks = await Task.find({ organization: orgId }).sort({ dueDate: 1 }).limit(10);

    } else {
      const totalProjects = await Project.countDocuments({ members: req.user._id });
      const activeTeams = await Team.countDocuments({ members: req.user._id });
      const aiQueries = await Analytics.countDocuments({ user: req.user._id, event: "ai_query" });

      stats = { ...stats, totalProjects, activeTeams, aiQueries };
      activities = await Analytics.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(10);
      tasks = await Task.find({ assignedTo: req.user._id }).sort({ dueDate: 1 }).limit(10);
    }

    // --- Aggregations inside function ---
    const revenueHistory = await Subscription.aggregate([
      { $match: { status: "active" } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, amount: { $sum: "$amount" } } },
      { $sort: { _id: 1 } },
    ]);

    const systemGrowth = await User.aggregate([
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, users: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const aiQueryHistory = await Analytics.aggregate([
      { $match: { event: "ai_query" } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const myAiHistory = await Analytics.aggregate([
      { $match: { user: req.user._id, event: "ai_query" } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // --- format ---
    const formattedActivities = activities.map(a => ({
      message: a.event,
      timeAgo: dayjs(a.createdAt).fromNow(),
    }));

    const formattedTasks = tasks.map(t => ({
      id: t._id,
      title: t.title,
      done: t.done,
      status:
        t.dueDate && dayjs(t.dueDate).isSame(dayjs(), "day")
          ? "Due Today"
          : t.dueDate && dayjs(t.dueDate).isSame(dayjs().add(1, "day"), "day")
          ? "Tomorrow"
          : "Upcoming",
    }));

    res.json({
      role,
      stats: {
        ...stats,
        revenueHistory: revenueHistory.map(r => ({ date: r._id, amount: r.amount })),
        systemGrowth: systemGrowth.map(s => ({ date: s._id, users: s.users, orgs: 0 })),
        aiQueryHistory: aiQueryHistory.map(q => ({ date: q._id, count: q.count })),
        myAiHistory: myAiHistory.map(q => ({ date: q._id, count: q.count })),
      },
      activities: formattedActivities,
      tasks: formattedTasks,
    });

  } catch (err) {
    next(err);
  }
};
