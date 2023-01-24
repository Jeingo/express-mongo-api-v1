export type StatusLikeType = 'None' | 'Like' | 'Dislike'

export type LikesType = {
    likeStatus: StatusLikeType
}

export type LikesInfoType = {
    likesCount: number
    dislikesCount: number
}

export type CommentsLikesTypeOutput = {
    id: string
    userId: string
    commentId: string
    myStatus: StatusLikeType
}

export type PostsLikesTypeOutput = {
    id: string
    userId: string
    postId: string
    myStatus: StatusLikeType
}

export class CommentsLikesTypeToDB {
    constructor(public userId: string, public commentId: string, public myStatus: StatusLikeType) {}
}

export class PostsLikesTypeToDB {
    constructor(public userId: string, public postId: string, public myStatus: StatusLikeType) {}
}
