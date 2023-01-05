import {ObjectId} from "mongodb";

export type UsersTypeOutput = {
    id: string
    login: string
    email: string
    createdAt: string
}

export type UsersTypeInput = {
    login: string
    password: string
    email: string
}

export type UsersTypeToDB = {
    login: string
    hash: string
    email: string
    createdAt: string
}

export type UsersIdInDB = {
    _id: ObjectId
}

export type UsersIdParams = {
    id: string
}