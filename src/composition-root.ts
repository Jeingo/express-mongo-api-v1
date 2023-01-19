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
import {EmailAdapter} from "./adapters/email-adapter";
import {JwtService} from "./application/jwt-service";
import {AuthService} from "./domain/auth-service";
import {EmailManager} from "./managers/email-manager";
import {SessionsService} from "./domain/sessions-service";
import {AuthController} from "./controllers/auth-controller";
import {BlogsService} from "./domain/blogs-service";
import {CommentsService} from "./domain/comments-service";
import {PostsService} from "./domain/posts-service";
import {TestService} from "./domain/test-service";
import {UsersService} from "./domain/users-service";
import {BlogsController} from "./controllers/blogs-controller";
import {CommentsController} from "./controllers/comments-controller";
import {PostsController} from "./controllers/posts-controller";
import {SecurityController} from "./controllers/security-controller";
import {TestController} from "./controllers/test-controller";
import {UsersController} from "./controllers/users-controller";

const blogsRepository = new BlogsRepository()
const commentsRepository = new CommentsRepository()
const postsRepository = new PostsRepository()
const sessionsRepository = new SessionsRepository()
const testRepository = new TestRepository()
const usersRepository = new UsersRepository()
export const rateLimiterRepository = new RateLimiterRepository()

const blogsQueryRepository = new BlogsQueryRepository()
const commentsQueryRepository = new CommentsQueryRepository()
const postsQueryRepository = new PostsQueryRepository()
const usersQueryRepository = new UsersQueryRepository()

const emailAdapter = new EmailAdapter()
export const jwtService = new JwtService()

const emailManager = new EmailManager(emailAdapter)
const authService = new AuthService(emailManager, usersRepository)
const blogsService = new BlogsService(blogsRepository)
const commentsService = new CommentsService(commentsRepository, postsRepository)
const postsService = new PostsService(blogsRepository, postsRepository)
const testService = new TestService(testRepository)
export const sessionsService = new SessionsService(sessionsRepository)
export const usersService = new UsersService(usersRepository)


export const authController = new AuthController(jwtService, authService, sessionsService)
export const blogsController = new BlogsController(blogsService, blogsQueryRepository)
export const commentsController = new CommentsController(commentsService, commentsQueryRepository)
export const postsController = new PostsController(postsService, postsQueryRepository)
export const securityController = new SecurityController(sessionsService)
export const testController = new TestController(testService)
export const usersController = new UsersController(usersService, usersQueryRepository)



