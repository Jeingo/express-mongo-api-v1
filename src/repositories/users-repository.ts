import {UsersTypeOutput, UsersTypeToDB} from "../models/users-models";
import {usersCollection} from "./db";
import {ObjectId} from "mongodb";

export const usersRepository = {
    async createUser(createdUser: UsersTypeToDB): Promise<UsersTypeOutput> {
        const res = await usersCollection.insertOne(createdUser)
        return {
            id: res.insertedId.toString(),
            login: createdUser.login,
            email: createdUser.email,
            createdAt: createdUser.createdAt
        }
    },
    async deleteUser(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }
}