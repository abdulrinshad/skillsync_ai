import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { useLocation } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [sessions, setSessions] = useState({
    admin: { user: null, token: null },
    teacher: { user: null, token: null },
    student: { user: null, token: null },
  });
  const [loading, setLoading] = useState(true);

  let location;
  try {
    location = useLocation();
  } catch (e) {
    location = { pathname: window.location.pathname };
  }

  const getRoleFromPath = (path) => {
    if (path.startsWith("/admin")) return "admin";
    if (path.startsWith("/teacher")) return "teacher";
    return "student";
  };

  useEffect(() => {
    const roles = ["admin", "teacher", "student"];
    const loadedSessions = {};
    roles.forEach((role) => {
      try {
        const savedUser = localStorage.getItem(`user_${role}`);
        const savedToken = localStorage.getItem(`token_${role}`);
        loadedSessions[role] = {
          user: savedUser ? JSON.parse(savedUser) : null,
          token: savedToken || null,
        };
      } catch (error) {
        console.error(`Error loading session for ${role}:`, error);
      }
    });
    setSessions(loadedSessions);
    setLoading(false);
  }, []);

  const login = (userData, accessToken) => {
    const role = userData.role === "admin" ? "admin" : (userData.role === "teacher" ? "teacher" : "student");

    localStorage.setItem(`user_${role}`, JSON.stringify(userData));
    localStorage.setItem(`token_${role}`, accessToken);

    // Fallbacks for backward compatibility
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", accessToken);

    setSessions((prev) => ({
      ...prev,
      [role]: { user: userData, token: accessToken },
    }));
  };

  const logout = () => {
    const role = getRoleFromPath(location.pathname);

    localStorage.removeItem(`user_${role}`);
    localStorage.removeItem(`token_${role}`);

    // Clear global fallback
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setSessions((prev) => ({
      ...prev,
      [role]: { user: null, token: null },
    }));
  };

  const activeRole = getRoleFromPath(location.pathname);
  const user = sessions[activeRole]?.user || null;
  const token = sessions[activeRole]?.token || null;

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    setUser: (userData) => {
      const role = userData?.role || activeRole;
      localStorage.setItem(`user_${role}`, JSON.stringify(userData));
      setSessions((prev) => ({
        ...prev,
        [role]: { ...prev[role], user: userData },
      }));
    },
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
};