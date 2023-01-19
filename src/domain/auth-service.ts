import bcrypt from 'bcrypt'
import { UsersRepository } from '../repositories/users-repository'
import { v4 } from 'uuid'
import add from 'date-fns/add'
import {EmailManager} from '../managers/email-manager'
import { UsersHashType, UsersTypeOutput, UsersTypeToDB } from '../models/users-models'

export class AuthService {
    emailManager: EmailManager
    usersRepository: UsersRepository
    constructor() {
        this.usersRepository = new UsersRepository()
        this.emailManager = new EmailManager()
    }
    async checkCredentials(loginOrEmail: string, password: string): Promise<UsersHashType | false> {
        const user = await this.usersRepository.findUserHashByLoginOrEmail(loginOrEmail)
        if (!user) return false
        const res = await bcrypt.compare(password, user.hash)
        if (!res) {
            return false
        }
        return user
    }
    async registerUser(login: string, password: string, email: string): Promise<UsersTypeOutput> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, passwordSalt)
        const createdUser = new UsersTypeToDB(
            login,
            passwordHash,
            email,
            new Date().toISOString(),
            {
                passwordRecoveryCode: v4(),
                expirationDate: add(new Date(), {
                    hours: 1
                }),
                isConfirmed: true
            },
            {
                confirmationCode: v4(),
                expirationDate: add(new Date(), {
                    hours: 1
                }),
                isConfirmed: false
            }
        )
        const result = await this.usersRepository.createUser(createdUser)
        await this.emailManager.sendRegistrationEmailConfirmation(createdUser)
        return result
    }
    async confirmEmail(code: string): Promise<void> {
        await this.usersRepository.updateConfirmationStatus(code)
    }
    async resendEmail(email: string): Promise<null | void> {
        const user = await this.usersRepository.findUserByEmail(email)
        if (!user) {
            return null
        }
        const newConfirmationCode = v4()
        await this.usersRepository.updateConfirmationCode(user, newConfirmationCode)
        user.emailConfirmation.confirmationCode = newConfirmationCode
        await this.emailManager.sendRegistrationEmailConfirmation(user)
    }
    async recoveryPassword(email: string): Promise<null | void> {
        const user = await this.usersRepository.findUserByEmail(email)
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
