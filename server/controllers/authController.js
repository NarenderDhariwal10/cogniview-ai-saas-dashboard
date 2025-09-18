// server/controllers/authController.js
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// Register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      name,
      email,
      password,
      provider: "local",
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid user data" });
    }

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        provider: user.provider,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      return res.json({
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    }

    res.status(401).json({ message: "Invalid email or password" });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    // If using cookies, clear it:
    res.clearCookie("jwt", { httpOnly: true, secure: process.env.NODE_ENV === "production" });

    // For token in localStorage, just tell frontend to remove it
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed", error: err.message });
  }
};
