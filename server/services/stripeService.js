// server/services/stripeService.js
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripeSecret = process.env.STRIPE_SECRET;
if (!stripeSecret) {
  console.warn("Warning: STRIPE_SECRET is not set");
}
const stripe = new Stripe(stripeSecret, { apiVersion: "2023-10-16" });

// ✅ Create checkout session
export const createStripeSession = async ({ userId, customerEmail, priceId }) => {
  if (!priceId) throw new Error("priceId is required");

  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    customer_email: customerEmail,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${clientUrl}/payment-success`,
    cancel_url: `${clientUrl}/payment-cancel`,
    metadata: {
      userId: userId.toString(), // ✅ store userId for webhook
      priceId,                   // ✅ also keep priceId to map plan later
    },
  });

  return session;
};

// ✅ Retrieve subscription from Stripe
export const retrieveSubscription = async (subscriptionId) => {
  if (!subscriptionId) throw new Error("subscriptionId required");
  return stripe.subscriptions.retrieve(subscriptionId);
};

// ✅ List available prices
export const listPrices = async () => {
  return stripe.prices.list({
    expand: ["data.product"], // include product details
    active: true,
    limit: 10,
  });
};

export const stripeInstance = stripe;
export default stripe;
