import { PostsExtendedLikesTypeOutput, PostsLikesTypeOutput } from '../models/likes-models'
import { injectable } from 'inversify'
import {PostsLikesModel} from "../domain/postsLikes-entity";

@injectable()
export class PostsLikesQueryRepository {
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
