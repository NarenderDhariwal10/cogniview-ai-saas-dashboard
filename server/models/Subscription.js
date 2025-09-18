// server/models/Subscription.js
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    status: { type: String, enum: ["active", "past_due", "canceled", "expired"], default: "active" },
    startDate: { type: Date, default: Date.now },
    endDate: Date,
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;

