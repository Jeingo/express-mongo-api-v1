import express from 'express'
import cookieParser from 'cookie-parser'
import { blogsRouter } from './routers/blogs-router'
import { postsRouter } from './routers/posts-router'
import { testRouter } from './routers/test-router'
import { usersRouter } from './routers/users-router'
import { authRouter } from './routers/auth-router'
import { commentsRouter } from './routers/comments-router'

export const app = express()

app.use(express.json())
app.use(cookieParser())
app.set('trust proxy', true)

app.use('/auth', authRouter)
app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/comments', commentsRouter)
app.use('/testing/all-data', testRouter)
