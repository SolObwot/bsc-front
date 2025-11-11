import { createContext, useState, useEffect } from "react";
import { authService } from "../services/auth.service";

export const AuthContext = createContext(null);

const readCachedUser = () => {
  const cached = localStorage.getItem("user");
  if (!cached) return null;
  try {
    return JSON.parse(cached);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => readCachedUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        localStorage.removeItem("user");
        setLoading(false);
        setUser(null);
        return;
      }

      const response = await authService.getCurrentUser();
      const parsedUser = extractUser(response?.data ?? response);

      if (parsedUser) {
        setUser(parsedUser);
        localStorage.setItem("user", JSON.stringify(parsedUser));
      } else {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } else {
        const cachedUser = readCachedUser();
        if (cachedUser) {
          setUser(cachedUser);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const response = await authService.login(credentials);

    const responseData = response?.data ?? response;
    const parsedUser = extractUser(responseData);
    const token =
      responseData?.token ??
      responseData?.access_token ??
      responseData?.data?.token ??
      null;

    if (token) {
      localStorage.setItem("token", token);
    }

    if (parsedUser) {
      setUser(parsedUser);
      localStorage.setItem("user", JSON.stringify(parsedUser));
    }

    return parsedUser;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const extractUser = (payload) => {
  if (!payload) return null;
  if (payload.user) return payload.user;
  if (payload.data?.user) return payload.data.user;
  if (payload.data?.data) return payload.data.data;
  if (payload.data) return payload.data;
  return payload;
};
