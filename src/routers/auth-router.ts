import { Router, Response, Request } from 'express'
import {
    codeValidation,
    emailRegistrationValidation,
    emailResendValidation,
    loginOrEmailValidation,
    loginRegistrationValidation,
    passwordFromAuthValidation,
    passwordRegistrationValidation
} from '../middleware/input-auth-validation'
import { inputValidation } from '../middleware/input-validation'
import { RequestWithBody } from '../models/types'
import {
    LoginTypeInput,
    RegistrationConfirmationType,
    RegistrationResendType
} from '../models/auth-models'
import { HTTP_STATUSES } from '../constats/status'
import { authService } from '../domain/auth-service'
import { jwtService } from '../application/jwt-service'
import { bearerAuth } from '../authorization/bearer-auth'
import { UsersTypeInput } from '../models/users-models'
import { v4 as uuidv4 } from 'uuid'
import { sessionsService } from '../domain/sessions-service'
import { rateLimiterMiddleware } from '../middleware/rate-limiter'
import { settings } from '../settings/settings'
import { checkAuthorizationAndGetPayload } from './helper'

export const authRouter = Router({})

const SECURE_COOKIE_MODE = settings.SECURE_COOKIE_MODE == 'true'

authRouter.post(
    '/login',
    rateLimiterMiddleware,
    loginOrEmailValidation,
    passwordFromAuthValidation,
    inputValidation,
    async (req: RequestWithBody<LoginTypeInput>, res: Response) => {
        const user = await authService.checkCredentials(req.body.loginOrEmail, req.body.password)

        if (!user) {
            res.clearCookie('refreshToken')
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            return
        }
        const deviceName = req.headers['user-agent']
        const ipAddress = req.ip
        const accessToken = jwtService.createJWT(user.id)
        const deviceId = uuidv4()
        const refreshToken = jwtService.createRefreshJWT(user.id, deviceId)

        await sessionsService.saveSession(refreshToken, ipAddress, deviceName!)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: SECURE_COOKIE_MODE
        })
        res.status(HTTP_STATUSES.OK_200).json({ accessToken: accessToken })
    }
)

authRouter.post('/refresh-token', async (req: Request, res: Response) => {
    const gotRefreshToken = req.cookies.refreshToken

    const payload = await checkAuthorizationAndGetPayload(gotRefreshToken)
    if (!payload) {
        res.clearCookie('refreshToken')
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    const accessToken = jwtService.createJWT(payload.userId)
    const refreshToken = jwtService.createRefreshJWT(payload.userId, payload.deviceId)
    await sessionsService.updateSession(refreshToken)

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: SECURE_COOKIE_MODE
    })
    res.status(HTTP_STATUSES.OK_200).json({ accessToken: accessToken })
})

authRouter.post('/logout', async (req: Request, res: Response) => {
    const gotRefreshToken = req.cookies.refreshToken

    const payload = await checkAuthorizationAndGetPayload(gotRefreshToken)
    if (!payload) {
        res.clearCookie('refreshToken')
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    await sessionsService.deleteSession(payload.iat)
    res.clearCookie('refreshToken')
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

authRouter.get('/me', bearerAuth, async (req: Request, res: Response) => {
    res.status(HTTP_STATUSES.OK_200).json(req.user)
})

authRouter.post(
    '/registration',
    rateLimiterMiddleware,
    loginRegistrationValidation,
    passwordRegistrationValidation,
    emailRegistrationValidation,
    inputValidation,
    async (req: RequestWithBody<UsersTypeInput>, res: Response) => {
        await authService.registerUser(req.body.login, req.body.password, req.body.email)
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
)

authRouter.post(
    '/registration-confirmation',
    rateLimiterMiddleware,
    codeValidation,
    inputValidation,
    async (req: RequestWithBody<RegistrationConfirmationType>, res: Response) => {
        await authService.confirmEmail(req.body.code)
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
)

authRouter.post(
    '/registration-email-resending',
    rateLimiterMiddleware,
    emailResendValidation,
    inputValidation,
    async (req: RequestWithBody<RegistrationResendType>, res: Response) => {
        await authService.resendEmail(req.body.email)
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
)
