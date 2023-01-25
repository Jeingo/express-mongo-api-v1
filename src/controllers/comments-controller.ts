import { RequestWithParams, RequestWithParamsAndBody, RequestWithParamsAndQuery } from '../models/types'
import {
    CommentsIdParams,
    CommentsTypeInput,
    CommentsTypeInputInPost,
    CommentsTypeOutput
} from '../models/comments-models'
import { Response } from 'express'
import { HTTP_STATUSES } from '../constats/status'
import { QueryComments } from '../models/query-models'
import { PaginatedType } from '../models/main-models'
import { CommentsQueryRepository } from '../query-reositories/comments-query-repository'
import { LikesType } from '../models/likes-models'
import { inject, injectable } from 'inversify'
import {CommentsService} from "../services/comments-service";

@injectable()
export class CommentsController {
    constructor(
        @inject(CommentsService) protected commentsService: CommentsService,
        @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository
    ) {}

    async getCommentById(req: RequestWithParams<CommentsIdParams>, res: Response<CommentsTypeOutput>) {
        const foundComment = await this.commentsQueryRepository.getCommentById(req.params.id, req.user?.userId)

        if (!foundComment) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.json(foundComment)
    }
    async getCommentsByPostId(
        req: RequestWithParamsAndQuery<CommentsIdParams, QueryComments>,
        res: Response<PaginatedType<CommentsTypeOutput | null>>
    ) {
        const foundComments = await this.commentsQueryRepository.getCommentsById(
            req.params.id,
            req.query,
            req.user?.userId
        )

        if (!foundComments) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.json(foundComments)
    }
    async createCommentByPostId(
        req: RequestWithParamsAndBody<CommentsIdParams, CommentsTypeInputInPost>,
        res: Response<CommentsTypeOutput>
    ) {
        const createdCommentId = await this.commentsService.createComment(req.body.content, req.params.id, req.user!)
        const createdComment = await this.commentsQueryRepository.getCommentById(createdCommentId!)
        if (!createdComment) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.status(HTTP_STATUSES.CREATED_201).json(createdComment)
    }
    async updateComment(req: RequestWithParamsAndBody<CommentsIdParams, CommentsTypeInput>, res: Response) {
        const updatedComment = await this.commentsService.updateComment(req.params.id, req.body.content, req.user!)

        if (updatedComment === HTTP_STATUSES.NOT_FOUND_404) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        if (updatedComment === HTTP_STATUSES.FORBIDDEN_403) {
            res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
    async deleteComment(req: RequestWithParams<CommentsIdParams>, res: Response) {
        const deletedComment = await this.commentsService.deleteComment(req.params.id, req.user!)

        if (deletedComment === HTTP_STATUSES.NOT_FOUND_404) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        if (deletedComment === HTTP_STATUSES.FORBIDDEN_403) {
            res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
    async updateStatusLike(req: RequestWithParamsAndBody<CommentsIdParams, LikesType>, res: Response) {
        const updatedCommentLike = await this.commentsService.updateStatusLike(
            req.user!.userId,
            req.params.id,
            req.body.likeStatus
        )
        if (!updatedCommentLike) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
}
