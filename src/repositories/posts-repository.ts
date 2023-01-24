import { PostsModel } from './db'
import { ObjectId } from 'mongodb'
import { PostsTypeOutput, PostsTypeToDB, PostsUpdateType } from '../models/posts-models'
import { injectable } from 'inversify'
import { LikesInfoType, StatusLikeType } from '../models/likes-models'

@injectable()
export class PostsRepository {
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
    private _getOutputPost(post: any): PostsTypeOutput {
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: post.extendedLikesInfo.likesCount,
                dislikesCount: post.extendedLikesInfo.dislikesCount,
                myStatus: 'None',
                newestLikes: []
            }
        }
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
