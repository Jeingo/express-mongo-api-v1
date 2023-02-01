import mongoose from 'mongoose'
import {PostsLikesTypeToDB} from '../models/likes-models'

export const PostsLikesSchema = new mongoose.Schema<PostsLikesTypeToDB>({
    userId: { type: String, required: true },
    postId: { type: String, required: true },
    myStatus: { type: String, required: true },
    login: { type: String, required: true },
    addedAt: { type: String, required: true }
})

export const PostsLikesModel = mongoose.model('posts-likes', PostsLikesSchema)