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
            `/post?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
        ),
    
    getById: (id: string) => 
        api.get<ApiResponse<Post>>(`/post/${id}`),

    getByUserId: (userId: string) =>
        api.get<{success: boolean; data: Post[]}>(`/post/users/${userId}`),

    create: (data: CreatePostPayload) =>
        api.post<ApiResponse<Post>>("/post", { data }),

    update: (id: string, data: UpdatePostPayload) =>
        api.put<ApiResponse<Post>>(`/post/${id}`, data),

    delete: (id: string) => 
        api.delete<ApiResponse<null>>(`/post/${id}`),
};