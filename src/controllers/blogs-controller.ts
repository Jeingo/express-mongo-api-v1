import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from '../models/types'
import { QueryBlogs } from '../models/query-models'
import { Response } from 'express'
import { PaginatedType } from '../models/main-models'
import { BlogsIdParams, BlogsTypeInput, BlogsTypeOutput } from '../models/blogs-models'
import { BlogsQueryRepository } from '../query-reositories/blogs-query-repository'
import { HTTP_STATUSES } from '../constats/status'
import { inject, injectable } from 'inversify'
import {BlogsService} from "../services/blogs-service";

@injectable()
export class BlogsController {
    constructor(
        @inject(BlogsService) protected blogsService: BlogsService,
        @inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository
    ) {}

    async getAllBlogs(req: RequestWithQuery<QueryBlogs>, res: Response<PaginatedType<BlogsTypeOutput>>) {
        const allBlogs = await this.blogsQueryRepository.getAllBlogs(req.query)
        res.status(HTTP_STATUSES.OK_200).json(allBlogs)
    }
    async getBlogById(req: RequestWithParams<BlogsIdParams>, res: Response<BlogsTypeOutput>) {
        const foundBlog = await this.blogsQueryRepository.getBlogById(req.params.id)

        if (!foundBlog) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.json(foundBlog)
    }
    async createBlog(req: RequestWithBody<BlogsTypeInput>, res: Response<BlogsTypeOutput>) {
        const createdBlogId = await this.blogsService.createBlog(req.body.name, req.body.description, req.body.websiteUrl)
        const createdBlog = await this.blogsQueryRepository.getBlogById(createdBlogId)
        res.status(HTTP_STATUSES.CREATED_201).json(createdBlog!)
    }
    async updateBlog(req: RequestWithParamsAndBody<BlogsIdParams, BlogsTypeInput>, res: Response) {
        const updatedBlog = await this.blogsService.updateBlog(
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
        const deletedBlog = await this.blogsService.deleteBlog(req.params.id)

        if (!deletedBlog) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
}
