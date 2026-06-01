import {api} from "../lib/api";
import type {AuthResponse, SignOutResponse} from "../types";

type SignUpPayload = {
    name: string;
    email: string;
    password: string;
};

type SignInPayload = {
    email: string;
    password: string;
}

export const authService = {
    signUp: (data: SignUpPayload) => 
        api.post<AuthResponse>("/auth/sign-up", data),

    signIn: (data: SignInPayload) => 
        api.post<AuthResponse>("/auth/sign-in", data),

    signOut: () => 
        api.post<SignOutResponse>("/auth/sign-out", {}),
};

