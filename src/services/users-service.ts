import {inject, injectable} from "inversify";
import {UsersRepository} from "../repositories/users-repository";
import {LoginTypeForAuth} from "../models/auth-models";
import {UserId, UsersTypeOutput, UsersTypeToDB} from "../models/users-models";
import bcrypt from "bcrypt";
import {v4} from "uuid";
import add from "date-fns/add";

@injectable()
export class UsersService {
    constructor(@inject(UsersRepository) protected usersRepository: UsersRepository) {
    }

    async getAuthUserById(id: UserId): Promise<LoginTypeForAuth | null> {
        return await this.usersRepository.getAuthUserById(id)
    }

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