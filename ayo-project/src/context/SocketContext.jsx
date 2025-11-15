 import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useGlobalContext } from "./context";

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user } = useGlobalContext();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) return;
    const url = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : "http://localhost:5000";
    const s = io(url, { transports: ["websocket"] });
    s.on("connect", () => {
      s.emit("join", user._id);
    });
    setSocket(s);
    return () => s.disconnect();
  }, [user]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};
