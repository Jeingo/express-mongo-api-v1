import mongoose from 'mongoose'
import { BlogsTypeToDB } from '../models/blogs-models'
import { PostsTypeToDB } from '../models/posts-models'
import { UsersTypeToDB } from '../models/users-models'
import { CommentsTypeToDB } from '../models/comments-models'
import { SessionTypeToDB } from '../models/session-models'
import { RateLimiterTypeToDB } from '../models/auth-models'

export const BlogsSchema = new mongoose.Schema<BlogsTypeToDB>({
    name: { type: String, required: true, maxlength: 15 },
    description: { type: String, required: true, maxlength: 500 },
    websiteUrl: { type: String, required: true, maxlength: 100 },
    createdAt: { type: String, required: true }
})

export const PostsSchema = new mongoose.Schema<PostsTypeToDB>({
    title: { type: String, required: true, maxlength: 30 },
    shortDescription: { type: String, required: true, maxlength: 100 },
    content: { type: String, required: true, maxlength: 1000 },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: String, required: true }
})

export const UsersSchema = new mongoose.Schema<UsersTypeToDB>({
    login: { type: String, required: true, maxlength: 10, minlength: 3 },
    hash: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: String, required: true },
    passwordRecoveryConfirmation: {
        passwordRecoveryCode: { type: String, required: true },
        expirationDate: { type: Date, required: true },
        isConfirmed: { type: Boolean, required: true }
    },
    emailConfirmation: {
        confirmationCode: { type: String, required: true },
        expirationDate: { type: Date, required: true },
        isConfirmed: { type: Boolean, required: true }
    }
})

export const CommentsSchema = new mongoose.Schema<CommentsTypeToDB>({
    content: { type: String, required: true, maxlength: 300, minlength: 20 },
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
    createdAt: { type: String, required: true },
    postId: { type: String, required: true }
})

export const SessionsSchema = new mongoose.Schema<SessionTypeToDB>({
    issueAt: { type: String, required: true },
    deviceId: { type: String, required: true },
    deviceName: { type: String, required: true },
    ip: { type: String, required: true },
    userId: { type: String, required: true },
    expireAt: { type: String, required: true }
})

export const RateLimiterSchema = new mongoose.Schema<RateLimiterTypeToDB>({
    ip: { type: String, required: true },
    endpoint: { type: String, required: true },
    date: { type: Number, required: true },
    count: { type: Number, required: true }
})
