import { TestRepository } from '../repositories/test-repository'

export class TestService {
    constructor(protected testRepository: TestRepository) {}

    async deleteAllDB(): Promise<void> {
        await this.testRepository.deleteAllDB()
    }
}
