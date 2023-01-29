import { Model, Document, Types } from 'mongoose'

type Users = {
    login: string
    hash: string
    email: string
    createdAt: string
    passwordRecoveryConfirmation: {
        passwordRecoveryCode: string
        expirationDate: Date
        isConfirmed: boolean
    }
    emailConfirmation: {
        confirmationCode: string
        expirationDate: Date
        isConfirmed: boolean
    }
}

export type UsersMethods = {
    updateEmailConfirmationStatus: (code: string) => UsersModelFullType
    updateConfirmationCode: () => UsersModelFullType
    updatePasswordRecoveryConfirmationCode: () => UsersModelFullType
    updatePassword: (newPassword: string) => UsersModelFullType
}

type UsersStatics = {
    make: (login: string, password: string, email: string, isConfirmed: boolean) => UsersModelFullType
}

export type UsersModelType = Users & Document & UsersMethods

export type UsersModelFullType = Model<UsersModelType> & UsersStatics & { _id: Types.ObjectId }
