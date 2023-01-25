import { PostsModel } from './db/db'
import { ObjectId } from 'mongodb'
import {PostId, PostsTypeOutput, PostsTypeToDB, PostsUpdateType} from '../models/posts-models'
import { injectable } from 'inversify'
import { LikesInfoType, StatusLikeType } from '../models/likes-models'

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
        const newLikesInfo = this._getUpdatedPostLike(
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
    private _getUpdatedPostLike(likesInfo: LikesInfoType, lastStatus: StatusLikeType, newStatus: StatusLikeType) {
        if (newStatus === 'None' && lastStatus === 'Like') {
            return { ...likesInfo, likesCount: --likesInfo.likesCount }
        }
        if (newStatus === 'None' && lastStatus === 'Dislike') {
            return { ...likesInfo, dislikesCount: --likesInfo.dislikesCount }
        }
        if (newStatus === 'Like' && lastStatus === 'None') {
            return { ...likesInfo, likesCount: ++likesInfo.likesCount }
        }
        if (newStatus === 'Like' && lastStatus === 'Dislike') {
            return {
                ...likesInfo,
                likesCount: ++likesInfo.likesCount,
                dislikesCount: --likesInfo.dislikesCount
            }
        }
        if (newStatus === 'Dislike' && lastStatus === 'None') {
            return { ...likesInfo, dislikesCount: ++likesInfo.dislikesCount }
        }
        if (newStatus === 'Dislike' && lastStatus === 'Like') {
            return {
                ...likesInfo,
                likesCount: --likesInfo.likesCount,
                dislikesCount: ++likesInfo.dislikesCount
            }
        }
        return likesInfo
    }
}
