import { testRepository } from '../repositories/test-repository'

class TestService {
    async deleteAllDB(): Promise<void> {
        await testRepository.deleteAllDB()
    }
}

export const testService = new TestService()
