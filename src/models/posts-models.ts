import { StatusLikeType } from './likes-models'

type NewestLikesType = {
    addedAt: string
    userId: string
    login: string
}

export type PostsTypeOutput = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
    extendedLikesInfo: {
        likesCount: number
        dislikesCount: number
        myStatus: StatusLikeType
        newestLikes: Array<NewestLikesType>
    }
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
        public createdAt: string,
        public extendedLikesInfo: {
            likesCount: number
            dislikesCount: number
        }
    ) {
        this.extendedLikesInfo.likesCount = extendedLikesInfo.likesCount
        this.extendedLikesInfo.dislikesCount = extendedLikesInfo.dislikesCount
    }
}

export type PostsIdParams = {
    id: string
}
