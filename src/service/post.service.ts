import {api} from "../lib/api";
import type {ApiResponse,PaginatedResponse, Post} from "../types";

type CreatePostPayload = {
    p_title: string;
    p_body: string;
    published: boolean;
    categories: string[];
    tags: string[];
}

type UpdatePostPayload = {
    p_title?: string;
    p_body?: string;
    published?: boolean;
    categories?: string[];
    tags?: string[];
}

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
        api.post<ApiResponse<Post>>("/posts", { data }),

    update: (id: string, data: UpdatePostPayload) =>
        api.put<ApiResponse<Post>>(`/posts/${id}`, data),

    delete: (id: string) => 
        api.delete<ApiResponse<null>>(`/posts/${id}`),
};