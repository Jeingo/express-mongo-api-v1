import { RequestWithBody, RequestWithParams, RequestWithQuery } from '../models/types'
import { QueryUsers } from '../models/query-models'
import { Response } from 'express'
import { PaginatedType } from '../models/main-models'
import { UsersIdParams, UsersTypeInput, UsersTypeOutput } from '../models/users-models'
import { UsersQueryRepository } from '../query-reositories/users-query-repository'
import { HTTP_STATUSES } from '../constats/status'
import { inject, injectable } from 'inversify'
import {UsersService} from "../services/users-service";

@injectable()
export class UsersController {
    constructor(
        @inject(UsersService) protected usersService: UsersService,
        @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository
    ) {}

    async getAllUsers(req: RequestWithQuery<QueryUsers>, res: Response<PaginatedType<UsersTypeOutput>>) {
        const allUsers = await this.usersQueryRepository.getAllUsers(req.query)
        res.status(HTTP_STATUSES.OK_200).json(allUsers)
    }
    async createUser(req: RequestWithBody<UsersTypeInput>, res: Response<UsersTypeOutput>) {
        const createdUser = await this.usersService.createUser(req.body.login, req.body.password, req.body.email)
        res.status(HTTP_STATUSES.CREATED_201).json(createdUser)
    }
    async deleteUser(req: RequestWithParams<UsersIdParams>, res: Response) {
        const deletedUser = await this.usersService.deleteUser(req.params.id)

        if (!deletedUser) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
}
