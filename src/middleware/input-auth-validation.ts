import { body } from 'express-validator'
import {UsersRepository} from '../repositories/users-repository'

const patternLogin = /^[a-zA-Z0-9_-]*$/
const patternEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/

const usersRepository = new UsersRepository()

const checkEmail = async (email: string) => {
    const foundUser = await usersRepository.findUserByEmail(email)
    if (foundUser) {
        throw new Error('Email is already exist')
    }
    return true
}

const checkLogin = async (login: string) => {
    const foundUser = await usersRepository.findUserByLogin(login)
    if (foundUser) {
        throw new Error('Email is already exist')
    }
    return true
}

const checkCode = async (code: string) => {
    const foundUser = await usersRepository.findUserByConfirmationCode(code)
    if (!foundUser) {
        throw new Error('This code is wrong')
    }
    if (foundUser.emailConfirmation.confirmationCode !== code) {
        throw new Error('This code is wrong')
    }
    if (foundUser.emailConfirmation.isConfirmed) {
        throw new Error('Account is already confirmed')
    }
    if (foundUser.emailConfirmation.expirationDate < new Date()) {
        throw new Error('This code is expired')
    }
    return true
}

const checkPasswordRecoveryCode = async (code: string) => {
    const foundUser = await usersRepository.findUserByConfirmationCodeRecoveryPassword(code)
    if (!foundUser) {
        throw new Error('This code is wrong')
    }
    if (foundUser.passwordRecoveryConfirmation.passwordRecoveryCode !== code) {
        throw new Error('This code is wrong')
    }
    if (foundUser.passwordRecoveryConfirmation.isConfirmed) {
        throw new Error('Password is already changed')
    }
    if (foundUser.passwordRecoveryConfirmation.expirationDate < new Date()) {
        throw new Error('This code is expired')
    }
    return true
}

const checkEmailResending = async (email: string) => {
    const foundUser = await usersRepository.findUserByEmail(email)
    if (!foundUser) {
        throw new Error('This email is wrong')
    }
    if (foundUser.emailConfirmation.isConfirmed) {
        throw new Error('Account is already confirmed')
    }
    return true
}

export const loginOrEmailValidation = body('loginOrEmail')
    .trim()
    .notEmpty()
    .withMessage(`Shouldn't be empty`)
    .isString()
    .withMessage('Should be string type')

export const passwordFromAuthValidation = body('password')
    .trim()
    .notEmpty()
    .withMessage(`Shouldn't be empty`)
    .isString()
    .withMessage('Should be string type')

export const loginRegistrationValidation = body('login')
    .trim()
    .notEmpty()
    .withMessage(`Shouldn't be empty`)
    .isString()
    .withMessage('Should be string type')
    .isLength({ max: 10, min: 3 })
    .withMessage('Should be less than 10 and more than 3 symbols')
    .matches(patternLogin)
    .withMessage('Should be correct login with a-z/A-Z/0-9 !')
    .custom(checkLogin)
    .withMessage('The user with this login is already exist')

export const passwordRegistrationValidation = body('password')
    .trim()
    .notEmpty()
    .withMessage(`Shouldn't be empty`)
    .isString()
    .withMessage('Should be string type')
    .isLength({ max: 20, min: 6 })
    .withMessage('Should be less than 20 and more than 6 symbols')

export const emailRegistrationValidation = body('email')
    .trim()
    .notEmpty()
    .withMessage(`Shouldn't be empty`)
    .isString()
    .withMessage('Should be string type')
    .matches(patternEmail)
    .withMessage('Should be correct email')
    .custom(checkEmail)
    .withMessage('The user with this email is already exist')

export const codeValidation = body('code')
    .trim()
    .notEmpty()
    .withMessage(`Shouldn't be empty`)
    .isString()
    .withMessage('Should be string type')
    .custom(checkCode)

export const emailResendValidation = body('email')
    .trim()
    .notEmpty()
    .withMessage(`Shouldn't be empty`)
    .isString()
    .withMessage('Should be string type')
    .matches(patternEmail)
    .withMessage('Should be correct email')
    .custom(checkEmailResending)

export const emailPasswordRecoveryValidation = body('email')
    .trim()
    .notEmpty()
    .withMessage(`Shouldn't be empty`)
    .isString()
    .withMessage('Should be string type')
    .matches(patternEmail)
    .withMessage('Should be correct email')

export const codePasswordRecoveryValidation = body('recoveryCode')
    .trim()
    .notEmpty()
    .withMessage(`Shouldn't be empty`)
    .isString()
    .withMessage('Should be string type')
    .custom(checkPasswordRecoveryCode)

export const passwordRecoveryValidation = body('newPassword')
    .trim()
    .notEmpty()
    .withMessage(`Shouldn't be empty`)
    .isString()
    .withMessage('Should be string type')
    .isLength({ max: 20, min: 6 })
    .withMessage('Should be less than 20 and more than 6 symbols')
