import express from 'express'
import { OK, NOT_FOUND } from 'http-status'

import STATUS from './constants/STATUS'
import APIResponse from './types/APIResponse'
import userRouter from './modules/users'
import { appConfig } from './config'

const PREFIX = appConfig.prefix
const router = express.Router()

router.get('/healthz', (_, res: APIResponse) => {
  res.status(OK).json({ status: STATUS.SUCCESS })
})

router.use(`${PREFIX}/users`, userRouter)

router.all('*', (_, res) => {
  res
    .status(NOT_FOUND)
    .json({ status: STATUS.FAIL, message: 'Route not found' })
})

export default router
