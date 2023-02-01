import { inject, injectable } from 'inversify'
import { CommentsRepository } from '../repositories/comments-repository'
import { PostsRepository } from '../repositories/posts-repository'
import { CommentsLikesRepository } from '../repositories/comments-likes-repository'
import { LoginTypeForAuth } from '../models/auth-models'
import { CommentId, CommentsTypeToDB } from '../models/comments-models'
import { HTTP_STATUSES } from '../constats/status'
import { CommentsLikesTypeToDB, StatusLikeType } from '../models/likes-models'
import { CommentsQueryRepository } from '../query-reositories/comments-query-repository'
import { PostsQueryRepository } from '../query-reositories/posts-query-repository'
import { CommentsLikesQueryRepository } from '../query-reositories/comments-likes-query-repository'

@injectable()
export class CommentsService {
    constructor(
        @inject(CommentsRepository) protected commentsRepository: CommentsRepository,
        @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository,
        @inject(PostsRepository) protected postsRepository: PostsRepository,
        @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository,
        @inject(CommentsLikesRepository) protected commentsLikesRepository: CommentsLikesRepository,
        @inject(CommentsLikesQueryRepository) protected commentsLikesQueryRepository: CommentsLikesQueryRepository
    ) {}

    async createComment(content: string, postId: string, user: LoginTypeForAuth): Promise<CommentId | null> {
        const foundPost = await this.postsQueryRepository.getPostById(postId)
        if (!foundPost) {
            return null
        }
        const createdComment = new CommentsTypeToDB(
            content,
            user.userId,
            user.login,
            new Date().toISOString(),
            postId,
            {
                likesCount: 0,
                dislikesCount: 0
            }
        )
        return await this.commentsRepository.createComment(createdComment)
    }

    async updateComment(id: string, content: string, user: LoginTypeForAuth): Promise<boolean | number> {
        const comment = await this.commentsQueryRepository.getCommentById(id)

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
        const comment = await this.commentsQueryRepository.getCommentById(id)

        if (!comment) {
            return HTTP_STATUSES.NOT_FOUND_404
        }

        if (comment.userId !== user.userId) {
            return HTTP_STATUSES.FORBIDDEN_403
        }

        return await this.commentsRepository.deleteComment(id)
    }

    async updateStatusLike(userId: string, commentId: string, newStatus: StatusLikeType): Promise<boolean> {
        let lastStatus: StatusLikeType = 'None'
        const comment = await this.commentsQueryRepository.getCommentById(commentId)
        if (!comment) return false
        const likeInfo = await this.commentsLikesQueryRepository.getLike(userId, commentId)
        if (!likeInfo) {
            const newLike = new CommentsLikesTypeToDB(userId, commentId, newStatus)
            await this.commentsLikesRepository.createLike(newLike)
        } else {
            const updatedLike = { myStatus: newStatus }
            await this.commentsLikesRepository.updateLike(likeInfo.id, updatedLike)
            lastStatus = likeInfo.myStatus
        }
        return await this.commentsRepository.updateLikeInComment(comment, lastStatus, newStatus)
    }
}
