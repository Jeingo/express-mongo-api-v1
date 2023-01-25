import { PostsRepository } from '../repositories/posts-repository'
import { BlogsRepository } from '../repositories/blogs-repository'
import { PostsTypeOutput, PostsTypeToDB } from '../models/posts-models'
import { inject, injectable } from 'inversify'
import { PostsLikesTypeToDB, StatusLikeType } from '../models/likes-models'
import { PostsLikesRepository } from '../repositories/posts-likes-repository'

@injectable()
export class PostsService {
    constructor(
        @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
        @inject(PostsRepository) protected postsRepository: PostsRepository,
        @inject(PostsLikesRepository) protected postsLikesRepository: PostsLikesRepository
    ) {}

    async getPostById(id: string, userId?: string): Promise<PostsTypeOutput | null> {
        const post = await this.postsRepository.getPostById(id)
        if (userId && post) {
            const like = await this.postsLikesRepository.getLike(userId, post.id)
            if (like) {
                post.extendedLikesInfo.myStatus = like.myStatus
            }
        }
        if (post) {
            const lastThreeLikes = await this.postsLikesRepository.getLastThreeLikes(post.id)
            if (lastThreeLikes) {
                post.extendedLikesInfo.newestLikes = lastThreeLikes
            }
        }
        return post
    }
    async createPost(title: string, desc: string, content: string, blogId: string): Promise<PostsTypeOutput | null> {
        const foundBlog = await this.blogsRepository.getBlogById(blogId)
        if (!foundBlog) return null
        const createdPost = new PostsTypeToDB(title, desc, content, blogId, foundBlog.name, new Date().toISOString(), {
            likesCount: 0,
            dislikesCount: 0
        })
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
    async updateStatusLike(userId: string, login: string, postId: string, newStatus: StatusLikeType): Promise<boolean> {
        let lastStatus: StatusLikeType = 'None'
        const post = await this.postsRepository.getPostById(postId)
        if (!post) return false
        const likeInfo = await this.postsLikesRepository.getLike(userId, postId)
        if (!likeInfo) {
            const newLike = new PostsLikesTypeToDB(userId, postId, newStatus, login, new Date().toISOString())
            await this.postsLikesRepository.createLike(newLike)
        } else {
            const updatedLike = { myStatus: newStatus }
            await this.postsLikesRepository.updateLike(likeInfo.id, updatedLike)
            lastStatus = likeInfo.myStatus
        }
        return await this.postsRepository.updateLikeInPost(post, lastStatus, newStatus)
    }
}
