import { injectable } from 'inversify'
import {
    PostsLikesId,
    PostsLikesTypeToDB,
    StatusLikeType
} from '../models/likes-models'
import { PostsLikesModel } from './db/db'
import { ObjectId } from 'mongodb'

@injectable()
export class PostsLikesRepository {
    async createLike(newLike: PostsLikesTypeToDB): Promise<PostsLikesId> {
        const result = await PostsLikesModel.create(newLike)
        return result._id.toString()
    }
    async updateLike(likeId: string, status: { myStatus: StatusLikeType }): Promise<boolean> {
        const result = await PostsLikesModel.findByIdAndUpdate(new ObjectId(likeId), status)
        return !!result
    }
}
