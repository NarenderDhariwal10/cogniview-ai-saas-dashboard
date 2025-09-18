// client/src/pages/OrganizationPage.jsx
import React, { useEffect, useState } from "react";
import {
  getUser,
  createOrganization,
  inviteMember,
  removeMember,
} from "../services/api";
import { Plus, Users, Mail, Shield, Trash2 } from "lucide-react";

const OrganizationPage = () => {
  const [orgs, setOrgs] = useState([]);
  const [orgName, setOrgName] = useState("");
  const [selectedOrg, setSelectedOrg] = useState(null);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Viewer");

  const fetchOrgs = async () => {
    try {
      const data = await getUser(); // comes from /auth/me
      setOrgs(data.organizations || []);
    } catch (err) {
      console.error("Fetch orgs error:", err.message);
    }
  };

  const handleCreateOrg = async () => {
    if (!orgName) return;
    try {
      await createOrganization(orgName);
      setOrgName("");
      fetchOrgs();
    } catch (err) {
      console.error("Create org error:", err.message);
    }
  };

  const handleInvite = async () => {
    if (!selectedOrg || !inviteEmail) return;
    try {
      await inviteMember(selectedOrg._id, inviteEmail, inviteRole);
      setInviteEmail("");
      fetchOrgs();
    } catch (err) {
      console.error("Invite error:", err.message);
    }
  };

  const handleRemove = async (userId) => {
    if (!selectedOrg) return;
    try {
      await removeMember(selectedOrg._id, userId);
      fetchOrgs();
    } catch (err) {
      console.error("Remove error:", err.message);
    }
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* Create Organization */}
      <div className="p-6 bg-white border rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Plus className="w-6 h-6 text-indigo-600" /> Create Organization
        </h2>
        <div className="flex gap-3">
          <input
            className="border p-3 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            placeholder="Enter organization name..."
          />
          <button
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
            onClick={handleCreateOrg}
          >
            Create
          </button>
        </div>
      </div>

      {/* List Organizations */}
      <div className="p-6 bg-white border rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-600" /> Your Organizations
        </h2>
        {orgs.length === 0 ? (
          <p className="text-gray-500 italic">No organizations yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {orgs.map((org) => (
              <div
                key={org._id}
                className={`p-4 rounded-lg border cursor-pointer transition hover:shadow ${
                  selectedOrg?._id === org._id
                    ? "bg-indigo-50 border-indigo-400"
                    : "bg-white"
                }`}
                onClick={() => setSelectedOrg(org)}
              >
                <p className="font-semibold text-lg text-gray-800">
                  {org.name}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {org.members?.length || 1} member(s)
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Manage Selected Org */}
      {selectedOrg && (
        <div className="p-6 bg-white border rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Manage Organization:{" "}
            <span className="text-indigo-600">{selectedOrg.name}</span>
          </h2>

          {/* Invite Section */}
          <div className="space-y-3 mb-8">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <Mail className="w-5 h-5 text-green-600" /> Invite Member
            </h3>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                className="border p-3 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Enter user email"
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </select>
              <button
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                onClick={handleInvite}
              >
                Invite
              </button>
            </div>
          </div>

          {/* Members List */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" /> Members
            </h3>
            <div className="divide-y border rounded-lg">
              {selectedOrg.members?.map((m) => (
                <div
                  key={m.user._id || m.user}
                  className="flex justify-between items-center p-3 hover:bg-gray-50 transition"
                >
                  <span className="text-gray-700">
                    <span className="font-medium">
                      {m.user?.name || m.user}
                    </span>{" "}
                    <span className="text-sm text-gray-500">
                      ({m.role})
                    </span>
                  </span>
                  <button
                    className="flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 text-sm transition"
                    onClick={() => handleRemove(m.user._id || m.user)}
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationPage;
