// server/controllers/billingController.js
import stripe from "../config/stripe.js";
import User from "../models/User.js";
import Subscription from "../models/Subscription.js";
import { PLAN_MAPPING } from "../config/stripePlans.js";
import { listPrices, createStripeSession } from "../services/stripeService.js";

// ✅ Get Stripe prices
export const getPrices = async (req, res, next) => {
  try {
    const prices = await listPrices();
    res.json(prices.data);
  } catch (err) {
    next(err);
  }
};

// ✅ Return current user billing stats
export const getBillingStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select(
      "plan subscriptionStatus"
    );
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      plan: user.plan || "free",
      subscriptionStatus: user.subscriptionStatus || "inactive",
    });
  } catch (err) {
    next(err);
  }
};

// ✅ Create Stripe checkout session
export const createCheckoutSession = async (req, res) => {
  try {
    const session = await createStripeSession({
      userId: req.user._id,
      customerEmail: req.user.email,
      priceId: req.body.priceId,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};

// ✅ Handle Stripe webhooks
export const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("⚡ Webhook event received:", event.type);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.userId;

        if (!userId) {
          console.warn("⚠️ No userId in checkout.session metadata");
          break;
        }

        // Save subscription to DB
        const lineItems = await stripe.checkout.sessions.listLineItems(
          session.id,
          { limit: 1 }
        );
        const price = (lineItems.data[0].price)/100;

        const subscription = new Subscription({
          userId,
          stripeCustomerId: session.customer,
          stripeSubscriptionId: session.subscription,
          status: "active",
          startDate: new Date(),
          amount: price.unit_amount, // <-- store in cents
          currency: price.currency,
        });

        await subscription.save();

        // Update user’s subscription info

        const priceId = lineItems.data[0].price.id;

        await User.findByIdAndUpdate(userId, {
          subscription: subscription._id,
          subscriptionStatus: "active",
          plan: PLAN_MAPPING[priceId] || "pro",
        });

        console.log("✅ Subscription saved for user:", userId);
        break;
      }

      case "customer.subscription.updated": {
        const subscriptionObj = event.data.object;

        const sub = await Subscription.findOneAndUpdate(
          { stripeSubscriptionId: subscriptionObj.id },
          {
            status: subscriptionObj.status,
            endDate: subscriptionObj.cancel_at
              ? new Date(subscriptionObj.cancel_at * 1000)
              : null,
          }
        );

        if (sub) {
          await User.findByIdAndUpdate(sub.userId, {
            subscriptionStatus: subscriptionObj.status,
            ...(subscriptionObj.status === "canceled" ? { plan: "free" } : {}),
          });
        }

        // Also update User
        await User.findOneAndUpdate(
          { subscription: { $exists: true } },
          {
            subscriptionStatus: subscriptionObj.status,
          }
        );

        console.log("🔄 Subscription updated:", subscriptionObj.id);
        break;
      }

      case "customer.subscription.deleted": {
        const subscriptionObj = event.data.object;

        const sub = await Subscription.findOneAndUpdate(
          { stripeSubscriptionId: subscriptionObj.id },
          {
            status: subscriptionObj.status,
            endDate: subscriptionObj.cancel_at
              ? new Date(subscriptionObj.cancel_at * 1000)
              : null,
          }
        );

        if (sub) {
          await User.findByIdAndUpdate(sub.userId, {
            subscriptionStatus: subscriptionObj.status,
            ...(subscriptionObj.status === "canceled" ? { plan: "free" } : {}),
          });
        }

        // Also update User
        await User.findOneAndUpdate(
          { subscription: { $exists: true } },
          {
            subscriptionStatus: "canceled",
            plan: "free",
          }
        );

        console.log(" Subscription canceled:", subscriptionObj.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).send("Webhook handler failed");
  }
};
