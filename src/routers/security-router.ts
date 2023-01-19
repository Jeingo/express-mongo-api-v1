import { Router } from 'express'
import { securityController } from '../controllers/security-controller'

export const securityRouter = Router({})

securityRouter.get('/devices', securityController.getAllActiveSession.bind(securityController))

securityRouter.delete('/devices', securityController.deleteAllSessionWithoutCurrent.bind(securityController))

securityRouter.delete('/devices/:id', securityController.deleteSessionById.bind(securityController))
