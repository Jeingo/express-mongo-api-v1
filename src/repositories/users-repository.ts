import {UserId, UsersTypeToDB} from '../models/users-models'
import { UsersModel } from './db/db'
import { ObjectId } from 'mongodb'
import add from 'date-fns/add'
import { injectable } from 'inversify'

@injectable()
export class UsersRepository {
    async createUser(createdUser: UsersTypeToDB): Promise<UserId> {
        const result = await UsersModel.create(createdUser)
        return result._id.toString()
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
}
