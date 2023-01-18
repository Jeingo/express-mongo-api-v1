import { Router } from 'express'
import { idValidation, inputValidation, queryValidation } from '../middleware/input-validation'
import {
    descriptionValidation,
    nameValidation,
    websiteUrlValidation
} from '../middleware/input-blogs-vallidation'
import { auth } from '../authorization/basic-auth'
import {
    contentValidation,
    shortDescriptionValidation,
    titleValidation
} from '../middleware/input-posts-validation'
import { blogsController } from '../controllers/blogs-controller'
import { postsController } from '../controllers/posts-controller'

export const blogsRouter = Router({})

blogsRouter.get('/', queryValidation, blogsController.getAllBlogs)

blogsRouter.get('/:id', idValidation, blogsController.getBlogById)

blogsRouter.get('/:id/posts', idValidation, queryValidation, postsController.getPostsByBlogId)

blogsRouter.post(
    '/',
    auth,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidation,
    blogsController.createBlog
)

blogsRouter.post(
    '/:id/posts',
    auth,
    idValidation,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidation,
    postsController.createPostByBlogId
)

blogsRouter.put(
    '/:id',
    auth,
    idValidation,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidation,
    blogsController.updateBlog
)

blogsRouter.delete('/:id', auth, idValidation, blogsController.deleteBlog)
