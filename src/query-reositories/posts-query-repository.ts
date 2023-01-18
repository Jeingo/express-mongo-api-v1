import { PostsTypeOutput } from '../models/posts-models'
import { BlogsModel, PostsModel } from '../repositories/db'
import { ObjectId } from 'mongodb'
import { QueryPosts } from '../models/query-models'
import { PaginatedType } from '../models/main-models'
import { getPaginatedType, makeDirectionToNumber } from './helper'

class PostsQueryRepository {
    async getAllPost(query: QueryPosts): Promise<PaginatedType<PostsTypeOutput>> {
        const countAllDocuments = await PostsModel.countDocuments()
        const {
            sortBy = 'createdAt',
            sortDirection = 'desc',
            pageNumber = 1,
            pageSize = 10
        } = query
        const sortDirectionNumber = makeDirectionToNumber(sortDirection)
        const skipNumber = (+pageNumber - 1) * +pageSize
        const res = await PostsModel.find()
            .sort({ [sortBy]: sortDirectionNumber })
            .skip(skipNumber)
            .limit(+pageSize)
        return getPaginatedType(res.map(this._getOutputPost), +pageSize, +pageNumber, countAllDocuments)
    }
    async getPostsById(
        id: string,
        query: QueryPosts
    ): Promise<PaginatedType<PostsTypeOutput> | null> {
        const foundBlogs = await BlogsModel.findById(new ObjectId(id))
        if (!foundBlogs) return null
        const countAllDocuments = await PostsModel.countDocuments({
            blogId: id
        })
        const {
            sortBy = 'createdAt',
            sortDirection = 'desc',
            pageNumber = 1,
            pageSize = 10
        } = query
        const sortDirectionNumber = makeDirectionToNumber(sortDirection)
        const skipNumber = (+pageNumber - 1) * +pageSize
        const res = await PostsModel.find({ blogId: id })
            .sort({ [sortBy]: sortDirectionNumber })
            .skip(skipNumber)
            .limit(+pageSize)

        return getPaginatedType(res.map(this._getOutputPost), +pageSize, +pageNumber, countAllDocuments)
    }
    private _getOutputPost (post: any): PostsTypeOutput {
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt
        }
    }
}

export const postsQueryRepository = new PostsQueryRepository()