import { tokensCollection } from './db'

export const tokenRepository = {
  async saveRefreshToken(userId: string, refreshToken: string) {
    await tokensCollection.insertOne({ userId: userId, refreshToken: refreshToken })
  },
  async findUserIdByRefreshToken(refreshToken: string): Promise<string | null> {
    const result = await tokensCollection.findOne({ refreshToken: refreshToken })
    if (!result) {
      return null
    }
    return result.userId
  },
  async deleteRefreshTokenByUserId(userId: string) {
    const result = await tokensCollection.deleteOne({ userId: userId })
    return result.deletedCount === 1
  },
}
