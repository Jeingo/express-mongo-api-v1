import { RequestWithBody, RequestWithParams, RequestWithQuery } from '../models/types'
import { QueryUsers } from '../models/query-models'
import { Response } from 'express'
import { PaginatedType } from '../models/main-models'
import { UsersIdParams, UsersTypeInput, UsersTypeOutput } from '../models/users-models'
import { usersQueryRepository } from '../query-reositories/users-query-repository'
import { HTTP_STATUSES } from '../constats/status'
import { usersService } from '../domain/users-service'

class UsersController {
    async getAllUsers(req: RequestWithQuery<QueryUsers>, res: Response<PaginatedType<UsersTypeOutput>>) {
        const allUsers = await usersQueryRepository.getAllUsers(req.query)
        res.status(HTTP_STATUSES.OK_200).json(allUsers)
    }
    async createUser(req: RequestWithBody<UsersTypeInput>, res: Response<UsersTypeOutput>) {
        const createdUser = await usersService.createUser(req.body.login, req.body.password, req.body.email)
        res.status(HTTP_STATUSES.CREATED_201).json(createdUser)
    }
    async deleteUser(req: RequestWithParams<UsersIdParams>, res: Response) {
        const deletedUser = await usersService.deleteUser(req.params.id)

        if (!deletedUser) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
}

export const usersController = new UsersController()
