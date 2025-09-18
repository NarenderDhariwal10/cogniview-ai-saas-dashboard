// server/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String },
  provider: { type: String, enum: ["local", "google", "github"], default: "local" },
  
   
  globalRole: {
  type: String,
  enum: ["user", "org_admin", "super_admin"],
  default: "user",
},

  
  plan: { type: String, enum: ["free", "pro", "enterprise"], default: "free" },
  subscriptionStatus: { type: String, enum: ["active", "inactive"], default: "inactive" },

  organizations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Organization" }],
  organization: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Organization",
},

  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
}, { timestamps: true });


userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password || !enteredPassword) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
