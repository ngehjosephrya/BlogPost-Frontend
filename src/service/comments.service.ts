import {api} from "../lib/api";
import type {ApiResponse, Comment} from "../types";

type CreateCommentPayload = {
    content: string;
};

type UpdateCommentPayload = {
    content: string;
};

export const commentsService = {
    getByPost: (postId: string) =>
        api.get<ApiResponse<Comment[]>>(`/comments/posts/${postId}`),

    create: (postId: string, data: CreateCommentPayload) =>
        api.post<ApiResponse<Comment>>(`/comments/posts/${postId}`, data),

    update: (id: string, data: UpdateCommentPayload) =>
        api.put<ApiResponse<Comment>>(`/comments/${id}`, data),

    delete: (id: string) =>
        api.delete<ApiResponse<Comment>>(`/comments/${id}`),
};
