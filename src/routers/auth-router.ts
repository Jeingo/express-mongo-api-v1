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

import { bearerAuth } from '../middleware/authorization/bearer-auth'
import { rateLimiterMiddleware } from '../middleware/rate-limiter'
import { authController } from '../composition-root'

export const authRouter = Router({})

authRouter.post(
    '/login',
    rateLimiterMiddleware,
    loginOrEmailValidation,
    passwordFromAuthValidation,
    inputValidation,
    authController.login.bind(authController)
)

authRouter.post('/refresh-token', authController.refreshToken.bind(authController))

authRouter.post('/logout', authController.logout.bind(authController))

authRouter.get('/me', bearerAuth, authController.me.bind(authController))

authRouter.post(
    '/registration',
    rateLimiterMiddleware,
    loginRegistrationValidation,
    passwordRegistrationValidation,
    emailRegistrationValidation,
    inputValidation,
    authController.registration.bind(authController)
)

authRouter.post(
    '/registration-confirmation',
    rateLimiterMiddleware,
    codeValidation,
    inputValidation,
    authController.registrationConfirmation.bind(authController)
)

authRouter.post(
    '/registration-email-resending',
    rateLimiterMiddleware,
    emailResendValidation,
    inputValidation,
    authController.registrationEmailResending.bind(authController)
)

authRouter.post(
    '/password-recovery',
    rateLimiterMiddleware,
    emailPasswordRecoveryValidation,
    inputValidation,
    authController.passwordRecovery.bind(authController)
)

authRouter.post(
    '/new-password',
    rateLimiterMiddleware,
    codePasswordRecoveryValidation,
    passwordRecoveryValidation,
    inputValidation,
    authController.newPassword.bind(authController)
)
