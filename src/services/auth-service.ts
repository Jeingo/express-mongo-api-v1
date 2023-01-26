import { inject, injectable } from 'inversify'
import { EmailManager } from '../infrastructure/email-manager'
import { UsersRepository } from '../repositories/users-repository'
import {FullUsersTypeOutput} from '../models/users-models'
import bcrypt from 'bcrypt'
import { v4 } from 'uuid'
import { UsersQueryRepository } from '../query-reositories/users-query-repository'

@injectable()
export class AuthService {
    constructor(
        @inject(EmailManager) protected emailManager: EmailManager,
        @inject(UsersRepository) protected usersRepository: UsersRepository,
        @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository
    ) {}

    async checkCredentials(loginOrEmail: string, password: string): Promise<FullUsersTypeOutput | false> {
        const user = await this.usersQueryRepository.getUser(loginOrEmail)
        if (!user) return false
        const res = await bcrypt.compare(password, user.hash)
        if (!res) {
            return false
        }
        return user
    }

    async confirmEmail(code: string): Promise<void> {
        await this.usersRepository.updateConfirmationStatus(code)
    }

    async resendEmail(email: string): Promise<null | void> {
        const user = await this.usersQueryRepository.getUser(email)
        if (!user) {
            return null
        }
        const newConfirmationCode = v4()
        await this.usersRepository.updateConfirmationCode(user, newConfirmationCode)
        user.emailConfirmation.confirmationCode = newConfirmationCode
        await this.emailManager.sendRegistrationEmailConfirmation(user)
    }

    async recoveryPassword(email: string): Promise<null | void> {
        const user = await this.usersQueryRepository.getUser(email)
        if (!user) {
            return null
        }
        const newPasswordRecoveryConfirmationCode = v4()
        await this.usersRepository.updatePasswordRecoveryConfirmationCode(user, newPasswordRecoveryConfirmationCode)
        user.passwordRecoveryConfirmation.passwordRecoveryCode = newPasswordRecoveryConfirmationCode
        await this.emailManager.sendPasswordRecoveryEmailConfirmation(user)
    }

    async setNewPassword(recoveryCode: string, newPassword: string): Promise<void> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(newPassword, passwordSalt)
        await this.usersRepository.updatePassword(recoveryCode, passwordHash)
    }
}
