import {
    FullUsersTypeOutput,
    UserId,
    UsersTypeOutput,
    UsersTypeToDB
} from '../models/users-models'
import { UsersModel } from './db/db'
import { ObjectId } from 'mongodb'
import add from 'date-fns/add'
import { LoginTypeForAuth } from '../models/auth-models'
import { injectable } from 'inversify'

@injectable()
export class UsersRepository {
    async getUser(uniqueField: string): Promise<FullUsersTypeOutput | null> {
        const result = await UsersModel.findOne().or([
            { email: uniqueField },
            { login: uniqueField },
            { 'emailConfirmation.confirmationCode': uniqueField },
            { 'passwordRecoveryConfirmation.passwordRecoveryCode': uniqueField },

        ])
        if (!result) return null
        return this._getOutputUser(result)
    }
    async getAuthUserById(id: UserId): Promise<LoginTypeForAuth | null> {
        const result = await UsersModel.findById(new ObjectId(id))
        if (!result) return null
        return this._getOutputAuthUser(result)
    }
    async createUser(createdUser: UsersTypeToDB): Promise<UsersTypeOutput> {
        const result = await UsersModel.create(createdUser)
        return this._getShortOutputUser(result)
    }
    async deleteUser(id: string): Promise<boolean> {
        const result = await UsersModel.findByIdAndDelete(new ObjectId(id))
        return !!result
    }
    async updateConfirmationStatus(code: string): Promise<boolean> {
        const result = await UsersModel.findOneAndUpdate(
            { 'emailConfirmation.confirmationCode': code },
            { 'emailConfirmation.isConfirmed': true }
        )
        return !!result
    }
    async updateConfirmationCode(user: UsersTypeToDB, code: string): Promise<boolean> {
        const result = await UsersModel.findOneAndUpdate(
            { login: user.login },
            { 'emailConfirmation.confirmationCode': code }
        )
        return !!result
    }
    async updatePasswordRecoveryConfirmationCode(user: UsersTypeToDB, code: string): Promise<boolean> {
        const result = await UsersModel.findOneAndUpdate(
            { login: user.login },
            {
                'passwordRecoveryConfirmation.passwordRecoveryCode': code,
                'passwordRecoveryConfirmation.isConfirmed': false,
                'passwordRecoveryConfirmation.expirationDate': add(new Date(), { hours: 1 })
            }
        )
        return !!result
    }
    async updatePassword(recoveryCode: string, newHash: string): Promise<boolean> {
        const result = await UsersModel.findOneAndUpdate(
            { 'passwordRecoveryConfirmation.passwordRecoveryCode': recoveryCode },
            { hash: newHash, 'passwordRecoveryConfirmation.isConfirmed': true }
        )
        return !!result
    }
    private _getOutputAuthUser(user: any): LoginTypeForAuth {
        return {
            email: user.email,
            login: user.login,
            userId: user._id.toString()
        }
    }

    private _getOutputUser(user: any): FullUsersTypeOutput {
        return {
            id: user._id.toString(),
            login: user.login,
            hash: user.hash,
            email: user.email,
            createdAt: user.createdAt,
            passwordRecoveryConfirmation: {
                passwordRecoveryCode: user.passwordRecoveryConfirmation.passwordRecoveryCode,
                expirationDate: user.passwordRecoveryConfirmation.expirationDate,
                isConfirmed: user.passwordRecoveryConfirmation.isConfirmed
            },
            emailConfirmation: {
                confirmationCode: user.emailConfirmation.confirmationCode,
                expirationDate: user.emailConfirmation.expirationDate,
                isConfirmed: user.emailConfirmation.isConfirmed
            }
        }
    }

    private _getShortOutputUser(user: any): UsersTypeOutput {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }
    }
}
