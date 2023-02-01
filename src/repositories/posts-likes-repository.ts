import { injectable } from 'inversify'
import { PostsLikesId, PostsLikesTypeToDB, StatusLikeType } from '../models/likes-models'
import { ObjectId } from 'mongodb'
import {PostsLikesModel} from "../domain/postsLikes-entity";

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
