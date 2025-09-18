// server/controllers/billingController.js
import stripe from "../config/stripe.js";
import User from "../models/User.js";
import Subscription from "../models/Subscription.js";
import { PLAN_MAPPING } from "../config/stripePlans.js";
import { listPrices } from "../services/stripeService.js";
export const getPrices = async (req, res, next) => {
  try {
    const prices = await listPrices();
    res.json(prices.data);
  } catch (err) {
    next(err);
  }
};

export const getBillingStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("plan subscriptionStatus");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      plan: user.plan || "free",
      subscriptionStatus: user.subscriptionStatus || "inactive",
    });
  } catch (err) {
    next(err);
  }
};


export const createCheckoutSession = async (req, res, next) => {
  try {
    const { priceId } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: req.user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${process.env.CLIENT_URL}/payment-success`,
       cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,

    });

    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
};


export const handleWebhook = async (req, res, next) => {
  try {
    const sig = req.headers["stripe-signature"];
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const user = await User.findOne({ email: session.customer_email });

        if (user) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          const priceId = subscription.items.data[0].price.id;
          const plan = PLAN_MAPPING[priceId] || "free";

          user.plan = plan;
          user.subscriptionStatus = subscription.status;
          await user.save();

          await Subscription.create({
            userId: user._id,
            stripeCustomerId: subscription.customer,
            stripeSubscriptionId: subscription.id,
            status: subscription.status,
            endDate: subscription.current_period_end
              ? new Date(subscription.current_period_end * 1000)
              : null,
          });
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        await Subscription.findOneAndUpdate(
          { stripeSubscriptionId: sub.id },
          {
            status: sub.status,
            endDate: sub.current_period_end
              ? new Date(sub.current_period_end * 1000)
              : null,
          }
        );

        await User.findOneAndUpdate(
          { email: sub.customer_email },
          { subscriptionStatus: sub.status }
        );
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook error:", err);
    next(err);
  }
};
