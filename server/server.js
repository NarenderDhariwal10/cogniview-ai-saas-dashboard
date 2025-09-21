import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import session from "express-session";
import passport from "passport";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import connectDB from "./config/dbconnect.js";
import configurePassport from "./config/passport.js";

import authRoutes from "./routes/authRoutes.js";
import organizationRoutes from "./routes/organizationRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import billingRoutes from "./routes/billingRoutes.js";
import premiumRoutes from "./routes/premiumRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import inviteRoutes from "./routes/inviteRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

import { errorHandler } from "./middleware/errorMiddleware.js";
import { trackUsage } from "./middleware/analyticsMiddleware.js";
import Task from "./models/Task.js";
import { handleWebhook } from "./controllers/billingController.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Core middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Sessions for OAuth
app.use(
  session({
    secret: process.env.JWT_SECRET || "keyboardcat",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport
configurePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// Stripe webhook (raw body)
app.post("/api/billing/webhook", express.raw({ type: "application/json" }), handleWebhook);

// JSON parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/premium", premiumRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/invites", inviteRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/track", trackUsage);

// Error handler
app.use(errorHandler);

// --- Socket.IO setup ---
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  socket.on("joinOrg", (orgId) => {
    socket.join(orgId);
    console.log("Joined org room:", orgId);
  });

  socket.on("projectUpdate", ({ orgId, message }) => {
    io.to(orgId).emit("projectUpdate", message);
  });

  // Watch Task collection (Mongo change streams)
  Task.watch().on("change", (change) => {
    const orgId = change.fullDocument?.organization;
    if (orgId) {
      io.to(orgId.toString()).emit("taskUpdate", {
        type: change.operationType,
        task: change.fullDocument,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log(" Socket disconnected:", socket.id);
  });
});


connectDB()
  .then(() => {
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });
