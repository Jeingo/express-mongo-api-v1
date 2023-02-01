import mongoose from 'mongoose'
import {settings} from '../../settings/settings'

const mongoUrl = settings.MONGO_URL
const dbName = settings.DB_NAME

export const runDb = async () => {
    try {
        mongoose.set('strictQuery', false)
        await mongoose.connect(mongoUrl, { dbName: dbName })
        console.log('Connected successfully to mongo db')
    } catch (err) {
        console.log(`Can't connect to mongo db: ` + err)
        await mongoose.disconnect()
    }
}