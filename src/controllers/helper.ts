import { jwtService } from '../application/jwt-service'
import {SessionsService} from '../domain/sessions-service'

export const checkAuthorizationAndGetPayload = async (token: string) => {
    const sessionsService = new SessionsService()
    const payload = jwtService.checkExpirationAndGetPayload(token)
    if (!payload) {
        return null
    }
    const statusSession = await sessionsService.isActiveSession(payload.deviceId, payload.iat.toString())
    if (statusSession) {
        return null
    }
    return payload
}
