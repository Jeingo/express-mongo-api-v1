import { inject, injectable } from 'inversify'
import { BlogsRepository } from '../repositories/blogs-repository'
import { PostsRepository } from '../repositories/posts-repository'
import { PostsLikesRepository } from '../repositories/posts-likes-repository'
import { PostId } from '../models/posts-models'
import { PostsLikesTypeToDB, StatusLikeType } from '../models/likes-models'
import { BlogsQueryRepository } from '../query-reositories/blogs-query-repository'
import { PostsQueryRepository } from '../query-reositories/posts-query-repository'
import { PostsLikesQueryRepository } from '../query-reositories/posts-likes-query-repository'
import {PostsModel} from "../domain/posts-entity";

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
        const foundBlog = await this.blogsRepository.getBlogById(blogId)
        if (!foundBlog) return null
        const createdPost = PostsModel.make(title, desc, content, blogId, foundBlog.name)
        await this.postsRepository.savePost(createdPost)
        return createdPost._id.toString()
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
        const post = await this.postsRepository.getPostById(id)
        if (!post) return false
        post.update(title, desc, content, blogId, foundBlog.name)
        await this.postsRepository.savePost(post)
        return true
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
