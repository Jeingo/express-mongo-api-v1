import {testRepository} from "../repositories/test-repository"

export const testService = {
    async deleteAllDB(): Promise<void> {
        await testRepository.deleteAllDB()
    }
}