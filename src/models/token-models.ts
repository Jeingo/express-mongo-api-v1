export type SessionType = {
    issueAt: string
    deviceId: string
    deviceName: string
    ip: string
    userId: string
    expireAt: string
}

export type TokenPayloadType = {
    deviceId: string
    userId: string
    exp: number
    iat: number
}
