// client/src/pages/Projects.jsx
import React, { useEffect, useState, useCallback } from "react";
import { getProjects, deleteProject, emitEvent } from "../services/api";
import ProjectModal from "../components/ProjectModal";
import DeleteConfirmation from "../components/DeleteConfirmation";
import { initSocket, getSocket } from "../services/socket";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit2 } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProjects();
      const payload = res.data?.data ?? res.data?.projects ?? res.data;
      setProjects(Array.isArray(payload) ? payload : []);
    } catch (err) {
      console.error("Load projects failed", err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const token = localStorage.getItem("token") || null;
    const socket = initSocket(token);

    socket.on("projectCreated", (proj) => {
      setProjects((prev) => {
        if (!proj) return prev;
        if (prev.some((p) => p._id === proj._id)) return prev;
        return [proj, ...prev];
      });
    });
    socket.on("projectUpdated", (proj) => {
      setProjects((prev) => prev.map((p) => (p._id === proj._id ? proj : p)));
    });
    socket.on("projectDeleted", ({ id }) => {
      setProjects((prev) => prev.filter((p) => p._id !== id));
    });

    return () => {
      const s = getSocket();
      s?.off("projectCreated");
      s?.off("projectUpdated");
      s?.off("projectDeleted");
    };
  }, [load]);

  const handleCreate = () => {
    setSelected(null);
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setSelected(p);
    setModalOpen(true);
  };

  const confirmDelete = (id) => setDeletingId(id);

  const handleDelete = async () => {
    if (!deletingId) return;
    const prev = projects;
    setProjects((p) => p.filter((x) => x._id !== deletingId));
    setDeletingId(null);
    try {
      await deleteProject(deletingId);
      emitEvent("projectDeleted", { id: deletingId });
    } catch (err) {
      console.error("Delete failed", err);
      setProjects(prev);
      alert(err.message || "Delete failed");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading projects...
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-5 py-2 rounded-xl font-medium shadow hover:from-indigo-700 hover:to-blue-700 transition"
        >
          <Plus size={18} /> New Project
        </button>
      </div>

      {/* Empty state */}
      {projects.length === 0 ? (
        <motion.div
          className="bg-white shadow-xl rounded-2xl p-10 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-gray-500 mb-4 text-lg">No projects yet — start building your first one!</p>
          <button
            onClick={handleCreate}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow hover:bg-indigo-700 transition"
          >
            Create Project
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <motion.div
              key={p._id}
              className="bg-white rounded-2xl shadow-lg p-6 relative hover:shadow-2xl transition cursor-pointer"
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="font-semibold text-xl text-gray-800">{p.name}</h2>
              <p className="text-gray-600 mt-2 text-sm">{p.description || "No description"}</p>
              <p className="mt-3 text-xs text-gray-400">
                Created: {new Date(p.createdAt).toLocaleDateString()}
              </p>

              {/* Actions */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => openEdit(p)}
                  title="Edit"
                  className="p-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 shadow-sm transition"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => confirmDelete(p._id)}
                  title="Delete"
                  className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 shadow-sm transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <ProjectModal
          project={selected}
          onClose={() => {
            setModalOpen(false);
            setSelected(null);
          }}
          onSaved={(proj) => {
            setProjects((prev) => {
              if (!proj) return prev;
              if (prev.some((p) => p._id === proj._id)) {
                return prev.map((p) => (p._id === proj._id ? proj : p));
              }
              return [proj, ...prev];
            });
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deletingId && (
        <DeleteConfirmation
          title="Delete Project?"
          description="This action cannot be undone. The project will be removed for all team members."
          onCancel={() => setDeletingId(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
