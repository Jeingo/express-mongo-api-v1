export type CommentsTypeOutput = {
    id: string
    content: string
    userId: string
    userLogin: string
    createdAt: string
    likesInfo: {
        likesCount: number
        dislikesCount: number
        myStatus: 'None' | 'Like' | 'Dislike'
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
            myStatus: 'None' | 'Like' | 'Dislike'
        }
    ) {
        this.likesInfo.likesCount = likesInfo.likesCount
        this.likesInfo.dislikesCount = likesInfo.dislikesCount
        this.likesInfo.myStatus = likesInfo.myStatus
    }
}

export type CommentsTypeInputInPost = {
    content: string
}

export type CommentsIdParams = {
    id: string
}
