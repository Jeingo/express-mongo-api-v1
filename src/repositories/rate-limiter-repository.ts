import { rateLimiterCollection } from './db'
import { RateLimiterType } from '../models/auth-models'

export const rateLimiterRepository = {
    async findIpBase(ip: string) {
        const result = await rateLimiterCollection.findOne({ ip: ip })
        if (!result) {
            return null
        }
        return {
            id: result._id,
            ip: result.ip,
            date: result.date,
            count: result.count
        }
    },
    async createIpBase(ip: string, dateNow: number) {
        await rateLimiterCollection.insertOne({ ip: ip, date: dateNow, count: 1 })
    },
    async incrementCountInIpBase(base: RateLimiterType) {
        const newCount = base.count + 1
        const result = await rateLimiterCollection.updateOne(
            { _id: base.id },
            { $set: { count: newCount } }
        )
        return result.matchedCount === 1
    },
    async toDefaultBase(base: RateLimiterType, dateNow: number) {
        const result = await rateLimiterCollection.updateOne(
            { _id: base.id },
            { $set: { count: 1, date: dateNow } }
        )
        return result.matchedCount === 1
    }
}
