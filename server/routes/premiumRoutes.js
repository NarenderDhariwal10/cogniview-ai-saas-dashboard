// server/routes/premiumRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import planMiddleware from "../middleware/planMiddleware.js";

const router = express.Router();

router.get("/export-csv", protect, planMiddleware("pro"), (req, res) => {
  const sampleData = [
    { name: "Alice", sales: 120 },
    { name: "Bob", sales: 150 },
  ];
  let csv = "Name,Sales\n";
  sampleData.forEach((row) => (csv += `${row.name},${row.sales}\n`));
  res.setHeader("Content-Type", "text/csv");
  res.attachment("report.csv");
  res.send(csv);
});

router.get("/ai-insights", protect, planMiddleware("pro"), (req, res) => {
  res.json({ insights: "AI says your team is performing well 🚀" });
});

export default router;
