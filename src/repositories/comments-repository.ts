import { CommentsTypeInput, CommentsTypeOutput, CommentsTypeToDB } from '../models/comments-models'
import { CommentsModel } from './db'
import { ObjectId } from 'mongodb'
import { LikesInfoType } from '../models/likes-models'

export class CommentsRepository {
    async getCommentById(id: string): Promise<CommentsTypeOutput | null> {
        const result = await CommentsModel.findById(new ObjectId(id))
        if (!result) return null
        return this._getOutputComment(result)
    }
    async createComment(createdComment: CommentsTypeToDB): Promise<CommentsTypeOutput> {
        const result = await CommentsModel.create(createdComment)
        return this._getOutputComment(result)
    }
    async updateComment(id: string, updatedComment: CommentsTypeInput): Promise<boolean> {
        const result = await CommentsModel.findByIdAndUpdate(new ObjectId(id), updatedComment)
        return !!result
    }
    async updateLikeInComment(comment: CommentsTypeOutput, status: string): Promise<boolean> {
        const newLike = this._getUpdatedLike(
            {
                likesCount: comment.likesInfo.likesCount,
                dislikesCount: comment.likesInfo.dislikesCount,
                myStatus: comment.likesInfo.myStatus
            },
            status
        )
        const result = await CommentsModel.findByIdAndUpdate(new ObjectId(comment.id), { likesInfo: newLike })
        return !!result
    }
    async deleteComment(id: string): Promise<boolean> {
        const result = await CommentsModel.findByIdAndDelete(new ObjectId(id))
        return !!result
    }
    private _getOutputComment(comment: any): CommentsTypeOutput {
        return {
            id: comment._id.toString(),
            content: comment.content,
            userId: comment.userId,
            userLogin: comment.userLogin,
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: comment.likesInfo.likesCount,
                dislikesCount: comment.likesInfo.dislikesCount,
                myStatus: comment.likesInfo.myStatus
            }
        }
    }
    private _getUpdatedLike(currentLike: LikesInfoType, status: string) {
        if (status === 'None' && currentLike.myStatus === 'Like') {
            return { ...currentLike, likesCount: --currentLike.likesCount, myStatus: status }
        }
        if (status === 'None' && currentLike.myStatus === 'Dislike') {
            return { ...currentLike, dislikesCount: --currentLike.dislikesCount, myStatus: status }
        }
        if (status === 'Like' && currentLike.myStatus === 'None') {
            return { ...currentLike, likesCount: ++currentLike.likesCount, myStatus: status }
        }
        if (status === 'Like' && currentLike.myStatus === 'Dislike') {
            return {
                ...currentLike,
                likesCount: ++currentLike.likesCount,
                dislikesCount: --currentLike.dislikesCount,
                myStatus: status
            }
        }
        if (status === 'Dislike' && currentLike.myStatus === 'None') {
            return { ...currentLike, dislikesCount: ++currentLike.dislikesCount, myStatus: status }
        }
        if (status === 'Dislike' && currentLike.myStatus === 'Like') {
            return {
                ...currentLike,
                likesCount: --currentLike.likesCount,
                dislikesCount: ++currentLike.dislikesCount,
                myStatus: status
            }
        }
        return currentLike
    }
}
