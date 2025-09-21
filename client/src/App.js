// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import routes from "./routes";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import FooterNote from "./components/Footer"; // ✅ import
import { useAuth } from "./hooks/useAuth";
import { ToastContainer } from "react-toastify";

export default function App() {
  const { user } = useAuth();

  return (
    <>
      <div className="flex h-screen bg-gray-50">
        {user && <Sidebar />}
        <div className="flex flex-col flex-1">
          {user && <Navbar />}
          <main className="flex-1 p-6 overflow-y-auto">
            <Routes>
              {routes.map(({ path, element }, index) => (
                <Route key={index} path={path} element={element} />
              ))}
            </Routes>
          </main>
          <FooterNote />
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
