import React from "react";

export default function Card({ title, children }) {
  return (
    <div className="bg-white shadow rounded p-4">
      {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}
      {children}
    </div>
  );
}
