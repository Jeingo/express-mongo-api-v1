import { RateLimiterModel } from './db'
import { RateLimiterType } from '../models/auth-models'
import { ObjectId } from 'mongodb'

const getOutputIPBase = (base: any) => {
    return {
        id: base._id,
        ip: base.ip,
        endpoint: base.endpoint,
        date: base.date,
        count: base.count
    }
}

export const rateLimiterRepository = {
    async findIpBase(ip: string, endpoint: string): Promise<RateLimiterType | null> {
        const result = await RateLimiterModel.findOne({ ip: ip, endpoint: endpoint })
        if (!result) return null
        return getOutputIPBase(result)
    },
    async createIpBase(ip: string, endpoint: string, dateNow: number): Promise<void> {
        await RateLimiterModel.create({
            ip: ip,
            endpoint: endpoint,
            date: dateNow,
            count: 1
        })
    },
    async incrementCountInIpBase(base: RateLimiterType): Promise<boolean> {
        const newCount = base.count + 1
        const result = await RateLimiterModel.findByIdAndUpdate(new ObjectId(base.id), {
            count: newCount
        })
        return !!result
    },
    async toDefaultBase(base: RateLimiterType, dateNow: number): Promise<boolean> {
        const result = await RateLimiterModel.findByIdAndUpdate(new ObjectId(base.id), {
            count: 1,
            date: dateNow
        })
        return !!result
    }
}
