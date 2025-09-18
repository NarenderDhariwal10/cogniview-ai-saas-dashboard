import React from "react";

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white rounded shadow-lg p-6 w-1/3">
        <button onClick={onClose} className="text-gray-500 float-right">✖</button>
        {children}
      </div>
    </div>
  );
}
