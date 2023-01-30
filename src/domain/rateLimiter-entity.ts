import mongoose from 'mongoose'
import {RateLimiterTypeToDB} from '../models/auth-models'

export const RateLimiterSchema = new mongoose.Schema<RateLimiterTypeToDB>({
    ip: { type: String, required: true },
    endpoint: { type: String, required: true },
    date: { type: Number, required: true },
    count: { type: Number, required: true }
})

export const RateLimiterModel = mongoose.model('limiters', RateLimiterSchema)