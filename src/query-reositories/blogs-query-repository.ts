import { BlogsTypeOutput } from '../models/blogs-models'
import { BlogsModel } from '../repositories/db/db'
import { QueryBlogs } from '../models/query-models'
import { PaginatedType } from '../models/main-models'
import { getPaginatedType, makeDirectionToNumber } from './helper'
import { injectable } from 'inversify'
import {ObjectId} from "mongodb";

@injectable()
export class BlogsQueryRepository {
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
        return getPaginatedType(res.map(this._getOutputBlog), +pageSize, +pageNumber, countAllDocuments)
    }
    async getBlogById(id: string): Promise<BlogsTypeOutput | null> {
        const result = await BlogsModel.findById(new ObjectId(id))
        if (!result) return null
        return this._getOutputBlog(result)
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
