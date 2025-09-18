// frontend/src/pages/Blog.jsx
import React from "react";
import { motion } from "framer-motion";

const posts = [
  {
    title: "Maximizing Team Productivity with AI",
    date: "2025-08-10",
    excerpt: "Learn how AI can help teams stay organized, track projects, and optimize productivity...",
  },
  {
    title: "Best Practices for Remote Collaboration",
    date: "2025-07-22",
    excerpt: "Remote work requires efficient tools. Discover top strategies to manage projects and teams effectively...",
  },
  {
    title: "Data-Driven Decision Making",
    date: "2025-06-15",
    excerpt: "Using analytics and insights to make smarter business decisions in SaaS applications...",
  },
];

export default function Blog() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-12">
      <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Blog</h1>
        <p className="text-gray-600">Read our latest updates, insights, and guides about SaaS, AI, and team productivity.</p>
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {posts.map((post, idx) => (
          <motion.div
            key={idx}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h2>
            <p className="text-gray-500 text-sm mb-3">{new Date(post.date).toLocaleDateString()}</p>
            <p className="text-gray-600">{post.excerpt}</p>
            <button className="mt-4 text-indigo-600 font-semibold hover:underline">Read More →</button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
