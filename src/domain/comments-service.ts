import { CommentsTypeOutput, CommentsTypeToDB } from '../models/comments-models'
import { PostsRepository } from '../repositories/posts-repository'
import { LoginTypeForAuth } from '../models/auth-models'
import { HTTP_STATUSES } from '../constats/status'
import { CommentsRepository } from '../repositories/comments-repository'

class CommentsService {
    commentsRepository: CommentsRepository
    postsRepository: PostsRepository
    constructor() {
        this.commentsRepository = new CommentsRepository()
        this.postsRepository = new PostsRepository()
    }
    async createComment(content: string, postId: string, user: LoginTypeForAuth): Promise<CommentsTypeOutput | null> {
        const foundPost = await this.postsRepository.getPostById(postId)
        if (!foundPost) {
            return null
        }
        const createdComment = new CommentsTypeToDB(content, user.userId, user.login, new Date().toISOString(), postId)
        return await this.commentsRepository.createComment(createdComment)
    }
    async getCommentById(id: string): Promise<CommentsTypeOutput | null> {
        return await this.commentsRepository.getCommentById(id)
    }
    async updateComment(id: string, content: string, user: LoginTypeForAuth): Promise<boolean | number> {
        const comment = await this.commentsRepository.getCommentById(id)

        if (!comment) {
            return HTTP_STATUSES.NOT_FOUND_404
        }

        if (comment.userId !== user.userId) {
            return HTTP_STATUSES.FORBIDDEN_403
        }
        const updatedComment = { content: content }
        return await this.commentsRepository.updateComment(id, updatedComment)
    }
    async deleteComment(id: string, user: LoginTypeForAuth): Promise<boolean | number> {
        const comment = await this.commentsRepository.getCommentById(id)

        if (!comment) {
            return HTTP_STATUSES.NOT_FOUND_404
        }

        if (comment.userId !== user.userId) {
            return HTTP_STATUSES.FORBIDDEN_403
        }

        return await this.commentsRepository.deleteComment(id)
    }
}

export const commentsService = new CommentsService()
