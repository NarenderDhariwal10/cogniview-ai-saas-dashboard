// server/routes/reportRoutes.js
import express from "express";
import { exportCSV, exportPDF } from "../controllers/reportController.js";
const router = express.Router();

router.get("/csv", exportCSV);
router.get("/pdf", exportPDF);

export default router;
