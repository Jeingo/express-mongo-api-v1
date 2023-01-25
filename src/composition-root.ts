import 'reflect-metadata'
import { BlogsRepository } from './repositories/blogs-repository'
import { CommentsRepository } from './repositories/comments-repository'
import { PostsRepository } from './repositories/posts-repository'
import { RateLimiterRepository } from './repositories/rate-limiter-repository'
import { SessionsRepository } from './repositories/sessions-repository'
import { TestRepository } from './repositories/test-repository'
import { UsersRepository } from './repositories/users-repository'
import { BlogsQueryRepository } from './query-reositories/blogs-query-repository'
import { CommentsQueryRepository } from './query-reositories/comments-query-repository'
import { PostsQueryRepository } from './query-reositories/posts-query-repository'
import { UsersQueryRepository } from './query-reositories/users-query-repository'
import { EmailAdapter } from './infrastructure/email-adapter'
import { JwtService } from './infrastructure/jwt-service'
import { EmailManager } from './infrastructure/email-manager'
import { AuthController } from './controllers/auth-controller'
import { BlogsController } from './controllers/blogs-controller'
import { CommentsController } from './controllers/comments-controller'
import { PostsController } from './controllers/posts-controller'
import { SecurityController } from './controllers/security-controller'
import { TestController } from './controllers/test-controller'
import { UsersController } from './controllers/users-controller'
import { CommentsLikesRepository } from './repositories/comments-likes-repository'
import { Container } from 'inversify'
import { PostsLikesRepository } from './repositories/posts-likes-repository'
import { AuthService } from './services/auth-service'
import { BlogsService } from './services/blogs-service'
import { CommentsService } from './services/comments-service'
import { PostsService } from './services/posts-service'
import { SessionsService } from './services/sessions-service'
import { TestService } from './services/test-service'
import { UsersService } from './services/users-service'

export const container = new Container()
container.bind(BlogsRepository).to(BlogsRepository)
container.bind(CommentsRepository).to(CommentsRepository)
container.bind(PostsRepository).to(PostsRepository)
container.bind(SessionsRepository).to(SessionsRepository)
container.bind(TestRepository).to(TestRepository)
container.bind(UsersRepository).to(UsersRepository)
container.bind(CommentsLikesRepository).to(CommentsLikesRepository)
container.bind(PostsLikesRepository).to(PostsLikesRepository)
container.bind(RateLimiterRepository).to(RateLimiterRepository)
container.bind(BlogsQueryRepository).to(BlogsQueryRepository)
container.bind(CommentsQueryRepository).to(CommentsQueryRepository)
container.bind(PostsQueryRepository).to(PostsQueryRepository)
container.bind(UsersQueryRepository).to(UsersQueryRepository)
container.bind(EmailAdapter).to(EmailAdapter)
container.bind(JwtService).to(JwtService)
container.bind(EmailManager).to(EmailManager)
container.bind(AuthService).to(AuthService)
container.bind(BlogsService).to(BlogsService)
container.bind(TestService).to(TestService)
container.bind(SessionsService).to(SessionsService)
container.bind(CommentsService).to(CommentsService)
container.bind(UsersService).to(UsersService)
container.bind(PostsService).to(PostsService)
container.bind(AuthController).to(AuthController)
container.bind(BlogsController).to(BlogsController)
container.bind(TestController).to(TestController)
container.bind(UsersController).to(UsersController)
container.bind(CommentsController).to(CommentsController)
container.bind(SecurityController).to(SecurityController)
container.bind(PostsController).to(PostsController)

export const rateLimiterRepository = container.resolve(RateLimiterRepository)

export const jwtService = container.resolve(JwtService)
export const sessionsService = container.resolve(SessionsService)
export const usersQueryRepository = container.resolve(UsersQueryRepository)

export const authController = container.resolve(AuthController)
export const blogsController = container.resolve(BlogsController)
export const commentsController = container.resolve(CommentsController)
export const postsController = container.resolve(PostsController)
export const securityController = container.resolve(SecurityController)
export const testController = container.resolve(TestController)
export const usersController = container.resolve(UsersController)
