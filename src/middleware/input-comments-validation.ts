import {body} from "express-validator"

export const contentInCommentValidation = body('content').trim()
    .notEmpty().withMessage(`Shouldn't be empty`)
    .isString().withMessage('Should be string type')
    .isLength({max: 300, min: 20}).withMessage('Should be less than 300 and more than 20 symbols')
