import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiLogin, apiMe, apiRegister, AuthUser, setAccessToken } from '../lib/api';

const TOKEN_KEY = 'cr_access_token';

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (input: { email: string; password: string }) => Promise<void>;
  register: (input: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAccessToken(token);
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }, [token]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(async (input: { email: string; password: string }) => {
    const res = await apiLogin(input);
    setToken(res.token);
    setUser(res.user);
  }, []);

  const register = useCallback(async (input: { name: string; email: string; password: string }) => {
    const res = await apiRegister(input);
    setToken(res.token);
    setUser(res.user);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        if (!token) {
          if (!cancelled) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        const res = await apiMe();
        if (!cancelled) {
          setUser(res.user);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          logout();
          setLoading(false);
        }
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [token, logout]);

  const value = useMemo<AuthState>(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
