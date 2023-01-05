import bcrypt from "bcrypt";
import {authRepository} from "../repositories/auth-repository";

export const authService = {
    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await authRepository.findByLoginOrEmail(loginOrEmail)
        if(!user) return false
        const res = await bcrypt.compare(password,user.hash)
        if(!res) {
            return false
        }
        return user
    }
}