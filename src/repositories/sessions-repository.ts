import { sessionCollection } from './db'
import { SessionInputType, SessionOutputType } from '../models/session-models'

const getOutputSession = (session: any) => {
    return {
        ip: session.ip,
        title: session.deviceName,
        lastActiveDate: session.issueAt,
        deviceId: session.deviceId
    }
}

export const sessionsRepository = {
    async saveSession(session: SessionInputType): Promise<void> {
        await sessionCollection.insertOne(session)
    },
    async findAllActiveSession(userId: string): Promise<SessionOutputType[] | null> {
        const currentDate = new Date().toISOString()
        const result = await sessionCollection
            .find({ userId: userId, expireAt: { $gt: currentDate } })
            .toArray()

        if (!result) {
            return null
        }
        return result.map(getOutputSession)
    },
    async findSession(iat: string): Promise<SessionOutputType | null> {
        const result = await sessionCollection.findOne({ issueAt: iat })
        if (!result) {
            return null
        }
        return getOutputSession(result)
    },
    async findSessionByDeviceId(deviceId: string): Promise<SessionInputType | null> {
        const result = await sessionCollection.findOne({ deviceId: deviceId })
        if (!result) {
            return null
        }
        return {
            issueAt: result.issueAt,
            deviceId: result.deviceId,
            deviceName: result.deviceName,
            ip: result.ip,
            userId: result.userId,
            expireAt: result.expireAt
        }
    },
    async updateSession(issueAt: string, expireAt: string, deviceId: string): Promise<boolean> {
        const result = await sessionCollection.updateOne(
            { deviceId: deviceId },
            { $set: { issueAt: issueAt, expireAt: expireAt } }
        )
        return result.matchedCount === 1
    },
    async deleteSession(issueAt: string): Promise<boolean> {
        const result = await sessionCollection.deleteOne({ issueAt: issueAt })
        return result.deletedCount === 1
    },
    async deleteSessionByDeviceId(deviceId: string): Promise<boolean> {
        const result = await sessionCollection.deleteOne({ deviceId: deviceId })
        return result.deletedCount === 1
    },
    async deleteSessionsWithoutCurrent(userId: string, issueAt: string): Promise<boolean> {
        const result = await sessionCollection.deleteMany({
            userId: userId,
            issueAt: { $ne: issueAt }
        })
        return result.deletedCount === 1
    }
}
