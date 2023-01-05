import {blogsRepository} from "../repositories/blogs-repository"
import {BlogsTypeOutput} from "../models/blogs-models";

export const blogsService = {
    async getBlogById(id: string): Promise<BlogsTypeOutput | null> {
        return await blogsRepository.getBlogById(id)
    },
    async createBlog(name: string, desc: string, url: string): Promise<BlogsTypeOutput> {
        const createdBlog = {
            name: name,
            description: desc,
            websiteUrl: url,
            createdAt: new Date().toISOString()
        }
        return await blogsRepository.createBlog(createdBlog)
    },
    async updateBlog(id: string, name: string, desc: string, url: string): Promise<boolean> {
        return await blogsRepository.updateBlog(id, name, desc, url)
    },
    async deleteBlog(id: string): Promise<boolean> {
        return await blogsRepository.deleteBlog(id)
    }
}