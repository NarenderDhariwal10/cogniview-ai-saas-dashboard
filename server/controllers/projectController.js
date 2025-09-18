// controllers/projectController.js
import Project from "../models/Project.js";


export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!req.user || !req.user.orgId) {
      return res.status(400).json({
        success: false,
        message: "Organization is required but not found on user context",
      });
    }

    const project = await Project.create({
      name,
      description,
      organization: req.user.orgId,   // <-- now always set correctly
      owner: req.user._id,
      members: [{ user: req.user._id, role: "admin" }],
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    console.error("Error creating project:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};



export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ organization: req.user.organization })
      .populate("members.user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    console.error("Error fetching projects:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      organization: req.user.organization,
    }).populate("members.user", "name email");

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    console.error("Error fetching project:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const updateProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = await Project.findOne({
      _id: req.params.id,
      organization: req.user.organization,
    });

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const member = project.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );
    if (!member || member.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    project.name = name || project.name;
    project.description = description || project.description;
    await project.save();

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    console.error("Error updating project:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      organization: req.user.organization,
    });

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const member = project.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );
    if (!member || member.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await Project.deleteOne({ _id: project._id });

    res.status(200).json({
      success: true,
      message: "Project deleted",
      id: project._id,
    });
  } catch (error) {
    console.error("Error deleting project:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
