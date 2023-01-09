import { Router, Response, Request } from 'express'
import {
  codeValidation,
  emailRegistrationValidation,
  emailResendValidation,
  loginOrEmailValidation,
  loginRegistrationValidation,
  passwordFromAuthValidation,
  passwordRegistrationValidation,
} from '../middleware/input-auth-validation'
import { inputValidation } from '../middleware/input-validation'
import { RequestWithBody } from '../models/types'
import {
  LoginTypeInput,
  RegistrationConfirmationType,
  RegistrationResendType,
} from '../models/auth-models'
import { HTTP_STATUSES } from '../constats/status'
import { authService } from '../domain/auth-service'
import { jwtService } from '../application/jwt-service'
import { bearerAuth } from '../authorization/bearer-auth'
import { UsersTypeInput } from '../models/users-models'
import { tokenRepository } from '../repositories/token-repository'

export const authRouter = Router({})

authRouter.post(
  '/login',
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

    await tokenRepository.deleteRefreshTokenByUserId(user.id)
    const accessToken = await jwtService.createJWT(user.id)
    const refreshToken = await jwtService.createAndSaveRefreshJWT(user.id)
    res.cookie('refreshToken', refreshToken.refreshToken, { httpOnly: true, secure: true, maxAge: 1000*20 })
    res.status(HTTP_STATUSES.OK_200).json(accessToken)
  }
)

authRouter.post('/refresh-token', async (req: Request, res: Response) => {
  const gotRefreshToken = req.cookies.refreshToken
  const userId = await jwtService.getUserIdByTokenRefresh(gotRefreshToken)
  const foundRefreshToken = await tokenRepository.findUserIdByRefreshToken(gotRefreshToken)

    console.log(userId)
    console.log(foundRefreshToken)

  if (!userId || !foundRefreshToken) {
    res.clearCookie('refreshToken')
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    return
  }

  await tokenRepository.deleteRefreshTokenByUserId(userId.toString())
  const accessToken = await jwtService.createJWT(userId.toString())
  const refreshToken = await jwtService.createAndSaveRefreshJWT(userId.toString())
  res.cookie('refreshToken', refreshToken.refreshToken, { httpOnly: true, secure: true, maxAge: 1000*20 })
  res.status(HTTP_STATUSES.OK_200).json(accessToken)
})

authRouter.post('/logout', async (req: Request, res: Response) => {
  const gotRefreshToken = req.cookies.refreshToken
  const userId = await jwtService.getUserIdByTokenRefresh(gotRefreshToken)
  const foundRefreshToken = await tokenRepository.findUserIdByRefreshToken(gotRefreshToken)

  if (!userId || !foundRefreshToken) {
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    return
  }
  await tokenRepository.deleteRefreshTokenByUserId(userId.toString())
  res.clearCookie('refreshToken')
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

authRouter.get('/me', bearerAuth, async (req: Request, res: Response) => {
  res.status(HTTP_STATUSES.OK_200).json(req.user)
})

authRouter.post(
  '/registration',
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
  codeValidation,
  inputValidation,
  async (req: RequestWithBody<RegistrationConfirmationType>, res: Response) => {
    await authService.confirmEmail(req.body.code)
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }
)

authRouter.post(
  '/registration-email-resending',
  emailResendValidation,
  inputValidation,
  async (req: RequestWithBody<RegistrationResendType>, res: Response) => {
    await authService.resendEmail(req.body.email)
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }
)
