import React from "react";

export default function Avatar({ name }) {
  return (
    <div className="bg-indigo-600 text-white w-10 h-10 flex items-center justify-center rounded-full">
      {name ? name[0].toUpperCase() : "?"}
    </div>
  );
}
