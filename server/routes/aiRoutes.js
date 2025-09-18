import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { uploadCSVAndAnalyze, chatAssistant } from "../controllers/aiController.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // temporary file storage

router.use(protect);

// Upload CSV & get AI insights
router.post("/upload-csv", upload.single("file"), uploadCSVAndAnalyze);

// Chat with AI
router.post("/chat", chatAssistant);

export default router;
