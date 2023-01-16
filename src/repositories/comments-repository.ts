import { CommentsTypeInput, CommentsTypeOutput, CommentsTypeToDB } from '../models/comments-models'
import { CommentsModel } from './db'
import { ObjectId } from 'mongodb'

const getOutputComment = (comment: any): CommentsTypeOutput => {
    return {
        id: comment._id.toString(),
        content: comment.content,
        userId: comment.userId,
        userLogin: comment.userLogin,
        createdAt: comment.createdAt
    }
}

export const commentsRepository = {
    async getCommentById(id: string): Promise<CommentsTypeOutput | null> {
        const result = await CommentsModel.findById(new ObjectId(id))
        if (!result) return null
        return getOutputComment(result)
    },
    async createComment(createdComment: CommentsTypeToDB): Promise<CommentsTypeOutput> {
        const result = await CommentsModel.create(createdComment)
        return getOutputComment(result)
    },
    async updateComment(id: string, updatedComment: CommentsTypeInput): Promise<boolean> {
        const result = await CommentsModel.findByIdAndUpdate(new ObjectId(id), updatedComment)
        return !!result
    },
    async deleteComment(id: string): Promise<boolean> {
        const result = await CommentsModel.findByIdAndDelete(new ObjectId(id))
        return !!result
    }
}
