// service/auth.service.ts
import { api } from "../lib/api";

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success?: boolean;
  message: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      avatarUrl: string | null;
      createdAt: string;
    };
    token?: string;
  };
}

export const authService = {
  signIn: async (credentials: SignInCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/signin", credentials);
    return response;
  },

  signUp: async (data: SignUpData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/signup", data);
    return response;
  },

  signOut: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>("/auth/signout", {});
    return response;
  },

  getCurrentUser: async (): Promise<{ success: boolean; data: any }> => {
    const response = await api.get<{ success: boolean; data: any }>("/auth/me");
    return response;
  },
};