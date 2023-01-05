import {body} from "express-validator"

const patternURL = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/


export const nameValidation = body('name').trim()
    .notEmpty().withMessage(`Shouldn't be empty`)
    .isString().withMessage('Should be string type')
    .isLength({max: 15}).withMessage('Should be less than 15 symbols')

export const descriptionValidation = body('description').trim()
    .notEmpty().withMessage(`Shouldn't be empty`)
    .isString().withMessage('Should be string type')
    .isLength({max: 500}).withMessage('Should be less than 500 symbols')

export const websiteUrlValidation = body('websiteUrl').trim()
    .notEmpty().withMessage(`Shouldn't be empty`)
    .isString().withMessage('Should be string type')
    .isLength({max: 100}).withMessage('Should be less than 100 symbols')
    .matches(patternURL).withMessage('Should be correct url')