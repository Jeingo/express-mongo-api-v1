import {BlogsRepository} from "./repositories/blogs-repository";
import {CommentsRepository} from "./repositories/comments-repository";
import {PostsRepository} from "./repositories/posts-repository";
import {RateLimiterRepository} from "./repositories/rate-limiter-repository";
import {SessionsRepository} from "./repositories/sessions-repository";
import {TestRepository} from "./repositories/test-repository";
import {UsersRepository} from "./repositories/users-repository";
import {BlogsQueryRepository} from "./query-reositories/blogs-query-repository";
import {CommentsQueryRepository} from "./query-reositories/comments-query-repository";
import {PostsQueryRepository} from "./query-reositories/posts-query-repository";
import {UsersQueryRepository} from "./query-reositories/users-query-repository";

const blogsRepository = new BlogsRepository()
const commentsRepository = new CommentsRepository()
const postsRepository = new PostsRepository()
const rateLimiterRepository = new RateLimiterRepository()
const sessionsRepository = new SessionsRepository()
const testRepository = new TestRepository()
const usersRepository = new UsersRepository()

const blogsQueryRepository = new BlogsQueryRepository()
const commentsQueryRepository = new CommentsQueryRepository()
const postsQueryRepository = new PostsQueryRepository()
const usersQueryRepository = new UsersQueryRepository()



