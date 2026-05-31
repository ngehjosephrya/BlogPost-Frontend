import {api} from "../lib/api";
import type {ApiResponse, User} from "../types/index";

type UpdateUserPayload = {
    name?: string;
    email?: string;
    password?: string;
    avatarUrl?: string;
};

type AvatarUploadResponse = {
    success: boolean;
    message: string;
    data: {
        url: string;
        publicId: string;
        width: number;
        height: number;
    };
};

export const usersService = {
    getAll: () => 
        api.get<{success: boolean; data: User[]}>("/users"),

    getById: (id: string) => 
        api.get<ApiResponse<User>>(`/users/${id}`),

    update: (id: string, data: UpdateUserPayload) =>
        api.put<ApiResponse<User>>(`/users/${id}`, data),

    delete: (id: string) =>
        api.delete<ApiResponse<User>>(`/users/${id}`),

    uploadAvatar: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const BASE_URL = import.meta.env.VITE_API_URL ?? "/api/v1";

    const res = await fetch(`${BASE_URL}/upload/avatar`,{
      method:      "POST",
      credentials: "include",
      body:        formData,
    });

    const data: AvatarUploadResponse = await res.json();

    if (!res.ok) {
      throw new Error(data.message ?? "Avatar upload failed");
    }

    return data.data.url;
  },
}