import { RequestWithBody } from '../models/types'
import {
    LoginTypeInput,
    NewPasswordType,
    PasswordRecoveryType,
    RegistrationConfirmationType,
    RegistrationResendType
} from '../models/auth-models'
import { Request, Response } from 'express'
import { HTTP_STATUSES } from '../constats/status'
import { JwtService } from '../infrastructure/jwt-service'
import { v4 as uuidv4 } from 'uuid'
import { settings } from '../settings/settings'
import { checkAuthorizationAndGetPayload } from './helper'
import { UsersTypeInput } from '../models/users-models'
import { inject, injectable } from 'inversify'
import { AuthService } from '../services/auth-service'
import { SessionsService } from '../services/sessions-service'
import {UsersService} from "../services/users-service";

const SECURE_COOKIE_MODE = settings.SECURE_COOKIE_MODE == 'true'

@injectable()
export class AuthController {
    constructor(
        @inject(JwtService) protected jwtService: JwtService,
        @inject(AuthService) protected authService: AuthService,
        @inject(UsersService) protected usersService: UsersService,
        @inject(SessionsService) protected sessionsService: SessionsService
    ) {}

    async login(req: RequestWithBody<LoginTypeInput>, res: Response) {
        const user = await this.authService.checkCredentials(req.body.loginOrEmail, req.body.password)

        if (!user) {
            res.clearCookie('refreshToken')
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            return
        }
        const deviceName = req.headers['user-agent'] || 'some device'
        const ipAddress = req.ip
        const accessToken = this.jwtService.createJWT(user.id)
        const deviceId = uuidv4()
        const refreshToken = this.jwtService.createRefreshJWT(user.id, deviceId)

        await this.sessionsService.saveSession(refreshToken, ipAddress, deviceName!)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: SECURE_COOKIE_MODE
        })
        res.status(HTTP_STATUSES.OK_200).json({ accessToken: accessToken })
    }
    async refreshToken(req: Request, res: Response) {
        const gotRefreshToken = req.cookies.refreshToken

        const payload = await checkAuthorizationAndGetPayload(gotRefreshToken)
        if (!payload) {
            res.clearCookie('refreshToken')
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            return
        }

        const accessToken = this.jwtService.createJWT(payload.userId)
        const refreshToken = this.jwtService.createRefreshJWT(payload.userId, payload.deviceId)
        await this.sessionsService.updateSession(refreshToken)

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: SECURE_COOKIE_MODE
        })
        res.status(HTTP_STATUSES.OK_200).json({ accessToken: accessToken })
    }
    async logout(req: Request, res: Response) {
        const gotRefreshToken = req.cookies.refreshToken

        const payload = await checkAuthorizationAndGetPayload(gotRefreshToken)
        if (!payload) {
            res.clearCookie('refreshToken')
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            return
        }

        await this.sessionsService.deleteSession(payload.iat)
        res.clearCookie('refreshToken')
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
    async me(req: Request, res: Response) {
        res.status(HTTP_STATUSES.OK_200).json(req.user)
    }
    async registration(req: RequestWithBody<UsersTypeInput>, res: Response) {
        await this.usersService.createUser(req.body.login, req.body.password, req.body.email, false)
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
    async registrationConfirmation(req: RequestWithBody<RegistrationConfirmationType>, res: Response) {
        await this.authService.confirmEmail(req.body.code)
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
    async registrationEmailResending(req: RequestWithBody<RegistrationResendType>, res: Response) {
        await this.authService.resendEmail(req.body.email)
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
    async passwordRecovery(req: RequestWithBody<PasswordRecoveryType>, res: Response) {
        await this.authService.recoveryPassword(req.body.email)
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
    async newPassword(req: RequestWithBody<NewPasswordType>, res: Response) {
        await this.authService.setNewPassword(req.body.recoveryCode, req.body.newPassword)
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
}
