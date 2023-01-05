import {MongoClient} from "mongodb"
import {settings} from "../settings/settings";

const mongoUrl = settings.MONGO_URL

export const client = new MongoClient(mongoUrl)

export const runDb = async () => {
    try {
        await client.connect()
        console.log('Connected successfully to mongo db')
    } catch (err) {
        console.log(`Can't connect to mongo db: ` + err)
        await client.close()
    }
}

const db = client.db('service')
export const blogsCollection = db.collection('blogs')
export const postsCollection = db.collection('posts')
export const usersCollection = db.collection('users')
export const commentsCollection = db.collection('comments')

