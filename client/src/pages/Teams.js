// frontend/src/pages/Teams.jsx
import React, { useEffect, useState } from "react";
import { getTeams, createTeam } from "../services/api";
import { io } from "socket.io-client";
import API from "../services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [newTeam, setNewTeam] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Viewer");
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  useEffect(() => {
    fetchTeams();

    const socket = io("http://localhost:4000"); // backend URL

    socket.on("teamCreated", (team) => {
      setTeams((prev) => [...prev, team]);
      toast.success(`✅ Team "${team.name}" created!`);
    });

    socket.on("memberAdded", (team) => {
      setTeams((prev) => prev.map((t) => (t._id === team._id ? team : t)));
      toast.info(`👥 New member joined "${team.name}"`);
    });

    socket.on("inviteSent", (invite) => {
      toast.success(`📩 Invite sent to ${invite.email} as ${invite.role}`);
    });

    return () => socket.disconnect();
  }, []);

  const fetchTeams = async () => {
  try {
    const res = await getTeams();
    setTeams(res);
  } catch (err) {
    console.error("Error fetching teams:", err);

    const msg =
      err.response?.data?.error ||
      err.response?.data?.message ||
      "❌ Failed to load teams";

    // Special case: no organization
    if (msg.includes("organization")) {
      toast.warn("⚠️ You are not part of any organization yet. Ask an admin to invite you.");
    } else {
      toast.error(msg);
    }
  }
};


  const handleCreateTeam = async () => {
    if (!newTeam.trim()) return;
    try {
      await createTeam({ name: newTeam, orgId: localStorage.getItem("orgId") });
      setNewTeam("");
    } catch (err) {
      console.error("Error creating team:", err);
      toast.error("❌ Failed to create team");
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail || !selectedTeamId) return;
    try {
      await API.post("/teams/invite/send", {
        email: inviteEmail,
        organizationId: localStorage.getItem("orgId"),
        teamId: selectedTeamId,
        role: inviteRole,
      });
      setInviteEmail("");
      setInviteRole("Viewer");
      setSelectedTeamId(null);
      setShowInvite(false);
      toast.success(`📨 Invite sent to ${inviteEmail}`);
    } catch (err) {
      console.error("Error inviting member:", err);
      toast.error("❌ Failed to send invite");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-gray-800">Teams</h1>
        <button
          onClick={() => setShowInvite(true)}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition"
        >
          + Invite Member
        </button>
      </div>

      <p className="text-gray-600">
        {teams.reduce((acc, t) => acc + t.members.length, 0)} members in organization
      </p>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {teams.map((team) => (
            <motion.div
              key={team._id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white/70 backdrop-blur-lg rounded-2xl p-5 shadow-lg border border-gray-200 flex flex-col justify-between hover:shadow-xl transition"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{team.name}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Members: {team.members.length}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedTeamId(team._id);
                  setShowInvite(true);
                }}
                className="mt-4 bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 rounded-xl font-medium hover:from-green-600 hover:to-teal-600 transition"
              >
                Invite
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Create Team */}
      <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Create a new team</h2>
        <div className="flex gap-3 flex-col md:flex-row">
          <input
            type="text"
            placeholder="New team name"
            value={newTeam}
            onChange={(e) => setNewTeam(e.target.value)}
            className="flex-1 p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
          />
          <button
            onClick={handleCreateTeam}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition"
          >
            + Create Team
          </button>
        </div>
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl p-6 w-96 max-w-full"
          >
            <h2 className="text-xl font-semibold mb-4">Invite Team Member</h2>
            <input
              type="email"
              placeholder="colleague@company.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="w-full p-3 border rounded-xl mb-4 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full p-3 border rounded-xl mb-4 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
            >
              <option value="Viewer">Viewer – Can view projects and data</option>
              <option value="Editor">Editor – Can edit and create content</option>
              <option value="Admin">Admin – Full management access</option>
            </select>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowInvite(false)}
                className="bg-gray-300 px-4 py-2 rounded-xl hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleInvite}
                className="bg-gradient-to-r from-green-500 to-teal-500 px-4 py-2 rounded-xl text-white font-medium hover:from-green-600 hover:to-teal-600 transition"
              >
                Invite
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
