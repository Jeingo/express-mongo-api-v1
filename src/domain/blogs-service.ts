import { BlogsRepository } from '../repositories/blogs-repository'
import { BlogsTypeOutput, BlogsTypeToDB } from '../models/blogs-models'

class BlogsService {
    blogsRepository: BlogsRepository
    constructor() {
        this.blogsRepository = new BlogsRepository()
    }
    async getBlogById(id: string): Promise<BlogsTypeOutput | null> {
        return await this.blogsRepository.getBlogById(id)
    }
    async createBlog(name: string, desc: string, url: string): Promise<BlogsTypeOutput> {
        const createdBlog = new BlogsTypeToDB(name, desc, url, new Date().toISOString())
        return await this.blogsRepository.createBlog(createdBlog)
    }
    async updateBlog(id: string, name: string, desc: string, url: string): Promise<boolean> {
        const updatedBlog = {
            name: name,
            description: desc,
            websiteUrl: url
        }
        return await this.blogsRepository.updateBlog(id, updatedBlog)
    }
    async deleteBlog(id: string): Promise<boolean> {
        return await this.blogsRepository.deleteBlog(id)
    }
}

export const blogsService = new BlogsService()
