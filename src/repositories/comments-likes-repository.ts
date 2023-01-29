import { CommentsLikesModel } from './db/db'
import { CommentsLikesId, CommentsLikesTypeToDB, StatusLikeType } from '../models/likes-models'
import { ObjectId } from 'mongodb'
import { injectable } from 'inversify'

@injectable()
export class CommentsLikesRepository {
    async createLike(newLike: CommentsLikesTypeToDB): Promise<CommentsLikesId> {
        const result = await CommentsLikesModel.create(newLike)
        return result._id.toString()
    }
    async updateLike(likeId: string, status: { myStatus: StatusLikeType }): Promise<boolean> {
        const result = await CommentsLikesModel.findByIdAndUpdate(new ObjectId(likeId), status)
        return !!result
    }
}
