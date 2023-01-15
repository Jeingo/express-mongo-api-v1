import { UsersTypeToDB } from '../models/users-models'
import { emailAdapter } from '../adapters/email-adapter'

const registrationConfirmationMessage = (code: string): string => {
    return `
        <h1>Thank for your registration</h1>
            <p>To finish registration please follow the link below:
                 <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
            </p>
           `
}

const passwordRecoveryConfirmationMessage = (code: string): string => {
    return `
        <h1>Password recovery</h1>
            <p>To finish password recovery please follow the link below:
                <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a>
            </p>
           `
}

export const emailManager = {
    async sendRegistrationEmailConfirmation(user: UsersTypeToDB): Promise<void> {
        const emailForm = {
            from: '"Backend-09" <backend.jeingo@gmail.com>',
            to: user.email,
            subject: 'Registration confirmation',
            html: registrationConfirmationMessage(user.emailConfirmation.confirmationCode)
        }
        await emailAdapter.sendEmail(emailForm)
    },
    async sendPasswordRecoveryEmailConfirmation(user: UsersTypeToDB): Promise<void> {
        const emailForm = {
            from: '"Backend-09" <backend.jeingo@gmail.com>',
            to: user.email,
            subject: 'Password recovery confirmation',
            html: passwordRecoveryConfirmationMessage(user.passwordRecoveryConfirmation.passwordRecoveryCode)
        }
        await emailAdapter.sendEmail(emailForm)
    }
}
