import {api} from "../lib/api";
import type {ApiResponse,PaginatedResponse, Post} from "../types";

type CreatePostPayload = {
    p_title: string;
    p_body: string;
    imageUrl?: string;
    published?: boolean;
    categories?: string[];
    tags?: string[];
}

type UpdatePostPayload = {
    p_title?: string;
    p_body?: string;
    imageUrl?: string;
    published?: boolean;
    categories?: string[];
    tags?: string[];
}

type ImageUplaodResponse = {
    success: boolean;
    message: string;
    data : {
        url: string;
        publicId: string;
        width: number;
        height: number;
    };
};

export const postService = {
    getAll: (page= 1, limit=10, search = "") =>
        api.get<PaginatedResponse<Post>>(
            `/posts?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
        ),
    
    getById: (id: string) => 
        api.get<ApiResponse<Post>>(`/posts/${id}`),

    getByUserId: (userId: string) =>
        api.get<{success: boolean; data: Post[]}>(`/posts/users/${userId}`),

    create: (data: CreatePostPayload) =>
        api.post<ApiResponse<Post>>("/posts", data),

    update: (id: string, data: UpdatePostPayload) =>
        api.put<ApiResponse<Post>>(`/posts/${id}`, data),

    delete: (id: string) => 
        api.delete<ApiResponse<null>>(`/posts/${id}`),
    
    uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const token = localStorage.getItem("token");

    const BASE_URL = import.meta.env.VITE_API_URL ?? "/api/v1";

    const res = await fetch(`${BASE_URL}/upload/image`, {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data: ImageUplaodResponse = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Image upload failed");
    }

    return data.data.url;
    },
};
