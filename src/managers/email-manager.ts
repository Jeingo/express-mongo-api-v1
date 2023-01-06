import { UsersTypeToDB } from '../models/users-models'
import { emailAdapter } from '../adapters/email-adapter'

const confirmationMessage = (code: string) => {
  return `
        <h1>Thank for your registration</h1>
            <p>To finish registration please follow the link below:
                 <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
            </p>
           `
}

export const emailManager = {
  async sendEmailConfirmation(user: UsersTypeToDB) {
    const emailForm = {
      from: '"Backend-09" <backend.jeingo@gmail.com>',
      to: user.email,
      subject: 'Registration confirmation',
      html: confirmationMessage(user.emailConfirmation.confirmationCode),
    }
    await emailAdapter.sendEmail(emailForm)
  },
}
