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