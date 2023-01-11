import jwt from 'jsonwebtoken'
import { settings } from '../settings/settings'
import { ObjectId } from 'mongodb'
import { tokenRepository } from '../repositories/token-repository'
import { SessionType, TokenPayloadType } from '../models/token-models'
import { v4 as uuidv4 } from 'uuid'

export const jwtService = {
    createJWT(userId: string) {
        return jwt.sign({ userId: userId }, settings.JWT_SECRET, {
            //expiresIn: '10s' for deploy
            expiresIn: '1m',
        })
    },
    createRefreshJWT(userId: string) {
        const deviceId = uuidv4()
        return jwt.sign(
            { userId: userId, deviceId: deviceId }, settings.JWT_REFRESH_SECRET, {
                // expiresIn: '20s' for deploy
                expiresIn: '1s',
            })
    },
    async saveSession(token: string, ip :string, deviceName: string ) {
        const result = jwt.verify(token, settings.JWT_REFRESH_SECRET) as TokenPayloadType
        const issueAt = new Date(result.iat * 1000).toISOString()
        const expireAt = new Date(result.exp * 1000).toISOString()
        const userId = result.userId
        const deviceId = result.deviceId

        const session: SessionType = {
            issueAt: issueAt,
            deviceId: deviceId,
            deviceName: deviceName,
            ip: ip,
            userId: userId,
            expireAt: expireAt,
        }
        await tokenRepository.saveSession(session)
    },
    async deleteRefreshJWT(userId: string) {
        return await tokenRepository.deleteRefreshTokenByUserId(userId)
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return new ObjectId(result.userId)
        } catch (err) {
            return null
        }
    },
    async getUserIdByTokenRefresh(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_REFRESH_SECRET)
            return new ObjectId(result.userId)
        } catch (err) {
            return null
        }
    },
}
