import {usersCollection} from "./db"

export const authRepository = {
    async findByLoginOrEmail(loginOrEmail: string) {
        return await usersCollection.findOne(
            {$or: [{email: loginOrEmail}, {login: loginOrEmail}]}
        )
    }
}