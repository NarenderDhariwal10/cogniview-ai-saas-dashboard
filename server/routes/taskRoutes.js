// routes/taskRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Task from "../models/Task.js";

const router = express.Router();

// Get my tasks
// Get tasks
router.get("/", protect, async (req, res) => {
  const role = req.user.globalRole;
  let tasks;
  if (role === "super_admin") {
    tasks = await Task.find();
  } else if (role === "org_admin") {
    tasks = await Task.find({ organization: req.user.organizations[0] });
  } else {
    tasks = await Task.find({ assignedTo: req.user._id });
  }
  res.json(tasks);
});

// Create task
router.post("/", protect, async (req, res) => {
  try {
    const { title, status, dueDate, orgId } = req.body;

    const newTask = new Task({
      title,
      status: status || "Upcoming",
      dueDate,
      organization: orgId || req.user.organizations[0],
      createdBy: req.user._id,
      assignedTo: req.user._id, // default assign to creator
    });

    const savedTask = await newTask.save();

    // Emit Socket.IO update to the organization
    const io = req.app.get("io");
    if (io && savedTask.organization) {
      io.to(savedTask.organization.toString()).emit("taskUpdate", {
        type: "create",
        task: savedTask,
      });
    }

    res.status(201).json(savedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create task" });
  }
});


// Update task
router.put("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });

    const io = req.app.get("io");
    if (io && task.organization) {
      io.to(task.organization.toString()).emit("taskUpdate", {
        type: "update",
        task,
      });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to update task" });
  }
});


// Delete task
router.delete("/:id", protect, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task removed" });
});

export default router;
