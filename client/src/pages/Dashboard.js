// client/src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import API from "../services/api";
import { io } from "socket.io-client";
import {
  Users, Briefcase, Bot, DollarSign, ShieldCheck,
  Building2, UserPlus, PlusCircle, BarChart3, CheckCircle2
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await API.get("/dashboard/stats");
      setStats(res.data.stats);
      setActivities(res.data.activities);
      setTasks(res.data.tasks);
      setRole(res.data.role);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const socket = io(process.env.REACT_APP_API_URL);
    socket.on("taskUpdate", fetchData);
    socket.on("activityUpdate", fetchData);
    socket.on("statsUpdate", fetchData);
    socket.on("billingUpdate", fetchData);
    return () => socket.disconnect();
  }, []);

  // Pie for user task completion
  const taskCompletion = [
    { name: "Done", value: tasks.filter((t) => t.done).length },
    { name: "Pending", value: tasks.filter((t) => !t.done).length },
  ];
  const COLORS = ["#4ade80", "#f87171"];

  if (loading) {
    return (
      <div className="px-6 py-4 space-y-4">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-4 space-y-6">
      <motion.h1
        className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Welcome back, {user.name} 👋
      </motion.h1>
      <p className="text-gray-600 dark:text-gray-400">
        Real-time overview tailored to your role: <span className="font-medium capitalize">{role}</span>
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Projects" value={stats?.totalProjects || 0} icon={<Briefcase className="h-6 w-6 text-blue-500" />} />
        <StatCard title="Active Teams" value={stats?.activeTeams || 0} icon={<Users className="h-6 w-6 text-green-500" />} />
        {role !== "user" && <StatCard title="AI Queries" value={stats?.aiQueries || 0} icon={<Bot className="h-6 w-6 text-purple-500" />} />}
        {role === "super_admin" && <StatCard title="Revenue" value={`$${stats?.revenue || 0}`} icon={<DollarSign className="h-6 w-6 text-indigo-500" />} />}
      </div>

      {/* Quick Actions */}
      <QuickActions role={role} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {role === "super_admin" && (
          <>
            <ChartCard title="Revenue Trend">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={stats?.revenueHistory || []}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="amount" stroke="#6366f1" fill="#a5b4fc" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Active Users & Orgs">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats?.systemGrowth || []}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#3b82f6" />
                  <Bar dataKey="orgs" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        )}

        {role === "org_admin" && (
          <>
            <ChartCard title="AI Queries Over Time">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={stats?.aiQueryHistory || []}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#9333ea" />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Projects vs Teams">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={[{ name: "Stats", projects: stats?.totalProjects, teams: stats?.activeTeams }]}>
                  <XAxis dataKey="name" hide />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="projects" fill="#3b82f6" />
                  <Bar dataKey="teams" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        )}

        {role === "user" && (
          <>
            <ChartCard title="Task Completion">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={taskCompletion} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                    {taskCompletion.map((entry, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="My AI Queries">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={stats?.myAiHistory || []}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#6366f1" />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        )}
      </div>

      {/* Activity & Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Recent Activity">
          <ul className="space-y-3">
            {activities.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">
                  {a.message} <span className="text-gray-400">({a.timeAgo})</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Upcoming Tasks">
          <ul className="space-y-3">
            {tasks.map((t, i) => (
              <li key={i} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={t.done} readOnly className="h-4 w-4 rounded border-gray-300" />
                  <span className={t.done ? "line-through text-gray-400" : ""}>{t.title}</span>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    t.status === "Due Today"
                      ? "bg-red-100 text-red-600"
                      : t.status === "Tomorrow"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {t.status}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

// --- Reusable UI Components ---
function StatCard({ title, value, icon }) {
  return (
    <motion.div
      className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 flex items-center justify-between border border-gray-100 dark:border-gray-700"
      whileHover={{ scale: 1.03 }}
    >
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <h2 className="text-2xl font-bold">{value}</h2>
      </div>
      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">{icon}</div>
    </motion.div>
  );
}

function QuickActions({ role }) {
  return (
    <>
      <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {role === "super_admin" && (
          <>
            <ActionCard icon={<ShieldCheck />} label="System Analytics" desc="Monitor system-wide metrics" />
            <ActionCard icon={<Building2 />} label="Manage Orgs" desc="View & manage organizations" />
          </>
        )}
        {role === "org_admin" && (
          <>
            <ActionCard icon={<PlusCircle />} label="Create Project" desc="Start a new project with your team" />
            <ActionCard icon={<UserPlus />} label="Invite Members" desc="Add team members to your org" />
            <ActionCard icon={<BarChart3 />} label="Org Analytics" desc="Monitor your team’s performance" />
          </>
        )}
        {role === "user" && (
          <ActionCard icon={<Bot />} label="AI Assistant" desc="Ask AI for insights" />
        )}
      </div>
    </>
  );
}

function ActionCard({ icon, label, desc }) {
  return (
    <motion.div
      className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md cursor-pointer"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">{icon}</div>
        <div>
          <p className="font-semibold">{label}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
        </div>
      </div>
    </motion.div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 border border-gray-100 dark:border-gray-700">
      <h3 className="font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 border border-gray-100 dark:border-gray-700">
      <h3 className="font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}
