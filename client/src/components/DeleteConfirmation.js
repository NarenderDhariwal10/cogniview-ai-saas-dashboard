// client/src/components/DeleteConfirmation.jsx
import React from "react";
import { motion } from "framer-motion";

export default function DeleteConfirmation({ onConfirm, onCancel, title = "Are you sure?" , description }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <motion.div
        className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6 z-10"
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && <p className="text-sm text-gray-600 mt-2">{description}</p>}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onCancel} className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}
