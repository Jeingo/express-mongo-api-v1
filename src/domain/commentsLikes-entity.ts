import mongoose from 'mongoose'
import { CommentsLikesTypeToDB } from '../models/likes-models'

export const CommentsLikesSchema = new mongoose.Schema<CommentsLikesTypeToDB>({
    userId: { type: String, required: true },
    commentId: { type: String, required: true },
    myStatus: { type: String, required: true }
})
