import {CommentId, CommentsTypeInput, CommentsTypeOutput, CommentsTypeToDB} from '../models/comments-models'
import { CommentsModel } from './db/db'
import { ObjectId } from 'mongodb'
import { LikesInfoType, StatusLikeType } from '../models/likes-models'
import { injectable } from 'inversify'

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
        const newLikesInfo = this._getUpdatedLike(
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
    private _getUpdatedLike(likesInfo: LikesInfoType, lastStatus: StatusLikeType, newStatus: StatusLikeType) {
        if (newStatus === 'None' && lastStatus === 'Like') {
            return { ...likesInfo, likesCount: --likesInfo.likesCount }
        }
        if (newStatus === 'None' && lastStatus === 'Dislike') {
            return { ...likesInfo, dislikesCount: --likesInfo.dislikesCount }
        }
        if (newStatus === 'Like' && lastStatus === 'None') {
            return { ...likesInfo, likesCount: ++likesInfo.likesCount }
        }
        if (newStatus === 'Like' && lastStatus === 'Dislike') {
            return {
                ...likesInfo,
                likesCount: ++likesInfo.likesCount,
                dislikesCount: --likesInfo.dislikesCount
            }
        }
        if (newStatus === 'Dislike' && lastStatus === 'None') {
            return { ...likesInfo, dislikesCount: ++likesInfo.dislikesCount }
        }
        if (newStatus === 'Dislike' && lastStatus === 'Like') {
            return {
                ...likesInfo,
                likesCount: --likesInfo.likesCount,
                dislikesCount: ++likesInfo.dislikesCount
            }
        }
        return likesInfo
    }
}
