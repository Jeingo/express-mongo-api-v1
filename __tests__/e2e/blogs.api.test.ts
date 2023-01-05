import request from 'supertest'
import {app} from '../../src/app'
import {HTTP_STATUSES} from '../../src/constats/status'
import {BlogsTypeInput, BlogsTypeOutput} from "../../src/models/blogs-models"
import {PostsTypeInputInBlog, PostsTypeOutput} from "../../src/models/posts-models";
import {PaginatedType} from "../../src/models/main-models";


const correctBlog: BlogsTypeInput = {
    name: 'Name',
    description: 'Description',
    websiteUrl: 'https://testurl.com'
}

const correctNewBlog: BlogsTypeInput = {
    name: 'NameNew',
    description: 'DescriptionNew',
    websiteUrl: 'https://testurlnew.com'
}

const incorrectBlog: BlogsTypeInput = {
    name: '',
    description: '',
    websiteUrl: ''
}

const correctPostById: PostsTypeInputInBlog = {
    title: 'Title',
    shortDescription: 'Short Description',
    content: 'Content'
}

const incorrectPostById: PostsTypeInputInBlog = {
    title: '',
    shortDescription: '',
    content: ''
}

const emptyBlogs: PaginatedType<BlogsTypeOutput> =
    {
    "pagesCount": 0,
    "page": 1,
    "pageSize": 10,
    "totalCount": 0,
    "items": []
}

const emptyPosts: PaginatedType<PostsTypeOutput> =
    {
        "pagesCount": 0,
        "page": 1,
        "pageSize": 10,
        "totalCount": 0,
        "items": []
    }


const errorsMessage = {
    "errorsMessages": [
        {
            "message": "Shouldn't be empty",
            "field": "name"
        },
        {
            "message": "Shouldn't be empty",
            "field": "description"
        },
        {
            "message": "Shouldn't be empty",
            "field": "websiteUrl"
        }
    ]
}

const errorsMessagePost = {
    "errorsMessages": [
        {
            "message": "Shouldn't be empty",
            "field": "title"
        },
        {
            "message": "Shouldn't be empty",
            "field": "shortDescription"
        },
        {
            "message": "Shouldn't be empty",
            "field": "content"
        }
    ]
}

