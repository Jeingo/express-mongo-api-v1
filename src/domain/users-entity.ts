import mongoose from 'mongoose'
import { UsersTypeToDB } from '../models/users-models'

export const UsersSchema = new mongoose.Schema<UsersTypeToDB>({
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
