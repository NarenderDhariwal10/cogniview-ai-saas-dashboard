import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  Bell,
  Moon,
  Sun,
  CreditCard,
  HelpCircle,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  return (
    <nav
      className={`${
        dark ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      } shadow-md px-4 md:px-8 py-3 flex justify-between items-center transition-colors duration-300`}
    >
      {/* Left - Search */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        <input
          type="text"
          placeholder="🔍 Search projects, teams, or members..."
          className={`px-4 py-2 rounded-xl w-full md:w-96 border focus:outline-none focus:ring-2 ${
            dark
              ? "bg-gray-800 border-gray-700 text-white focus:ring-indigo-400"
              : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-indigo-500"
          } transition-all duration-300`}
        />
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-4 relative ml-4">
        {/* Dark/Light Toggle */}
        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-full hover:scale-110 transition-transform duration-200"
          aria-label="Toggle theme"
        >
          {dark ? (
            <Sun className="h-5 w-5 text-yellow-400" />
          ) : (
            <Moon className="h-5 w-5 text-gray-600" />
          )}
        </button>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-full hover:scale-110 transition-transform duration-200"
          aria-label="Notifications"
        >
          <Bell className={`${dark ? "text-gray-300" : "text-gray-600"} h-5 w-5`} />
          <span className="absolute top-1 right-1 h-4 w-4 text-xs flex items-center justify-center bg-red-500 text-white rounded-full shadow-md">
            1
          </span>
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white h-9 w-9 rounded-full flex items-center justify-center font-semibold hover:scale-105 transition-transform duration-200"
            aria-haspopup="true"
            aria-expanded={open}
          >
            {user?.name?.charAt(0).toUpperCase() || "G"}
          </button>

          {/* Dropdown */}
          {open && (
            <div
              className={`absolute right-0 mt-3 w-60 rounded-xl shadow-xl border transform origin-top-right transition-all duration-200 ${
                dark
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-200 text-gray-800"
              }`}
            >
              <div className="px-4 py-3">
                <p className="font-semibold">{user?.name || "Guest"}</p>
                <p className="text-sm opacity-70">
                  {user?.email || "guest@example.com"}
                </p>
              </div>
              <hr className={dark ? "border-gray-700" : "border-gray-200"} />

              <button className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-200">
                <CreditCard className="h-4 w-4" /> Billing
              </button>

              <button className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-200">
                <HelpCircle className="h-4 w-4" /> Help & Support
              </button>

              <button
                onClick={logout}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
