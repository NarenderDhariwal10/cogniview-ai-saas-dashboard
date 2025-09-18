// src/pages/Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/Button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register, googleLogin, githubLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      return setError("Passwords do not match");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    try {
      setLoading(true);
      await register(email, password, name);
      navigate("/dashboard");
    } catch (err) {
      setError("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/70 backdrop-blur-lg shadow-2xl rounded-2xl px-10 py-8 w-full max-w-md border border-gray-200"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
          Join Cogniview
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Create your account to start managing projects
        </p>

        {error && (
          <p className="bg-red-100 text-red-600 p-2 rounded text-sm mb-4">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-xl font-semibold mt-4 hover:from-indigo-700 hover:to-blue-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Registering..." : "Create Account"}
        </Button>

        {/* OAuth Options */}
        <div className="mt-6 flex flex-col gap-3">
          <Button
            type="button"
            className="flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-black text-white rounded-xl py-3 font-medium shadow-sm"
            onClick={googleLogin}
          >
            <FcGoogle size={20} /> Continue with Google
          </Button>
          <Button
            type="button"
            className="flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-black text-white rounded-xl py-3 font-medium shadow-sm"
            onClick={githubLogin}
          >
            <FaGithub size={20} /> Continue with GitHub
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <span
            className="text-indigo-600 font-medium cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login here
          </span>
        </p>
      </form>
    </div>
  );
}
