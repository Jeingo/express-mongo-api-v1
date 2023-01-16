import { BlogsModel} from './db'
import { ObjectId } from 'mongodb'
import { BlogsTypeOutput, BlogsTypeToDB } from '../models/blogs-models'

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
        const result = await BlogsModel.findOne({ _id: new ObjectId(id) })
        if (!result) return null
        return getOutputBlog(result)
    },
    async createBlog(createdBlog: BlogsTypeToDB): Promise<BlogsTypeOutput> {
        const result = new BlogsModel(createdBlog)
        await result.save()
        return getOutputBlog(result)
    },
    async updateBlog(id: string, name: string, description: string, url: string): Promise<boolean> {
        const result = await BlogsModel.findOne({ _id: new ObjectId(id) })
        if(!result) return false
        result.name = name
        result.description = description
        result.websiteUrl = url
        await result.save()
        return true
    },
    async deleteBlog(id: string): Promise<boolean> {
        const result = await BlogsModel.findOne({ _id: new ObjectId(id) })
        if(!result) return false
        await result.delete()
        return true
    }
}
