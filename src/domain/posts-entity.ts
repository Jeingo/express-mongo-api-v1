import mongoose from 'mongoose'
import { PostsTypeToDB } from '../models/posts-models'

export const PostsSchema = new mongoose.Schema<PostsTypeToDB>({
    title: { type: String, required: true, maxlength: 30 },
    shortDescription: { type: String, required: true, maxlength: 100 },
    content: { type: String, required: true, maxlength: 1000 },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: String, required: true },
    extendedLikesInfo: {
        likesCount: { type: Number, required: true },
        dislikesCount: { type: Number, required: true }
    }
})
