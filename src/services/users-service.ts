import { inject, injectable } from 'inversify'
import { UsersRepository } from '../repositories/users-repository'
import { UsersTypeOutput, UsersTypeToDB } from '../models/users-models'
import bcrypt from 'bcrypt'
import { v4 } from 'uuid'
import add from 'date-fns/add'
import { UsersQueryRepository } from '../query-reositories/users-query-repository'

@injectable()
export class UsersService {
    constructor(
        @inject(UsersRepository) protected usersRepository: UsersRepository,
        @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository
    ) {}

    async createUser(login: string, password: string, email: string): Promise<UsersTypeOutput> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, passwordSalt)
        const createdUser = new UsersTypeToDB(
            login,
            passwordHash,
            email,
            new Date().toISOString(),
            {
                passwordRecoveryCode: v4(),
                expirationDate: add(new Date(), {
                    hours: 1
                }),
                isConfirmed: true
            },
            {
                confirmationCode: v4(),
                expirationDate: add(new Date(), {
                    hours: 1
                }),
                isConfirmed: true
            }
        )
        return await this.usersRepository.createUser(createdUser)
    }

    async deleteUser(id: string): Promise<boolean> {
        return await this.usersRepository.deleteUser(id)
    }
}
