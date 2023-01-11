import jwt from "jsonwebtoken";
import {settings} from "../settings/settings";
import {SessionType, TokenPayloadType} from "../models/token-models";
import {tokenRepository} from "../repositories/token-repository";

export const sessionsService = {
    async findAllActiveSession(userId: string) {
        return await tokenRepository.findAllActiveSession(userId)
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
    }
}
