import { injectable } from 'inversify'
import {BlogsModel} from "../domain/blogs-entity";
import {PostsModel} from "../domain/posts-entity";
import {UsersModel} from "../domain/users-entity";
import {CommentsModel} from "../domain/comments-entity";
import {SessionsModel} from "../domain/sessions-entity";
import {RateLimiterModel} from "../domain/rateLimiter-entity";
import {CommentsLikesModel} from "../domain/commentsLikes-entity";
import {PostsLikesModel} from "../domain/postsLikes-entity";

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
