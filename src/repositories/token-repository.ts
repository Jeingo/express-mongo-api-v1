import { sessionCollection } from './db'
import { SessionType } from '../models/token-models'

export const tokenRepository = {
    async saveSession(session: SessionType) {
        await sessionCollection.insertOne(session)
    },
    async findUserIdByRefreshToken(refreshToken: string): Promise<string | null> {
        const result = await sessionCollection.findOne({ refreshToken: refreshToken })
        if (!result) {
            return null
        }
        return result.userId
    },
    async deleteRefreshTokenByUserId(userId: string) {
        const result = await sessionCollection.deleteOne({ userId: userId })
        return result.deletedCount === 1
    },
}
