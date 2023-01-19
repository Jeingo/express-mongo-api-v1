import {TestRepository} from '../repositories/test-repository'

class TestService {
    testRepository: TestRepository
    constructor() {
        this.testRepository = new TestRepository()
    }
    async deleteAllDB(): Promise<void> {
        await this.testRepository.deleteAllDB()
    }
}

export const testService = new TestService()
