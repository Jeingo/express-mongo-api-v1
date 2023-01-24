import { CommentsLikesModel } from './db'
import { CommentsLikesTypeOutput, CommentsLikesTypeToDB, StatusLikeType } from '../models/likes-models'
import { ObjectId } from 'mongodb'
import { injectable } from 'inversify'

@injectable()
export class CommentsLikesRepository {
    async getLike(userId: string, commentId: string): Promise<CommentsLikesTypeOutput | null> {
        const result = await CommentsLikesModel.findOne({ userId: userId, commentId: commentId })
        if (!result) return null
        return this._getOutputLike(result)
    }
    async createLike(newLike: CommentsLikesTypeToDB): Promise<CommentsLikesTypeOutput> {
        const result = await CommentsLikesModel.create(newLike)
        return this._getOutputLike(result)
    }
    async updateLike(likeId: string, status: { myStatus: StatusLikeType }): Promise<boolean> {
        const result = await CommentsLikesModel.findByIdAndUpdate(new ObjectId(likeId), status)
        return !!result
    }
    private _getOutputLike(like: any): CommentsLikesTypeOutput {
        return {
            id: like._id.toString(),
            userId: like.userId,
            commentId: like.commentId,
            myStatus: like.myStatus
        }
    }
}
