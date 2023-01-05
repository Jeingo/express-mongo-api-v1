import {blogsCollection} from "./db"
import {ObjectId} from "mongodb"
import {BlogsTypeOutput, BlogsTypeToDB} from "../models/blogs-models"

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
        const res = await blogsCollection.findOne({_id: new ObjectId(id)})

        if(!res) {
            return null
        }
        return getOutputBlog(res)
    },
    async createBlog(createdBlog: BlogsTypeToDB): Promise<BlogsTypeOutput> {
        const res = await blogsCollection.insertOne(createdBlog)
        return {
            id: res.insertedId.toString(),
            name: createdBlog.name,
            description: createdBlog.description,
            websiteUrl: createdBlog.websiteUrl,
            createdAt: createdBlog.createdAt
        }
    },
    async updateBlog(id: string, name: string, desc: string, url: string): Promise<boolean> {
        const result = await blogsCollection
            .updateOne({_id: new ObjectId(id)},{$set: {name: name, description: desc, websiteUrl: url}})
        return result.matchedCount === 1
    },
    async deleteBlog(id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }
}