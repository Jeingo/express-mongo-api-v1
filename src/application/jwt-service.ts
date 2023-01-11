import jwt from 'jsonwebtoken'
import { settings } from '../settings/settings'
import { ObjectId } from 'mongodb'
import { tokenRepository } from '../repositories/token-repository'
import { SessionType, TokenPayloadType } from '../models/token-models'

export const jwtService = {
    createJWT(userId: string) {
        return jwt.sign({ userId: userId }, settings.JWT_SECRET, {
            //expiresIn: '10s' for deploy
            expiresIn: '1m'
        })
    },
    createRefreshJWT(userId: string, deviceId: string) {
        return jwt.sign({ userId: userId, deviceId: deviceId }, settings.JWT_REFRESH_SECRET, {
            // expiresIn: '20s' for deploy
            expiresIn: '5m'
        })
    },
    checkExpirationAndGetPayload(token: string) {
        try {
            return jwt.verify(token, settings.JWT_REFRESH_SECRET) as TokenPayloadType
        } catch (err) {
            return null
        }
    },
    async saveSession(token: string, ip: string, deviceName: string) {
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
            expireAt: expireAt
        }
        await tokenRepository.saveSession(session)
    },
    async updateSession(token: string) {
        const result = jwt.verify(token, settings.JWT_REFRESH_SECRET) as TokenPayloadType
        const issueAt = new Date(result.iat * 1000).toISOString()
        const expireAt = new Date(result.exp * 1000).toISOString()
        const deviceId = result.deviceId
        await tokenRepository.updateSession(issueAt, expireAt, deviceId)
    },
    async isActiveSession(deviceId: string, iat: string) {
        const result = await tokenRepository.findSession(iat)
        if (!result) {
            return false
        }
        return result.deviceId === deviceId
    },
    async deleteSession(iat: number) {
        const issueAt = new Date(iat * 1000).toISOString()
        return await tokenRepository.deleteSession(issueAt)
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return new ObjectId(result.userId)
        } catch (err) {
            return null
        }
    }
}
