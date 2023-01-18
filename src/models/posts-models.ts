export type PostsTypeOutput = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export type PostsTypeInput = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}

export type PostsUpdateType = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
}

export type PostsTypeInputInBlog = {
    title: string
    shortDescription: string
    content: string
}

export class PostsTypeToDB {
    constructor(
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public blogName: string,
        public createdAt: string
    ) {}
}

export type PostsIdParams = {
    id: string
}
