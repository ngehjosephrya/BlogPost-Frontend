import { createContext, useState, useEffect, useCallback, use } from "react";
import type { ReactNode } from "react";
import type { User } from "../types";
import { authService } from "../service/auth.service";
import { api } from "../lib/api";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  error: string | null;
  clearError: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  useEffect(() => {
    const rehydrate = async () => {
      try {
        const res = await api.get<{ success: boolean; data: User }>("/auth/me");
        const freshUser = res.data;

        const stored = localStorage.getItem("user");
        const storedUser = stored ? JSON.parse(stored): {};

        const mergedUser = { ...storedUser, ...freshUser };

        setUser(mergedUser);
        localStorage.setItem("user", JSON.stringify(mergedUser));
      } catch {
        setUser(null);
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    rehydrate();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setError(null);

      const res = await authService.signIn({ email, password });

      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign in failed";
      setError(message);
      throw err;
    }
  }, []);

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        setError(null);

        const res = await authService.signUp({ name, email, password });
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Sign up failed";
        setError(message);
        throw err;
      }
    },
    [],
  );

  const signOut = useCallback(async () => {
    try {
      await authService.signOut();
    } catch (err) {
    } finally {
      setUser(null);
      localStorage.removeItem("user");
    }
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    signIn,
    signUp,
    signOut,
    updateUser,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
