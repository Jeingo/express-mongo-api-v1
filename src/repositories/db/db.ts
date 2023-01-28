import mongoose from 'mongoose'
import { settings } from '../../settings/settings'
import { BlogsSchema} from '../../domain/blogs-entity'
import { PostsSchema } from '../../domain/posts-entity'
import { UsersSchema } from '../../domain/users-entity'
import { CommentsSchema } from '../../domain/comments-entity'
import { SessionsSchema } from '../../domain/sessions-entity'
import { RateLimiterSchema } from '../../domain/rateLimiter-entity'
import { CommentsLikesSchema } from '../../domain/commentsLikes-entity'
import { PostsLikesSchema } from '../../domain/postsLikes-entity'
import { BlogsModelFullType, BlogsModelType} from "../../domain/types/blogs-entity-types";

const mongoUrl = settings.MONGO_URL
const dbName = settings.DB_NAME

export const runDb = async () => {
    try {
        mongoose.set('strictQuery', false)
        await mongoose.connect(mongoUrl, { dbName: dbName })
        console.log('Connected successfully to mongo db')
    } catch (err) {
        console.log(`Can't connect to mongo db: ` + err)
        await mongoose.disconnect()
    }
}

export const BlogsModel = mongoose.model<BlogsModelType, BlogsModelFullType>('blogs', BlogsSchema)
export const PostsModel = mongoose.model('posts', PostsSchema)
export const UsersModel = mongoose.model('users', UsersSchema)
export const CommentsModel = mongoose.model('comments', CommentsSchema)
export const SessionsModel = mongoose.model('sessions', SessionsSchema)
export const RateLimiterModel = mongoose.model('limiters', RateLimiterSchema)
export const CommentsLikesModel = mongoose.model('comments-likes', CommentsLikesSchema)
export const PostsLikesModel = mongoose.model('posts-likes', PostsLikesSchema)
