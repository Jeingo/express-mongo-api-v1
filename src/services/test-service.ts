import { inject, injectable } from 'inversify'
import { TestRepository } from '../repositories/test-repository'

@injectable()
export class TestService {
    constructor(@inject(TestRepository) protected testRepository: TestRepository) {}

    async deleteAllDB(): Promise<void> {
        await this.testRepository.deleteAllDB()
    }
}
