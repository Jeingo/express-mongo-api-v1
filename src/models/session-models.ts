export type SessionOutputType = {
    ip: string
    title: string
    lastActiveDate: string
    deviceId: string
}

export type SessionInputType = {
    issueAt: string
    deviceId: string
    deviceName: string
    ip: string
    userId: string
    expireAt: string
}

export type SessionTypeToDB = {
    issueAt: string
    deviceId: string
    deviceName: string
    ip: string
    userId: string
    expireAt: string
}
