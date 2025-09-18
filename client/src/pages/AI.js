import React, { useState } from "react";
import { chatAI, uploadCSV } from "../services/api";
import Card from "../components/Cards";
import Button from "../components/Button";

export default function AI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(false);
  const [csvLoading, setCsvLoading] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    setError("");
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await chatAI(input);
      const botMsg = { role: "assistant", content: res.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      setError(err.response?.data?.message || "AI chat failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError("");
    setCsvLoading(true);

    try {
      const res = await uploadCSV(file);
      setInsights(res.insights);
    } catch (err) {
      console.error("CSV upload error:", err);
      setError(err.response?.data?.message || "CSV analysis failed");
      setInsights("");
    } finally {
      setCsvLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar: Chat history */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-white shadow-lg">
        <div className="p-6 border-b">
          <Button className="w-full">+ New Conversation</Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <h2 className="font-semibold mb-3">Chat History</h2>
          {messages.length === 0 ? (
            <p className="text-gray-400 text-sm">No conversations yet</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {messages
                .filter((m) => m.role === "user")
                .map((m, i) => (
                  <li
                    key={i}
                    className="truncate text-blue-600 hover:underline cursor-pointer"
                  >
                    {m.content}
                  </li>
                ))}
            </ul>
          )}
        </div>
        <div className="p-4 border-t text-xs text-gray-400">
          © 2025 Cogniview
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* CSV Upload */}
        <div className="border-b bg-white p-4 flex justify-between items-center shadow-sm">
          <div>
            <h1 className="font-bold text-lg">CSV Insights</h1>
            <p className="text-sm text-gray-500">
              Upload a .csv file to generate AI-powered insights.
            </p>
          </div>
          <label className="cursor-pointer">
            <span className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm">
              {csvLoading ? "Analyzing..." : "Upload CSV"}
            </span>
            <input
              type="file"
              accept=".csv"
              onChange={handleUpload}
              disabled={csvLoading}
              className="hidden"
            />
          </label>
        </div>

        {/* Insights */}
        {insights && (
          <div className="p-6">
            <Card>
              <h2 className="font-semibold mb-2">Insights</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{insights}</p>
            </Card>
          </div>
        )}

        {/* Chat Section */}
        <div className="flex-1 flex flex-col p-6 overflow-y-auto">
          <Card className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 p-4">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`max-w-[75%] px-4 py-2 rounded-lg shadow-sm text-sm ${
                    m.role === "user"
                      ? "bg-blue-600 text-white ml-auto"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {m.content}
                </div>
              ))}
              {loading && (
                <p className="text-gray-400 text-sm">AI is typing...</p>
              )}
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            {/* Input */}
            <div className="p-4 border-t flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <Button onClick={sendMessage} disabled={loading}>
                Send
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
