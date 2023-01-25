import mongoose from 'mongoose'
import { CommentsTypeToDB } from '../models/comments-models'

export const CommentsSchema = new mongoose.Schema<CommentsTypeToDB>({
    content: { type: String, required: true, maxlength: 300, minlength: 20 },
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
    createdAt: { type: String, required: true },
    postId: { type: String, required: true },
    likesInfo: {
        likesCount: { type: Number, required: true },
        dislikesCount: { type: Number, required: true }
    }
})
