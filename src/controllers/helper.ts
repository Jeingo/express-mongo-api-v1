import {JwtService} from '../application/jwt-service'
import {sessionsService} from "../composition-root";

export const checkAuthorizationAndGetPayload = async (token: string) => {
    const jwtService = new JwtService()
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
