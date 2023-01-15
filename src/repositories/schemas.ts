import mongoose from "mongoose";
import {BlogsTypeToDB} from "../models/blogs-models";

export const BlogsSchema = new mongoose.Schema<BlogsTypeToDB>({
    name: {type: String, required: true, maxlength: 15},
    description: {type: String, required: true, maxlength: 500},
    websiteUrl: {type: String, required: true, maxlength: 100},
    createdAt: {type: String, required: true}
})