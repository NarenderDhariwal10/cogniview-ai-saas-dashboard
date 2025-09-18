// models/Task.js
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    done: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["Due Today", "Tomorrow", "Upcoming"],
      default: "Upcoming",
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
