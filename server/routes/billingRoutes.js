// server/routes/billingRoutes.js
import express from "express";
import {
  
  createCheckoutSession,
  handleWebhook,
} from "../controllers/billingController.js";
import { protect } from "../middleware/authMiddleware.js";

import { getPrices , getBillingStats} from "../controllers/billingController.js";




const router = express.Router();

// Get current user billing info
// router.get("/me", protect, getBillingStats);

// Create checkout session
router.post("/create-checkout-session", protect, createCheckoutSession);
router.get("/me", protect, getBillingStats);


// Stripe Webhook (⚠️needs express.raw middleware in server.js)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);
router.get("/prices", protect, getPrices);

export default router;
