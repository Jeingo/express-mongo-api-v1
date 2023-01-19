import { PostsRepository } from '../repositories/posts-repository'
import { BlogsRepository } from '../repositories/blogs-repository'
import { PostsTypeOutput, PostsTypeToDB } from '../models/posts-models'

class PostsService {
    blogsRepository: BlogsRepository
    postsRepository: PostsRepository
    constructor() {
        this.blogsRepository = new BlogsRepository()
        this.postsRepository = new PostsRepository()
    }
    async getPostById(id: string): Promise<PostsTypeOutput | null> {
        return await this.postsRepository.getPostById(id)
    }
    async createPost(title: string, desc: string, content: string, blogId: string): Promise<PostsTypeOutput | null> {
        const foundBlog = await this.blogsRepository.getBlogById(blogId)
        if (!foundBlog) return null
        const createdPost = new PostsTypeToDB(title, desc, content, blogId, foundBlog.name, new Date().toISOString())
        return await this.postsRepository.createPost(createdPost)
    }
    async updatePost(
        id: string,
        title: string,
        desc: string,
        content: string,
        blogId: string
    ): Promise<boolean | null> {
        const foundBlog = await this.blogsRepository.getBlogById(blogId)
        if (!foundBlog) return null
        const updatedPost = {
            title: title,
            shortDescription: desc,
            content: content,
            blogId: blogId,
            blogName: foundBlog.name
        }
        return await this.postsRepository.updatePost(id, updatedPost)
    }
    async deletePost(id: string): Promise<boolean> {
        return await this.postsRepository.deletePost(id)
    }
}

export const postsService = new PostsService()
