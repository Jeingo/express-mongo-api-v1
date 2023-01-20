import { Request, Response } from 'express'
import { TestService } from '../domain/test-service'
import { HTTP_STATUSES } from '../constats/status'
import { inject, injectable } from 'inversify'

@injectable()
export class TestController {
    constructor(@inject(TestService) protected testService: TestService) {}

    async clearAllCollection(req: Request, res: Response) {
        await this.testService.deleteAllDB()
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
}
