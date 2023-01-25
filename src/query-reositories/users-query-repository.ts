import { QueryUsers } from '../models/query-models'
import { PaginatedType } from '../models/main-models'
import { FullUsersTypeOutput, UserId, UsersTypeOutput } from '../models/users-models'
import { getPaginatedType, makeDirectionToNumber } from './helper'
import { UsersModel } from '../repositories/db/db'
import { injectable } from 'inversify'
import { LoginTypeForAuth } from '../models/auth-models'
import { ObjectId } from 'mongodb'

@injectable()
export class UsersQueryRepository {
    async getAllUsers(query: QueryUsers): Promise<PaginatedType<UsersTypeOutput>> {
        const {
            searchLoginTerm = null,
            searchEmailTerm = null,
            sortBy = 'createdAt',
            sortDirection = 'desc',
            pageNumber = 1,
            pageSize = 10
        } = query
        const sortDirectionNumber = makeDirectionToNumber(sortDirection)
        const skipNumber = (+pageNumber - 1) * +pageSize

        const filter = (a: any, b: any) => ({ $or: [a, b] })
        const loginFilter = searchLoginTerm ? { login: { $regex: new RegExp(searchLoginTerm, 'gi') } } : {}
        const emailFilter = searchEmailTerm ? { email: { $regex: new RegExp(searchEmailTerm, 'gi') } } : {}
        const filterMain = filter(loginFilter, emailFilter)

        const countAllDocuments = await UsersModel.countDocuments(filterMain)
        const res = await UsersModel.find(filterMain)
            .sort({ [sortBy]: sortDirectionNumber })
            .skip(skipNumber)
            .limit(+pageSize)
        return getPaginatedType(res.map(this._getShortOutputUser), +pageSize, +pageNumber, countAllDocuments)
    }
    async getUser(uniqueField: string): Promise<FullUsersTypeOutput | null> {
        const result = await UsersModel.findOne().or([
            { email: uniqueField },
            { login: uniqueField },
            { 'emailConfirmation.confirmationCode': uniqueField },
            { 'passwordRecoveryConfirmation.passwordRecoveryCode': uniqueField }
        ])
        if (!result) return null
        return this._getOutputUser(result)
    }
    async getAuthUserById(id: UserId): Promise<LoginTypeForAuth | null> {
        const result = await UsersModel.findById(new ObjectId(id))
        if (!result) return null
        return this._getOutputAuthUser(result)
    }
    private _getShortOutputUser(user: any): UsersTypeOutput {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }
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
}
