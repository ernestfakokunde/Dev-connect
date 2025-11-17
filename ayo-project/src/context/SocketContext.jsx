import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useGlobalContext } from "./context";

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user } = useGlobalContext();
  const [socket, setSocket] = useState(null);

  const getSocketUrl = () => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
    const httpBase = import.meta.env.VITE_SOCKET_URL || apiBase.replace(/\/api$/, "");
    if (httpBase.startsWith("https://")) return httpBase.replace("https://", "wss://");
    if (httpBase.startsWith("http://")) return httpBase.replace("http://", "ws://");
    return httpBase;
  };

  useEffect(() => {
    if (!user) return;
    const s = io(getSocketUrl(), { transports: ["websocket"] });
    s.on("connect", () => {
      s.emit("join", user._id);
    });
    setSocket(s);
    return () => s.disconnect();
  }, [user]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};
