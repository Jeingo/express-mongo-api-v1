import {Model, Document, Types} from "mongoose";

type Posts = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: {
        likesCount: number
        dislikesCount: number
    }
}

export type PostsStatics = {
    make: (title: string, description: string, content: string, blogId: string, blogName: string) => PostsModelFullType
}

export type PostsMethods = {
    update: (title: string, description: string, content: string, blogId: string, blogName: string) => PostsModelFullType
}

export type PostsModelType = Posts & Document & PostsMethods

export type PostsModelFullType = Model<PostsModelType> & PostsStatics & {_id: Types.ObjectId}