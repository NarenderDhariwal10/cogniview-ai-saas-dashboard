// client/src/pages/ProjectDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectById } from "../services/api";
import ProjectModal from "../components/ProjectModal";
import { initSocket, getSocket } from "../services/socket";
import { motion } from "framer-motion";
import { Edit2 } from "lucide-react";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getProjectById(id);
      const payload = res.data?.data ?? res.data;
      setProject(payload);
    } catch (err) {
      console.error(err);
      alert("Failed to load project");
      navigate("/projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const token = localStorage.getItem("token");
    const socket = initSocket(token);

    socket.on("projectUpdated", (proj) => {
      if (proj && proj._id === id) setProject(proj);
    });
    socket.on("projectDeleted", ({ id: deletedId }) => {
      if (deletedId === id) {
        alert("Project was deleted");
        navigate("/projects");
      }
    });

    return () => {
      const s = getSocket();
      s?.off("projectUpdated");
      s?.off("projectDeleted");
    };
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading project details...
      </div>
    );

  if (!project)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Project not found
      </div>
    );

  const userId = localStorage.getItem("userId");
  const isAdmin = project.members?.some(
    (m) => m.role === "admin" && (m.user?._id ?? m.user) === userId
  );

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Project Info Card */}
      <motion.div
        className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">{project.name}</h1>
            <p className="text-gray-600 mt-2">{project.description || "No description provided."}</p>
            <p className="text-sm text-gray-400 mt-3">
              Owner: <span className="font-medium text-gray-700">{project.owner?.name || "—"}</span>
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1 px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-semibold shadow transition"
            >
              <Edit2 className="w-4 h-4" /> Edit
            </button>
          )}
        </div>

        {/* Members Section */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Members</h3>
          <div className="flex flex-col gap-3">
            {project.members?.map((m) => (
              <div
                key={m.user?._id || m.user}
                className="flex justify-between items-center p-3 border rounded-lg hover:shadow-md transition bg-gray-50"
              >
                <div>
                  <p className="font-medium text-gray-800">{m.user?.name || m.user}</p>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    m.role === "admin"
                      ? "bg-red-100 text-red-700"
                      : m.role === "editor"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}>
                    {m.role.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Modal */}
      {modalOpen && (
        <ProjectModal
          project={project}
          onClose={() => setModalOpen(false)}
          onSaved={(p) => setProject(p)}
        />
      )}
    </div>
  );
}
