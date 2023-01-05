import {postsCollection} from "./db"
import {ObjectId} from "mongodb"
import {PostsTypeOutput, PostsTypeToDB} from "../models/posts-models"

const getOutputPost = (post: any): PostsTypeOutput => {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    }
}

export const postsRepository = {
    async getPostById(id: string): Promise<PostsTypeOutput | null> {
        const res = await postsCollection.findOne({_id: new ObjectId(id)})
        if(res) {
            return getOutputPost(res)
        }
            return null
    },
    async getPostsById(id: string) {
        if(!ObjectId.isValid(id)) {
            return null
        }
        const res = await postsCollection.find({blogId: id}).toArray()
        if(res) {
            return res.map(getOutputPost)
        }
        return null
    },
    async createPost(createdPost: PostsTypeToDB): Promise<PostsTypeOutput> {
            const res = await postsCollection.insertOne(createdPost)
            return {
                id: res.insertedId.toString(),
                title: createdPost.title,
                shortDescription: createdPost.shortDescription,
                content: createdPost.content,
                blogId: createdPost.blogId,
                blogName: createdPost.blogName,
                createdAt: createdPost.createdAt
            }
    },
    async updatePost(id: string, title: string, desc: string, content: string, blogId: string, blogName: string): Promise<boolean | null> {
        if(!ObjectId.isValid(blogId)) {
            return null
        }
        const updatePost = await postsCollection
            .updateOne({_id: new ObjectId(id)},
                {$set: {title: title, shortDescription: desc, content: content, blogId: blogId, blogName: blogName}})
        return updatePost.matchedCount === 1
    },
    async deletePost(id: string): Promise<boolean> {
        const result = await postsCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }
}