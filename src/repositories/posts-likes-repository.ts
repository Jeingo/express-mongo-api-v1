import { injectable } from 'inversify'
import {
    PostsExtendedLikesTypeOutput,
    PostsLikesTypeOutput,
    PostsLikesTypeToDB,
    StatusLikeType
} from '../models/likes-models'
import { PostsLikesModel } from './db/db'
import { ObjectId } from 'mongodb'

@injectable()
export class PostsLikesRepository {
    async getLastThreeLikes(postId: string): Promise<PostsExtendedLikesTypeOutput[] | null> {
        const desc = -1
        const threeLastUser = 3
        const like = 'Like'
        const result = await PostsLikesModel.find({ postId: postId, myStatus: like })
            .sort({ addedAt: desc })
            .limit(threeLastUser)

        if (!result) return null
        return result.map(this._getOutputExtendedLike)
    }
    async getLike(userId: string, postId: string): Promise<PostsLikesTypeOutput | null> {
        const result = await PostsLikesModel.findOne({ userId: userId, postId: postId })
        if (!result) return null
        return this._getOutputLike(result)
    }
    async createLike(newLike: PostsLikesTypeToDB): Promise<PostsLikesTypeOutput> {
        const result = await PostsLikesModel.create(newLike)
        return this._getOutputLike(result)
    }
    async updateLike(likeId: string, status: { myStatus: StatusLikeType }): Promise<boolean> {
        const result = await PostsLikesModel.findByIdAndUpdate(new ObjectId(likeId), status)
        return !!result
    }
    private _getOutputLike(like: any): PostsLikesTypeOutput {
        return {
            id: like._id.toString(),
            userId: like.userId,
            postId: like.postId,
            myStatus: like.myStatus,
            login: like.login,
            addedAt: like.addedAt
        }
    }
    private _getOutputExtendedLike(like: any): PostsExtendedLikesTypeOutput {
        return {
            addedAt: like.addedAt,
            userId: like.userId,
            login: like.login
        }
    }
}
