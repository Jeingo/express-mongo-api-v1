import { TestRepository } from '../repositories/test-repository'

export class TestService {
    testRepository: TestRepository
    constructor() {
        this.testRepository = new TestRepository()
    }
    async deleteAllDB(): Promise<void> {
        await this.testRepository.deleteAllDB()
    }
}
