// frontend/src/pages/About.jsx
import React from "react";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-12">
      {/* Hero Section */}
      <motion.div
        className="text-center py-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
          Welcome to Cogniview
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
          Cogniview is an AI-powered SaaS platform designed to provide powerful insights,
          streamline team collaboration, and help your organization make data-driven decisions effortlessly.
        </p>
      </motion.div>

      {/* Why Cogniview Section */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer">
          <h2 className="text-xl font-semibold text-indigo-600 mb-2">AI-Powered Insights</h2>
          <p className="text-gray-600">
            Get real-time insights from your data, identify trends, anomalies, and actionable recommendations.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer">
          <h2 className="text-xl font-semibold text-indigo-600 mb-2">Team Collaboration</h2>
          <p className="text-gray-600">
            Manage projects, tasks, and teams in a seamless, collaborative workspace with real-time updates.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer">
          <h2 className="text-xl font-semibold text-indigo-600 mb-2">Enterprise-Grade Security</h2>
          <p className="text-gray-600">
            Keep your data safe with robust security protocols, role-based access, and audit trails.
          </p>
        </div>
      </motion.div>

      {/* Team Section */}
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
        <p className="text-gray-600 max-w-3xl mx-auto text-lg">
          Cogniview aims to empower organizations to harness the power of AI, simplify operations, 
          and unlock the full potential of their teams by providing a modern, intuitive, and secure platform.
        </p>
      </motion.div>
    </div>
  );
}
