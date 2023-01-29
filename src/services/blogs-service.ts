import { inject, injectable } from 'inversify'
import { BlogsRepository } from '../repositories/blogs-repository'
import { BlogId } from '../models/blogs-models'
import { BlogsQueryRepository } from '../query-reositories/blogs-query-repository'
import { BlogsModel } from '../repositories/db/db'

@injectable()
export class BlogsService {
    constructor(
        @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
        @inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository
    ) {}

    async createBlog(name: string, description: string, url: string): Promise<BlogId> {
        const createdBlog = BlogsModel.make(name, description, url)
        await this.blogsRepository.saveBlog(createdBlog)
        return createdBlog._id.toString()
    }
    async updateBlog(id: string, name: string, description: string, url: string): Promise<boolean> {
        const blog = await this.blogsRepository.getBlogById(id)
        if (!blog) return false
        blog.update(name, description, url)
        await this.blogsRepository.saveBlog(blog)
        return true
    }

    async deleteBlog(id: string): Promise<boolean> {
        return await this.blogsRepository.deleteBlog(id)
    }
}
