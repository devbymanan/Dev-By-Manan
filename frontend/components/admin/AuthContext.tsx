"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { adminLogin } from "@/lib/adminApi";

const TOKEN_KEY = "dbm_admin_token";

interface AuthContextValue {
  token: string | null;
  /** True once we've checked localStorage for a saved token. */
  ready: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // Real localStorage on purpose — this is the deployed web app, not a
  // Claude artifact, so the "no browser storage" artifact rule doesn't
  // apply here. Persisting the JWT lets a refresh keep the admin logged in.
  useEffect(() => {
    const saved = window.localStorage.getItem(TOKEN_KEY);
    if (saved) setToken(saved);
    setReady(true);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const { token: newToken } = await adminLogin(username, password);
    window.localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
