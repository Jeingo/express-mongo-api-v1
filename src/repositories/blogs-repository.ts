import { BlogsModel } from './db/db'
import { ObjectId } from 'mongodb'
import { BlogId, BlogsTypeInput, BlogsTypeToDB } from '../models/blogs-models'
import { injectable } from 'inversify'

@injectable()
export class BlogsRepository {
    async createBlog(createdBlog: BlogsTypeToDB): Promise<BlogId> {
        const result = await BlogsModel.create(createdBlog)
        return result._id.toString()
    }
    async updateBlog(id: string, updatedBlog: BlogsTypeInput): Promise<boolean> {
        const result = await BlogsModel.findByIdAndUpdate(new ObjectId(id), updatedBlog)
        return !!result
    }
    async deleteBlog(id: string): Promise<boolean> {
        const result = await BlogsModel.findByIdAndDelete(new ObjectId(id))
        return !!result
    }
}
