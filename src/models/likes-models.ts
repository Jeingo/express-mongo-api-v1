export type LikesType = {
    likeStatus: StatusLikeType
}

export type StatusLikeType = 'None' | 'Like' | 'Dislike'

export type LikesTypeOutput = {
    id: string
    userId: string
    commentId: string
    myStatus: StatusLikeType
}

export type LikesInfoType = {
    likesCount: number
    dislikesCount: number
}

export class LikesTypeToDB {
    constructor(public userId: string, public commentId: string, public myStatus: StatusLikeType) {}
}
