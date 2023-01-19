import { UsersTypeToDB } from '../models/users-models'
import {EmailAdapter} from '../adapters/email-adapter'

export class EmailManager {
    constructor(protected emailAdapter: EmailAdapter) {}

    async sendRegistrationEmailConfirmation(user: UsersTypeToDB): Promise<void> {
        const emailForm = {
            from: '"Backend-09" <backend.jeingo@gmail.com>',
            to: user.email,
            subject: 'Registration confirmation',
            html: this._registrationConfirmationMessage(user.emailConfirmation.confirmationCode)
        }
        await this.emailAdapter.sendEmail(emailForm)
    }
    async sendPasswordRecoveryEmailConfirmation(user: UsersTypeToDB): Promise<void> {
        const emailForm = {
            from: '"Backend-09" <backend.jeingo@gmail.com>',
            to: user.email,
            subject: 'Password recovery confirmation',
            html: this._passwordRecoveryConfirmationMessage(user.passwordRecoveryConfirmation.passwordRecoveryCode)
        }
        await this.emailAdapter.sendEmail(emailForm)
    }
    private _registrationConfirmationMessage(code: string): string {
        return `
        <h1>Thank for your registration</h1>
            <p>To finish registration please follow the link below:
                 <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
            </p>
           `
    }
    private _passwordRecoveryConfirmationMessage(code: string): string {
        return `
        <h1>Password recovery</h1>
            <p>To finish password recovery please follow the link below:
                <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a>
            </p>
           `
    }
}
