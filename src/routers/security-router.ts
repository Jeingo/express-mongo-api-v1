import { Router } from 'express'
import { securityController } from '../controllers/security-controller'

export const securityRouter = Router({})

securityRouter.get('/devices', securityController.getAllActiveSession)

securityRouter.delete('/devices', securityController.deleteAllSessionWithoutCurrent)

securityRouter.delete('/devices/:id', securityController.deleteSessionById)
