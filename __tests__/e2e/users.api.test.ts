import request from 'supertest'
import {app} from '../../src/app'
import {HTTP_STATUSES} from '../../src/constats/status'
import {PaginatedType} from "../../src/models/main-models";
import {UsersTypeInput} from "../../src/models/users-models";

const correctUser = {
    login: 'login',
    password: 'password',
    email: 'email@gmail.com'
}

const incorrectUser = {
    login: '',
    password: '',
    email: ''
}

const emptyUsers: PaginatedType<UsersTypeInput> =
    {
        "pagesCount": 0,
        "page": 1,
        "pageSize": 10,
        "totalCount": 0,
        "items": []
    }

const emptyUsersWithQuery: PaginatedType<UsersTypeInput> =
    {
        "pagesCount": 0,
        "page": 2,
        "pageSize": 5,
        "totalCount": 0,
        "items": []
    }

const someQuery = {
    pageNumber: 2,
    pageSize: 5
}

const errorsMessage = {
    "errorsMessages": [
        {
            "message": "Shouldn't be empty",
            "field": "login"
        },
        {
            "message": "Shouldn't be empty",
            "field": "password"
        },
        {
            "message": "Shouldn't be empty",
            "field": "email"
        }
    ]
}

describe('/blogs', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })
    it('GET /users: should return 200 and empty array', async () => {
        await request(app)
            .get('/users')
            .auth('admin', 'qwerty')
            .expect(HTTP_STATUSES.OK_200, emptyUsers)
    })
    it(`GET /users: shouldn't get users without authorization`, async () => {
        await request(app)
            .get('/users')
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })
    it('GET /users: should return 200 and empty array', async () => {
        await request(app)
            .get('/users')
            .query(someQuery)
            .auth('admin', 'qwerty')
            .expect(HTTP_STATUSES.OK_200, emptyUsersWithQuery)
    })
    it(`POST /users: shouldn't create user without authorization`, async () => {
        await request(app)
            .post('/users')
            .send(correctUser)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
        await request(app)
            .get('/users')
            .auth('admin', 'qwerty')
            .expect(HTTP_STATUSES.OK_200, emptyUsers)
    })
    it(`POST /users: shouldn't create user with incorrect data`, async () => {
        const errMes = await request(app)
            .post('/users')
            .auth('admin', 'qwerty')
            .send(incorrectUser)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
        await request(app)
            .get('/users')
            .auth('admin', 'qwerty')
            .expect(HTTP_STATUSES.OK_200, emptyUsers)
        expect(errMes.body).toEqual(errorsMessage)
    })
    let createdUser: any = null
    it(`POST /users: should create user with correct data`, async () => {
        const createdResponse = await request(app)
            .post('/users')
            .auth('admin', 'qwerty')
            .send(correctUser)
            .expect(HTTP_STATUSES.CREATED_201)
        createdUser = createdResponse.body
        expect(createdUser).toEqual({
            id: expect.any(String),
            login: 'login',
            email: 'email@gmail.com',
            createdAt: expect.any(String)
        })
    })
    it(`DELETE /users/id: shouldn't delete user without authorization`, async () => {
        await request(app)
            .delete('/users' + '/' + createdUser.id)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })
    it(`DELETE /users/bad-id: should return 404 for not existing user`, async () => {
        await request(app)
            .delete('/users/999')
            .auth('admin', 'qwerty')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })
    it(`DELETE /users/id: should delete user`, async () => {
        await request(app)
            .delete('/users' + '/' + createdUser.id)
            .auth('admin', 'qwerty')
            .expect(HTTP_STATUSES.NO_CONTENT_204)
        await request(app)
            .get('/users')
            .auth('admin', 'qwerty')
            .expect(HTTP_STATUSES.OK_200, emptyUsers)
    })
})
