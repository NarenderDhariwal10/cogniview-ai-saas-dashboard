// routes/analyticsRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Analytics from "../models/Analytics.js";

const router = express.Router();

router.get("/stats", protect, async (req, res) => {
  try {
    const events = await Analytics.aggregate([
      { $group: { _id: "$event", count: { $sum: 1 } } }
    ]);
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
});

export default router;
