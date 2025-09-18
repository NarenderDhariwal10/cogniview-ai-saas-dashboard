// routes/projectRoutes.js
import express from "express";
const router = express.Router();
import planMiddleware from "../middleware/planMiddleware.js";
import { protect} from "../middleware/authMiddleware.js";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";


// Protect all routes, AI SaaS plan enforcement is optional per feature
router.use(protect);

router.post("/", planMiddleware("pro"), createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
