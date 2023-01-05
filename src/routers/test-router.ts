import {Router, Request, Response} from 'express'
import {HTTP_STATUSES} from "../constats/status"
import {testService} from "../domain/test-service"

export const testRouter = Router({})

testRouter.delete('/', async (req: Request, res: Response) => {
    await testService.deleteAllDB()
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})