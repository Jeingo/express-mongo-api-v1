import {
    BlogsModel,
    CommentsLikesModel,
    CommentsModel, PostsLikesModel,
    PostsModel,
    RateLimiterModel,
    SessionsModel,
    UsersModel
} from './db'
import { injectable } from 'inversify'

@injectable()
export class TestRepository {
    async deleteAllDB(): Promise<void> {
        await BlogsModel.deleteMany({})
        await PostsModel.deleteMany({})
        await UsersModel.deleteMany({})
        await CommentsModel.deleteMany({})
        await SessionsModel.deleteMany({})
        await RateLimiterModel.deleteMany({})
        await CommentsLikesModel.deleteMany({})
        await PostsLikesModel.deleteMany({})
    }
}
