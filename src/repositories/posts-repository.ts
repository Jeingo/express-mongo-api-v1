import { PostsModel } from './db/db'
import { ObjectId } from 'mongodb'
import { PostId, PostsTypeOutput, PostsTypeToDB, PostsUpdateType } from '../models/posts-models'
import { injectable } from 'inversify'
import { StatusLikeType } from '../models/likes-models'
import {getUpdatedLike} from "./helper";

@injectable()
export class PostsRepository {
    async createPost(createdPost: PostsTypeToDB): Promise<PostId> {
        const result = await PostsModel.create(createdPost)
        return result._id.toString()
    }
    async updatePost(id: string, updatedPost: PostsUpdateType): Promise<boolean> {
        const result = await PostsModel.findByIdAndUpdate(new ObjectId(id), updatedPost)
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
    async deletePost(id: string): Promise<boolean> {
        const result = await PostsModel.findByIdAndDelete(new ObjectId(id))
        return !!result
    }
}
