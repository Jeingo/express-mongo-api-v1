import {QueryComments} from "../models/query-models";
import {PaginatedType} from "../models/main-models";
import {CommentsTypeOutput} from "../models/comments-models";
import {commentsCollection, postsCollection} from "../repositories/db";
import {getPaginatedType, makeDirectionToNumber} from "./helper";
import {ObjectId} from "mongodb";

const getOutputComment = (comment: any): CommentsTypeOutput => {
    return {
        id: comment._id.toString(),
        content: comment.content,
        userId: comment.userId,
        userLogin: comment.userLogin,
        createdAt: comment.createdAt
    }
}

export const commentsQueryRepository = {
    async getCommentsById(id: string, query: QueryComments): Promise<PaginatedType<CommentsTypeOutput> | null> {
        const foundPosts = await postsCollection.findOne({_id: new ObjectId(id)})

        if (!foundPosts) {
            return null
        }
        const countAllDocuments = await commentsCollection.countDocuments({postId: id})
        const {sortBy = 'createdAt', sortDirection = 'desc', pageNumber = 1, pageSize = 10} = query
        const sortDirectionNumber = makeDirectionToNumber(sortDirection)
        const skipNumber = (+pageNumber - 1) * +pageSize
        const res = await commentsCollection
            .find({postId: id})
            .sort({[sortBy]: sortDirectionNumber})
            .skip(skipNumber)
            .limit(+pageSize)
            .toArray()

        return getPaginatedType(res.map(getOutputComment), +pageSize, +pageNumber, countAllDocuments)
    }
}