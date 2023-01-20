import { BlogsModel } from './db'
import { ObjectId } from 'mongodb'
import { BlogsTypeInput, BlogsTypeOutput, BlogsTypeToDB } from '../models/blogs-models'
import { injectable } from 'inversify'

@injectable()
export class BlogsRepository {
    async getBlogById(id: string): Promise<BlogsTypeOutput | null> {
        const result = await BlogsModel.findById(new ObjectId(id))
        if (!result) return null
        return this._getOutputBlog(result)
    }
    async createBlog(createdBlog: BlogsTypeToDB): Promise<BlogsTypeOutput> {
        const result = await BlogsModel.create(createdBlog)
        return this._getOutputBlog(result)
    }
    async updateBlog(id: string, updatedBlog: BlogsTypeInput): Promise<boolean> {
        const result = await BlogsModel.findByIdAndUpdate(new ObjectId(id), updatedBlog)
        return !!result
    }
    async deleteBlog(id: string): Promise<boolean> {
        const result = await BlogsModel.findByIdAndDelete(new ObjectId(id))
        return !!result
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
