// client/src/components/ProjectModal.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import  { createProject, updateProject, emitEvent } from "../services/api";

export default function ProjectModal({ project, onClose, onSaved }) {
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");
  const [loading, setLoading] = useState(false);
  const isEdit = typeof project?._id === "string";

  useEffect(() => {
    setName(project?.name || "");
    setDescription(project?.description || "");
  }, [project]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Project name required");
    setLoading(true);
    try {
      let res;
      if (isEdit) {
        res = await updateProject(project._id, { name, description });
        // optimistic broadcast (server should also broadcast)
        emitEvent("projectUpdated", res.data?.data || res.data);
        onSaved && onSaved(res.data?.data || res.data);
      } else {
        res = await createProject({ name, description });
        emitEvent("projectCreated", res.data?.data || res.data);
        onSaved && onSaved(res.data?.data || res.data);
      }
      onClose();
    } catch (err) {
      console.error("Save project error:", err);
      alert(err.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div
        className="relative bg-white rounded-lg shadow-lg w-full max-w-lg p-6 z-10"
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h3 className="text-lg font-semibold mb-4">{isEdit ? "Edit Project" : "Create Project"}</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-sm block mb-1">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Project name"
              required
            />
          </div>
          <div>
            <label className="text-sm block mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Short description"
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Create Project"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
