import jwt from 'jsonwebtoken'
import { settings } from '../settings/settings'
import { ObjectId } from 'mongodb'
import { tokenRepository } from '../repositories/token-repository'

export const jwtService = {
  async createJWT(userId: string) {
    const token = jwt.sign({ userId: userId }, settings.JWT_SECRET, {
      expiresIn: '10s',
    })
    return {
      accessToken: token,
    }
  },
  async createAndSaveRefreshJWT(userId: string) {
    const token = jwt.sign({ userId: userId }, settings.JWT_REFRESH_SECRET, {
      expiresIn: '20s',
    })
    await tokenRepository.saveRefreshToken(userId, token)
    return {
      refreshToken: token,
    }
  },
  async deleteRefreshJWT(userId: string) {
    return await tokenRepository.deleteRefreshTokenByUserId(userId)
  },
  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, settings.JWT_SECRET)
      return new ObjectId(result.userId)
    } catch (err) {
      return null
    }
  },
  async getUserIdByTokenRefresh(token: string) {
    try {
      const result: any = jwt.verify(token, settings.JWT_REFRESH_SECRET)
      return new ObjectId(result.userId)
    } catch (err) {
      return null
    }
  },
}
