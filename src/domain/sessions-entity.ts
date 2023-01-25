import mongoose from "mongoose";
import {SessionTypeToDB} from "../models/session-models";

export const SessionsSchema = new mongoose.Schema<SessionTypeToDB>({
    issueAt: {type: String, required: true},
    deviceId: {type: String, required: true},
    deviceName: {type: String, required: true},
    ip: {type: String, required: true},
    userId: {type: String, required: true},
    expireAt: {type: String, required: true}
})