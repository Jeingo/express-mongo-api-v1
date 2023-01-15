import { ObjectId } from 'mongodb'

export type LoginTypeInput = {
    loginOrEmail: string
    password: string
}

export type LoginTypeForAuth = {
    email: string
    login: string
    userId: string
}

export type RegistrationConfirmationType = {
    code: string
}

export type RegistrationResendType = {
    email: string
}

export type PasswordRecoveryType = {
    email: string
}

export type DeviceIdParams = {
    id: string
}

export type RateLimiterType = {
    id: ObjectId
    ip: string
    endpoint: string
    date: number
    count: number
}
