import { Router } from 'express'
import {
    codePasswordRecoveryValidation,
    codeValidation,
    emailPasswordRecoveryValidation,
    emailRegistrationValidation,
    emailResendValidation,
    loginOrEmailValidation,
    loginRegistrationValidation,
    passwordFromAuthValidation,
    passwordRecoveryValidation,
    passwordRegistrationValidation
} from '../middleware/input-auth-validation'
import { inputValidation } from '../middleware/input-validation'

import { bearerAuth } from '../authorization/bearer-auth'
import { rateLimiterMiddleware } from '../middleware/rate-limiter'
import { authController } from '../controllers/auth-controller'

export const authRouter = Router({})

authRouter.post(
    '/login',
    rateLimiterMiddleware,
    loginOrEmailValidation,
    passwordFromAuthValidation,
    inputValidation,
    authController.login
)

authRouter.post('/refresh-token', authController.refreshToken)

authRouter.post('/logout', authController.logout)

authRouter.get('/me', bearerAuth, authController.me)

authRouter.post(
    '/registration',
    rateLimiterMiddleware,
    loginRegistrationValidation,
    passwordRegistrationValidation,
    emailRegistrationValidation,
    inputValidation,
    authController.registration
)

authRouter.post(
    '/registration-confirmation',
    rateLimiterMiddleware,
    codeValidation,
    inputValidation,
    authController.registrationConfirmation
)

authRouter.post(
    '/registration-email-resending',
    rateLimiterMiddleware,
    emailResendValidation,
    inputValidation,
    authController.registrationEmailResending
)

authRouter.post(
    '/password-recovery',
    rateLimiterMiddleware,
    emailPasswordRecoveryValidation,
    inputValidation,
    authController.passwordRecovery
)

authRouter.post(
    '/new-password',
    rateLimiterMiddleware,
    codePasswordRecoveryValidation,
    passwordRecoveryValidation,
    inputValidation,
    authController.newPassword
)
