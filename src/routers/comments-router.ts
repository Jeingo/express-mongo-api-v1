import { Router } from 'express'
import { bearerAuth } from '../authorization/bearer-auth'
import {getUserIdByAccessToken, idValidation, inputValidation} from '../middleware/input-validation'
import { contentInCommentValidation } from '../middleware/input-comments-validation'
import { commentsController } from '../composition-root'
import { likesValidation } from '../middleware/input-likes-validation'

export const commentsRouter = Router({})

commentsRouter.get('/:id',getUserIdByAccessToken, idValidation, commentsController.getCommentById.bind(commentsController))

commentsRouter.put(
    '/:id',
    bearerAuth,
    idValidation,
    contentInCommentValidation,
    inputValidation,
    commentsController.updateComment.bind(commentsController)
)

commentsRouter.put(
    '/:id/like-status',
    bearerAuth,
    idValidation,
    likesValidation,
    inputValidation,
    commentsController.updateStatusLike.bind(commentsController)
)

commentsRouter.delete('/:id', bearerAuth, idValidation, commentsController.deleteComment.bind(commentsController))
