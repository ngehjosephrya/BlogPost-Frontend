export type User = {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
};

export type Post = {
    id: string;
    p_title: string;
    p_body: string;
    published: boolean;
    authorId: string;
    author?: User;
    comments?: Comment[];
    likes?: Like[];
    categories?: Category[];
    tags?: Tag[];
    createdAt: string;
    updatedAt: string;
}

export type Comment = {
    id: string;
    content: string;
    authorId: string;
    postId: string;
    author?: User;
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

export type PagninatedResponse<T> = {
    message: string;
    data: T[];
    total: number;
    page: number;
}