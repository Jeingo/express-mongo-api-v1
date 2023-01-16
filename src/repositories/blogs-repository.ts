import { BlogsModel} from './db'
import { ObjectId } from 'mongodb'
import {BlogsTypeInput, BlogsTypeOutput, BlogsTypeToDB} from '../models/blogs-models'

const getOutputBlog = (blog: any): BlogsTypeOutput => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt
    }
}

export const blogsRepository = {
    async getBlogById(id: string): Promise<BlogsTypeOutput | null> {
        const result = await BlogsModel.findById(new ObjectId(id))
        if (!result) return null
        return getOutputBlog(result)
    },
    async createBlog(createdBlog: BlogsTypeToDB): Promise<BlogsTypeOutput> {
        const result = await BlogsModel.create(createdBlog)
        return getOutputBlog(result)
    },
    async updateBlog(id: string, updatedBlog: BlogsTypeInput): Promise<boolean> {
        const result = await BlogsModel.findByIdAndUpdate(new ObjectId(id), updatedBlog)
        if(!result) return false
        return true
    },
    async deleteBlog(id: string): Promise<boolean> {
        const result = await BlogsModel.findByIdAndDelete(new ObjectId(id))
        if(!result) return false
        return true
    }
}
