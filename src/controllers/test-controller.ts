import { Request, Response } from 'express'
import { testService } from '../domain/test-service'
import { HTTP_STATUSES } from '../constats/status'

class TestController {
    async clearAllCollection(req: Request, res: Response) {
        await testService.deleteAllDB()
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
}

export const testController = new TestController()
