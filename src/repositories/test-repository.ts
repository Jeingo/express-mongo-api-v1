import {blogsCollection, commentsCollection, postsCollection, usersCollection} from "./db"

export const testRepository = {
    async deleteAllDB(): Promise<void> {
        await blogsCollection.deleteMany({})
        await postsCollection.deleteMany({})
        await usersCollection.deleteMany({})
        await commentsCollection.deleteMany({})
    }
}