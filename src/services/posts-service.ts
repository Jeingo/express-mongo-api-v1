import { inject, injectable } from 'inversify'
import { BlogsRepository } from '../repositories/blogs-repository'
import { PostsRepository } from '../repositories/posts-repository'
import { PostsLikesRepository } from '../repositories/posts-likes-repository'
import { PostId, PostsTypeToDB } from '../models/posts-models'
import { PostsLikesTypeToDB, StatusLikeType } from '../models/likes-models'
import { BlogsQueryRepository } from '../query-reositories/blogs-query-repository'
import { PostsQueryRepository } from '../query-reositories/posts-query-repository'
import {PostsLikesQueryRepository} from "../query-reositories/posts-likes-query-repository";

@injectable()
export class PostsService {
    constructor(
        @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
        @inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository,
        @inject(PostsRepository) protected postsRepository: PostsRepository,
        @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository,
        @inject(PostsLikesRepository) protected postsLikesRepository: PostsLikesRepository,
        @inject(PostsLikesQueryRepository) protected postsLikesQueryRepository: PostsLikesQueryRepository
    ) {}
    async createPost(title: string, desc: string, content: string, blogId: string): Promise<PostId | null> {
        const foundBlog = await this.blogsQueryRepository.getBlogById(blogId)
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
        const foundBlog = await this.blogsQueryRepository.getBlogById(blogId)
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
        const post = await this.postsQueryRepository.getPostById(postId)
        if (!post) return false
        const likeInfo = await this.postsLikesQueryRepository.getLike(userId, postId)
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
