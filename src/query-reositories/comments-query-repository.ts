import { QueryComments } from '../models/query-models'
import { PaginatedType } from '../models/main-models'
import { CommentsTypeOutput } from '../models/comments-models'
import { CommentsModel, PostsModel } from '../repositories/db'
import { getPaginatedType, makeDirectionToNumber } from './helper'
import { ObjectId } from 'mongodb'

class CommentsQueryRepository {
    async getCommentsById(
        id: string,
        query: QueryComments
    ): Promise<PaginatedType<CommentsTypeOutput> | null> {
        const foundPosts = await PostsModel.findById(new ObjectId(id))
        if (!foundPosts) return null
        const countAllDocuments = await CommentsModel.countDocuments({
            postId: id
        })
        const {
            sortBy = 'createdAt',
            sortDirection = 'desc',
            pageNumber = 1,
            pageSize = 10
        } = query
        const sortDirectionNumber = makeDirectionToNumber(sortDirection)
        const skipNumber = (+pageNumber - 1) * +pageSize
        const res = await CommentsModel.find({ postId: id })
            .sort({ [sortBy]: sortDirectionNumber })
            .skip(skipNumber)
            .limit(+pageSize)

        return getPaginatedType(
            res.map(this._getOutputComment),
            +pageSize,
            +pageNumber,
            countAllDocuments
        )
    }
    private _getOutputComment(comment: any): CommentsTypeOutput {
        return {
            id: comment._id.toString(),
            content: comment.content,
            userId: comment.userId,
            userLogin: comment.userLogin,
            createdAt: comment.createdAt
        }
    }
}

export const commentsQueryRepository = new CommentsQueryRepository()
