// frontend/src/pages/Pricing.jsx
import React from "react";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Starter",
    price: "$19/month",
    features: [
      "Up to 5 team members",
      "Basic analytics",
      "Project management",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: "$29/month",
    features: [
      "Up to 25 team members",
      "Advanced analytics",
      "Task & project tracking",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "$99/month",
    features: [
      "Unlimited team members",
      "AI-powered insights",
      "Dedicated account manager",
      "24/7 support",
    ],
  },
];

export default function Pricing() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-12">
      <motion.div
        className="text-center py-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
          Pricing Plans
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
          Flexible pricing plans to suit startups, growing teams, and enterprises.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {plans.map((plan, idx) => (
          <motion.div
            key={idx}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer flex flex-col justify-between"
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{plan.name}</h2>
            <p className="text-indigo-600 text-xl font-semibold mb-4">{plan.price}</p>
            <ul className="text-gray-600 mb-6 space-y-2">
              {plan.features.map((f, i) => (
                <li key={i}>• {f}</li>
              ))}
            </ul>
            <button className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
              Choose Plan
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
