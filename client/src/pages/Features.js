// frontend/src/pages/Features.jsx
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const features = [
  {
    title: "AI Insights & Analytics",
    desc: "Transform raw data into actionable insights and visualize trends in real-time.",
  },
  {
    title: "Project & Task Management",
    desc: "Organize projects, assign tasks, track progress, and improve team productivity.",
  },
  {
    title: "Team Collaboration",
    desc: "Seamlessly collaborate with teams, share updates, and communicate effectively.",
  },
  {
    title: "Role-Based Access",
    desc: "Securely manage team permissions with admin, editor, and viewer roles.",
  },
  {
    title: "Notifications & Alerts",
    desc: "Stay updated with instant alerts for task updates, deadlines, and project activities.",
  },
  {
    title: "Cloud Integration",
    desc: "Access and store data securely on cloud with backup and versioning.",
  },
];

export default function Features() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-12">
      {/* Hero Section */}
      <motion.div
        className="text-center py-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
          Features
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
          Cogniview is packed with features designed to boost productivity, enhance collaboration, and drive smart decisions.
        </p>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {features.map((f, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer flex flex-col gap-3"
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <CheckCircle className="text-indigo-600 w-6 h-6" />
            <h2 className="text-xl font-semibold text-gray-800">{f.title}</h2>
            <p className="text-gray-600">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
