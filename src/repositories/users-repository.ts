import {UsersHashType, UsersTypeOutput, UsersTypeToDB} from "../models/users-models";
import {usersCollection} from "./db";
import {ObjectId} from "mongodb";

const getOutputUserHash = (user: any): UsersHashType => {
    return {
        id: user._id.toString(),
        hash: user.hash
    }
}

export const usersRepository = {
    async createUser(createdUser: UsersTypeToDB): Promise<UsersTypeOutput> {
        const result = await usersCollection.insertOne(createdUser)
        return {
            id: result.insertedId.toString(),
            login: createdUser.login,
            email: createdUser.email,
            createdAt: createdUser.createdAt
        }
    },
    async deleteUser(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },
    async findUserHashByLoginOrEmail(loginOrEmail: string) {
        const result =  await usersCollection.findOne(
            {$or: [{email: loginOrEmail}, {login: loginOrEmail}]}
        )
        return getOutputUserHash(result)
    }
}