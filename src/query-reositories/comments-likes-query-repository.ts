import { injectable } from 'inversify'
import { CommentsLikesTypeOutput } from '../models/likes-models'
import {CommentsLikesModel} from "../domain/commentsLikes-entity";

@injectable()
export class CommentsLikesQueryRepository {
    async getLike(userId: string, commentId: string): Promise<CommentsLikesTypeOutput | null> {
        const result = await CommentsLikesModel.findOne({ userId: userId, commentId: commentId })
        if (!result) return null
        return this._getOutputLike(result)
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
