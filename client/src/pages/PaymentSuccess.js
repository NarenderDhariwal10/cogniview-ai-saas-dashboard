// pages/PaymentSuccess.js
import React from "react";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-50 to-white px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md w-full border"
      >
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="h-16 w-16 text-green-500 animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your payment. Your subscription is now active. Enjoy all the premium features!
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-5 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate("/pricing")}
            className="px-5 py-2 rounded-lg border font-medium hover:bg-gray-100 transition"
          >
            View Plans
          </button>
        </div>
      </motion.div>
    </div>
  );
}
