import { Request, Response } from 'express'
import { checkAuthorizationAndGetPayload } from './helper'
import { HTTP_STATUSES } from '../constats/status'
import {SessionsService} from '../domain/sessions-service'
import { RequestWithParams } from '../models/types'
import { DeviceIdParams } from '../models/auth-models'

export class SecurityController {
    constructor(protected sessionsService: SessionsService) {}

    async getAllActiveSession(req: Request, res: Response) {
        const gotRefreshToken = req.cookies.refreshToken

        const payload = await checkAuthorizationAndGetPayload(gotRefreshToken)
        if (!payload) {
            res.clearCookie('refreshToken')
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            return
        }

        const allSession = await this.sessionsService.findAllActiveSession(payload.userId)
        res.json(allSession)
    }
    async deleteAllSessionWithoutCurrent(req: Request, res: Response) {
        const gotRefreshToken = req.cookies.refreshToken

        const payload = await checkAuthorizationAndGetPayload(gotRefreshToken)
        if (!payload) {
            res.clearCookie('refreshToken')
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            return
        }
        await this.sessionsService.deleteActiveSessionWithoutCurrent(payload.userId, payload.iat)
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
    async deleteSessionById(req: RequestWithParams<DeviceIdParams>, res: Response) {
        const gotRefreshToken = req.cookies.refreshToken

        const payload = await checkAuthorizationAndGetPayload(gotRefreshToken)
        if (!payload) {
            res.clearCookie('refreshToken')
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            return
        }

        const deletedDevice = await this.sessionsService.deleteSessionByDeviceId(req.params.id, payload.userId)
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
}
