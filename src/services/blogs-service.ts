import { inject, injectable } from 'inversify'
import { BlogsRepository } from '../repositories/blogs-repository'
import { BlogId, BlogsTypeToDB } from '../models/blogs-models'
import { BlogsQueryRepository } from '../query-reositories/blogs-query-repository'

@injectable()
export class BlogsService {
    constructor(
        @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
        @inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository
    ) {}

    async createBlog(name: string, desc: string, url: string): Promise<BlogId> {
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
