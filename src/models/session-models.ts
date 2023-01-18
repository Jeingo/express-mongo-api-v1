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

export class SessionTypeToDB {
    constructor(
        public issueAt: string,
        public deviceId: string,
        public deviceName: string,
        public ip: string,
        public userId: string,
        public expireAt: string
    ) {}
}
