import { Router } from 'express'
import { auth } from '../authorization/basic-auth'
import { idValidation, inputValidation, queryValidation } from '../middleware/input-validation'
import {
    emailValidation,
    loginValidation,
    passwordValidation
} from '../middleware/input-users-validation'
import { usersController } from '../controllers/users-controller'

export const usersRouter = Router({})

usersRouter.get('/', auth, queryValidation, usersController.getAllUsers)

usersRouter.post(
    '/',
    auth,
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidation,
    usersController.createUser
)

usersRouter.delete('/:id', auth, idValidation, usersController.deleteUser)
