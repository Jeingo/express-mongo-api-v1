import { Router } from 'express'
import { bearerAuth } from '../authorization/bearer-auth'
import { idValidation, inputValidation } from '../middleware/input-validation'
import { contentInCommentValidation } from '../middleware/input-comments-validation'
import { commentsController } from '../controllers/comments-controller'

export const commentsRouter = Router({})

commentsRouter.get('/:id', idValidation, commentsController.getCommentById.bind(commentsController))

commentsRouter.put(
    '/:id',
    bearerAuth,
    idValidation,
    contentInCommentValidation,
    inputValidation,
    commentsController.updateComment.bind(commentsController)
)

commentsRouter.delete('/:id', bearerAuth, idValidation, commentsController.deleteComment.bind(commentsController))