describe('/blogs', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })
    it('GET /blogs: should return 200 and empty array', async () => {
        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUSES.OK_200, emptyBlogs)
    })
    it('GET /blogs/bad-id: should return 404 for not existing blog', async () => {
        await request(app)
            .get('/blogs/999')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })
    it(`POST /blogs: shouldn't create blog without authorization`, async () => {
        await request(app)
            .post('/blogs')
            .send(correctBlog)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUSES.OK_200, emptyBlogs)
    })
    it(`POST /blogs: shouldn't create blog with incorrect data`, async () => {
        const errMes = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send(incorrectBlog)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUSES.OK_200, emptyBlogs)
        expect(errMes.body).toEqual(errorsMessage)
    })
    let createdBlog: any = null
    it(`POST /blogs: should create blog with correct data`, async () => {
        const createdResponse = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send(correctBlog)
            .expect(HTTP_STATUSES.CREATED_201)
        createdBlog = createdResponse.body
        expect(createdBlog).toEqual({
            id: expect.any(String),
            ...correctBlog,
            createdAt: expect.any(String)
        })
    })
    it(`GET /blogs/id: should return blog by id`, async () => {
        const response = await request(app)
            .get('/blogs' + '/' + createdBlog.id)
            .expect(HTTP_STATUSES.OK_200)
        expect(response.body).toEqual({
            id: expect.any(String),
            ...correctBlog,
            createdAt: expect.any(String)
        })
    })
    it(`PUT /blogs/id: shouldn't update blog without authorization`, async () => {
        await request(app)
            .put('/blogs' + '/' + createdBlog.id)
            .send(correctNewBlog)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })
    it(`PUT /blogs/id: shouldn't update blog with incorrect data`, async () => {
        const errMes = await request(app)
            .put('/blogs' + '/' + createdBlog.id)
            .auth('admin', 'qwerty')
            .send(incorrectBlog)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
        expect(errMes.body).toEqual(errorsMessage)
    })
    it(`PUT /blogs/id: should update blog with correct data`, async () => {
        await request(app)
            .put('/blogs' + '/' + createdBlog.id)
            .auth('admin', 'qwerty')
            .send(correctNewBlog)
            .expect(HTTP_STATUSES.NO_CONTENT_204)
        const response = await request(app)
            .get('/blogs' + '/' + createdBlog.id)
            .expect(HTTP_STATUSES.OK_200)
        expect(response.body).toEqual({
            id: expect.any(String),
            ...correctNewBlog,
            createdAt: expect.any(String)
        })
    })
    it('PUT /blogs/bad-id: should return 404 for not existing blog', async () => {
        await request(app)
            .put('/blogs/999')
            .auth('admin', 'qwerty')
            .send(correctNewBlog)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })
    it(`DELETE /blogs/id: shouldn't delete blog without authorization`, async () => {
        await request(app)
            .delete('/blogs' + '/' + createdBlog.id)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })
    it(`DELETE /blogs/bad-id: should return 404 for not existing blog`, async () => {
        await request(app)
            .delete('/blogs/999')
            .auth('admin', 'qwerty')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })
    it(`DELETE /blogs/id: should delete blog`, async () => {
        await request(app)
            .delete('/blogs' + '/' + createdBlog.id)
            .auth('admin', 'qwerty')
            .expect(HTTP_STATUSES.NO_CONTENT_204)
        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUSES.OK_200, emptyBlogs)
    })
    let createdBlog2: any = null
    it(`POST /blogs/id/posts: shouldn't create post by blog's id without authorization`, async () => {
        const createdResponse = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send(correctBlog)
            .expect(HTTP_STATUSES.CREATED_201)
        createdBlog2 = createdResponse.body
        await request(app)
            .post('/blogs' + '/' + createdBlog2.id + '/posts')
            .send(correctPostById)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
        await request(app)
            .get('/posts')
            .expect(HTTP_STATUSES.OK_200, emptyPosts)
    })
    it(`POST /blogs/id/posts: shouldn't create post by blog's id with incorrect data`, async () => {
        const errMes = await request(app)
            .post('/blogs' + '/' + createdBlog2.id + '/posts')
            .auth('admin', 'qwerty')
            .send(incorrectPostById)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
        expect(errMes.body).toEqual(errorsMessagePost)
    })
    let createdPost: any = null
    it(`POST /blogs/id/posts: should create posts by blog's id with correct data`, async () => {
        const createdResponse = await request(app)
            .post('/blogs' + '/' + createdBlog2.id + '/posts')
            .auth('admin', 'qwerty')
            .send(correctPostById)
            .expect(HTTP_STATUSES.CREATED_201)
        createdPost = createdResponse.body
        expect(createdPost).toEqual({
            id: expect.any(String),
            ...correctPostById,
            blogId: createdBlog2.id,
            blogName: createdBlog2.name,
            createdAt: expect.any(String)
        })
    })
    it(`POST /blogs/bad-id/posts: should return 404 for not existing post by blog's id`, async () => {
        await request(app)
            .post('/blogs/999/posts')
            .auth('admin', 'qwerty')
            .send(correctPostById)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })
    it(`GET /blogs/bad-id/posts: should return 404 for not existing post by blog's id`, async () => {
        await request(app)
            .get('/blogs/999/posts')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })
    it(`GET /blogs/id/posts: should return post by blog's id`, async () => {
        const response = await request(app)
            .get('/blogs' + '/' + createdBlog2.id + '/posts')
            .expect(HTTP_STATUSES.OK_200)
        expect(response.body).toEqual(
            {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [{
                    id: expect.any(String),
                    ...correctPostById,
                    blogId: createdBlog2.id,
                    blogName: createdBlog2.name,
                    createdAt: expect.any(String)
                }]
            }
        )
    })
})