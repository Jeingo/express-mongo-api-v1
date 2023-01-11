import { sessionCollection } from './db'
import { SessionType } from '../models/token-models'

export const tokenRepository = {
    async saveSession(session: SessionType) {
        await sessionCollection.insertOne(session)
    },
    async findSession(iat: string) {
        const result = await sessionCollection.findOne({issueAt: iat})
        if(!result) {
            return null
        }
        return {
            issueAt: result.issueAt,
            deviceId: result.deviceId,
            deviceName: result.deviceName,
            ip: result.ip,
            userId: result.userId,
            expireAt: result.expireAt,
        }
    },
    async updateSession(issueAt: string, expireAt: string, deviceId: string) {
        const result = await sessionCollection.updateOne({deviceId: deviceId}, {$set: {issueAt: issueAt, expireAt: expireAt}})
        return result.matchedCount === 1
    },
    async deleteSession(issueAt: string) {
        const result = await sessionCollection.deleteOne({ issueAt: issueAt })
        console.log(issueAt)
        return result.deletedCount === 1
    },
}
