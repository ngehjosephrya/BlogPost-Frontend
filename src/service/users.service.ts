import {api} from "../lib/api";
import type {ApiResponse, User} from "../types/index";

type UpdateUserPayload = {
    name?: string;
    email?: string;
    password?: string;
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

}