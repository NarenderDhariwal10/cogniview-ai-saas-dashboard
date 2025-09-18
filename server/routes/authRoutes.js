// server/routes/authRoutes.js
import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { register, login, logout } from "../controllers/authController.js";
import {
  validate,
  registerValidation,
  loginValidation,
} from "../middleware/validation.js";
import User from "../models/User.js";

const router = express.Router();

// Register & login
router.post("/register", validate(registerValidation), register);
router.post("/login", validate(loginValidation), login);

// Logout
router.post("/logout", logout);

// Get current user
router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id)
        .populate({
          path: "organizations",
          model: "Organization",
          populate: {
            path: "members.user",
            select: "name email", // get member details
          },
        })
        .select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (err) {
      console.error("Error in /me:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);


// OAuth - Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: true }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
  }
);

// OAuth - GitHub
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login", session: true }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
  }
);

export default router;
