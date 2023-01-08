import { tokensCollection } from './db'

export const tokenRepository = {
  async save(userId: string, refreshToken: string) {
    await tokensCollection.insertOne({ userId: userId, refreshToken: refreshToken })
  },
  async findAndDeleteRefreshToken(refreshToken: string) {
    const foundRefreshToken = await tokensCollection.findOne({ refreshToken: refreshToken })
    if(!foundRefreshToken) {
      return null
    }
    const result = await tokensCollection.deleteOne({ refreshToken: refreshToken })
    return result.deletedCount === 1
  },
}
