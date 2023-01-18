export type CommentsTypeOutput = {
    id: string
    content: string
    userId: string
    userLogin: string
    createdAt: string
}

export type CommentsTypeInput = {
    content: string
}

export class CommentsTypeToDB {
    constructor(
        public content: string,
        public userId: string,
        public userLogin: string,
        public createdAt: string,
        public postId: string
    ) {}
}

export type CommentsTypeInputInPost = {
    content: string
}

export type CommentsIdParams = {
    id: string
}
