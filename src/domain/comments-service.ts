import {CommentsTypeOutput} from "../models/comments-models";
import {postsRepository} from "../repositories/posts-repository";
import {LoginTypeForAuth} from "../models/auth-models";
import {commentsRepository} from "../repositories/comments-repository";
import {HTTP_STATUSES} from "../constats/status";

export const commentsService = {
    async createComment(content: string, postId: string, user: LoginTypeForAuth): Promise<CommentsTypeOutput | null> {
        const foundPost = await postsRepository.getPostById(postId)
        if(!foundPost) {
            return null
        }
        const createdComment = {
            content: content,
            userId: user.userId,
            userLogin: user.login,
            createdAt: new Date().toISOString(),
            postId: postId
        }
        return await commentsRepository.createComment(createdComment)
    },
    async getCommentById(id: string): Promise<CommentsTypeOutput | null> {
        return await commentsRepository.getCommentById(id)
    },
    async updateComment(id: string, content: string,  user: LoginTypeForAuth): Promise<boolean | number> {
        const comment = await commentsRepository.getCommentById(id)

        if(!comment) {
            return HTTP_STATUSES.NOT_FOUND_404
        }

        if(comment.userId !== user.userId) {
            return HTTP_STATUSES.FORBIDDEN_403
        }

        return await commentsRepository.updateComment(id, content)
    },
    async deleteComment(id: string, user: LoginTypeForAuth): Promise<boolean | number> {
        const comment = await commentsRepository.getCommentById(id)

        if(!comment) {
            return HTTP_STATUSES.NOT_FOUND_404
        }

        if(comment.userId !== user.userId) {
            return HTTP_STATUSES.FORBIDDEN_403
        }

        return await commentsRepository.deleteComment(id)
    }
}