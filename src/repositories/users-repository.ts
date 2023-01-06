import {
  UsersConfirmationCodeType,
  UsersHashType,
  UsersTypeOutput,
  UsersTypeToDB,
} from '../models/users-models'
import { usersCollection } from './db'
import { ObjectId } from 'mongodb'

const getOutputUserHash = (user: any): UsersHashType => {
  return {
    id: user._id.toString(),
    hash: user.hash,
  }
}

const getOutputUserForConfirmationCode = (user: any): UsersConfirmationCodeType => {
  return {
    id: user._id.toString(),
    emailConfirmation: {
      confirmationCode: user.emailConfirmation.confirmationCode,
      expirationDate: user.emailConfirmation.expirationDate,
      isConfirmed: user.emailConfirmation.isConfirmed,
    },
  }
}

const getOutputUser = (user: any): UsersTypeToDB => {
  return {
    login: user.login,
    hash: user.hash,
    email: user.email,
    createdAt: user.createdAt,
    emailConfirmation: {
      confirmationCode: user.emailConfirmation.confirmationCode,
      expirationDate: user.emailConfirmation.expirationDate,
      isConfirmed: user.emailConfirmation.isConfirmed,
    },
  }
}

export const usersRepository = {
  async createUser(createdUser: UsersTypeToDB): Promise<UsersTypeOutput> {
    const result = await usersCollection.insertOne(createdUser)
    return {
      id: result.insertedId.toString(),
      login: createdUser.login,
      email: createdUser.email,
      createdAt: createdUser.createdAt,
    }
  },
  async deleteUser(id: string): Promise<boolean> {
    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount === 1
  },
  async findUserHashByLoginOrEmail(loginOrEmail: string) {
    const result = await usersCollection.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    })
    if (!result) {
      return null
    }
    return getOutputUserHash(result)
  },
  async findUserByConfirmationCode(code: string) {
    const result = await usersCollection.findOne({
      'emailConfirmation.confirmationCode': code,
    })
    if (!result) {
      return null
    }
    return getOutputUserForConfirmationCode(result)
  },
  async updateConfirmationStatus(code: string) {
    const result = await usersCollection.updateOne(
      { 'emailConfirmation.confirmationCode': code },
      { $set: { 'emailConfirmation.isConfirmed': true } }
    )
    return result.modifiedCount === 1
  },
  async findUserByEmail(email: string) {
    const result = await usersCollection.findOne({ email: email })
    if (!result) {
      return null
    }
    return getOutputUser(result)
  },
  async updateConfirmationCode(user: UsersTypeToDB, code: string) {
    const result = await usersCollection.updateOne(
      { login: user.login },
      { $set: { 'emailConfirmation.confirmationCode': code } }
    )
    return result.modifiedCount === 1
  },
}
