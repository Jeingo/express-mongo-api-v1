import {
    UsersConfirmationCodePasswordRecoveryType,
    UsersConfirmationCodeType,
    UsersHashType,
    UsersTypeOutput,
    UsersTypeToDB
} from '../models/users-models'
import { UsersModel } from './db'
import { ObjectId } from 'mongodb'
import add from 'date-fns/add'
import {LoginTypeForAuth} from "../models/auth-models";

const getOutputUserForAuth = (user: any): LoginTypeForAuth => {
    return {
        email: user.email,
        login: user.login,
        userId: user._id.toString()
    }
}

const getOutputUserHash = (user: any): UsersHashType => {
    return {
        id: user._id.toString(),
        hash: user.hash
    }
}

const getOutputUserForConfirmationCode = (user: any): UsersConfirmationCodeType => {
    return {
        id: user._id.toString(),
        emailConfirmation: {
            confirmationCode: user.emailConfirmation.confirmationCode,
            expirationDate: user.emailConfirmation.expirationDate,
            isConfirmed: user.emailConfirmation.isConfirmed
        }
    }
}

const getOutputUserForPasswordRecoveryConfirmationCode = (
    user: any
): UsersConfirmationCodePasswordRecoveryType => {
    return {
        id: user._id.toString(),
        passwordRecoveryConfirmation: {
            passwordRecoveryCode: user.passwordRecoveryConfirmation.passwordRecoveryCode,
            expirationDate: user.passwordRecoveryConfirmation.expirationDate,
            isConfirmed: user.passwordRecoveryConfirmation.isConfirmed
        }
    }
}

const getOutputUser = (user: any): UsersTypeToDB => {
    return {
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

const getShortOutputUser = (user: any): UsersTypeOutput => {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
}

export const usersRepository = {
    async findUserById(id: ObjectId): Promise<LoginTypeForAuth | null> {
        const result = await UsersModel.findById(id)
        if(!result) return null
        return getOutputUserForAuth(result)
    },
    async createUser(createdUser: UsersTypeToDB): Promise<UsersTypeOutput> {
        const result = await UsersModel.create(createdUser)
        return getShortOutputUser(result)
    },
    async deleteUser(id: string): Promise<boolean> {
        const result = await UsersModel.findByIdAndDelete(new ObjectId(id))
        return !!result
    },
    async findUserHashByLoginOrEmail(loginOrEmail: string): Promise<UsersHashType | null> {
        const result = await UsersModel.findOne().or([
            { email: loginOrEmail },
            { login: loginOrEmail }
        ])
        if (!result) return null
        return getOutputUserHash(result)
    },
    async findUserByConfirmationCode(code: string): Promise<UsersConfirmationCodeType | null> {
        const result = await UsersModel.findOne({
            'emailConfirmation.confirmationCode': code
        })
        if (!result) return null
        return getOutputUserForConfirmationCode(result)
    },
    async findUserByConfirmationCodeRecoveryPassword(
        code: string
    ): Promise<UsersConfirmationCodePasswordRecoveryType | null> {
        const result = await UsersModel.findOne({
            'passwordRecoveryConfirmation.passwordRecoveryCode': code
        })
        if (!result) return null
        return getOutputUserForPasswordRecoveryConfirmationCode(result)
    },
    async updateConfirmationStatus(code: string): Promise<boolean> {
        const result = await UsersModel.findOneAndUpdate(
            { 'emailConfirmation.confirmationCode': code },
            { 'emailConfirmation.isConfirmed': true }
        )
        return !!result
    },
    async findUserByEmail(email: string): Promise<UsersTypeToDB | null> {
        const result = await UsersModel.findOne({ email: email })
        if (!result) return null
        return getOutputUser(result)
    },
    async findUserByLogin(login: string): Promise<UsersTypeToDB | null> {
        const result = await UsersModel.findOne({ login: login })
        if (!result) return null
        return getOutputUser(result)
    },
    async updateConfirmationCode(user: UsersTypeToDB, code: string): Promise<boolean> {
        const result = await UsersModel.findOneAndUpdate(
            { login: user.login },
            { 'emailConfirmation.confirmationCode': code }
        )
        return !!result
    },
    async updatePasswordRecoveryConfirmationCode(
        user: UsersTypeToDB,
        code: string
    ): Promise<boolean> {
        const result = await UsersModel.findOneAndUpdate(
            { login: user.login },
            {
                'passwordRecoveryConfirmation.passwordRecoveryCode': code,
                'passwordRecoveryConfirmation.isConfirmed': false,
                'passwordRecoveryConfirmation.expirationDate': add(new Date(), { hours: 1 })
            }
        )
        return !!result
    },
    async updatePassword(recoveryCode: string, newHash: string): Promise<boolean> {
        const result = await UsersModel.findOneAndUpdate(
            { 'passwordRecoveryConfirmation.passwordRecoveryCode': recoveryCode },
            { hash: newHash, 'passwordRecoveryConfirmation.isConfirmed': true }
        )
        return !!result
    }
}
