import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    event: {
      type: String,
      required: true,
      enum: [
        "login",
        "logout",
        "signup",
        "subscription_started",
        "subscription_canceled",
        "subscription_renewed",
        "payment_success",
        "payment_failed",
        "ai_query",
        "file_upload",
      ],
    },
    metadata: { type: mongoose.Schema.Types.Mixed }, 
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Analytics", analyticsSchema);
