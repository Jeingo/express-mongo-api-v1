import { BlogsModel, CommentsModel, PostsModel, RateLimiterModel, SessionsModel, UsersModel } from './db'
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
    }
}
