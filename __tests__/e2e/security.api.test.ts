import request from "supertest";
import {app} from "../../src/app";
import {HTTP_STATUSES} from "../../src/constats/status";
import mongoose from "mongoose";
import {settings} from "../../src/settings/settings";

const correctUser = {
    login: 'login',
    password: 'password',
    email: 'email@gmail.com'
}

const correctUser2 = {
    login: 'login2',
    password: 'password',
    email: 'email@gmail.com'
}

const correctLogin = {
    loginOrEmail: 'login',
    password: 'password'
}

const correctLogin2 = {
    loginOrEmail: 'login2',
    password: 'password'
}

let createdUser: any = null
let createdToken: any = null
let createdRefreshToken: any = null
describe('/security/devices', () => {
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
        const createdResponseLogin = await request(app)
            .post('/auth/login')
            .send(correctLogin)
            .expect(HTTP_STATUSES.OK_200)
        createdToken = createdResponseLogin.body
        createdRefreshToken = createdResponseLogin.headers['set-cookie'][0].split(';')[0]
        expect(createdToken).toEqual({
            accessToken: expect.any(String)
        })
    })
    afterAll(async () => {
        await mongoose.connection.close()
    })
    it('GET /security/devices: should return 401 with incorrect cookie', async () => {
        await request(app)
            .get('/security/devices')
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })
    let createdSession: any = null
    it('GET /security/devices: should return 200 with correct data', async () => {
        const createdResponse = await request(app)
            .get('/security/devices')
            .set('Cookie', createdRefreshToken)
            .expect(HTTP_STATUSES.OK_200)
        createdSession = createdResponse.body
        expect(createdSession).toEqual([{
            ip: expect.any(String),
            title: 'some device',
            lastActiveDate: expect.any(String),
            deviceId: expect.any(String)
        }])
    })
    it('DELETE /security/devices: should return 401 with incorrect cookie', async () => {
        await request(app)
            .delete('/security/devices')
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })
    it('DELETE /security/devices: should return 204 with correct data', async () => {
         await request(app)
            .delete('/security/devices')
            .set('Cookie', createdRefreshToken)
            .expect(HTTP_STATUSES.NO_CONTENT_204)
    })
    it('DELETE /security/devices/:id: should return 401 with incorrect cookie', async () => {
        await request(app)
            .delete('/security/devices' + '/' + createdSession[0].deviceId)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })
    it('DELETE /security/devices/:bad-id: should return 404 with incorrect deviceId', async () => {
        await request(app)
            .delete('/security/devices' + '/' + createdSession[0].deviceId + '!')
            .set('Cookie', createdRefreshToken)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })
    let createdUser2: any = null
    let createdToken2: any = null
    let createdRefreshToken2: any = null

    it('DELETE /security/devices/id: should return 403 with other user', async () => {
        const createdResponse = await request(app)
            .post('/users')
            .auth('admin', 'qwerty')
            .send(correctUser2)
            .expect(HTTP_STATUSES.CREATED_201)
        createdUser2 = createdResponse.body
        const createdResponseLogin = await request(app)
            .post('/auth/login')
            .send(correctLogin2)
            .expect(HTTP_STATUSES.OK_200)
        createdToken2 = createdResponseLogin.body
        createdRefreshToken2 = createdResponseLogin.headers['set-cookie'][0].split(';')[0]
        const createdResponse2 = await request(app)
            .get('/security/devices')
            .set('Cookie', createdRefreshToken)
            .expect(HTTP_STATUSES.OK_200)
        createdSession = createdResponse2.body
        await request(app)
            .delete('/security/devices' + '/' + createdSession[0].deviceId)
            .set('Cookie', createdRefreshToken2)
            .expect(HTTP_STATUSES.FORBIDDEN_403)
    })
    it('DELETE /security/devices/:id: should return 204 ', async () => {
        await request(app)
            .delete('/security/devices' + '/' + createdSession[0].deviceId )
            .set('Cookie', createdRefreshToken)
            .expect(HTTP_STATUSES.NO_CONTENT_204)
    })
})