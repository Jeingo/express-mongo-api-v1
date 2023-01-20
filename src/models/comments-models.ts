import { StatusLikeType } from './likes-models'

export type CommentsTypeOutput = {
    id: string
    content: string
    userId: string
    userLogin: string
    createdAt: string
    likesInfo: {
        likesCount: number
        dislikesCount: number
        myStatus: StatusLikeType
    }
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
        public postId: string,
        public likesInfo: {
            likesCount: number
            dislikesCount: number
        }
    ) {
        this.likesInfo.likesCount = likesInfo.likesCount
        this.likesInfo.dislikesCount = likesInfo.dislikesCount
    }
}

export type CommentsTypeInputInPost = {
    content: string
}

export type CommentsIdParams = {
    id: string
}
