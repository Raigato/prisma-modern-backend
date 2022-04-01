import express from 'express'
import { OK, NOT_FOUND } from 'http-status'

import STATUS from './constants/STATUS'
import APIResponse from './types/APIResponse'
import { appConfig } from './config'
import guard from './modules/auth/middleware'
import authRouter from './modules/auth'
import userRouter from './modules/users'

const PREFIX = appConfig.prefix

const apiRouter = express.Router()

apiRouter.use('/', authRouter)

apiRouter.use(`/users`, guard(), userRouter)

const router = express.Router()

router.get('/healthz', (_, res: APIResponse) => {
  res.status(OK).json({ status: STATUS.SUCCESS })
})

router.use(PREFIX, apiRouter)

router.all('*', (_, res) => {
  res
    .status(NOT_FOUND)
    .json({ status: STATUS.FAIL, message: 'Route not found' })
})

export default router
