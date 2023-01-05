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

export type CommentsTypeToDB = {
    content: string
    userId: string
    userLogin: string
    createdAt: string
    postId: string
}

export type CommentsTypeInputInPost = {
    content: string
}

export type CommentsIdParams = {
    id: string
}