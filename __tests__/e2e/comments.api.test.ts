import request from 'supertest'
import {app} from '../../src/app'
import {HTTP_STATUSES} from '../../src/constats/status'
import {CommentsTypeInput, CommentsTypeOutput} from "../../src/models/comments-models";
import {PostsTypeInput} from "../../src/models/posts-models";
import {BlogsTypeInput} from "../../src/models/blogs-models";
import {PaginatedType} from "../../src/models/main-models";
import mongoose from "mongoose";
import {settings} from "../../src/settings/settings";

const correctBlog: BlogsTypeInput = {
    name: 'Name',
    description: 'Description',
    websiteUrl: 'https://testurl.com'
}

const correctPost: PostsTypeInput = {
    title: 'Title',
    shortDescription: 'Short Description',
    content: 'Content',
    blogId: '1'
}

const correctUser = {
    login: 'login',
    password: 'password',
    email: 'email@gmail.com'
}

const correctUser2 = {
    login: 'login2',
    password: 'password2',
    email: 'email@gmail.com'
}

const correctLogin = {
    loginOrEmail: 'login',
    password: 'password'
}

const correctLogin2 = {
    loginOrEmail: 'login2',
    password: 'password2'
}

const correctComment: CommentsTypeInput = {
    content: "content content content content more 20"
}

const correctCommentNew: CommentsTypeInput = {
    content: "content content content content more 20 NEW"
}

const inCorrectCommentNew: CommentsTypeInput = {
    content: "incorrect content"
}

const badLikeStatus = {
    likeStatus: ''
}

const correctLikeStatus = {
    likeStatus: 'Like'
}

const emptyComments: PaginatedType<CommentsTypeOutput> = {
    "pagesCount": 0,
    "page": 1,
    "pageSize": 10,
    "totalCount": 0,
    "items": []
}


