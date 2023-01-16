import { MongoClient } from 'mongodb' // to delete
import mongoose from 'mongoose'
import { settings } from '../settings/settings'
import {
    BlogsSchema,
    CommentsSchema,
    PostsSchema,
    RateLimiterSchema,
    SessionsSchema,
    UsersSchema
} from './schemas'

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

export const BlogsModel = mongoose.model('blogs', BlogsSchema)
export const PostsModel = mongoose.model('posts', PostsSchema)
export const UsersModel = mongoose.model('users', UsersSchema)
export const CommentsModel = mongoose.model('comments', CommentsSchema)
export const SessionsModel = mongoose.model('sessions', SessionsSchema)
export const RateLimiterModel = mongoose.model('limiters', RateLimiterSchema)
