// contexts/AuthContext.tsx
import { createContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import type { User } from "../types";
import { authService } from "../service/auth.service";

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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Fixed rehydration - this is the key fix
  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const response = await authService.getCurrentUser();
        
        // Fixed: Properly access nested data
        if (response?.success && response?.data) {
          setUser(response.data);
          localStorage.setItem("user", JSON.stringify(response.data));
        } else {
          // Fallback to localStorage
          const stored = localStorage.getItem("user");
          if (stored) {
            setUser(JSON.parse(stored));
          }
        }
      } catch (error) {
        console.log("Auth rehydration failed:", error);
        // Don't redirect here - just clear user
        const stored = localStorage.getItem("user");
        if (stored) {
          try {
            setUser(JSON.parse(stored));
          } catch {
            localStorage.removeItem("user");
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await authService.signIn({ email, password });
      
      // Fixed: Proper response structure handling
      if (response?.data?.user) {
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err: any) {
      const message = err.message || "Sign in failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await authService.signUp({ name, email, password });
      
      // Fixed: Proper response structure handling
      if (response?.data?.user) {
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err: any) {
      const message = err.message || "Sign up failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authService.signOut();
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
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