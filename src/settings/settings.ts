import * as dotenv from 'dotenv'
dotenv.config()

export const settings = {
    MONGO_URL: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017',
    JWT_SECRET: process.env.JWT_SECRET || '123',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '456',
    PORT: process.env.PORT || 5000,
    EMAIL_LOGIN: process.env.EMAIL_LOGIN,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    SECURE_COOKIE_MODE: process.env.SECURE_COOKIE_MODE,
    EXPIRE_JWT: process.env.EXPIRE_JWT,
    EXPIRE_REFRESH_JWT: process.env.EXPIRE_REFRESH_JWT
}
