import { Router, Request, Response } from 'express'
import { jwtService } from '../application/jwt-service'
import { HTTP_STATUSES } from '../constats/status'
import { sessionsService } from '../domain/sessions-service'

export const securityRouter = Router({})

securityRouter.get('/devices', async (req: Request, res: Response) => {
    const gotRefreshToken = req.cookies.refreshToken

    const payload = jwtService.checkExpirationAndGetPayload(gotRefreshToken)
    if (!payload) {
        res.clearCookie('refreshToken')
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    const statusSession = await sessionsService.isActiveSession(
        payload.deviceId,
        payload.iat.toString()
    )
    if (statusSession) {
        res.clearCookie('refreshToken')
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }
    const allSession = await sessionsService.findAllActiveSession(payload.userId)
    res.json(allSession)
})

securityRouter.delete('/devices', async (req: Request, res: Response) => {
    const gotRefreshToken = req.cookies.refreshToken

    const payload = jwtService.checkExpirationAndGetPayload(gotRefreshToken)
    if (!payload) {
        res.clearCookie('refreshToken')
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    const statusSession = await sessionsService.isActiveSession(
        payload.deviceId,
        payload.iat.toString()
    )
    if (statusSession) {
        res.clearCookie('refreshToken')
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }
    await sessionsService.deleteActiveSessionWithoutCurrent(payload.userId, payload.iat)
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

securityRouter.delete('/devices/:id', async (req: Request, res: Response) => {})
