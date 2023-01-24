import { injectable } from 'inversify'
import { PostsLikesTypeOutput, PostsLikesTypeToDB, StatusLikeType } from '../models/likes-models'
import { PostsLikesModel } from './db'
import { ObjectId } from 'mongodb'

@injectable()
export class PostsLikesRepository {
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
}
