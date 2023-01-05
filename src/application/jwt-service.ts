import jwt from 'jsonwebtoken'
import {settings} from "../settings/settings";
import {ObjectId} from "mongodb";

export const jwtService = {
    async createJWT(user: any) {
        const token = jwt.sign({userId: user._id}, settings.JWT_SECRET, {expiresIn: '10m'})
        return {
            accessToken: token
        }
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return new ObjectId(result.userId)
        } catch (err) {
            return null
        }
    }
}