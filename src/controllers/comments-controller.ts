import { RequestWithParams, RequestWithParamsAndBody, RequestWithParamsAndQuery } from '../models/types'
import {
    CommentsIdParams,
    CommentsTypeInput,
    CommentsTypeInputInPost,
    CommentsTypeOutput
} from '../models/comments-models'
import { Response } from 'express'
import { commentsService } from '../domain/comments-service'
import { HTTP_STATUSES } from '../constats/status'
import { QueryComments } from '../models/query-models'
import { PaginatedType } from '../models/main-models'
import { commentsQueryRepository } from '../query-reositories/comments-query-repository'

class CommentsController {
    async getCommentById(req: RequestWithParams<CommentsIdParams>, res: Response<CommentsTypeOutput>) {
        const foundComment = await commentsService.getCommentById(req.params.id)

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
        const foundComments = await commentsQueryRepository.getCommentsById(req.params.id, req.query)

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
        const createdComment = await commentsService.createComment(req.body.content, req.params.id, req.user!)

        if (!createdComment) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.status(HTTP_STATUSES.CREATED_201).json(createdComment)
    }
    async updateComment(req: RequestWithParamsAndBody<CommentsIdParams, CommentsTypeInput>, res: Response) {
        const updatedComment = await commentsService.updateComment(req.params.id, req.body.content, req.user!)

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
        const deletedComment = await commentsService.deleteComment(req.params.id, req.user!)

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
}

export const commentsController = new CommentsController()
