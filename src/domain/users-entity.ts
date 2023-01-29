import mongoose from 'mongoose'
import { UsersModel } from '../repositories/db/db'
import { v4 } from 'uuid'
import add from 'date-fns/add'
import bcrypt from 'bcrypt'
import { UsersModelType } from './types/users-entity-types'

export const UsersSchema = new mongoose.Schema<UsersModelType>({
    login: { type: String, required: true, maxlength: 10, minlength: 3 },
    hash: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: String, required: true },
    passwordRecoveryConfirmation: {
        passwordRecoveryCode: { type: String, required: true },
        expirationDate: { type: Date, required: true },
        isConfirmed: { type: Boolean, required: true }
    },
    emailConfirmation: {
        confirmationCode: { type: String, required: true },
        expirationDate: { type: Date, required: true },
        isConfirmed: { type: Boolean, required: true }
    }
})

UsersSchema.statics.make = async function (login: string, password: string, email: string, isConfirmed: boolean) {
    const passwordSalt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, passwordSalt)
    return new UsersModel({
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
            isConfirmed: isConfirmed
        }
    })
}

UsersSchema.methods.updateEmailConfirmationStatus = function (code: string) {
    this.emailConfirmation.confirmationCode = code
    this.emailConfirmation.isConfirmed = true
    return this
}

UsersSchema.methods.updateConfirmationCode = function () {
    this.emailConfirmation.confirmationCode = v4()
    return this
}

UsersSchema.methods.updatePasswordRecoveryConfirmationCode = function () {
    this.passwordRecoveryConfirmation.passwordRecoveryCode = v4()
    this.passwordRecoveryConfirmation.isConfirmed = false
    this.passwordRecoveryConfirmation.expirationDate = add(new Date(), { hours: 1 })
    return this
}

UsersSchema.methods.updatePassword = async function (newPassword: string) {
    const passwordSalt = await bcrypt.genSalt(10)
    this.hash = await bcrypt.hash(newPassword, passwordSalt)
    this.passwordRecoveryConfirmation.isConfirmed = true
    return this
}
