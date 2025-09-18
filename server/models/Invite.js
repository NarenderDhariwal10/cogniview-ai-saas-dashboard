import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    role: {
      type: String,
      enum: ["Admin", "Editor", "Viewer"],
      default: "Viewer",
    },
    token: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Declined", "Expired"],
      default: "Pending",
    },
    expiresAt: { type: Date, default: () => Date.now() + 7 * 24 * 60 * 60 * 1000 }, 
  },
  { timestamps: true }
);

const Invite = mongoose.model("Invite", inviteSchema);
export default Invite;
