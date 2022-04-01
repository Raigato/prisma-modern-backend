import express from 'express'

import { loginHandler } from './auth-handlers'

const authRouter = express.Router()

authRouter.post('/login', loginHandler)

export default authRouter
