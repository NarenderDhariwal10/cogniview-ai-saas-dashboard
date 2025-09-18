import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["Admin", "Editor", "Viewer"],
          default: "Viewer",
        },
      },
    ],
  },
  { timestamps: true }
);

const Team = mongoose.model("Team", teamSchema);
export default Team;
