import { RequestWithParams, RequestWithParamsAndBody } from '../models/types'
import { CommentsIdParams, CommentsTypeInput, CommentsTypeOutput } from '../models/comments-models'
import { Response } from 'express'
import { commentsService } from '../domain/comments-service'
import { HTTP_STATUSES } from '../constats/status'

class CommentsController {
    async getCommentById(
        req: RequestWithParams<CommentsIdParams>,
        res: Response<CommentsTypeOutput>
    ) {
        const foundComment = await commentsService.getCommentById(req.params.id)

        if (!foundComment) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.json(foundComment)
    }
    async updateComment(
        req: RequestWithParamsAndBody<CommentsIdParams, CommentsTypeInput>,
        res: Response
    ) {
        const updatedComment = await commentsService.updateComment(
            req.params.id,
            req.body.content,
            req.user!
        )

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
