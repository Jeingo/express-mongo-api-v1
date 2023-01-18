import { BlogsTypeOutput } from '../models/blogs-models'
import { BlogsModel } from '../repositories/db'
import { QueryBlogs } from '../models/query-models'
import { PaginatedType } from '../models/main-models'
import { getPaginatedType, makeDirectionToNumber } from './helper'

class BlogsQueryRepository {
    async getAllBlogs(query: QueryBlogs): Promise<PaginatedType<BlogsTypeOutput>> {
        const {
            searchNameTerm = null,
            sortBy = 'createdAt',
            sortDirection = 'desc',
            pageNumber = 1,
            pageSize = 10
        } = query
        const sortDirectionNumber = makeDirectionToNumber(sortDirection)
        const skipNumber = (+pageNumber - 1) * +pageSize
        let filter = {}
        if (searchNameTerm) {
            filter = { name: { $regex: new RegExp(searchNameTerm, 'gi') } }
        }
        const countAllDocuments = await BlogsModel.countDocuments(filter)
        const res = await BlogsModel.find(filter)
            .sort({ [sortBy]: sortDirectionNumber })
            .skip(skipNumber)
            .limit(+pageSize)
        return getPaginatedType(
            res.map(this._getOutputBlog),
            +pageSize,
            +pageNumber,
            countAllDocuments
        )
    }
    private _getOutputBlog(blog: any): BlogsTypeOutput {
        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt
        }
    }
}

export const blogsQueryRepository = new BlogsQueryRepository()
