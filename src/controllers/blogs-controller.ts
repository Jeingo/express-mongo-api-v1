import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from '../models/types'
import { QueryBlogs } from '../models/query-models'
import { Response } from 'express'
import { PaginatedType } from '../models/main-models'
import { BlogsIdParams, BlogsTypeInput, BlogsTypeOutput } from '../models/blogs-models'
import { blogsQueryRepository } from '../query-reositories/blogs-query-repository'
import { HTTP_STATUSES } from '../constats/status'
import { blogsService } from '../domain/blogs-service'
import { PostsIdParams, PostsTypeInputInBlog, PostsTypeOutput } from '../models/posts-models'
import { postsQueryRepository } from '../query-reositories/posts-query-repository'
import { postsService } from '../domain/posts-service'

class BlogsController {
    async getAllBlogs(
        req: RequestWithQuery<QueryBlogs>,
        res: Response<PaginatedType<BlogsTypeOutput>>
    ) {
        const allBlogs = await blogsQueryRepository.getAllBlogs(req.query)
        res.status(HTTP_STATUSES.OK_200).json(allBlogs)
    }
    async getBlogById(req: RequestWithParams<BlogsIdParams>, res: Response<BlogsTypeOutput>) {
        const foundBlog = await blogsService.getBlogById(req.params.id)

        if (!foundBlog) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.json(foundBlog)
    }
    async createBlog(req: RequestWithBody<BlogsTypeInput>, res: Response<BlogsTypeOutput>) {
        const createdBlog = await blogsService.createBlog(
            req.body.name,
            req.body.description,
            req.body.websiteUrl
        )
        res.status(HTTP_STATUSES.CREATED_201).json(createdBlog)
    }
    async updateBlog(req: RequestWithParamsAndBody<BlogsIdParams, BlogsTypeInput>, res: Response) {
        const updatedBlog = await blogsService.updateBlog(
            req.params.id,
            req.body.name,
            req.body.description,
            req.body.websiteUrl
        )

        if (!updatedBlog) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
    async deleteBlog(req: RequestWithParams<BlogsIdParams>, res: Response) {
        const deletedBlog = await blogsService.deleteBlog(req.params.id)

        if (!deletedBlog) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
    async getPostsByBlogId(
        req: RequestWithParamsAndQuery<PostsIdParams, QueryBlogs>,
        res: Response<PaginatedType<PostsTypeOutput> | null>
    ) {
        const foundPosts = await postsQueryRepository.getPostsById(req.params.id, req.query)

        if (!foundPosts) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.json(foundPosts)
    }
    async createPostByBlogId(
        req: RequestWithParamsAndBody<PostsIdParams, PostsTypeInputInBlog>,
        res: Response<PostsTypeOutput>
    ) {
        const createdPost = await postsService.createPost(
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.params.id
        )

        if (!createdPost) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.status(HTTP_STATUSES.CREATED_201).json(createdPost)
    }
}

export const blogsController = new BlogsController()
