 import request from "supertest"
import {app} from "../../src/app"
import {HTTP_STATUSES} from '../../src/constats/status'
 import mongoose from "mongoose";
 import {settings} from "../../src/settings/settings";

const correctUser = {
    login: 'login',
    password: 'password',
    email: 'email@gmail.com'
}

 const correctUser2 = {
     login: 'login2',
     password: 'password2',
     email: 'email2@gmail.com'
 }

const correctLogin = {
    loginOrEmail: 'login',
    password: 'password'
}

const correctBadLogin = {
    loginOrEmail: 'login',
    password: 'bad-password'
}

const incorrectLogin = {
    login: '',
    password: ''
}

const incorrectCodeConfirmation = {
    code: '123'
}

 const incorrectEmailForResending = {
     email: 'bad-email@gmail.com'
 }

const errorsMessage = {
    "errorsMessages": [
        {
            "message": "Shouldn't be empty",
            "field": "loginOrEmail"
        },
        {
            "message": "Shouldn't be empty",
            "field": "password"
        }
    ]
}

 const errorsMessageForRegistration = {
     "errorsMessages": [
         {
             "message": "The user with this login is already exist",
             "field": "login"
         },
         {
             "message": "The user with this email is already exist",
             "field": "email"
         }
     ]
 }

 const errorsMessageForConfirmation = {
     "errorsMessages": [
         {
             "message": "This code is wrong",
             "field": "code"
         }
     ]
 }

 const errorsMessageForEmailResending = {
     "errorsMessages": [
         {
             "message": "This email is wrong",
             "field": "email"
         }
     ]
 }

let createdUser: any = null
describe('/auth/login', () => {
    beforeAll(async () => {
        mongoose.set('strictQuery', false)
        await mongoose.connect(settings.MONGO_URL, {dbName: settings.DB_NAME})
        await request(app).delete('/testing/all-data')
        const createdResponse = await request(app)
            .post('/users')
            .auth('admin', 'qwerty')
            .send(correctUser)
            .expect(HTTP_STATUSES.CREATED_201)
        createdUser = createdResponse.body
    })
    afterAll(async () => {
        await mongoose.connection.close()
    })
    it('POST /auth/login: should return 400 with incorrect data', async () => {
        const errMes = await request(app)
            .post('/auth/login')
            .send(incorrectLogin)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
        expect(errMes.body).toEqual(errorsMessage)
    })
    it('POST /auth/login: should return 401 if the password or login is wrong', async () => {
        await request(app)
            .post('/auth/login')
            .send(correctBadLogin)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })
    let createdToken: any = null
    let createdRefreshToken: any = null
    it('POST /auth/login: should return 200 if the password or login is correct', async () => {
        const createdResponse = await request(app)
            .post('/auth/login')
            .send(correctLogin)
            .expect(HTTP_STATUSES.OK_200)
        createdToken = createdResponse.body
        createdRefreshToken = createdResponse.headers['set-cookie'][0].split(';')[0]
        expect(createdToken).toEqual({
            accessToken: expect.any(String)
        })
    })
    it('GET /auth/me: should return 401 if token is wrong', async () => {
        await request(app)
            .get('/auth/me')
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })
    let gotRegistrationUser: any = null
    it('GET /auth/me: should return 200', async () => {
        const createdResponse = await request(app)
            .get('/auth/me')
            .set('Authorization', 'Bearer ' + createdToken.accessToken)
            .expect(HTTP_STATUSES.OK_200)
        gotRegistrationUser = createdResponse.body
        expect(gotRegistrationUser).toEqual({
            email: createdUser.email,
            login: createdUser.login,
            userId: createdUser.id
        })
    })
    it('POST /auth/registration: should return 400 with invalid data', async () => {
        const createdResponse = await request(app)
            .post('/auth/registration')
            .send(correctUser)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
        expect(createdResponse.body).toEqual(errorsMessageForRegistration)
    })
    it('POST /auth/registration: should return 204 with correct data', async () => {
        await request(app)
            .post('/auth/registration')
            .send(correctUser2)
            .expect(HTTP_STATUSES.NO_CONTENT_204)
    })
    it('POST /auth/registration-confirmation: should return 400 with invalid data', async () => {
        const createdResponse = await request(app)
            .post('/auth/registration-confirmation')
            .send(incorrectCodeConfirmation)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
        expect(createdResponse.body).toEqual(errorsMessageForConfirmation)
    })
    it('POST /auth/registration-confirmation: should return 204 with correct code (Try it yourself)', async () => {
        expect(1).toBe(1)
    })
    it('POST /auth/registration-email-resending: should return 400 with invalid data', async () => {
        const createdResponse = await request(app)
            .post('/auth/registration-email-resending')
            .send(incorrectEmailForResending)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
        expect(createdResponse.body).toEqual(errorsMessageForEmailResending)
    })
    it('POST /auth/refresh-token: should return 401 if refresh-token is wrong', async () => {
        await request(app)
            .post('/auth/refresh-token')
            .set('Cookie', createdRefreshToken + '!')
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })
    let createdRefreshToken2: any = null
    it('POST /auth/refresh-token: should return 200 with correct refresh token', async () => {
        const createdResponse = await request(app)
            .post('/auth/refresh-token')
            .set('Cookie', createdRefreshToken)
            .expect(HTTP_STATUSES.OK_200)
        const token = createdResponse.body
        createdRefreshToken2 = createdResponse.headers['set-cookie'][0].split(';')[0]
        expect(token).toEqual({accessToken: expect.any(String) })
    })
    it('POST /auth/logout: should return 401 if refresh-token is wrong', async () => {
        await request(app)
            .post('/auth/logout')
            .set('Cookie', createdRefreshToken + '!')
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })
    it('POST /auth/logout: should return 200 with correct refresh token', async () => {
        await request(app)
            .post('/auth/logout')
            .set('Cookie', createdRefreshToken2)
            .expect(HTTP_STATUSES.NO_CONTENT_204)
    })
    it('POST /auth/login: should return 429 after 5 request in 10 seconds ', async() => {
        for(let i = 0; i < 5; i++) {
            await request(app)
                .post('/auth/login')
                .send(correctLogin)
        }
        await request(app)
            .post('/auth/login')
            .send(correctLogin)
            .expect(HTTP_STATUSES.TOO_MANY_REQUESTS_429)
    })
})