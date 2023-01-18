import { settings } from '../settings/settings'
import nodemailer from 'nodemailer'
import { EmailForm } from '../models/email-models'

class EmailAdapter {
    async sendEmail(form: EmailForm): Promise<void> {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: settings.EMAIL_LOGIN,
                pass: settings.EMAIL_PASSWORD
            }
        })

        await transporter.sendMail({
            from: form.from,
            to: form.to,
            subject: form.subject,
            html: form.html
        })
    }
}

export const emailAdapter = new EmailAdapter()
