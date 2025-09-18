// pages/PaymentCancel.js
import React from "react";
import { XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md w-full border"
      >
        <div className="flex justify-center mb-4">
          <XCircle className="h-16 w-16 text-red-500 animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 mb-6">
          Your transaction was not completed. If this was a mistake, you can try
          again below.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate("/pricing")}
            className="px-5 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-5 py-2 rounded-lg border font-medium hover:bg-gray-100 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
}
