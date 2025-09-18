// pages/Billing.js
import React, { useEffect, useState } from "react";
import { createCheckout, getBilling, getPrices } from "../services/api";
import { CheckCircle, XCircle, Star } from "lucide-react";

export default function Billing() {
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState("");
  const [prices, setPrices] = useState([]);
  const [priceMap, setPriceMap] = useState({});

  // Fetch billing info
  useEffect(() => {
    const fetchBilling = async () => {
      try {
        const res = await getBilling();
        setBilling(res);
      } catch (err) {
        console.error("Failed to fetch billing info:", err);
        setError("⚠️ Failed to load billing info. Try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchBilling();
  }, []);

  // Fetch Stripe Prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await getPrices();
        setPrices(res);

        const map = {};
        res.forEach((p) => {
          if (p.product.name.toLowerCase().includes("pro")) map.pro = p.id;
          if (p.product.name.toLowerCase().includes("enterprise")) map.enterprise = p.id;
          if (p.unit_amount === 0) map.free = null;
        });

        setPriceMap(map);
      } catch (err) {
        console.error("Failed to fetch Stripe prices:", err);
      }
    };
    fetchPrices();
  }, []);

  // Checkout
  const handleCheckout = async (planKey) => {
    setCheckoutLoading(true);
    setError("");
    try {
      if (!priceMap[planKey]) {
        setError(planKey === "free" ? "Free plan doesn’t require checkout." : "Price ID not found.");
        return;
      }
      const res = await createCheckout(priceMap[planKey]);
      window.location.href = res.url;
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Checkout failed. Try again later.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const plans = [
    {
      name: "Free",
      price: "$0",
      features: ["3 Projects", "5 Team Members", "Basic AI Assistant", "Standard Support"],
      disabledFeatures: ["Advanced Analytics", "Priority Support", "Custom Integrations"],
      planKey: "free",
    },
    {
      name: "Pro",
      price: "$29/month",
      features: [
        "Unlimited Projects",
        "Unlimited Team Members",
        "Advanced AI Assistant",
        "Priority Support",
        "Advanced Analytics",
        "Team Collaboration Tools",
      ],
      disabledFeatures: ["Custom Integrations"],
      planKey: "pro",
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "$99/month",
      features: [
        "Everything in Pro",
        "Custom Integrations",
        "Dedicated Support",
        "Advanced Security",
        "Custom Onboarding",
        "SLA Guarantee",
        "White-label Options",
      ],
      disabledFeatures: [],
      planKey: "enterprise",
    },
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-500">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Billing</h1>
      <p className="text-gray-600 mb-8">Choose a plan that fits your team and scale effortlessly.</p>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const isCurrent = billing?.plan === plan.planKey;

          return (
            <div
              key={plan.name}
              className={`relative border rounded-2xl p-6 shadow-lg backdrop-blur-md transition-transform hover:scale-105 ${
                plan.highlight ? "border-blue-500 bg-gradient-to-br from-blue-50 to-white" : "border-gray-200 bg-white"
              }`}
            >
              {/* Badge */}
              {plan.highlight && (
                <div className="absolute top-4 right-4 flex items-center gap-1 text-blue-600 text-sm font-medium">
                  <Star size={16} /> Most Popular
                </div>
              )}

              <h2 className="text-xl font-semibold">{plan.name}</h2>
              <p className="text-3xl font-bold mt-2">{plan.price}</p>

              {/* Features */}
              <ul className="mt-6 space-y-3">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-green-600">
                    <CheckCircle size={18} /> {f}
                  </li>
                ))}
                {plan.disabledFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-400 line-through">
                    <XCircle size={18} /> {f}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <div className="mt-8">
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full bg-green-100 text-green-700 font-medium py-2 rounded-lg cursor-not-allowed"
                  >
                    ✅ Current Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleCheckout(plan.planKey)}
                    disabled={checkoutLoading}
                    className={`w-full py-3 rounded-lg font-medium transition ${
                      plan.highlight
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    } ${checkoutLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {checkoutLoading ? "Processing..." : plan.planKey === "free" ? "Start Free" : `Choose ${plan.name}`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
