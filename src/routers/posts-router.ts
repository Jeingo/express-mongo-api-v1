import { Router } from 'express'
import { getUserIdByAccessToken, idValidation, inputValidation, queryValidation } from '../middleware/input-validation'
import {
    blogIdValidation,
    contentValidation,
    shortDescriptionValidation,
    titleValidation
} from '../middleware/input-posts-validation'
import { auth } from '../authorization/basic-auth'
import { bearerAuth } from '../authorization/bearer-auth'
import { contentInCommentValidation } from '../middleware/input-comments-validation'
import { commentsController, postsController } from '../composition-root'

export const postsRouter = Router({})

postsRouter.get('/', queryValidation, postsController.getAllPosts.bind(postsController))

postsRouter.get('/:id', idValidation, postsController.getPostById.bind(postsController))

postsRouter.get(
    '/:id/comments',
    getUserIdByAccessToken,
    idValidation,
    queryValidation,
    commentsController.getCommentsByPostId.bind(commentsController)
)

postsRouter.post(
    '/',
    auth,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidation,
    postsController.createPost.bind(postsController)
)

postsRouter.post(
    '/:id/comments',
    bearerAuth,
    idValidation,
    contentInCommentValidation,
    inputValidation,
    commentsController.createCommentByPostId.bind(commentsController)
)

postsRouter.put(
    '/:id',
    auth,
    idValidation,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidation,
    postsController.updatePost.bind(postsController)
)

postsRouter.delete('/:id', auth, idValidation, postsController.deletePost.bind(postsController))
