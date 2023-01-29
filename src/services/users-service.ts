import { inject, injectable } from 'inversify'
import { UsersRepository } from '../repositories/users-repository'
import {UserId} from '../models/users-models'
import { UsersQueryRepository } from '../query-reositories/users-query-repository'
import {UsersModel} from "../repositories/db/db";

@injectable()
export class UsersService {
    constructor(
        @inject(UsersRepository) protected usersRepository: UsersRepository,
        @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository
    ) {}

    async createUser(login: string, password: string, email: string, isConfirmed: boolean): Promise<UserId> {
        const createdUser = await UsersModel.make(login, password, email, isConfirmed)
        await this.usersRepository.saveUser(createdUser)
        return createdUser._id.toString()
    }

    async deleteUser(id: string): Promise<boolean> {
        return await this.usersRepository.deleteUser(id)
    }
}
