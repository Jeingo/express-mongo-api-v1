import { PostsModel } from './db/db'
import { ObjectId } from 'mongodb'
import { PostsTypeOutput } from '../models/posts-models'
import { injectable } from 'inversify'
import { StatusLikeType } from '../models/likes-models'
import { getUpdatedLike } from './helper'

@injectable()
export class PostsRepository {
    async getPostById(id: string) {
        return PostsModel.findById(new ObjectId(id))
    }
    async savePost(post: any) {
        return await post.save()
    }
    async deletePost(id: string): Promise<boolean> {
        const result = await PostsModel.findByIdAndDelete(new ObjectId(id))
        return !!result
    }
    async updateLikeInPost(
        post: PostsTypeOutput,
        lastStatus: StatusLikeType,
        newStatus: StatusLikeType
    ): Promise<boolean> {
        const newLikesInfo = getUpdatedLike(
            {
                likesCount: post.extendedLikesInfo.likesCount,
                dislikesCount: post.extendedLikesInfo.dislikesCount
            },
            lastStatus,
            newStatus
        )
        const result = await PostsModel.findByIdAndUpdate(new ObjectId(post.id), { extendedLikesInfo: newLikesInfo })
        return !!result
    }
}
