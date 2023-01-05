import {QueryUsers} from "../models/query-models";
import {PaginatedType} from "../models/main-models";
import {UsersTypeOutput} from "../models/users-models";
import {getPaginatedType, makeDirectionToNumber} from "./helper";
import {usersCollection} from "../repositories/db";

const getOutputUser = (user: any): UsersTypeOutput => {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
}

export const usersQueryRepository = {
    async getAllUsers(query: QueryUsers): Promise<PaginatedType<UsersTypeOutput>> {
        const {
            searchLoginTerm = null,
            searchEmailTerm = null,
            sortBy = 'createdAt',
            sortDirection = 'desc',
            pageNumber = 1,
            pageSize = 10
        } = query
        const sortDirectionNumber = makeDirectionToNumber(sortDirection)
        const skipNumber = (+pageNumber - 1) * +pageSize

        const filter = (a:any, b:any) => ({$or:[a,b]})
        const loginFilter = searchLoginTerm ? {login: {$regex: new RegExp(searchLoginTerm, "gi")}} : {}
        const emailFilter = searchEmailTerm ? {email: {$regex: new RegExp(searchEmailTerm, "gi")}} : {}
        const filterMain = filter(loginFilter, emailFilter)

        const countAllDocuments = await usersCollection.countDocuments(filterMain)
        const res = await usersCollection
            .find(filterMain)
            .sort({[sortBy]: sortDirectionNumber})
            .skip(skipNumber)
            .limit(+pageSize)
            .toArray()
        return getPaginatedType(res.map(getOutputUser), +pageSize, +pageNumber, countAllDocuments)
    }
}