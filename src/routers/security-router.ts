import { Router, Request, Response } from 'express'
import { jwtService } from '../application/jwt-service'
import { HTTP_STATUSES } from '../constats/status'
import { sessionsService } from '../domain/sessions-service'
import { RequestWithParams } from '../models/types'
import { DeviceIdParams } from '../models/auth-models'

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

securityRouter.delete(
    '/devices/:id',
    async (req: RequestWithParams<DeviceIdParams>, res: Response) => {
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

        const deletedDevice = await sessionsService.deleteSessionByDeviceId(
            req.params.id,
            payload.userId
        )
        if (deletedDevice === HTTP_STATUSES.NOT_FOUND_404) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        if (deletedDevice === HTTP_STATUSES.FORBIDDEN_403) {
            res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
)
