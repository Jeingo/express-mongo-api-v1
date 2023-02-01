import { inject, injectable } from 'inversify'
import { SessionsRepository } from '../repositories/sessions-repository'
import { SessionOutputType, SessionTypeToDB } from '../models/session-models'
import jwt from 'jsonwebtoken'
import { settings } from '../settings/settings'
import { TokenPayloadType } from '../models/token-models'
import { HttpTypes } from '../models/status-models'
import { HTTP_STATUSES } from '../constats/status'

@injectable()
export class SessionsService {
    constructor(@inject(SessionsRepository) protected sessionsRepository: SessionsRepository) {}

    async findAllActiveSession(userId: string): Promise<SessionOutputType[] | null> {
        return await this.sessionsRepository.findAllActiveSession(userId)
    }

    async saveSession(token: string, ip: string, deviceName: string): Promise<void> {
        const result = jwt.verify(token, settings.JWT_REFRESH_SECRET) as TokenPayloadType
        const issueAt = new Date(result.iat * 1000).toISOString()
        const expireAt = new Date(result.exp * 1000).toISOString()
        const userId = result.userId
        const deviceId = result.deviceId

        const session: SessionTypeToDB = new SessionTypeToDB(issueAt, deviceId, deviceName, ip, userId, expireAt)
        await this.sessionsRepository.saveSession(session)
    }

    async updateSession(token: string): Promise<void> {
        const result = jwt.verify(token, settings.JWT_REFRESH_SECRET) as TokenPayloadType
        const issueAt = new Date(result.iat * 1000).toISOString()
        const expireAt = new Date(result.exp * 1000).toISOString()
        const deviceId = result.deviceId
        await this.sessionsRepository.updateSession(issueAt, expireAt, deviceId)
    }

    async isActiveSession(deviceId: string, iat: string): Promise<boolean> {
        const result = await this.sessionsRepository.findSession(iat)
        if (!result) {
            return false
        }
        return result.deviceId === deviceId
    }

    async deleteSession(iat: number): Promise<boolean> {
        const issueAt = new Date(iat * 1000).toISOString()
        return await this.sessionsRepository.deleteSession(issueAt)
    }

    async deleteSessionByDeviceId(deviceId: string, userId: string): Promise<boolean | HttpTypes> {
        const device = await this.sessionsRepository.findSessionByDeviceId(deviceId)

        if (!device) {
            return HTTP_STATUSES.NOT_FOUND_404
        }

        if (device.userId !== userId) {
            return HTTP_STATUSES.FORBIDDEN_403
        }
        return await this.sessionsRepository.deleteSessionByDeviceId(deviceId)
    }

    async deleteActiveSessionWithoutCurrent(userId: string, iat: number): Promise<void> {
        const issueAt = new Date(iat * 1000).toISOString()
        await this.sessionsRepository.deleteSessionsWithoutCurrent(userId, issueAt)
    }
}
