import { blogsRepository } from '../repositories/blogs-repository'
import { BlogsTypeOutput, BlogsTypeToDB } from '../models/blogs-models'

class BlogsService {
    async getBlogById(id: string): Promise<BlogsTypeOutput | null> {
        return await blogsRepository.getBlogById(id)
    }
    async createBlog(name: string, desc: string, url: string): Promise<BlogsTypeOutput> {
        const createdBlog = new BlogsTypeToDB(name, desc, url, new Date().toISOString())
        return await blogsRepository.createBlog(createdBlog)
    }
    async updateBlog(id: string, name: string, desc: string, url: string): Promise<boolean> {
        const updatedBlog = {
            name: name,
            description: desc,
            websiteUrl: url
        }
        return await blogsRepository.updateBlog(id, updatedBlog)
    }
    async deleteBlog(id: string): Promise<boolean> {
        return await blogsRepository.deleteBlog(id)
    }
}

export const blogsService = new BlogsService()
