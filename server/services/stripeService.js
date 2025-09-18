// server/services/stripeService.js
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripeSecret = process.env.STRIPE_SECRET;
if (!stripeSecret) {
  console.warn("Warning: STRIPE_SECRET is not set");
}
const stripe = new Stripe(stripeSecret, { apiVersion: "2023-10-16" });

export const createCheckoutSession = async ({ customerEmail, priceId, metadata = {} }) => {
  if (!priceId) throw new Error("priceId is required");

  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000"; // ✅ fallback to React dev server

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    customer_email: customerEmail,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${clientUrl}/dashboard?success=true`,
    cancel_url: `${clientUrl}/billing?canceled=true`,
    metadata,
  });

  return session;
};

export const retrieveSubscription = async (subscriptionId) => {
  if (!subscriptionId) throw new Error("subscriptionId required");
  return stripe.subscriptions.retrieve(subscriptionId);
};
export const listPrices = async () => {
  return stripe.prices.list({
    expand: ["data.product"], // include product details
    active: true,
    limit: 10,
  });
};

export const stripeInstance = stripe;
export default stripe;
