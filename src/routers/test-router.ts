import { Router } from 'express'
import {testController} from "../composition-root";
export const testRouter = Router({})

testRouter.delete('/', testController.clearAllCollection.bind(testController))
