import {Model, Document, Types} from "mongoose";

type Blogs = {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string
}

type BlogsStatics = {
    make: (name: string, description: string, websiteUrl: string) => BlogsModelFullType
}

export type BlogsMethods = {
    update: (name: string, description: string, websiteUrl: string) => BlogsModelFullType
}

export type BlogsModelType = Blogs & Document & BlogsMethods

export type BlogsModelFullType = Model<BlogsModelType> & BlogsStatics & {_id: Types.ObjectId}