import mongoose from 'mongoose'
import { BlogsModelType} from "./types/blogs-entity-types";
import {BlogsModel} from "../repositories/db/db";


export const BlogsSchema = new mongoose.Schema<BlogsModelType>({
    name: { type: String, required: true, maxlength: 15 },
    description: { type: String, required: true, maxlength: 500 },
    websiteUrl: { type: String, required: true, maxlength: 100 },
    createdAt: { type: String, required: true }
})

BlogsSchema.methods.update = function (name: string, description: string, url: string) {
    this.name = name
    this.description = description
    this.websiteUrl = url
    return this
}

BlogsSchema.statics.make = function (name: string, description: string, websiteUrl: string ) {
    return new BlogsModel({
        name: name,
        description: description,
        websiteUrl: websiteUrl,
        createdAt: new Date().toISOString()
    })
}