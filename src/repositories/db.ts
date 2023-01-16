import { MongoClient } from 'mongodb' // to delete
import mongoose from 'mongoose'
import { settings } from '../settings/settings'
import {BlogsSchema, CommentsSchema, PostsSchema, UsersSchema} from './schemas'

const mongoUrl = settings.MONGO_URL
const dbName = settings.DB_NAME

export const client = new MongoClient(mongoUrl) // to delete

export const runDb = async () => {
    try {
        await client.connect() // to delete
        mongoose.set('strictQuery', false)
        await mongoose.connect(mongoUrl, { dbName: dbName })
        console.log('Connected successfully to mongo db')
    } catch (err) {
        console.log(`Can't connect to mongo db: ` + err)
        await client.close() // to delete
        await mongoose.disconnect()
    }
}

const db = client.db(dbName) // to delete
export const blogsCollection = db.collection('blogs') // to delete
export const postsCollection = db.collection('posts') // to delete
export const usersCollection = db.collection('users') // to delete
export const commentsCollection = db.collection('comments') // to delete
export const sessionCollection = db.collection('sessions') // to delete
export const rateLimiterCollection = db.collection('limiter') // to delete

export const BlogsModel = mongoose.model('blogs', BlogsSchema)
export const PostsModel = mongoose.model('posts', PostsSchema)
export const UsersModel = mongoose.model('users', UsersSchema)
export const CommentsModel = mongoose.model('comments', CommentsSchema)
// export const SessionModel = mongoose.model('sessions',)
// export const RateLimiterModel = mongoose.model('limiter',)
