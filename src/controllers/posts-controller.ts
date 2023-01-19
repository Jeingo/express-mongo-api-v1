import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from '../models/types'
import { QueryBlogs, QueryPosts } from '../models/query-models'
import { Response } from 'express'
import { PaginatedType } from '../models/main-models'
import { PostsIdParams, PostsTypeInput, PostsTypeInputInBlog, PostsTypeOutput } from '../models/posts-models'
import { postsQueryRepository } from '../query-reositories/posts-query-repository'
import { HTTP_STATUSES } from '../constats/status'
import {PostsService} from '../domain/posts-service'

class PostsController {
    postsService: PostsService
    constructor() {
        this.postsService = new PostsService()
    }
    async getAllPosts(req: RequestWithQuery<QueryPosts>, res: Response<PaginatedType<PostsTypeOutput>>) {
        const allPosts = await postsQueryRepository.getAllPost(req.query)
        res.status(HTTP_STATUSES.OK_200).json(allPosts)
    }
    async getPostById(req: RequestWithParams<PostsIdParams>, res: Response<PostsTypeOutput>) {
        const foundPost = await this.postsService.getPostById(req.params.id)

        if (!foundPost) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.json(foundPost)
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
    async createPost(req: RequestWithBody<PostsTypeInput>, res: Response<PostsTypeOutput | null>) {
        const createdPost = await this.postsService.createPost(
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.blogId
        )
        res.status(HTTP_STATUSES.CREATED_201).json(createdPost)
    }
    async createPostByBlogId(
        req: RequestWithParamsAndBody<PostsIdParams, PostsTypeInputInBlog>,
        res: Response<PostsTypeOutput>
    ) {
        const createdPost = await this.postsService.createPost(
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
    async updatePost(req: RequestWithParamsAndBody<PostsIdParams, PostsTypeInput>, res: Response) {
        const updatedPost = await this.postsService.updatePost(
            req.params.id,
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.blogId
        )

        if (!updatedPost) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
    async deletePost(req: RequestWithParams<PostsIdParams>, res: Response) {
        const deletedPost = await this.postsService.deletePost(req.params.id)

        if (!deletedPost) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
}

export const postsController = new PostsController()
