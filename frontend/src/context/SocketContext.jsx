import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (!user) return;
    const s = io("https://wealthos-backend-psa5.onrender.com", { withCredentials: true });
    setSocket(s);

    // Listen for budget alerts specific to this user
    s.on(`alert_${user._id}`, (data) => {
      setAlerts(prev => [...prev, { id: Date.now(), message: data.message }]);
      // Auto remove after 5 seconds
      setTimeout(() => {
        setAlerts(prev => prev.filter(a => a.id !== Date.now()));
      }, 5000);
    });

    return () => s.disconnect();
  }, [user]);

  const dismissAlert = (id) => setAlerts(prev => prev.filter(a => a.id !== id));

  return (
    <SocketContext.Provider value={{ socket, alerts, dismissAlert }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);