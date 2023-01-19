import { NextFunction, Response, Request } from 'express'
import { HTTP_STATUSES } from '../constats/status'
import { jwtService } from '../application/jwt-service'
import {UsersService} from '../domain/users-service'

export const bearerAuth = async (req: Request, res: Response, next: NextFunction) => {
    const usersService = new UsersService()
    if (!req.headers.authorization) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    const token = req.headers.authorization.split(' ')[1]
    const userId = jwtService.getUserIdByToken(token)

    if (!userId) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }
    req.user = await usersService.getUserById(userId)
    next()
}
