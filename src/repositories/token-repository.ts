import { sessionCollection } from './db'
import { SessionType } from '../models/token-models'

const getOutputSession = (session: any) => {
    return {
        ip: session.ip,
        title: session.deviceName,
        lastActiveDate: session.issueAt,
        deviceId: session.deviceId
    }
}

export const tokenRepository = {
    async saveSession(session: SessionType) {
        await sessionCollection.insertOne(session)
    },
    async findAllActiveSession(userId: string) {
        const currentDate = new Date().toISOString()
        const result = await sessionCollection
            .find({ userId: userId, expireAt: { $gt: currentDate } })
            .toArray()

        if (!result) {
            return null
        }
        return result.map(getOutputSession)
    },
    async findSession(iat: string) {
        const result = await sessionCollection.findOne({ issueAt: iat })
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
    async findSessionByDeviceId(deviceId: string) {
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
    async updateSession(issueAt: string, expireAt: string, deviceId: string) {
        const result = await sessionCollection.updateOne(
            { deviceId: deviceId },
            { $set: { issueAt: issueAt, expireAt: expireAt } }
        )
        return result.matchedCount === 1
    },
    async deleteSession(issueAt: string) {
        const result = await sessionCollection.deleteOne({ issueAt: issueAt })
        return result.deletedCount === 1
    },
    async deleteSessionByDeviceId(deviceId: string) {
        const result = await sessionCollection.deleteOne({ deviceId: deviceId })
        return result.deletedCount === 1
    },
    async deleteSessionsWithoutCurrent(userId: string, issueAt: string) {
        const result = await sessionCollection.deleteMany({ userId: userId, issueAt: {$ne: issueAt}})
        return result.deletedCount === 1
    }
}
