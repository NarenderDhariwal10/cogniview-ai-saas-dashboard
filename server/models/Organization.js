// server/models/Organization.js
import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: { type: String, enum: ["Admin", "Editor", "Viewer"], default: "Viewer" },
      },
    ],
  },
  { timestamps: true }
);

const Organization = mongoose.model("Organization", organizationSchema);
export default Organization;
