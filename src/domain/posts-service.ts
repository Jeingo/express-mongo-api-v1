import { postsRepository } from '../repositories/posts-repository'
import { blogsRepository } from '../repositories/blogs-repository'
import { PostsTypeOutput, PostsTypeToDB } from '../models/posts-models'

class PostsService {
    async getPostById(id: string): Promise<PostsTypeOutput | null> {
        return await postsRepository.getPostById(id)
    }
    async createPost(
        title: string,
        desc: string,
        content: string,
        blogId: string
    ): Promise<PostsTypeOutput | null> {
        const foundBlog = await blogsRepository.getBlogById(blogId)
        if (!foundBlog) return null
        const createdPost = new PostsTypeToDB(
            title,
            desc,
            content,
            blogId,
            foundBlog.name,
            new Date().toISOString()
        )
        return await postsRepository.createPost(createdPost)
    }
    async updatePost(
        id: string,
        title: string,
        desc: string,
        content: string,
        blogId: string
    ): Promise<boolean | null> {
        const foundBlog = await blogsRepository.getBlogById(blogId)
        if (!foundBlog) return null
        const updatedPost = {
            title: title,
            shortDescription: desc,
            content: content,
            blogId: blogId,
            blogName: foundBlog.name
        }
        return await postsRepository.updatePost(id, updatedPost)
    }
    async deletePost(id: string): Promise<boolean> {
        return await postsRepository.deletePost(id)
    }
}

export const postsService = new PostsService()
