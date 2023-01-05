import bcrypt from "bcrypt";
import {usersRepository} from "../repositories/users-repository";

export const authService = {
    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await usersRepository.findUserHashByLoginOrEmail(loginOrEmail)
        if(!user) return false
        const res = await bcrypt.compare(password,user.hash)
        if(!res) {
            return false
        }
        return user
    }
}