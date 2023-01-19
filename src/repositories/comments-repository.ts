import { CommentsTypeInput, CommentsTypeOutput, CommentsTypeToDB } from '../models/comments-models'
import { CommentsModel } from './db'
import { ObjectId } from 'mongodb'

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
        const currentLike = {
            likesInfo: {
                likesCount: comment.likesInfo.likesCount,
                dislikesCount: comment.likesInfo.dislikesCount,
                myStatus: comment.likesInfo.myStatus
            }
        }
        const  result = await CommentsModel.findByIdAndUpdate(new ObjectId(comment.id), currentLike)
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
    // private _getUpdatedLike(obj: any) {
    //     switch (obj.myStatus) {
    //         case "None":
    //             return obj
    //         case "Like":
    //             return {
    //                 likesInfo: {
    //                     likesCount: obj.likesInfo.likesCount,
    //                     dislikesCount: obj.likesInfo.dislikesCount,
    //                     myStatus: obj.likesInfo.myStatus
    //                 }
    //             }
    //     }
    // }
}
