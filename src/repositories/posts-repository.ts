import { PostsModel } from './db'
import { ObjectId } from 'mongodb'
import { PostsTypeOutput, PostsTypeToDB, PostsUpdateType } from '../models/posts-models'

class PostsRepository {
    async getPostById(id: string): Promise<PostsTypeOutput | null> {
        const result = await PostsModel.findById(new ObjectId(id))
        if (!result) return null
        return this._getOutputPost(result)
    }
    async createPost(createdPost: PostsTypeToDB): Promise<PostsTypeOutput> {
        const result = await PostsModel.create(createdPost)
        return this._getOutputPost(result)
    }
    async updatePost(id: string, updatedPost: PostsUpdateType): Promise<boolean> {
        const result = await PostsModel.findByIdAndUpdate(new ObjectId(id), updatedPost)
        return !!result
    }
    async deletePost(id: string): Promise<boolean> {
        const result = await PostsModel.findByIdAndDelete(new ObjectId(id))
        return !!result
    }
    private _getOutputPost(post: any): PostsTypeOutput {
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
}

export const postsRepository = new PostsRepository()
