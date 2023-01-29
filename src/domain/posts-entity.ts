import mongoose from 'mongoose'
import { PostsModelType } from './types/posts-enity-types'
import { PostsModel } from '../repositories/db/db'

export const PostsSchema = new mongoose.Schema<PostsModelType>({
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

PostsSchema.statics.make = function (
    title: string,
    description: string,
    content: string,
    blogId: string,
    blogName: string
) {
    return new PostsModel({
        title: title,
        shortDescription: description,
        content: content,
        blogId: blogId,
        blogName: blogName,
        createdAt: new Date().toISOString(),
        extendedLikesInfo: {
            likesCount: 0,
            dislikesCount: 0
        }
    })
}

PostsSchema.methods.update = function (
    title: string,
    description: string,
    content: string,
    blogId: string,
    blogName: string
) {
    this.title = title
    this.shortDescription = description
    this.content = content
    this.blogId = blogId
    this.blogName = blogName
    return this
}
