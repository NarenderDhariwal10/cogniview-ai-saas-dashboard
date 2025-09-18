// server/config/stripe.js
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const STRIPE_SECRET =  process.env.STRIPE_SECRET;
if (!STRIPE_SECRET) {
  console.warn("Warning: STRIPE_SECRET_KEY is not set");
}
const stripe = new Stripe(STRIPE_SECRET, { apiVersion: "2023-10-16" });

export default stripe;

