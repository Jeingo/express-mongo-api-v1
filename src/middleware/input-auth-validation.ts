import {body} from "express-validator"

export const loginOrEmailValidation = body('loginOrEmail').trim()
    .notEmpty().withMessage(`Shouldn't be empty`)
    .isString().withMessage('Should be string type')

export const passwordFromAuthValidation = body('password').trim()
    .notEmpty().withMessage(`Shouldn't be empty`)
    .isString().withMessage('Should be string type')
