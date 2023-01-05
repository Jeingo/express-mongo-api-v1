import {Response, Router} from "express"
import {auth} from "../authorization/basic-auth"
import {idValidation, inputValidation, queryValidation} from "../middleware/input-validation";
import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../models/types";
import {PaginatedType} from "../models/main-models";
import {QueryUsers} from "../models/query-models";
import {UsersIdParams, UsersTypeInput, UsersTypeOutput} from "../models/users-models";
import {HTTP_STATUSES} from "../constats/status";
import {usersQueryRepository} from "../query-reositories/users-query-repository";
import {emailValidation, loginValidation, passwordValidation} from "../middleware/input-users-validation";
import {usersService} from "../domain/users-service";

export const usersRouter = Router({})

usersRouter.get('/',
    auth,
    queryValidation,
    async (req: RequestWithQuery<QueryUsers>,
           res: Response<PaginatedType<UsersTypeOutput>> ) => {
    const allUsers = await usersQueryRepository.getAllUsers(req.query)
    res.status(HTTP_STATUSES.OK_200).json(allUsers)
    })

usersRouter.post('/',
    auth,
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidation,
    async (req: RequestWithBody<UsersTypeInput>,
           res: Response<UsersTypeOutput>) => {
    const createdUser = await usersService.createUser(req.body.login, req.body.password, req.body.email)
    res.status(HTTP_STATUSES.CREATED_201).json(createdUser)
})

usersRouter.delete('/:id',
    auth,
    idValidation,
    async (req: RequestWithParams<UsersIdParams>, res: Response) => {
        const deletedUser = await usersService.deleteUser(req.params.id)

        if (!deletedUser) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })