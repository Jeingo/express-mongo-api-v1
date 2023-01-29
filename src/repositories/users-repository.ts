import { UsersTypeToDB} from '../models/users-models'
import { UsersModel} from './db/db'
import { ObjectId } from 'mongodb'
import add from 'date-fns/add'
import { injectable } from 'inversify'

@injectable()
export class UsersRepository {
    async getUserById(id: string) {
        return UsersModel.findById(new ObjectId(id))
    }
    async getUserByUniqueField(uniqueField: string) {
        return UsersModel.findOne().or([
            { email: uniqueField },
            { login: uniqueField },
            { 'emailConfirmation.confirmationCode': uniqueField },
            { 'passwordRecoveryConfirmation.passwordRecoveryCode': uniqueField }
        ])
    }
    async saveUser(user: any) {
        return await user.save()
    }
    async deleteUser(id: string): Promise<boolean> {
        const result = await UsersModel.findByIdAndDelete(new ObjectId(id))
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
