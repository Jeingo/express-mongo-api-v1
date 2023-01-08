import {tokenCollection} from "./db";

export const tokenRepository = {
    async save(userId: string, refreshToken: string) {
        await tokenCollection.insertOne({userId: userId, refreshToken: refreshToken})
    }
}