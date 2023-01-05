import bcrypt from "bcrypt";
import {usersRepository} from "../repositories/users-repository";
import {v4} from "uuid";
import add from "date-fns/add";
import {emailManager} from "../managers/email-manager";

export const authService = {
    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await usersRepository.findUserHashByLoginOrEmail(loginOrEmail)
        if(!user) return false
        const res = await bcrypt.compare(password,user.hash)
        if(!res) {
            return false
        }
        return user
    },
    async registerUser(login: string, password: string, email: string) {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, passwordSalt)
        const createdUser = {
            login: login,
            hash: passwordHash,
            email: email,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: v4(),
                expirationDate: add(new Date(), {
                    hours: 1
                }),
                isConfirmed: false
            }
        }
        const result = await usersRepository.createUser(createdUser)
        await emailManager.sendEmailConfirmation(createdUser)
        return result
    },
    async confirmEmail(code: string) {
        await usersRepository.updateConfirmationCode(code)
    }
}