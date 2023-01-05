import {LoginTypeForAuth} from "../models/auth-models";

declare global {
    declare namespace Express {
        export interface Request {
            user: LoginTypeForAuth | null
        }
    }
}