import {
    blogsCollection,
    commentsCollection,
    postsCollection, rateLimiterCollection,
    sessionCollection,
    usersCollection
} from './db'

export const testRepository = {
    async deleteAllDB(): Promise<void> {
        await blogsCollection.deleteMany({})
        await postsCollection.deleteMany({})
        await usersCollection.deleteMany({})
        await commentsCollection.deleteMany({})
        await sessionCollection.deleteMany({})
        await rateLimiterCollection.deleteMany({})
    }
}
