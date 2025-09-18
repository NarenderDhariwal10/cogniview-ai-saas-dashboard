import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Bot,
  CreditCard,
  Building2,
  CheckSquare,
} from "lucide-react"; // modern icon library

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/projects", label: "Projects", icon: FolderKanban },
  { path: "/teams", label: "Teams", icon: Users },
  { path: "/organization", label: "Organization", icon: Building2 },
  { path: "/tasks", label: "Tasks", icon: CheckSquare },
  { path: "/ai", label: "AI Assistant", icon: Bot },
  { path: "/billing", label: "Billing", icon: CreditCard },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-gray-100 flex flex-col border-r border-gray-800 shadow-lg">
      {/* Brand */}
      <div className="p-6 text-2xl font-extrabold tracking-tight text-white">
        Cogniview
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium
              ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer (optional user/profile) */}
      <div className="p-4 border-t border-gray-800 text-xs text-gray-400">
        © 2025 Cogniview
      </div>
    </aside>
  );
}
