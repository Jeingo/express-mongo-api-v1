export type UsersTypeOutput = {
    id: string
    login: string
    email: string
    createdAt: string
}

export type UsersTypeInput = {
    login: string
    password: string
    email: string
}

export class UsersTypeToDB {
    constructor(
        public login: string,
        public hash: string,
        public email: string,
        public createdAt: string,
        public passwordRecoveryConfirmation: {
            passwordRecoveryCode: string
            expirationDate: Date
            isConfirmed: boolean
        },
        public emailConfirmation: {
            confirmationCode: string
            expirationDate: Date
            isConfirmed: boolean
        }
    ) {
        this.passwordRecoveryConfirmation.passwordRecoveryCode =
            passwordRecoveryConfirmation.passwordRecoveryCode
        this.passwordRecoveryConfirmation.expirationDate =
            passwordRecoveryConfirmation.expirationDate
        this.passwordRecoveryConfirmation.isConfirmed = passwordRecoveryConfirmation.isConfirmed
        this.emailConfirmation.confirmationCode = emailConfirmation.confirmationCode
        this.emailConfirmation.expirationDate = emailConfirmation.expirationDate
        this.emailConfirmation.isConfirmed = emailConfirmation.isConfirmed
    }
}

export type UsersHashType = {
    id: string
    hash: string
}

export type UsersConfirmationCodeType = {
    id: string
    emailConfirmation: {
        confirmationCode: string
        expirationDate: Date
        isConfirmed: boolean
    }
}

export type UsersConfirmationCodePasswordRecoveryType = {
    id: string
    passwordRecoveryConfirmation: {
        passwordRecoveryCode: string
        expirationDate: Date
        isConfirmed: boolean
    }
}

export type UsersIdParams = {
    id: string
}
