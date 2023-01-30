import mongoose from 'mongoose'
import {BlogsModelFullType, BlogsModelType} from './types/blogs-entity-types'

export const BlogsSchema = new mongoose.Schema<BlogsModelType>({
    name: { type: String, required: true, maxlength: 15 },
    description: { type: String, required: true, maxlength: 500 },
    websiteUrl: { type: String, required: true, maxlength: 100 },
    createdAt: { type: String, required: true }
})

// class BlogsClass {
//     static make(name: string, description: string, websiteUrl: string) {
//         return new BlogsModel({
//             name: name,
//             description: description,
//             websiteUrl: websiteUrl,
//             createdAt: new Date().toISOString()
//         })
//     }
//     update(name: string, description: string, websiteUrl: string) {
//         this.name = name
//         this.description = description
//         this.websiteUrl = websiteUrl
//     }
// }

BlogsSchema.statics.make = function (name: string, description: string, websiteUrl: string) {
    return new BlogsModel({
        name: name,
        description: description,
        websiteUrl: websiteUrl,
        createdAt: new Date().toISOString()
    })
}

BlogsSchema.methods.update = function (name: string, description: string, websiteUrl: string) {
    this.name = name
    this.description = description
    this.websiteUrl = websiteUrl
    return this
}

export const BlogsModel = mongoose.model<BlogsModelType, BlogsModelFullType>('blogs', BlogsSchema)