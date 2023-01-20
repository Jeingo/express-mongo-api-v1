import { TestRepository } from '../repositories/test-repository'
import { inject, injectable } from 'inversify'

@injectable()
export class TestService {
    constructor(@inject(TestRepository) protected testRepository: TestRepository) {}

    async deleteAllDB(): Promise<void> {
        await this.testRepository.deleteAllDB()
    }
}
