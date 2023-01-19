import {body} from "express-validator";

const availableStatus = ["None", "Like", "Dislike"]

const isLike = async (status: string): Promise<true> => {
    if (availableStatus.indexOf(status) === -1) {
        throw new Error("Incorrect like status")
    }
    return true
}

export const likesValidation = body('likeStatus')
    .trim()
    .notEmpty()
    .withMessage(`Shouldn't be empty`)
    .isString()
    .withMessage('Should be string type')
    .custom(isLike)