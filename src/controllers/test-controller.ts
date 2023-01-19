import { Request, Response } from 'express'
import {TestService} from '../domain/test-service'
import { HTTP_STATUSES } from '../constats/status'

class TestController {
    testService: TestService
    constructor() {
        this.testService = new TestService()
    }
    async clearAllCollection(req: Request, res: Response) {
        await this.testService.deleteAllDB()
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
}

export const testController = new TestController()
