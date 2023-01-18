import bcrypt from 'bcrypt'
import { usersRepository } from '../repositories/users-repository'
import { v4 } from 'uuid'
import add from 'date-fns/add'
import { emailManager } from '../managers/email-manager'
import { UsersHashType, UsersTypeOutput } from '../models/users-models'

class AuthService {
    async checkCredentials(loginOrEmail: string, password: string): Promise<UsersHashType | false> {
        const user = await usersRepository.findUserHashByLoginOrEmail(loginOrEmail)
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
        const createdUser = {
            login: login,
            hash: passwordHash,
            email: email,
            createdAt: new Date().toISOString(),
            passwordRecoveryConfirmation: {
                passwordRecoveryCode: v4(),
                expirationDate: add(new Date(), {
                    hours: 1
                }),
                isConfirmed: true
            },
            emailConfirmation: {
                confirmationCode: v4(),
                expirationDate: add(new Date(), {
                    hours: 1
                }),
                isConfirmed: false
            }
        }
        const result = await usersRepository.createUser(createdUser)
        await emailManager.sendRegistrationEmailConfirmation(createdUser)
        return result
    }
    async confirmEmail(code: string): Promise<void> {
        await usersRepository.updateConfirmationStatus(code)
    }
    async resendEmail(email: string): Promise<null | void> {
        const user = await usersRepository.findUserByEmail(email)
        if (!user) {
            return null
        }
        const newConfirmationCode = v4()
        await usersRepository.updateConfirmationCode(user, newConfirmationCode)
        user.emailConfirmation.confirmationCode = newConfirmationCode
        await emailManager.sendRegistrationEmailConfirmation(user)
    }
    async recoveryPassword(email: string): Promise<null | void> {
        const user = await usersRepository.findUserByEmail(email)
        if (!user) {
            return null
        }
        const newPasswordRecoveryConfirmationCode = v4()
        await usersRepository.updatePasswordRecoveryConfirmationCode(
            user,
            newPasswordRecoveryConfirmationCode
        )
        user.passwordRecoveryConfirmation.passwordRecoveryCode = newPasswordRecoveryConfirmationCode
        await emailManager.sendPasswordRecoveryEmailConfirmation(user)
    }
    async setNewPassword(recoveryCode: string, newPassword: string): Promise<void> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(newPassword, passwordSalt)
        await usersRepository.updatePassword(recoveryCode, passwordHash)
    }
}

export const authService = new AuthService()
