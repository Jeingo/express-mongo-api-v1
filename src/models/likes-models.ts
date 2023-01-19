export type LikesType = {
    likeStatus: 'None' | 'Like' | 'Dislike'
}

export type CommentsIdParams = {
    id: string
}

export type LikesInfoType = {
    likesCount: number
    dislikesCount: number
    myStatus: string
}
