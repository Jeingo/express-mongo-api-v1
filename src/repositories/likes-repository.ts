import { LikesModel } from './db'
import { LikesTypeOutput, LikesTypeToDB, StatusLikeType } from '../models/likes-models'
import { ObjectId } from 'mongodb'
import { injectable } from 'inversify'

@injectable()
export class LikesRepository {
    async getLike(userId: string, commentId: string): Promise<LikesTypeOutput | null> {
        const result = await LikesModel.findOne({ userId: userId, commentId: commentId })
        if (!result) return null
        return this._getOutputLike(result)
    }
    async createLike(newLike: LikesTypeToDB): Promise<LikesTypeOutput> {
        const result = await LikesModel.create(newLike)
        return this._getOutputLike(result)
    }
    async updateLike(likeId: string, status: { myStatus: StatusLikeType }): Promise<boolean> {
        const result = await LikesModel.findByIdAndUpdate(new ObjectId(likeId), status)
        return !!result
    }
    private _getOutputLike(like: any): LikesTypeOutput {
        return {
            id: like._id.toString(),
            userId: like.userId,
            commentId: like.userId,
            myStatus: like.myStatus
        }
    }
}
