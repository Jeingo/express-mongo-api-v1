import { Response } from 'express'
import {RequestWithBody} from "../models/types";
import {LikesType} from "../models/likes-models";
import {HTTP_STATUSES} from "../constats/status";

export class LikesController {
    async updateStatus(req: RequestWithBody<LikesType>, res: Response) {
        const updatedCommentLike = 1
        if (!updatedCommentLike) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.json(HTTP_STATUSES.NO_CONTENT_204)
    }
}