let createdComment: any = null
let createdUser: any = null
let createdToken: any = null
let createdPost: any = null
describe('/comments', () => {
    beforeAll(async () => {
        mongoose.set('strictQuery', false)
        await mongoose.connect(settings.MONGO_URL, {dbName: settings.DB_NAME})
        await request(app).delete('/testing/all-data')
        const createdResponseBlog = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send(correctBlog)
            .expect(HTTP_STATUSES.CREATED_201)
        const createdBlog = createdResponseBlog.body
        correctPost.blogId = createdBlog.id
        const createdResponsePost = await request(app)
            .post('/posts')
            .auth('admin', 'qwerty')
            .send(correctPost)
            .expect(HTTP_STATUSES.CREATED_201)
        createdPost = createdResponsePost.body
        const createdResponseUser = await request(app)
            .post('/users')
            .auth('admin', 'qwerty')
            .send(correctUser)
            .expect(HTTP_STATUSES.CREATED_201)
        createdUser = createdResponseUser.body
        const createdResponseToken = await request(app)
            .post('/auth/login')
            .send(correctLogin)
            .expect(HTTP_STATUSES.OK_200)
        createdToken = createdResponseToken.body
        const createdResponseComment = await request(app)
            .post('/posts' + '/' +createdPost.id + '/comments')
            .set('Authorization', 'Bearer ' + createdToken.accessToken)
            .send(correctComment)
            .expect(HTTP_STATUSES.CREATED_201)
        createdComment = createdResponseComment.body
    })
    afterAll(async () => {
        await mongoose.connection.close()
    })
    it('GET /comments/bad-id: should return 404 for not existing comments', async () => {
        await request(app)
            .get('/comments/999')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })
    it(`GET /comments/id: should return comments by id`, async () => {
        const response = await request(app)
            .get('/comments' + '/' + createdComment.id)
            .expect(HTTP_STATUSES.OK_200)
        expect(response.body).toEqual({
            id: expect.any(String),
            ...correctComment,
            userId: createdUser.id,
            userLogin: createdUser.login,
            createdAt: expect.any(String),
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None'
            }
        })
    })
    it(`PUT /comments/id: shouldn't update comment without authorization`, async () => {
        await request(app)
            .put('/comments' + '/' + createdComment.id)
            .send(correctCommentNew)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })
    it(`PUT /comments/id: shouldn't update comment with incorrect data`, async () => {
        await request(app)
            .put('/comments' + '/' + createdComment.id)
            .set('Authorization', 'Bearer ' + createdToken.accessToken)
            .send(inCorrectCommentNew)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
    })
    it(`PUT /comments/bad-id: should return 404 for not existing comment`, async () => {
        await request(app)
            .put('/comments/999')
            .set('Authorization', 'Bearer ' + createdToken.accessToken)
            .send(correctCommentNew)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    let createdUser2: any = null
    let createdToken2: any = null

    it(`PUT /comments/id: should return 403 with incorrect token`, async () => {
        const createdResponseUser = await request(app)
            .post('/users')
            .auth('admin', 'qwerty')
            .send(correctUser2)
            .expect(HTTP_STATUSES.CREATED_201)
        createdUser2 = createdResponseUser.body
        const createdResponseToken = await request(app)
            .post('/auth/login')
            .send(correctLogin2)
            .expect(HTTP_STATUSES.OK_200)
        createdToken2 = createdResponseToken.body
        await request(app)
            .put('/comments' + '/' + createdComment.id)
            .set('Authorization', 'Bearer ' + createdToken2.accessToken)
            .send(correctCommentNew)
            .expect(HTTP_STATUSES.FORBIDDEN_403)
    })
    it(`PUT /comments/id: should update comment with correct data`, async () => {
        await request(app)
            .put('/comments' + '/' + createdComment.id)
            .set('Authorization', 'Bearer ' + createdToken.accessToken)
            .send(correctCommentNew)
            .expect(HTTP_STATUSES.NO_CONTENT_204)
        const response = await request(app)
            .get('/comments' + '/' + createdComment.id)
            .expect(HTTP_STATUSES.OK_200)
        expect(response.body).toEqual({
            id: expect.any(String),
            ...correctCommentNew,
            userId: createdUser.id,
            userLogin: createdUser.login,
            createdAt: expect.any(String),
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None'
            }
        })
    })
    it(`PUT /comments/id/like-status: should return 401 without authorization`, async () => {
        await request(app)
            .put('/comments' + '/' + createdComment.id + '/' + 'like-status')
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })
    it(`PUT /comments/id/like-status: should return 400 with bad body`, async () => {
        await request(app)
            .put('/comments' + '/' + createdComment.id + '/' + 'like-status')
            .set('Authorization', 'Bearer ' + createdToken.accessToken)
            .send(badLikeStatus)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
    })
    it(`PUT /comments/bad-id/like-status: should return 404 if comment not exist`, async () => {
        await request(app)
            .put('/comments' + '/' + 999 + '/' + 'like-status')
            .set('Authorization', 'Bearer ' + createdToken.accessToken)
            .send(correctLikeStatus)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })
    it(`PUT /comments/id/like-status: should return 204 if all ok`, async () => {
        await request(app)
            .put('/comments' + '/' + createdComment.id + '/' + 'like-status')
            .set('Authorization', 'Bearer ' + createdToken.accessToken)
            .send(correctLikeStatus)
            .expect(HTTP_STATUSES.NO_CONTENT_204)
        const response = await request(app)
            .get('/comments' + '/' + createdComment.id)
            .set('Authorization', 'Bearer ' + createdToken.accessToken)
            .expect(HTTP_STATUSES.OK_200)
        expect(response.body).toEqual({
            id: expect.any(String),
            ...correctCommentNew,
            userId: createdUser.id,
            userLogin: createdUser.login,
            createdAt: expect.any(String),
            likesInfo: {
                likesCount: 1,
                dislikesCount: 0,
                myStatus: 'Like'
            }
        })
        const response2 = await request(app)
            .get('/comments' + '/' + createdComment.id)
            .expect(HTTP_STATUSES.OK_200)
        expect(response2.body).toEqual({
            id: expect.any(String),
            ...correctCommentNew,
            userId: createdUser.id,
            userLogin: createdUser.login,
            createdAt: expect.any(String),
            likesInfo: {
                likesCount: 1,
                dislikesCount: 0,
                myStatus: 'None'
            }
        })
    })
    it(`DELETE /comments/id: shouldn't delete blog without authorization`, async () => {
        await request(app)
            .delete('/comments' + '/' + createdComment.id)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })
    it(`DELETE /comments/bad-id: should return 404 for not existing comment`, async () => {
        await request(app)
            .delete('/comments/999')
            .set('Authorization', 'Bearer ' + createdToken.accessToken)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })
    it(`DELETE /comments/id: should return 403 with incorrect token`, async () => {
        await request(app)
            .delete('/comments' + '/' + createdComment.id)
            .set('Authorization', 'Bearer ' + createdToken2.accessToken)
            .expect(HTTP_STATUSES.FORBIDDEN_403)
    })
    it(`DELETE /comments/id: should delete comment with correct data`, async () => {
        await request(app)
            .delete('/comments' + '/' + createdComment.id)
            .set('Authorization', 'Bearer ' + createdToken.accessToken)
            .expect(HTTP_STATUSES.NO_CONTENT_204)
        await request(app)
            .get('/posts' + '/' + createdPost.id + '/comments')
            .expect(HTTP_STATUSES.OK_200, emptyComments)
    })

})