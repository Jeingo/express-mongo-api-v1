import { Router } from 'express'
import { getUserIdByAccessToken, idValidation, inputValidation, queryValidation } from '../middleware/input-validation'
import { descriptionValidation, nameValidation, websiteUrlValidation } from '../middleware/input-blogs-vallidation'
import { auth } from '../authorization/basic-auth'
import { contentValidation, shortDescriptionValidation, titleValidation } from '../middleware/input-posts-validation'
import { blogsController, postsController } from '../composition-root'

export const blogsRouter = Router({})

blogsRouter.get('/', queryValidation, blogsController.getAllBlogs.bind(blogsController))

blogsRouter.get('/:id', idValidation, blogsController.getBlogById.bind(blogsController))

blogsRouter.get(
    '/:id/posts',
    getUserIdByAccessToken,
    idValidation,
    queryValidation,
    postsController.getPostsByBlogId.bind(postsController)
)

blogsRouter.post(
    '/',
    auth,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidation,
    blogsController.createBlog.bind(blogsController)
)

blogsRouter.post(
    '/:id/posts',
    auth,
    idValidation,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidation,
    postsController.createPostByBlogId.bind(postsController)
)

blogsRouter.put(
    '/:id',
    auth,
    idValidation,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidation,
    blogsController.updateBlog.bind(blogsController)
)

blogsRouter.delete('/:id', auth, idValidation, blogsController.deleteBlog.bind(blogsController))
