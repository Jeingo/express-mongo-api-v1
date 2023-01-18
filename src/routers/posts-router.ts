import { Router } from 'express'
import { idValidation, inputValidation, queryValidation } from '../middleware/input-validation'
import {
    blogIdValidation,
    contentValidation,
    shortDescriptionValidation,
    titleValidation
} from '../middleware/input-posts-validation'
import { auth } from '../authorization/basic-auth'
import { bearerAuth } from '../authorization/bearer-auth'
import { contentInCommentValidation } from '../middleware/input-comments-validation'
import { postsController } from '../controllers/posts-controller'

export const postsRouter = Router({})

postsRouter.get('/', queryValidation, postsController.getAllPosts)

postsRouter.get('/:id', idValidation, postsController.getPostById)

postsRouter.get('/:id/comments', idValidation, queryValidation, postsController.getCommentsByPostId)

postsRouter.post(
    '/',
    auth,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidation,
    postsController.createPost
)

postsRouter.post(
    '/:id/comments',
    bearerAuth,
    idValidation,
    contentInCommentValidation,
    inputValidation,
    postsController.createCommentByPostId
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
    postsController.updatePost
)

postsRouter.delete('/:id', auth, idValidation, postsController.deletePost)
