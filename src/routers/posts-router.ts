import {Router, Response} from 'express'
import {HTTP_STATUSES} from "../constats/status"
import {postsService} from "../domain/posts-service"
import {idValidation, inputValidation, queryValidation} from "../middleware/input-validation"
import {
    blogIdValidation,
    contentValidation,
    shortDescriptionValidation,
    titleValidation
} from "../middleware/input-posts-validation"
import {auth} from "../authorization/basic-auth"
import {PostsIdParams, PostsTypeInput, PostsTypeOutput} from "../models/posts-models"
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../models/types"
import {postsQueryRepository} from "../query-reositories/posts-query-repository";
import {QueryComments, QueryPosts} from "../models/query-models";
import {PaginatedType} from "../models/main-models";
import {bearerAuth} from "../authorization/bearer-auth";
import {CommentsIdParams, CommentsTypeInputInPost, CommentsTypeOutput} from "../models/comments-models"
import {contentInCommentValidation} from "../middleware/input-comments-validation";
import {commentsService} from "../domain/comments-service";
import {commentsQueryRepository} from "../query-reositories/comments-query-repository";

export const postsRouter = Router({})

postsRouter.get('/',
    queryValidation ,
    async (req: RequestWithQuery<QueryPosts>,
           res: Response<PaginatedType<PostsTypeOutput>>) => {
    const allPosts = await postsQueryRepository.getAllPost(req.query)
    res.status(HTTP_STATUSES.OK_200).json(allPosts)
})

postsRouter.get('/:id',
    idValidation,
    async (req: RequestWithParams<PostsIdParams>,
           res: Response<PostsTypeOutput>) => {
    const foundPost = await postsService.getPostById(req.params.id)

    if(!foundPost) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    res.json(foundPost)
})

postsRouter.get('/:id/comments',
    idValidation,
    queryValidation,
    async (req: RequestWithParamsAndQuery<CommentsIdParams, QueryComments>,
           res: Response<PaginatedType<CommentsTypeOutput | null>>) => {
    const foundComments = await commentsQueryRepository.getCommentsById(req.params.id, req.query)

    if(!foundComments) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    res.json(foundComments)
    })

postsRouter.post('/',
    auth,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidation,
    async (req: RequestWithBody<PostsTypeInput>,
           res: Response<PostsTypeOutput| null>) => {
    const createdPost = await postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
    res.status(HTTP_STATUSES.CREATED_201).json(createdPost)
})

postsRouter.post('/:id/comments',
    bearerAuth,
    idValidation,
    contentInCommentValidation,
    inputValidation,
    async (req: RequestWithParamsAndBody<CommentsIdParams, CommentsTypeInputInPost>,
           res: Response<CommentsTypeOutput>) => {
    const createdComment = await commentsService.createComment(req.body.content, req.params.id, req.user!)

    if(!createdComment) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    res.status(HTTP_STATUSES.CREATED_201).json(createdComment)
    })

postsRouter.put('/:id',
    auth,
    idValidation,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidation,
    async (req: RequestWithParamsAndBody<PostsIdParams, PostsTypeInput>,
           res: Response) => {
    const updatedPost = await postsService.updatePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)

    if(!updatedPost) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

postsRouter.delete('/:id',
    auth,
    idValidation,
    async (req: RequestWithParams<PostsIdParams>, res: Response) => {
    const deletedPost = await postsService.deletePost(req.params.id)

    if(!deletedPost) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})