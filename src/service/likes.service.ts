import {api} from "../lib/api"
import type { ApiResponse, Like } from "../types"

export const likesService = {
    getByPost: (postId: string) =>
        api.get<ApiResponse<Like[]>>(`/likes/posts/${postId}`),

    like: (postId: string) => 
        api.post<ApiResponse<Like>>(`/likes/posts/${postId}`, {}),

    unlike: (postId: string) => 
        api.delete<ApiResponse<null>>(`/likes/posts/${postId}`),
}
