export type User = {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt?: string;
};

export type Post = {
    id: string;
    p_title: string;
    p_body: string;
    published: boolean;
    authorId: string;
    author?: Pick<User, "id" | "name" | "email">;
    comments?: Comment[];
    likes?: Like[];
    categories?: Category[];
    tags?: Tag[];
    _count?: {
        likes: number;
        comments: number;
    };
    createdAt: string;
    updatedAt: string;
}

export type Comment = {
    id: string;
    content: string;
    authorId: string;
    postId: string;
    author?: Pick<User, "id" | "name">;
    createdAt: string;
    updatedAt: string;
};

export type Category = {
    id: string;
    name: string;
};

export type Tag = {
    id: string;
    name: string;
};

export type Like = {
    id: string;
    userId: string;
    postId: string;
    user?: Pick<User, "id" | "name">;
    post?: Pick<Post, "id" | "p_title">;
    createdAt: string;
}

//API Response Wrappers
export type AuthResponse = {
    message: string;
    data: {
        user: User;
        token: string;
    };
};

export type SignOutResponse ={
    success: boolean;
    message: string;
};


export type ApiResponse<T> ={
    message: string;
    data: T;
};

export type PaginatedResponse<T> = {
    message: string;
    data: T[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalPosts: number;
        limit: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
};