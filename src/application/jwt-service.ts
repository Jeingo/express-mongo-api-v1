import jwt from 'jsonwebtoken'
import { settings } from '../settings/settings'
import { ObjectId } from 'mongodb'
import { TokenPayloadType } from '../models/token-models'

export const jwtService = {
    createJWT(userId: string) {
        return jwt.sign({ userId: userId }, settings.JWT_SECRET, {
            //expiresIn: '10s' for deploy
            expiresIn: '10s'
        })
    },
    createRefreshJWT(userId: string, deviceId: string) {
        return jwt.sign({ userId: userId, deviceId: deviceId }, settings.JWT_REFRESH_SECRET, {
            // expiresIn: '20s' for deploy
            expiresIn: '20s'
        })
    },
    checkExpirationAndGetPayload(token: string) {
        try {
            return jwt.verify(token, settings.JWT_REFRESH_SECRET) as TokenPayloadType
        } catch (err) {
            return null
        }
    },
    getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return new ObjectId(result.userId)
        } catch (err) {
            return null
        }
    }
}
