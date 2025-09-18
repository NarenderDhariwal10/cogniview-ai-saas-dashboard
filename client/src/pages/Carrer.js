// frontend/src/pages/Career.jsx
import React from "react";
import { motion } from "framer-motion";

const jobs = [
  {
    title: "Frontend Developer",
    type: "Full-time",
    location: "Remote",
  },
  {
    title: "Backend Developer",
    type: "Full-time",
    location: "Remote",
  },
  {
    title: "Product Manager",
    type: "Full-time",
    location: "Remote",
  },
];

export default function Career() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-12">
      <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Join Our Team</h1>
        <p className="text-gray-600">We’re building the future of AI-powered SaaS solutions. Check our open roles below!</p>
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {jobs.map((job, idx) => (
          <motion.div
            key={idx}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-2">{job.title}</h2>
            <p className="text-gray-600 mb-1">{job.type}</p>
            <p className="text-gray-500">{job.location}</p>
            <button className="mt-4 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 w-full">
              Apply Now
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
