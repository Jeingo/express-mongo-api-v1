import { inject, injectable } from 'inversify'
import { EmailManager } from '../infrastructure/email-manager'
import { UsersRepository } from '../repositories/users-repository'
import {FullUsersTypeOutput} from '../models/users-models'
import bcrypt from 'bcrypt'
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

    async confirmEmail(code: string): Promise<boolean> {
        const user = await this.usersRepository.getUserByUniqueField(code)
        if(!user) return false
        user.updateEmailConfirmationStatus(code)
        await this.usersRepository.saveUser(user)
        return true
    }

    async resendEmail(email: string): Promise<boolean> {
        const user = await this.usersRepository.getUserByUniqueField(email)
        if(!user) return false
        user.updateConfirmationCode()
        await this.usersRepository.saveUser(user)
        await this.emailManager.sendRegistrationEmailConfirmation(user)
        return true
    }


    async recoveryPassword(email: string): Promise<boolean> {
        const user = await this.usersRepository.getUserByUniqueField(email)
        if(!user) return false
        user.updatePasswordRecoveryConfirmationCode()
        await this.usersRepository.saveUser(user)
        await this.emailManager.sendPasswordRecoveryEmailConfirmation(user)
        return true
    }

    async setNewPassword(recoveryCode: string, newPassword: string): Promise<boolean> {
        const user = await this.usersRepository.getUserByUniqueField(recoveryCode)
        if(!user) return false
        user.updatePassword(newPassword)
        await this.usersRepository.saveUser(user)
        return true
    }
}
