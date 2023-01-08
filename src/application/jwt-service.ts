import jwt from 'jsonwebtoken'
import { settings } from '../settings/settings'
import { ObjectId } from 'mongodb'
import {tokenRepository} from "../repositories/token-repository";

export const jwtService = {
  async createJWT(user: any) {
    const token = jwt.sign({ userId: user.id }, settings.JWT_SECRET, {
      expiresIn: '10m',
    })
    return {
      accessToken: token,
    }
  },
  async createRefreshJWT(user: any) {
    const token = jwt.sign({ userId: user.id }, settings.JWT_REFRESH_SECRET, {
      expiresIn: '30d',
    })
    await tokenRepository.save(user.id, token)
    return {
      refreshToken: token,
    }
  },
  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, settings.JWT_SECRET)
      return new ObjectId(result.userId)
    } catch (err) {
      return null
    }
  },
}
