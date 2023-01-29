import { CommentId, CommentsTypeInput, CommentsTypeOutput, CommentsTypeToDB } from '../models/comments-models'
import { CommentsModel } from './db/db'
import { ObjectId } from 'mongodb'
import { StatusLikeType } from '../models/likes-models'
import { injectable } from 'inversify'
import { getUpdatedLike } from './helper'

@injectable()
export class CommentsRepository {
    async createComment(createdComment: CommentsTypeToDB): Promise<CommentId> {
        const result = await CommentsModel.create(createdComment)
        return result._id.toString()
    }
    async updateComment(id: string, updatedComment: CommentsTypeInput): Promise<boolean> {
        const result = await CommentsModel.findByIdAndUpdate(new ObjectId(id), updatedComment)
        return !!result
    }
    async updateLikeInComment(
        comment: CommentsTypeOutput,
        lastStatus: StatusLikeType,
        newStatus: StatusLikeType
    ): Promise<boolean> {
        const newLikesInfo = getUpdatedLike(
            {
                likesCount: comment.likesInfo.likesCount,
                dislikesCount: comment.likesInfo.dislikesCount
            },
            lastStatus,
            newStatus
        )
        const result = await CommentsModel.findByIdAndUpdate(new ObjectId(comment.id), { likesInfo: newLikesInfo })
        return !!result
    }
    async deleteComment(id: string): Promise<boolean> {
        const result = await CommentsModel.findByIdAndDelete(new ObjectId(id))
        return !!result
    }
}
