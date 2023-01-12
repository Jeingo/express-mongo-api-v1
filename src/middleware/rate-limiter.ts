import { NextFunction, Request, Response } from 'express'
import { rateLimiterRepository } from '../repositories/rate-limiter-repository'
import { HTTP_STATUSES } from '../constats/status'

const maxRequest = 5
const timeInterval = 10000 // 10s

export const rateLimiterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const currentEndpoint = req.originalUrl
    const currentDate = Date.now()
    const currentIp = req.ip
    const ipBase = await rateLimiterRepository.findIpBase(currentIp, currentEndpoint)

    if (!ipBase) {
        await rateLimiterRepository.createIpBase(currentIp, currentEndpoint, currentDate)
        next()
        return
    }
    if (ipBase!.count >= maxRequest && ipBase!.date + timeInterval > currentDate) {
        res.sendStatus(HTTP_STATUSES.TOO_MANY_REQUESTS_429)
        return
    }
    if (ipBase!.date + timeInterval < currentDate) {

        await rateLimiterRepository.toDefaultBase(ipBase, currentDate)
        next()
        return
    }

    await rateLimiterRepository.incrementCountInIpBase(ipBase)
    next()
}
