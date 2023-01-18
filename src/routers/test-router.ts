import {Router} from 'express'
import {testController} from "../controllers/test-controller";

export const testRouter = Router({})

testRouter.delete('/', testController.clearAllCollection)
