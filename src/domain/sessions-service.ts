import jwt from 'jsonwebtoken'
import { settings } from '../settings/settings'
import { TokenPayloadType } from '../models/token-models'
import { sessionsRepository } from '../repositories/sessions-repository'
import { HTTP_STATUSES } from '../constats/status'
import { SessionInputType, SessionOutputType } from '../models/session-models'
import { HttpTypes } from '../models/status-models'

class SessionsService {
    async findAllActiveSession(userId: string): Promise<SessionOutputType[] | null> {
        return await sessionsRepository.findAllActiveSession(userId)
    }
    async saveSession(token: string, ip: string, deviceName: string): Promise<void> {
        const result = jwt.verify(token, settings.JWT_REFRESH_SECRET) as TokenPayloadType
        const issueAt = new Date(result.iat * 1000).toISOString()
        const expireAt = new Date(result.exp * 1000).toISOString()
        const userId = result.userId
        const deviceId = result.deviceId

        const session: SessionInputType = {
            issueAt: issueAt,
            deviceId: deviceId,
            deviceName: deviceName,
            ip: ip,
            userId: userId,
            expireAt: expireAt
        }
        await sessionsRepository.saveSession(session)
    }
    async updateSession(token: string): Promise<void> {
        const result = jwt.verify(token, settings.JWT_REFRESH_SECRET) as TokenPayloadType
        const issueAt = new Date(result.iat * 1000).toISOString()
        const expireAt = new Date(result.exp * 1000).toISOString()
        const deviceId = result.deviceId
        await sessionsRepository.updateSession(issueAt, expireAt, deviceId)
    }
    async isActiveSession(deviceId: string, iat: string): Promise<boolean> {
        const result = await sessionsRepository.findSession(iat)
        if (!result) {
            return false
        }
        return result.deviceId === deviceId
    }
    async deleteSession(iat: number): Promise<boolean> {
        const issueAt = new Date(iat * 1000).toISOString()
        return await sessionsRepository.deleteSession(issueAt)
    }
    async deleteSessionByDeviceId(deviceId: string, userId: string): Promise<boolean | HttpTypes> {
        const device = await sessionsRepository.findSessionByDeviceId(deviceId)

        if (!device) {
            return HTTP_STATUSES.NOT_FOUND_404
        }

        if (device.userId !== userId) {
            return HTTP_STATUSES.FORBIDDEN_403
        }
        return await sessionsRepository.deleteSessionByDeviceId(deviceId)
    }
    async deleteActiveSessionWithoutCurrent(userId: string, iat: number): Promise<void> {
        const issueAt = new Date(iat * 1000).toISOString()
        await sessionsRepository.deleteSessionsWithoutCurrent(userId, issueAt)
    }
}

export const sessionsService = new SessionsService()
