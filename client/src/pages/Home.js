// src/pages/Home.js
import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { motion } from "framer-motion";
import { Users, Bot, BarChart3 } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 bg-white/80 backdrop-blur-lg shadow-md sticky top-0 z-50">
        <h1
          className="text-2xl font-extrabold text-blue-600 cursor-pointer tracking-tight hover:scale-105 transition"
          onClick={() => navigate("/")}
        >
          Cogniview
        </h1>
        <div className="hidden md:flex gap-8 font-medium">
          <button onClick={() => navigate("/features")} className="text-gray-600 hover:text-blue-600 transition">Features</button>
          <button onClick={() => navigate("/pricing")} className="text-gray-600 hover:text-blue-600 transition">Pricing</button>
          <button onClick={() => navigate("/about")} className="text-gray-600 hover:text-blue-600 transition">About</button>
        </div>
        <Button
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-md transition"
          onClick={() => navigate("/login")}
        >
          Sign In
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center text-center py-28 px-6 overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-200 rounded-full blur-3xl opacity-40 animate-pulse"></div>

        <motion.h2
          className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight relative z-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Build Better with{" "}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            AI-Powered Teams
          </span>
        </motion.h2>
        <motion.p
          className="text-gray-600 text-lg mb-10 max-w-2xl relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Streamline your workflow with intelligent project management, seamless collaboration,
          and AI-driven insights — all in one powerful dashboard.
        </motion.p>
        <Button
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-xl font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-700 transition transform hover:scale-105 relative z-10"
          onClick={() => navigate("/register")}
        >
          🚀 Start Free Trial
        </Button>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8 px-6 py-20 max-w-6xl mx-auto">
        {[
          {
            icon: <Users className="w-12 h-12 text-blue-600" />,
            title: "Team Management",
            desc: "Organize teams, assign roles, and manage permissions effortlessly.",
          },
          {
            icon: <Bot className="w-12 h-12 text-purple-600" />,
            title: "AI Assistant",
            desc: "Gain insights from your data and automate repetitive tasks with AI.",
          },
          {
            icon: <BarChart3 className="w-12 h-12 text-green-600" />,
            title: "Analytics",
            desc: "Track performance, monitor growth, and make smart, data-driven decisions.",
          },
        ].map((feature, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-2xl shadow-lg p-10 text-center hover:shadow-2xl transition transform hover:-translate-y-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
          >
            <div className="flex justify-center mb-6">{feature.icon}</div>
            <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
            <p className="text-gray-600">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Bottom CTA */}
      <section className="text-center py-24 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to transform your workflow?
        </h2>
        <p className="mb-10 text-lg">
          Join thousands of teams using Cogniview to supercharge productivity.
        </p>
        <Button
          className="bg-white text-blue-600 font-semibold px-10 py-4 rounded-xl shadow-lg hover:bg-gray-100 transition"
          onClick={() => navigate("/register")}
        >
          🚀 Start Free Trial
        </Button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-600 py-12 mt-auto">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 px-6">
          <div>
            <h3 className="font-bold text-lg mb-3">Cogniview</h3>
            <p className="text-sm text-gray-500">
              AI-powered SaaS dashboard to help teams collaborate and grow faster.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/features" className="hover:text-blue-600">Features</a></li>
              <li><a href="/pricing" className="hover:text-blue-600">Pricing</a></li>
              <li><a href="/about" className="hover:text-blue-600">About</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/careers" className="hover:text-blue-600">Careers</a></li>
              <li><a href="/blog" className="hover:text-blue-600">Blog</a></li>
              <li><a href="/contact" className="hover:text-blue-600">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/privacy" className="hover:text-blue-600">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-blue-600">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500 mt-10">
          © {new Date().getFullYear()} Cogniview. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
