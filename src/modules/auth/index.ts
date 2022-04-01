import express from 'express'

import { authenticateHandler, loginHandler } from './auth-handlers'

const authRouter = express.Router()

authRouter.post('/login', loginHandler)
authRouter.post('/authenticate', authenticateHandler)

export default authRouter
