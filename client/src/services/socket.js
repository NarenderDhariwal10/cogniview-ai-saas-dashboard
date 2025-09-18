// client/src/services/socket.js
import { io } from "socket.io-client";

let socket;

export const initSocket = (token) => {
  if (!socket) {
    socket = io(process.env.REACT_APP_API_URL || "http://localhost:4000", {
      auth: { token },
      transports: ["websocket"],
      withCredentials: true,
    });

    // automatic reconnect options are handled by socket.io by default
    socket.on("connect_error", (err) => {
      console.warn("Socket connect_error:", err.message);
    });
  }
  return socket;
};

export const getSocket = () => socket;
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
