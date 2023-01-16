import mongoose from "mongoose";
import {BlogsTypeToDB} from "../models/blogs-models";
import {PostsTypeToDB} from "../models/posts-models";

export const BlogsSchema = new mongoose.Schema<BlogsTypeToDB>({
    name: {type: String, required: true, maxlength: 15},
    description: {type: String, required: true, maxlength: 500},
    websiteUrl: {type: String, required: true, maxlength: 100},
    createdAt: {type: String, required: true}
})

export const PostsSchema = new mongoose.Schema<PostsTypeToDB>({
    title: {type: String, required: true, maxlength: 30},
    shortDescription: {type: String, required: true, maxlength: 100},
    content: {type: String, required: true, maxlength: 1000},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true}
})