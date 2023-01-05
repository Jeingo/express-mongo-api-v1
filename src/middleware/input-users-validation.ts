import {body} from "express-validator"

const patternLogin = /^[a-zA-Z0-9_-]*$/
const patternEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

export const loginValidation = body('login').trim()
    .notEmpty().withMessage(`Shouldn't be empty`)
    .isString().withMessage('Should be string type')
    .isLength({max: 10, min: 3}).withMessage('Should be less than 10 and more than 3 symbols')
    .matches(patternLogin).withMessage('Should be correct login with a-z/A-Z/0-9')

export const passwordValidation = body('password').trim()
    .notEmpty().withMessage(`Shouldn't be empty`)
    .isString().withMessage('Should be string type')
    .isLength({max: 20, min: 6}).withMessage('Should be less than 20 and more than 6 symbols')

export const emailValidation = body('email').trim()
    .notEmpty().withMessage(`Shouldn't be empty`)
    .isString().withMessage('Should be string type')
    .matches(patternEmail).withMessage('Should be correct email')