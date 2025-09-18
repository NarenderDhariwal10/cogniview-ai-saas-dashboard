// src/pages/TaskPage.jsx
import { useEffect, useState } from "react";
import API from "../services/api";
import { getSocket } from "../services/socket";
import { motion, AnimatePresence } from "framer-motion";

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Upcoming");
  const [dueDate, setDueDate] = useState("");

  const orgId = localStorage.getItem("orgId");
  const socket = getSocket();

  // Fetch tasks
  const fetchTasks = async () => {
    if (!orgId) return;
    try {
      const { data } = await API.get(`/tasks?orgId=${orgId}`);
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err.message || err);
    }
  };

  // Real-time updates
  useEffect(() => {
    fetchTasks();
    if (!socket) return;

    socket.emit("joinOrg", orgId);

    const handleTaskUpdate = (update) => {
      if (!update?.type) return;
      switch (update.type) {
        case "create":
          setTasks((prev) => [...prev, update.task]);
          break;
        case "update":
          setTasks((prev) =>
            prev.map((t) => (t._id === update.task._id ? update.task : t))
          );
          break;
        case "delete":
          setTasks((prev) =>
            prev.filter((t) => t._id !== update.task._id)
          );
          break;
        default:
          break;
      }
    };

    socket.on("taskUpdate", handleTaskUpdate);
    return () => socket.off("taskUpdate", handleTaskUpdate);
  }, [orgId, socket]);

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await API.post("/tasks", { title, status, dueDate, orgId });
      setTitle("");
      setStatus("Upcoming");
      setDueDate("");
    } catch (err) {
      console.error("Failed to add task:", err.message || err);
    }
  };

  const toggleDone = async (task) => {
    try {
      await API.put(`/tasks/${task._id}`, { done: !task.done });
    } catch (err) {
      console.error("Failed to toggle task:", err.message || err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await API.delete(`/tasks/${taskId}`);
    } catch (err) {
      console.error("Failed to delete task:", err.message || err);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "Due Today":
        return "bg-red-200 text-red-800";
      case "Tomorrow":
        return "bg-yellow-200 text-yellow-800";
      case "Upcoming":
      default:
        return "bg-blue-200 text-blue-800";
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800">Tasks</h1>

      {/* Add Task */}
      <form
        onSubmit={addTask}
        className="flex flex-col md:flex-row gap-4 bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-gray-200 mb-6"
      >
        <input
          type="text"
          placeholder="Task title"
          className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
        >
          <option value="Due Today">Due Today</option>
          <option value="Tomorrow">Tomorrow</option>
          <option value="Upcoming">Upcoming</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition"
        >
          Add Task
        </button>
      </form>

      {/* Task List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.div
              key={task._id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-5 border border-gray-200 flex justify-between items-center hover:shadow-xl transition"
            >
              <div>
                <h2
                  className={`font-semibold text-lg ${
                    task.done ? "line-through text-gray-400" : "text-gray-800"
                  }`}
                >
                  {task.title}
                </h2>
                <p className="text-sm mt-1 text-gray-500">
                  Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}
                </p>
                <span
                  className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${statusColor(task.status)}`}
                >
                  {task.status}
                </span>
              </div>
              <div className="flex flex-col md:flex-row gap-2">
                <button
                  onClick={() => toggleDone(task)}
                  className={`px-4 py-2 rounded-xl font-medium transition ${
                    task.done
                      ? "bg-gray-400 text-white hover:bg-gray-500"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {task.done ? "Undo" : "Done"}
                </button>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
