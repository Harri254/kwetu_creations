import { createContext, useEffect, useState } from "react";
import { apiRequest } from "../lib/api";

const TOKEN_KEY = "kwetu-auth-token";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  useEffect(() => {
    let isMounted = true;

    if (!token) {
      setUser(null);
      setIsLoading(false);
      return undefined;
    }

    setIsLoading(true);

    apiRequest("/api/auth/me", { token })
      .then((payload) => {
        if (isMounted) {
          setUser(payload.user);
        }
      })
      .catch(() => {
        if (isMounted) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const storeSession = (payload) => {
    localStorage.setItem(TOKEN_KEY, payload.token);
    setToken(payload.token);
    setUser(payload.user);
  };

  const register = async (input) => {
    const payload = await apiRequest("/api/auth/register", {
      method: "POST",
      body: input,
    });

    storeSession(payload);
    return payload.user;
  };

  const login = async (input) => {
    const payload = await apiRequest("/api/auth/login", {
      method: "POST",
      body: input,
    });

    storeSession(payload);
    return payload.user;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoading, isAuthenticated: Boolean(user), register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
