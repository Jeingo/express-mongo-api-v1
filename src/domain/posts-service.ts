import {postsRepository} from "../repositories/posts-repository"
import {blogsRepository} from "../repositories/blogs-repository"
import {PostsTypeOutput} from "../models/posts-models";

export const postsService = {
    async getPostById(id: string): Promise<PostsTypeOutput | null> {
        return await postsRepository.getPostById(id)
    },
    async createPost(title: string, desc: string, content: string, blogId: string): Promise<PostsTypeOutput | null> {
        const foundBlog = await blogsRepository.getBlogById(blogId)
        if (!foundBlog) {
            return null
        }
        const createdPost = {
            title: title,
            shortDescription: desc,
            content: content,
            blogId: blogId,
            blogName: foundBlog.name,
            createdAt: new Date().toISOString()
        }
        return await postsRepository.createPost(createdPost)

    },
    async updatePost(id: string, title: string, desc: string, content: string, blogId: string): Promise<boolean | null> {
        const foundBlog = await blogsRepository.getBlogById(blogId)
        if (foundBlog) {
            return await postsRepository.updatePost(id, title, desc, content, blogId, foundBlog.name)
        }
        return null
    },
    async deletePost(id: string): Promise<boolean> {
        return await postsRepository.deletePost(id)
    }
}