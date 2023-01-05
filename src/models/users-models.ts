
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

export type UsersTypeToDB = {
    login: string
    hash: string
    email: string
    createdAt: string
    emailConfirmation: {
        confirmationCode: string
        expirationDate: Date
        isConfirmed: boolean
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

export type UsersConfirmationType = {
    id: string
    emailConfirmation: {
        isConfirmed: boolean
    }
}

export type UsersIdParams = {
    id: string
}